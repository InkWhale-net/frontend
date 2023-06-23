import { Button, Heading, Stack } from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatQueryResultToNumber, isAddressValid } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
const TokensTabCheckBalance = ({
  mode,
  address,
  tokenInfo,
  balance,
  selectedContractAddr,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [addressCheckBalance, setAddressCheckBalance] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

  async function checkBalanceHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }

    if (!isAddressValid(addressCheckBalance)) {
      return toast.error("Invalid address!");
    }
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      addressCheckBalance
    );
    let tokenDecimalQuery = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22Metadata::tokenDecimals"
    );
    const decimal = tokenDecimalQuery.toHuman()?.Ok;

    const bal = formatQueryResultToNumber(queryResult, parseInt(decimal));
    setTokenBalance(bal);
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
            content: !address ? (
              "No account selected"
            ) : (
              <AddressCopier address={address} />
            ),
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
        title={`Enter any address to check ${tokenInfo?.title} balance`}
      >
        <IWCard mt="16px" w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              value={addressCheckBalance}
              onChange={({ target }) => setAddressCheckBalance(target.value)}
              placeholder="Address you want to check balance"
            />

            <IWInput
              value={tokenBalance}
              isDisabled={true}
              placeholder=""
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenInfo?.title}
                </Heading>
              }
            />

            <Button
              isDisabled={!addressCheckBalance}
              onClick={() => checkBalanceHandler()}
              w="full"
            >
              Check
            </Button>
          </Stack>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

export default TokensTabCheckBalance;
