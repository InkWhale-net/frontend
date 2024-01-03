import { CopyIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import IWCard from "components/card/Card";
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
import { psp22_contract } from "utils/contracts";
import MyAccountTab from "./myAccount";

const TokensTabTransferToken = ({
  mode,
  address,
  balance,
  tokenInfo,
  selectedContractAddr,
  loadTokenInfo,
  ...rest
}) => {
  const { currentAccount, api } = useSelector((s) => s.wallet);
  const dispatch = useDispatch();

  const [transferAddress, setTransferAddress] = useState("");
  const [addressFromDomain, setAddressFromDomain] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  async function transferTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    const resolvedAddress = await resolveAZDomainToAddress(transferAddress);
    setAddressFromDomain(resolvedAddress);
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
      toast.error("Low Azero balance!");
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
      setTransferAddress("");
      setTransferAmount("");
      loadTokenInfo();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
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
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              value={transferAddress}
              onChange={({ target }) => {
                setTransferAddress(target.value);
                setAddressFromDomain("");
                setTransferAmount("");
              }}
              placeholder="Address to transfer"
            />
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
            <IWInput
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
            >
              Transfer
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

export default TokensTabTransferToken;
