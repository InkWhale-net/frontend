import { Box, Heading, Stack } from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import IWCard from "components/card/Card";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import TokensTabSwapToken from "./TokensTabSwapToken";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  addressShortener,
  formatNumDynDecimal,
  formatQueryResultToNumber,
  isAddressValid,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import { getTokenOwner } from "utils";
import { formatTokenAmount } from "utils";
import { swapableTokens } from "constants";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useAppContext } from "contexts/AppContext";

export default function TokensSwapPage() {
  const { api } = useAppContext();
  const history = useHistory();

  const { tokenAddress } = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);

  const [selectedContractAddr, setSelectedContractAddr] = useState(null);
  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [tokenInfo, setTokenInfo] = useState({ title: "", balance: "" });
  const [tokenV2Info, setTokenV2Info] = useState({ title: "", balance: "" });
  const [supportedToken, setSupportedToken] = useState([]);
  const [swapTokenContractAddress, setSwapTokenContractAddress] =
    useState(null);

  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let filterAddressContractParam = [];
      for (const swapableToken of swapableTokens) {
        filterAddressContractParam.push(swapableToken.contractAddress);
      }
      let { ret, status, message } = await APICall.getTokensList({});

      // let faucetTokensListTmp = ret.filter(
      //   (el) =>
      //     !!el?.contractAddress &&
      //     filterAddressContractParam.includes(el?.contractAddress)
      // );

      // hard fix only for IOU
      let faucetTokensListTmp = swapableTokens;

      if (status === "OK") {
        if (isUnmounted) return;
        return setFaucetTokensList(faucetTokensListTmp);
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();
    return () => (isUnmounted = true);
  }, []);

  const selectedToken = useMemo(
    () =>
      faucetTokensList?.find(
        (el) => el.contractAddress === selectedContractAddr
      ),
    [selectedContractAddr, faucetTokensList]
  );

  const loadTokenInfo = useCallback(
    async (tokenAddress) => {
      if (!currentAccount) {
        toast.error("Please connect wallet!");
        return setTokenInfo({ title: "", balance: "" });
      }

      if (!isAddressValid(tokenAddress)) {
        toast.error("Invalid address!");
        return;
      }

      let queryResult = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22::balanceOf",
        currentAccount?.address
      );
      let queryResult4 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenDecimals"
      );
      const decimals = queryResult4?.toHuman().Ok;
      const balance = formatQueryResultToNumber(
        queryResult,
        parseInt(decimals)
      );

      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenSymbol"
      );
      const tokenSymbol = queryResult1?.toHuman().Ok;
      let queryResult2 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenName"
      );
      const tokenName = queryResult2?.toHuman().Ok;
      let queryResult3 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22::totalSupply"
      );
      const rawTotalSupply = queryResult3?.toHuman().Ok;

      const totalSupply = formatTokenAmount(rawTotalSupply, decimals);

      const { address: owner } = await getTokenOwner(tokenAddress);
      let tokenIconUrl = null;
      try {
        const { status, ret } = await APICall.getTokenInfor({
          tokenAddress: tokenAddress,
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
        if (swapableToken.contractAddress == tokenAddress) {
          let supportedToken = [
            {
              version: "1.0",
              token: swapableToken.token,
              name: swapableToken.name,
              decimal: swapableToken.decimal,
              contractAddress: swapableToken.contractAddress,
            },
            {
              version: "2.0",
              token: swapableToken.tokenVersion2,
              name: swapableToken.nameVersion2,
              decimal: swapableToken.decimal,
              contractAddress: swapableToken.contractAddress2,
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
          balance: balance,
          name: tokenName,
          totalSupply: formatNumDynDecimal(totalSupply, 4),
          decimals,
          owner,
          tokenIconUrl,
          address: tokenAddress,
        };
      });
    },
    [currentAccount]
  );

  const loadTokenV2Info = useCallback(
    async (tokenAddress) => {
      let tokenV2ContractAddress = null;
      for (const swapableToken of swapableTokens) {
        if (swapableToken.contractAddress === tokenAddress) {
          tokenV2ContractAddress = swapableToken.contractAddress2;
        }
      }
      if (!currentAccount) {
        toast.error("Please connect wallet!");
        return setTokenInfo({ title: "", balance: "" });
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
      const decimals = queryResult4?.toHuman().Ok;
      const balance = formatQueryResultToNumber(
        queryResult,
        parseInt(decimals)
      );

      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenV2ContractAddress,
        0,
        "psp22Metadata::tokenSymbol"
      );
      const tokenSymbol = queryResult1?.toHuman().Ok;
      let queryResult2 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenV2ContractAddress,
        0,
        "psp22Metadata::tokenName"
      );
      const tokenName = queryResult2?.toHuman().Ok;
      let queryResult3 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenV2ContractAddress,
        0,
        "psp22::totalSupply"
      );
      const rawTotalSupply = queryResult3?.toHuman().Ok;

      const totalSupply = formatTokenAmount(rawTotalSupply, decimals);

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
        const ret = {
          ...prev,
          title: tokenSymbol,
          balance: balance,
          name: tokenName,
          totalSupply: formatNumDynDecimal(totalSupply, 4),
          decimals,
          owner,
          tokenIconUrl,
          address: tokenV2ContractAddress,
        };

        return ret;
      });
    },
    [currentAccount]
  );

  useEffect(() => {
    if (api && tokenAddress) {
      setSelectedContractAddr(tokenAddress);
      loadTokenInfo(tokenAddress);
      loadTokenV2Info(tokenAddress);
    }
  }, [api, loadTokenInfo, loadTokenV2Info, tokenAddress]);

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
                    console.log("value", value);
                    history.push({ pathname: `/tokens/swap/${value}` });
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
            </Stack>
          </IWCard>
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
          />{" "}
        </Stack>
      </SectionContainer>
    </>
  );
}
