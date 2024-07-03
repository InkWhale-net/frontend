import { CopyIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { addressShortener } from "utils";
import { handleCopy } from "utils";
import { resolveAZDomainToAddress } from "utils";
import {
  delay,
  formatChainStringToNumber,
  formatNumToBN,
  isAddressValid,
} from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import MyAccountTab from "./myAccount";
import { appChain } from "constants";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ContractPromise } from "@polkadot/api-contract";
import { getEstimatedGasBatchTx } from "utils";
import { useAppContext } from "contexts/AppContext";
import { batchTxResponseErrorHandler } from "utils";

const TokensTabTransferToken = ({
  mode,
  address,
  balance,
  tokenInfo,
  selectedContractAddr,
  loadTokenInfo,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const dispatch = useDispatch();

  const [transferAddress, setTransferAddress] = useState("");
  const [addressFromDomain, setAddressFromDomain] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferList, setTransferList] = useState([
    {
      address: "",
      amount: "",
    },
  ]);
  const addNewTranferE = () => {
    setTransferList([
      ...transferList,
      {
        address: "",
        amount: "",
      },
    ]);
  };
  const updateAddress = (value, index) => {
    let cloneList = [...transferList];
    cloneList[index].address = value;
    setTransferList(cloneList);
  };
  const updateAmount = (value, index) => {
    let cloneList = [...transferList];
    cloneList[index].amount = value;
    setTransferList(cloneList);
  };
  const removeTransferE = (index) => {
    setTransferList(
      transferList.filter((e) => !(transferList.indexOf(e) == index))
    );
  };

  async function transferTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    toast.success(transferList?.length > 0 && `Bulk Transfer process...`);
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

    gasLimit = await getEstimatedGasBatchTx(
      address,
      tokenContract,
      value,
      "psp22::transfer",
      transferList[0].address,
      formatNumToBN(transferList[0].amount, tokenInfo?.decimals),
      []
    );
    await Promise.all(
      transferList.map(async (info) => {
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
                  toast.success(
                    transferList?.length === 1
                      ? "NFT has been staked successfully                  "
                      : "All NFTs have been staked successfully"
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
                transferList?.length === 1
                  ? "The staking is not fully successful!                "
                  : `Bulk staking are not fully successful! ${totalSuccessTxCount} staking completed successfully.`
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
      .catch((error) => toast.error("The staking fail", error?.message));

    return unsubscribe;
    // const resolvedAddress = await resolveAZDomainToAddress(transferAddress);
    // setAddressFromDomain(resolvedAddress);
    // if (!isAddressValid(transferAddress) && !resolvedAddress) {
    //   return toast.error("Invalid address!");
    // }

    // if (transferAmount === 0 || !transferAmount) {
    //   toast.error("Please enter amount to transfer!");
    //   return;
    // }
    // if (+transferAmount > formatChainStringToNumber(tokenInfo?.content)) {
    //   toast.error(
    //     `You don't have enough ${tokenInfo?.title} tokens to transfer!`
    //   );
    //   return;
    // }
    // if (balance?.azero < 0.05) {
    //   toast.error(`Low ${appChain?.unit} balance!`);
    //   return;
    // }

    // await execContractTx(
    //   currentAccount,
    //   "api",
    //   psp22_contract.CONTRACT_ABI,
    //   selectedContractAddr,
    //   0, //-> value
    //   "psp22::transfer",
    //   resolvedAddress ? resolvedAddress : transferAddress,
    //   formatNumToBN(transferAmount, tokenInfo?.decimals),
    //   []
    // );

    // await delay(2000).then(() => {
    //   setTransferAddress("");
    //   setTransferAmount("");
    //   loadTokenInfo();
    //   dispatch(fetchUserBalance({ currentAccount, api }));
    // });
  }

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
        <IWCard mt="16px" w="full" variant="solid">
          {transferList?.map((obj, index) => (
            <Box
              sx={{ display: "flex", gap: "4px", mt: index > 0 ? "8px" : 0 }}
            >
              <IWInput
                sx={{
                  flex: 1,
                }}
                value={transferList[index].address}
                onChange={({ target }) => {
                  updateAddress(target.value, index);
                  // setTransferAddress(target.value);
                  // setAddressFromDomain("");
                  // setTransferAmount("");
                }}
                placeholder={`Address${
                  appChain?.haveAzeroID ? " or azero.id" : ""
                } to transfer`}
              />
              <Box w="200px">
                <IWInput
                  value={transferList[index].amount}
                  type="number"
                  onChange={({ target }) => {
                    updateAmount(target.value, index);
                    // setTransferAddress(target.value);
                    // setAddressFromDomain("");
                    // setTransferAmount("");
                  }}
                  placeholder={`Amount`}
                />
              </Box>
              {index <= transferList?.length - 2 ? (
                <Box
                  sx={{
                    w: "52px",
                    h: "52px",
                    bg: "#93F0F5",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => removeTransferE(index)}
                >
                  <AiOutlineMinus color="white" />
                </Box>
              ) : (
                <Box
                  sx={{
                    w: "52px",
                    h: "52px",
                    bg: "#93F0F5",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => addNewTranferE()}
                >
                  <AiOutlinePlus color="white" />
                </Box>
              )}
            </Box>
          ))}
          {addressFromDomain && transferAddress && (
            <IWInput
              value={addressShortener(addressFromDomain)}
              readOnly
              inputRightElementIcon={
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  ml="4px"
                  mb="8px"
                  w="20px"
                  h="21px"
                  color="#8C86A5"
                  onClick={() => handleCopy("Address", address)}
                >
                  <CopyIcon w="20px" h="21px" />
                </Box>
              }
            />
          )}
          {/* <IWInput
            value={transferAmount}
            onChange={({ target }) => setTransferAmount(target.value)}
            type="number"
            placeholder="Amount to transfer"
            inputRightElementIcon={
              <Heading as="h5" size="h5" fontWeight="semibold">
                {tokenInfo?.title}
              </Heading>
            }
          /> */}

          <Button
            // isDisabled={!Number(transferAmount) || !transferAddress}
            onClick={() => transferTokenHandler()}
            w="full"
            mt="8px"
          >
            Transfer
          </Button>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

export default TokensTabTransferToken;
