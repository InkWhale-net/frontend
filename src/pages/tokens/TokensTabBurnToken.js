import { Button, Heading, Stack } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatChainStringToNumber, formatNumToBN } from "utils";
import { execContractTx } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import MyAccountTab from "./myAccount";
import { FINALIZED_TIME } from "constants";

const TokensTabBurnToken = ({
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

  const [burnAmount, setBurnAmount] = useState("");

  async function burnTokenHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (burnAmount === 0 || !burnAmount) {
      toast.error("Please enter amount to transfer!");
      return;
    }

    if (+burnAmount > +formatChainStringToNumber(tokenInfo?.content)) {
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
      "psp22Burnable::burn",
      currentAccount?.address,
      formatNumToBN(burnAmount, parseInt(tokenInfo?.decimals))
    );

    await delay(FINALIZED_TIME).then(() => {
      setBurnAmount("");
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
        title={`Burn ${tokenInfo?.title} Tokens`}
      >
        <IWCard mt="16px" w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              type="number"
              value={burnAmount}
              onChange={({ target }) => setBurnAmount(target.value)}
              placeholder="Amount to burn"
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenInfo?.title}
                </Heading>
              }
            />

            <Button
              isDisabled={!Number(burnAmount)}
              onClick={burnTokenHandler}
              w="full"
            >
              Burn
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

export default TokensTabBurnToken;
