import { Box, Button, Heading, Show, Stack } from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import IWCard from "components/card/Card";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import IWTabs from "components/tabs/IWTabs";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  addressShortener,
  formatNumDynDecimal,
  formatQueryResultToNumber,
  isAddressValid,
  moveINWToBegin,
  roundUp,
} from "utils";
import { execContractQuery } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import TokenInformation from "./TokenInformation";
import TokensTabBurnToken from "./TokensTabBurnToken";
import TokensTabCheckBalance from "./TokensTabCheckBalance";
import TokensTabTransferToken from "./TokensTabTransferToken";
 
import { getTokenOwner } from "utils";
import { formatTokenAmount } from "utils";

export default function TokensPage() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [selectedContractAddr, setSelectedContractAddr] = useState(null);
  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [tokenInfo, setTokenInfo] = useState({ title: "", content: "" });

  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getTokensList({});

      if (status === "OK") {
        if (isUnmounted) return;
        return setFaucetTokensList(moveINWToBegin(ret));
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();
    return () => (isUnmounted = true);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (selectedContractAddr) {
        loadTokenInfo();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedContractAddr, currentAccount]);

  const selectedToken = useMemo(
    () =>
      faucetTokensList?.find(
        (el) => el.contractAddress === selectedContractAddr
      ),
    [selectedContractAddr, faucetTokensList]
  );

  async function loadTokenInfo() {
    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return setTokenInfo({ title: "", content: "" });
    }

    if (!isAddressValid(selectedContractAddr)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );
    let queryResult4 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22Metadata::tokenDecimals"
    );
    const decimals = queryResult4.toHuman().Ok;
    const balance = formatQueryResultToNumber(queryResult, parseInt(decimals));

    let queryResult1 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22Metadata::tokenSymbol"
    );
    const tokenSymbol = queryResult1.toHuman().Ok;
    let queryResult2 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22Metadata::tokenName"
    );
    const tokenName = queryResult2.toHuman().Ok;
    let queryResult3 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::totalSupply"
    );
    const rawTotalSupply = queryResult3.toHuman().Ok;

    const totalSupply = formatTokenAmount(rawTotalSupply, decimals);

    const { address: owner } = await getTokenOwner(selectedContractAddr);
    let tokenIconUrl = null;
    try {
      const { status, ret } = await APICall.getTokenInfor({
        tokenAddress: selectedContractAddr,
      });
      if (status === "OK") {
        tokenIconUrl = ret?.tokenIconUrl;
      }
    } catch (error) {
      console.log(error);
    }

    setTokenInfo((prev) => {
      return {
        ...prev,
        title: tokenSymbol,
        content: balance,
        name: tokenName,
        totalSupply: formatNumDynDecimal(totalSupply, 4),
        decimals,
        owner,
        tokenIconUrl,
        address: selectedContractAddr,
      };
    });
  }

  const tabsData = [
    {
      label: <>Check Balance</>,
      component: (
        <TokensTabCheckBalance
          mode="BALANCE_CHECK"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
        />
      ),
      isDisabled: false,
    },

    {
      label: (
        <>
          Transfer<Show above="md"> Token</Show>
        </>
      ),
      component: (
        <TokensTabTransferToken
          mode="TRANSFER_TOKEN"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
          loadTokenInfo={loadTokenInfo}
        />
      ),
      isDisabled: false,
    },
    {
      label: (
        <>
          Burn<Show above="md"> Token</Show>
        </>
      ),
      component: (
        <TokensTabBurnToken
          mode="BURN_TOKEN"
          {...currentAccount}
          tokenInfo={tokenInfo}
          selectedContractAddr={selectedContractAddr}
          loadTokenInfo={loadTokenInfo}
        />
      ),
      isDisabled: false,
    },
    tokenInfo?.title && {
      label: <>Token Info</>,
      component: <TokenInformation tokenInfo={tokenInfo} />,
      isDisabled: false,
    },
  ];

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Token Interaction"
        description={
          <span>Check token information, transfer or burn tokens.</span>
        }
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="full"
              spacing="20px"
              alignItems={{ base: "end" }}
              flexDirection={{ base: "column", lg: "row" }}
            >
              <Box w="full" pr={{ lg: "10px" }}>
                <Heading as="h4" size="h4" mb="12px">
                  Token Contract Address
                </Heading>
                <SelectSearch
                  name="token"
                  placeholder="Select Token..."
                  closeMenuOnSelect={true}
                  // filterOption={filterOptions}
                  value={
                    selectedToken
                      ? {
                          value: selectedToken?.contractAddress,
                          label: `${selectedToken?.symbol} (${
                            selectedToken?.name
                          }) - ${addressShortener(
                            selectedToken?.contractAddress
                          )}`,
                        }
                      : ""
                  }
                  isSearchable
                  onChange={({ value }) => {
                    setSelectedContractAddr(value);
                  }}
                  options={faucetTokensList?.map((token, idx) => ({
                    value: token?.contractAddress,
                    label: `${token?.symbol} (${
                      token?.name
                    }) - ${addressShortener(token?.contractAddress)}`,
                  }))}
                ></SelectSearch>
              </Box>
              <Box w="full" pr={{ lg: "20px" }}>
                <IWInput
                  onChange={({ target }) =>
                    setSelectedContractAddr(target.value)
                  }
                  value={selectedContractAddr}
                  placeholder="Address to check"
                  label="or enter token contract address"
                />
              </Box>

              <Button
                onClick={loadTokenInfo}
                w="full"
                maxW={{ base: "full", lg: "190px" }}
              >
                Load
              </Button>
            </Stack>
          </IWCard>

          <IWTabs tabsData={tabsData.filter((e) => !!e)} />
        </Stack>
      </SectionContainer>
    </>
  );
}
