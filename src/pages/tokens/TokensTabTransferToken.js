import { Button, Heading, Stack } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  addressShortener,
  delay,
  formatChainStringToNumber,
  formatNumToBN,
  isAddressValid,
} from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";

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
  const [transferAmount, setTransferAmount] = useState("");

  async function transferTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (!isAddressValid(transferAddress)) {
      return toast.error("Invalid address!");
    }

    if (transferAmount === 0 || !transferAmount) {
      toast.error("Please enter amount to transfer!");
      return;
    }

    if (transferAmount > formatChainStringToNumber(tokenInfo?.content)) {
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
      transferAddress,
      formatNumToBN(transferAmount),
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
      <IWCardOneColumn
        title="My Account"
        data={[
          {
            title: "Account Address",
            content: !address
              ? "No account selected"
              : addressShortener(address),
          },
          {
            title: "Azero Balance",
            content: `${balance?.azero || 0} AZERO`,
          },
          { title: "INW Balance", content: `${balance?.inw || 0} INW` },
          {
            title: !tokenInfo?.title ? "" : `${tokenInfo?.title} Balance`,
            content: `${tokenInfo?.content} ${tokenInfo?.title}`,
          },
        ]}
      />

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
              onChange={({ target }) => setTransferAddress(target.value)}
              placeholder="Address to transfer"
            />

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
