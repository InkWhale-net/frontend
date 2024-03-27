import { Box, Button, Heading, Show, Stack } from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import IWCard from "components/card/Card";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import IWTabs from "components/tabs/IWTabs";
import TokenInformation from "./TokenInformation";
import TokensTabSwapToken from "./TokensTabSwapToken";
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
import psp22_contract from "utils/contracts/psp22_contract";
import { getTokenOwner } from "utils";
import { formatTokenAmount } from "utils";
import { appChain, swapableTokens } from "constants";

export default function TokensSwapPage() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [selectedContractAddr, setSelectedContractAddr] = useState(null);
  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [tokenInfo, setTokenInfo] = useState({ title: "", content: "" });
  const [tokenV2Info, setTokenV2Info] = useState({ title: "", content: "" });
  const [supportedToken, setSupportedToken] = useState([]);
  const [swapTokenContractAddress, setSwapTokenContractAddress] = useState(null);
  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let filterAddressContractParam = [];
      for (const swapableToken of swapableTokens) {
        filterAddressContractParam.push(swapableToken.contract_address);
      }
      let { ret, status, message } = await APICall.getTokensList({});
      let faucetTokensListTmp = ret.filter(
        (el) => !!el?.contractAddress && filterAddressContractParam.includes(el?.contractAddress)
      );

      console.log('getFaucetTokensListData::ret', ret);
      // for (const faucetTokensListItem of ret) {
      //   if (faucetTokensListItem.)
      // }

      if (status === "OK") {
        if (isUnmounted) return;
        return setFaucetTokensList(faucetTokensListTmp);
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
        loadTokenV2Info();
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
    console.log('selectedContractAddr', selectedContractAddr);
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
    setSupportedToken([]);
    setSwapTokenContractAddress(null);
    for (const swapableToken of swapableTokens) {
      if (swapableToken.contract_address == selectedContractAddr) {
        let supportedToken = [
          {
            version: "1.0",
            token: swapableToken.token,
            name: swapableToken.name,
            decimal: swapableToken.decimal,
            contractAddress: swapableToken.contract_address,
          },
          {
            version: "2.0",
            token: swapableToken.token_version_2,
            name: swapableToken.name_version_2,
            decimal: swapableToken.decimal,
            contractAddress: swapableToken.contract_address_2,
          },
        ];
        setSupportedToken(supportedToken);
        setSwapTokenContractAddress(swapableToken.swap_contract_address);
      }
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

  async function loadTokenV2Info() {
    let tokenV2ContractAddress = null;
    for (const swapableToken of swapableTokens) {
      if (swapableToken.contract_address == selectedContractAddr) {
        tokenV2ContractAddress = swapableToken.contract_address_2;
      }
    }
    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return setTokenInfo({ title: "", content: "" });
    }

    if (!isAddressValid(tokenV2ContractAddress)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenV2ContractAddress,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );
    let queryResult4 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenV2ContractAddress,
      0,
      "psp22Metadata::tokenDecimals"
    );
    const decimals = queryResult4.toHuman().Ok;
    const balance = formatQueryResultToNumber(queryResult, parseInt(decimals));

    let queryResult1 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenV2ContractAddress,
      0,
      "psp22Metadata::tokenSymbol"
    );
    const tokenSymbol = queryResult1.toHuman().Ok;
    let queryResult2 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenV2ContractAddress,
      0,
      "psp22Metadata::tokenName"
    );
    const tokenName = queryResult2.toHuman().Ok;
    let queryResult3 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenV2ContractAddress,
      0,
      "psp22::totalSupply"
    );
    const rawTotalSupply = queryResult3.toHuman().Ok;

    const totalSupply = formatTokenAmount(rawTotalSupply, decimals);
    console.log('tokenV2ContractAddress', tokenV2ContractAddress);
    const { address: owner } = await getTokenOwner(tokenV2ContractAddress);
    let tokenIconUrl = null;
    try {
      const { status, ret } = await APICall.getTokenInfor({
        tokenAddress: tokenV2ContractAddress,
      });
      if (status === "OK") {
        tokenIconUrl = ret?.tokenIconUrl;
      }
    } catch (error) {
      console.log(error);
    }

    setTokenV2Info((prev) => {
      return {
        ...prev,
        title: tokenSymbol,
        content: balance,
        name: tokenName,
        totalSupply: formatNumDynDecimal(totalSupply, 4),
        decimals,
        owner,
        tokenIconUrl,
        address: tokenV2ContractAddress,
      };
    });
  }

  const tabsData = [
    tokenInfo?.title && {
      label: <>Token Info</>,
      component: <TokenInformation tokenInfo={tokenInfo} />,
      isDisabled: false,
    },
    tokenInfo?.title && {
      label: (
        <>
          Swap<Show above="md"> Token</Show>
        </>
      ),
      component: (
        <TokensTabSwapToken
          mode="SWAP_TOKEN"
          {...currentAccount}
          tokenInfo={tokenInfo}
          tokenV2Info={tokenV2Info}
          selectedContractAddr={selectedContractAddr}
          loadTokenInfo={loadTokenInfo}
          loadTokenV2Info={loadTokenV2Info}
          supportedToken={supportedToken}
          swapTokenContractAddress={swapTokenContractAddress}
        />
      ),
      isDisabled: false,
    },
  ];
  console.log(currentAccount);
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Swap Token"
        description={
          <span>Check token information, swap token to new version.</span>
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
