import {
  Box,
  Button,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineClear } from "react-icons/ai";
import { addressShortener, moveINWToBegin } from "utils";

import IWPaginationTable from "components/table/IWPaginationTable";
import { useAppContext } from "contexts/AppContext";
import { useMutation } from "react-query";
import { getTimestamp, roundUp } from "utils";
import { formatChainStringToNumber } from "utils";

export default function TokensSwapHistoryPage() {
  const { api } = useAppContext();
  const [transactions, setTransactions] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
  const [tokenAddressSearch, setTokenAddressSearch] = useState("");
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const [keywords, setKeywords] = useState({
    queryAddress: "",
    fromOnly: false,
    toOnly: false,
  });
  const [, setFaucetTokensList] = useState([]);
  const [selectedContractAddr, setSelectedContractAddr] = useState(null);

  const selectedToken = useMemo(
    () =>
      commonFiTokenList?.find((el) => el.tokenAddress === selectedContractAddr),
    [selectedContractAddr]
  );

  useEffect(() => {
    setKeywords({
      queryAddress: "",
      fromOnly: false,
      toOnly: false,
    });
    if (pagination?.pageIndex !== 0) {
      setPagination({ pageIndex: 0, pageSize: 10 });
    } else {
      if (selectedToken)
        tokenTransactionMutation.mutate(selectedToken?.tokenAddress, keywords);
      else tokenTransactionMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken]);

  useEffect(() => {
    if (!(tokenAddressSearch?.length > 0)) {
      setKeywords({
        queryAddress: "",
        fromOnly: false,
        toOnly: false,
      });
      if (pagination?.pageIndex !== 0) {
        setPagination({ pageIndex: 0, pageSize: 10 });
      } else {
        tokenTransactionMutation.mutate();
      }
    }
  }, [tokenAddressSearch]);

  useEffect(() => {
    if (!(keywords?.queryAddress?.length > 0))
      tokenTransactionMutation.mutate(selectedToken?.tokenAddress);
    setKeywords({ ...keywords, fromOnly: false, toOnly: false });
  }, [keywords?.queryAddress]);

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
    tokenTransactionMutation.mutate(selectedToken?.tokenAddress, keywords);
  }, [pageIndex, pageSize, api]);

  const [cacheTokenMetadata, setCacheTokenMetadata] = useState([]);

  const filterTokenCache = (list) => {
    return Object.values(
      list.reduce((acc, obj) => {
        const tokenContract = obj.tokenContract;
        if (!acc[tokenContract]) {
          acc[tokenContract] = obj;
        }
        return acc;
      }, {})
    );
  };

  const tokenTransactionMutation = useMutation(async () => {
    await new Promise(async (resolve) => {
      if (!api) return;
      let queryBody = {};
      const tokenMetadata = [...cacheTokenMetadata];
      if (tokenAddressSearch || selectedToken?.tokenAddress)
        queryBody.tokenContract =
          tokenAddressSearch || selectedToken?.tokenAddress;
      if (keywords?.queryAddress)
        queryBody.queryAddress = keywords?.queryAddress;
      if (keywords?.fromOnly) queryBody.isFromOnly = keywords?.fromOnly;
      if (keywords?.toOnly) queryBody.isToOnly = keywords?.toOnly;

      queryBody.limit = pageSize;
      queryBody.offset = pageIndex * pageSize;

      const { ret, status, message } = await APICall.getSwapTransactionHistory(
        queryBody
      );

      setTotalPage(roundUp(ret?.total / 10, 0));

      if (status === "OK") {
        const transactionList = await Promise.all(
          ret?.dataArray?.map(async (txObj) => {
            if (txObj.method.includes("router::swapExact")) {
              const tokenInInfo = commonFiTokenList.find(
                (item) => item.tokenAddress === txObj.tokenPathIn
              );

              const tokenOutInfo = commonFiTokenList.find(
                (item) => item.tokenAddress === txObj.tokenPathOut
              );

              const timeEvent = await getTimestamp(api, txObj?.blockNumber);

              if (txObj.method === "router::swapExactTokensForNative") {
                return {
                  ...txObj,
                  type: "Common Fi",
                  account: txObj.toAddress,
                  blockNum: txObj.blockNumber,
                  tokenIn: `${
                    formatChainStringToNumber(txObj.amountIn) /
                    Math.pow(10, tokenInInfo?.tokenDecimals)
                  } ${tokenInInfo?.tokenSymbol}`,
                  tokenOut: txObj.amountOut,
                  blockNumber: timeEvent,
                };
              }

              return {
                ...txObj,
                type: "Common Fi",
                account: txObj.toAddress,
                blockNum: txObj.blockNumber,
                tokenIn: `${
                  formatChainStringToNumber(txObj.amountIn) /
                  Math.pow(10, tokenInInfo?.tokenDecimals)
                } ${tokenInInfo?.tokenSymbol}`,
                tokenOut: `${
                  formatChainStringToNumber(txObj.amountOut) /
                  Math.pow(10, tokenOutInfo?.tokenDecimals)
                } ${tokenOutInfo?.tokenSymbol}`,
                blockNumber: timeEvent,
              };
            }
          })
        );
        setCacheTokenMetadata(filterTokenCache(tokenMetadata));
        setTransactions(transactionList.filter((e) => e));
      } else {
        toast.error(message);
      }
      resolve();
    });
  }, "query-token-tx");

  const tableData = {
    tableHeader: [
      {
        accessorKey: "type",
        header: "DEX",
      },
      {
        accessorKey: "blockNum",
        header: "block Num",
      },
      {
        accessorKey: "account",
        header: "User address",
      },
      {
        accessorKey: "tokenIn",
        header: "From",
      },
      {
        accessorKey: "tokenOut",
        header: "To",
      },
      {
        accessorKey: "blockNumber",
        header: "Time",
      },
    ],
    tableBody: transactions || [],
  };

  return (
    <>
      {/* <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Common Fi Swap Transaction History"
        description={<span>Sync in progress</span>}
      >
        <SimpleGrid
          w="full"
          columns={{ base: 1, lg: 2 }}
          spacingX={{ lg: "20px" }}
          spacingY={{ base: "20px", lg: "32px" }}
          mb={{ base: "30px" }}
          alignItems="flex-end"
        >
          <Box w="full" pr={{ lg: "10px" }}>
            <Heading as="h4" size="h4" mb="12px">
              Token Contract Address
            </Heading>

            <Box display={{ base: "flex" }} alignItems={{ base: "flex-end" }}>
              <Box display="flex" flex={1} flexDirection="column">
                <SelectSearch
                  inputValue={tokenAddressSearch}
                  onInputChange={(value) => {
                    if (value?.length > 0) setTokenAddressSearch(value);
                  }}
                  noOptionsMessage={() => (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (pagination?.pageIndex !== 0) {
                          setPagination({ pageIndex: 0, pageSize: 10 });
                        } else {
                          tokenTransactionMutation.mutate(
                            selectedToken?.tokenAddress,
                            keywords
                          );
                        }
                      }}
                    >{`Search token "${tokenAddressSearch}"`}</div>
                  )}
                  name="token"
                  placeholder={tokenAddressSearch?.length > 0 || "All token"}
                  closeMenuOnSelect={true}
                  value={
                    selectedToken
                      ? {
                          value: selectedToken?.tokenAddress,
                          label: `${selectedToken?.tokenSymbol} (${
                            selectedToken?.tokenSymbol
                          }) - ${addressShortener(
                            selectedToken?.tokenAddress
                          )}`,
                        }
                      : ""
                  }
                  isSearchable
                  onChange={({ value }) => {
                    console.log("value", value);
                    setSelectedContractAddr(value);
                  }}
                  options={[
                    {
                      label: "All token",
                    },
                    ...commonFiTokenList?.map((token, idx) => ({
                      value: token?.tokenAddress,
                      label: `${token?.tokenSymbol} (${
                        token?.tokenSymbol
                      }) - ${addressShortener(token?.tokenAddress)}`,
                    })),
                  ]}
                />
              </Box>

              {tokenAddressSearch?.length > 0 && (
                <IconButton
                  aria-label="Clear"
                  variant="link"
                  width={"42px"}
                  height={"42px"}
                  marginTop={"16px"}
                  icon={<AiOutlineClear />}
                  onClick={() => setTokenAddressSearch("")}
                />
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", pl: "10px" }}>
            <IWInput
              value={keywords?.queryAddress}
              width={{ base: "full" }}
              onChange={({ target }) =>
                setKeywords({ ...keywords, queryAddress: target.value })
              }
              placeholder="Search user address"
            />
            {!isSmallerThanMd && (
              <Button
                sx={{ ml: "10px" }}
                isDisabled={false}
                onClick={() => {
                  if (pagination?.pageIndex !== 0) {
                    setPagination({ pageIndex: 0, pageSize: 10 });
                  } else {
                    tokenTransactionMutation.mutate(
                      tokenAddressSearch || selectedToken?.tokenAddress,
                      keywords
                    );
                  }
                }}
              >
                Load
              </Button>
            )}
          </Box>
        </SimpleGrid>
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
          <IWPaginationTable
            {...tableData}
            pagination={pagination}
            setPagination={setPagination}
            totalData={totalPage}
            mutation={tokenTransactionMutation}
          />
        </Stack>
      </SectionContainer> */}
    </>
  );
}

const commonFiTokenList = [
  {
    tokenSymbol: "INW",
    tokenDecimals: 12,
    icon: "",
    tokenAddress: "5FrXTf3NXRWZ1wzq9Aka7kTGCgGotf6wifzV7RzxoCYtrjiX",
  },
  {
    tokenSymbol: "INW2",
    tokenDecimals: 12,
    icon: "",
    tokenAddress: "5HgJNiF2bJkjqZ8M7HRdSuJ9Ho5EJhnpipEtF69FTo2XX1Hu",
  },
  {
    tokenAddress: "5CVGYujZnkBvNsUypdMuEYT2qRzFWhZHufteSfYguQMLkaE3",
    tokenName: "Fire",
    tokenSymbol: "FIR",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5FDkUXLExhgFT92UQvMQVG8H4Z4Ku4Mx9heUYpchxZMdY7LD",
    tokenName: "Paper",
    tokenSymbol: "PAP",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5DgnLZDNJ2bN4AcG4PzGMDdpL5ukd1kttmuMjXYNCG91vCkX",
    tokenName: "Plants",
    tokenSymbol: "PLA",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5GkV8efVcUhZ2PRkP6bNzJ9ATVh32uJMY89zMiK5rkA49yfU",
    tokenName: "Water",
    tokenSymbol: "WAT",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5F84uFXvpEn4n6fAyRbP6mg32YHy8R4KEokZfFMW1svNTmbZ",
    tokenName: "Wind",
    tokenSymbol: "WIN",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5DuyRY19RZsxnyffwKRSox8rj5VUHf49fHLjUcZpfnwFrYGZ",
    tokenName: "Electricity",
    tokenSymbol: "ELE",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5E3bkdogtK4ro2vC5vKP7QDJRzw38kHqXp5p5BiurQ9hBSbF",
    tokenName: "Ice",
    tokenSymbol: "ICE",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5CnV23shYarqBGZVmzuCxJvbd2TwxvQsjgAxoeGnhu2Zkxkp",
    tokenName: "Steam",
    tokenSymbol: "STE",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5D5W2iUTvWs3mVSLDCdnNU3pTJyUHpiCeTEp9td4Hk3jwPqt",
    tokenName: "Stone",
    tokenSymbol: "STO",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5H8UXMbPdVTCbsYQWBGuVj4k6XDo75wqQ8QdeRbwziQYcTdc",
    tokenName: "Wood",
    tokenSymbol: "WOO",
    tokenDecimals: 12,
  },
  {
    tokenAddress: "5GCESNyxspadqV267XA1jr1dUs5gQpM5fK8vWf2mbUCHrNcX",
    tokenName: "wSepoliaETH",
    tokenSymbol: "wSETH",
    tokenDecimals: 18,
  },
  {
    tokenAddress: "5GbgQsUockA8cG6VV9AMesudFC5Z9HZBeGrgURsX2tarUynh",
    tokenName: "Magic",
    tokenSymbol: "MAG",
    tokenDecimals: 6,
  },
  {
    tokenAddress: "5EgZssw2zdRNd6ptEm5RMvh4aJebLhdfsdFPECUrCWRMB4bJ",
    tokenName: "Love",
    tokenSymbol: "LUV",
    tokenDecimals: 6,
  },
  {
    tokenAddress: "5F4baaKHqbP9D3pzL82T8ETG8p5iSojaPnuAJmNk5rh7tiKs",
    tokenName: "Luck",
    tokenSymbol: "LUC",
    tokenDecimals: 6,
  },
  {
    tokenAddress: "5F15fXseSeKtmjmUUrERV7rXwBQDmpS1RMepniiYLiMWEhkf",
    tokenName: "Knowledge",
    tokenSymbol: "KNO",
    tokenDecimals: 6,
  },
  {
    tokenAddress: "5EFDb7mKbougLtr5dnwd5KDfZ3wK55JPGPLiryKq4uRMPR46",
    tokenName: "Wrapped TZERO",
    tokenSymbol: "wTZERO",
    tokenDecimals: 12,
  },
];
