import { CopyIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { handleCopy } from "utils";
import { addressShortener } from "utils";
import {
  formatQueryResultToNumber,
  isAddressValid,
  resolveAZDomainToAddress,
} from "utils";
import { execContractQuery } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import MyAccountTab from "./myAccount";
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
  const [addressFromDomain, setAddressFromDomain] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");

  async function checkBalanceHandler() {
    if (!currentAccount) {
      return toast.error("Please connect wallet!");
    }

    if (!tokenInfo?.title) {
      return toast.error("Please load token first!");
    }
    const resolvedAddress = await resolveAZDomainToAddress(addressCheckBalance);
    setAddressFromDomain(resolvedAddress);
    if (!isAddressValid(addressCheckBalance) && !resolvedAddress) {
      return toast.error("Invalid address!");
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      resolvedAddress ? resolvedAddress : addressCheckBalance
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
      <MyAccountTab address={address} balance={balance} tokenInfo={tokenInfo} />

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
              onChange={({ target }) => {
                setAddressCheckBalance(target.value);
                setAddressFromDomain("");
                setTokenBalance("");
              }}
              placeholder="Address you want to check balance"
            />
            {addressFromDomain && addressCheckBalance && (
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
