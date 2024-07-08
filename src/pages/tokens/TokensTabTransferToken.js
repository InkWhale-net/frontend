import { Box, Button, Collapse, Heading, Stack, Text } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";

import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import IWTextArea from "components/input/TextArea";
import { MAX_TRANSFER_AMOUNT, appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { isValidAddress } from "pages/launchpad/create/utils";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  batchTxResponseErrorHandler,
  delay,
  formatChainStringToNumber,
  formatNumToBN,
  getEstimatedGasBatchTx,
  isAddressValid,
  resolveAZDomainToAddress,
} from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import MyAccountTab from "./myAccount";
export const SINLE_TRANSFER_MODE = 0;
export const BULK_TRANSFER_MODE = 1;
const processStringToArray = (input) => {
  try {
    const lines = input?.trim().split("\n");
    const result = [];

    lines.forEach((line) => {
      const [address, amount] = line?.trim().split(",");
      result.push({ address, amount: Number(amount) });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};
const TokensTabTransferToken = (props) => {
  const {
    mode,
    address,
    balance,
    tokenInfo,
    selectedContractAddr,
    loadTokenInfo,
    ...rest
  } = props;
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const [tmode, setTmode] = useState(SINLE_TRANSFER_MODE);

  const [transferAddress, setTransferAddress] = useState("");
  const [transferBulkAddress, setTransferBulkAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  async function transferTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    const resolvedAddress = await resolveAZDomainToAddress(transferAddress);
    if (!isAddressValid(transferAddress) && !resolvedAddress) {
      return toast.error("Invalid address!");
    }

    if (transferAmount === 0 || !transferAmount) {
      toast.error("Please enter amount to transfer!");
      return;
    }
    if (+transferAmount > formatChainStringToNumber(tokenInfo?.content)) {
      toast.error(
        `You don't have enough ${tokenInfo?.title} tokens to transfer!`
      );
      return;
    }
    if (balance?.azero < 0.05) {
      toast.error(`Low ${appChain?.unit} balance!`);
      return;
    }

    await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::transfer",
      resolvedAddress ? resolvedAddress : transferAddress,
      formatNumToBN(transferAmount, tokenInfo?.decimals),
      []
    );

    await delay(2000).then(() => {
      setTransferBulkAddress("");
      setTransferAddress("");
      setTransferAmount("");
      loadTokenInfo();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  const verifyBulkString = async (listTransfer) => {
    const isValidAddressList = await Promise.all(
      listTransfer?.map(async (e) => {
        const wladdress =
          (await resolveAZDomainToAddress(e?.address)) ||
          (isValidAddress(e?.address) && e?.address);
        return wladdress;
      })
    );
    if (isValidAddressList?.filter((e) => e)?.length != listTransfer?.length) {
      toast.error("Invalid address");
      return false;
    }

    if (
      listTransfer?.filter((e) => e?.amount > 0)?.length != listTransfer?.length
    ) {
      toast.error("Invalid amount");
      return false;
    }

    return true;
  };
  const bulkTransferTokenHandler = async () => {
    const listTransfer = processStringToArray(transferBulkAddress);
    if (!(await verifyBulkString(listTransfer))) {
      return toast.error("Invalid transfer string");
    }
    if (listTransfer?.length > MAX_TRANSFER_AMOUNT) {
      return toast.error(
        `Max multiple transfer amount is ${MAX_TRANSFER_AMOUNT}`
      );
    }
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    toast.success(listTransfer?.length > 0 && `Bulk Transfer process...`);
    let unsubscribe;
    let transferTxALL;

    const address = currentAccount?.address;
    const { signer } = await web3FromSource(currentAccount?.meta?.source);

    toast.success("Estimated transaction fee...");
    const value = 0;
    let gasLimit;

    const tokenContract = new ContractPromise(
      api,
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr
    );
    const reformatListTransfer = await Promise.all(
      listTransfer.map(async (e) => {
        return {
          ...e,
          address: (await resolveAZDomainToAddress(e?.address)) || e?.address,
        };
      })
    );
    gasLimit = await getEstimatedGasBatchTx(
      address,
      tokenContract,
      value,
      "psp22::transfer",
      reformatListTransfer[0].address,
      formatNumToBN(reformatListTransfer[0].amount, tokenInfo?.decimals),
      []
    );
    await Promise.all(
      reformatListTransfer.map(async (info) => {
        const ret = tokenContract.tx["psp22::transfer"](
          { gasLimit, value },
          info.address,
          formatNumToBN(info.amount, tokenInfo?.decimals),
          []
        );

        return ret;
      })
    ).then((res) => (transferTxALL = res));
    api.tx.utility
      .batch(transferTxALL)
      .signAndSend(
        address,
        { signer },
        async ({ events, status, dispatchError }) => {
          if (status?.isFinalized) {
            let totalSuccessTxCount = null;

            events.forEach(
              async ({ event, event: { data, method, section, ...rest } }) => {
                if (api.events.utility?.BatchInterrupted.is(event)) {
                  totalSuccessTxCount = data[0]?.toString();
                }

                if (api.events.utility?.BatchCompleted.is(event)) {
                  setTransferBulkAddress("");
                  setTransferAddress("");
                  setTransferAmount("");
                  loadTokenInfo();
                  dispatch(fetchUserBalance({ currentAccount, api }));
                  toast.success(
                    reformatListTransfer?.length === 1
                      ? "Token has been transfered successfully                  "
                      : "All Token have been transfered successfully"
                  );
                }
              }
            );

            // await listNFTStake.map(
            //   async (info) =>
            //     await APICall.askBEupdateNFTFromArtZero({
            //       collection_address: NFTtokenContract,
            //       token_id: info?.tokenID,
            //     })
            // );
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!totalSuccessTxCount) {
              toast.error(
                reformatListTransfer?.length === 1
                  ? "Transfer is not fully successful!                "
                  : `Bulk transfer are not fully successful! ${totalSuccessTxCount} transfer completed successfully.`
              );
            }
            // updateData();
            batchTxResponseErrorHandler({
              status,
              dispatchError,
              dispatch,
              txType: "MULTI_TRANSFER",
              api,
              currentAccount,
              isApprovalTx: true,
            });
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((error) => toast.error("The transfer fail", error?.message));

    return unsubscribe;
  };
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <MyAccountTab address={address} balance={balance} tokenInfo={tokenInfo} />

      <IWCard
        w="full"
        variant="outline"
        title={`Transfer ${tokenInfo?.title} Tokens`}
      >
        <Box
          sx={{
            bg: "#93F0F5",
            cursor: "pointer",
            p: "10px",
            borderRadius: "4px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setTmode(SINLE_TRANSFER_MODE)}
        >
          <Text
            sx={{
              color: "#57527E",
              fontWeight: "bold",
            }}
          >
            Single transfer
          </Text>
          {tmode == SINLE_TRANSFER_MODE ? (
            <BsChevronDown color="#57527E" />
          ) : (
            <BsChevronRight color="#57527E" />
          )}
        </Box>
        <Collapse in={tmode == SINLE_TRANSFER_MODE} animateOpacity>
          <IWInput
            mt="4px"
            value={transferAddress}
            onChange={({ target }) => {
              setTransferAddress(target.value);
              setTransferAmount("");
            }}
            placeholder={`Address${
              appChain?.haveAzeroID ? " or azero.id" : ""
            } to transfer`}
          />
          <IWInput
            mt="4px"
            value={transferAmount}
            onChange={({ target }) => setTransferAmount(target.value)}
            type="number"
            placeholder="Amount to transfer"
            inputRightElementIcon={
              <Heading as="h5" size="h5" fontWeight="semibold">
                {tokenInfo?.title}
              </Heading>
            }
          />

          <Button
            isDisabled={!Number(transferAmount) || !transferAddress}
            onClick={() => transferTokenHandler()}
            w="full"
            mt="8px"
            variant="outline"
            sx={{
              borderWidth: "4px",
              borderColor: "#93F0F5",
            }}
          >
            Transfer
          </Button>
        </Collapse>
        <Box
          sx={{
            bg: "#93F0F5",
            cursor: "pointer",
            p: "8px",
            borderRadius: "4px",
            mt: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onClick={() => setTmode(BULK_TRANSFER_MODE)}
        >
          <Text
            sx={{
              color: "#57527E",
              fontWeight: "bold",
            }}
          >
            Multiple transfer
          </Text>
          {tmode == BULK_TRANSFER_MODE ? (
            <BsChevronDown color="#57527E" />
          ) : (
            <BsChevronRight color="#57527E" />
          )}
        </Box>
        <Collapse in={tmode == BULK_TRANSFER_MODE} animateOpacity>
          <IWTextArea
            sx={{
              height: "132px",
              mt: "8px",
            }}
            value={transferBulkAddress}
            onChange={({ target }) => {
              const newValue = target.value;
              const lines = newValue.split("\n");

              if (lines.length <= MAX_TRANSFER_AMOUNT) {
                setTransferBulkAddress(target.value);
              }
            }}
            placeholder={`Enter one address, amount on each line. A decimal separator of amount must use dot (.)\nSample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn,100\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL,20`}
          />
          <Button
            isDisabled={!(transferBulkAddress?.length > 0)}
            onClick={() => bulkTransferTokenHandler()}
            w="full"
            mt="8px"
            variant="outline"
            sx={{
              borderWidth: "4px",
              borderColor: "#93F0F5",
            }}
          >
            Transfer
          </Button>
        </Collapse>
      </IWCard>
    </Stack>
  );
};

export default TokensTabTransferToken;
