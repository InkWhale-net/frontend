import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Switch,
  useBreakpointValue,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineClear, AiOutlineDownload } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  addressShortener,
  formatNumDynDecimal,
  formatTokenAmount,
  moveINWToBegin,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";

import IWPaginationTable from "components/table/IWPaginationTable";
import { useAppContext } from "contexts/AppContext";
import { useMutation } from "react-query";
import { getTimestamp, roundUp } from "utils";

export default function TokensPage() {
  const { currentAccount } = useSelector((s) => s.wallet);
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
  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [selectedContractAddr, setSelectedContractAddr] = useState(null);

  const selectedToken = useMemo(
    () =>
      faucetTokensList?.find(
        (el) => el.contractAddress === selectedContractAddr
      ),
    [selectedContractAddr, faucetTokensList]
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
        tokenTransactionMutation.mutate(
          selectedToken?.contractAddress,
          keywords
        );
      else tokenTransactionMutation.mutate();
    }
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
      tokenTransactionMutation.mutate(selectedToken?.contractAddress);
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
    tokenTransactionMutation.mutate(selectedToken?.contractAddress, keywords);
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
      if (tokenAddressSearch || selectedToken?.contractAddress)
        queryBody.tokenContract =
          tokenAddressSearch || selectedToken?.contractAddress;
      if (keywords?.queryAddress)
        queryBody.queryAddress = keywords?.queryAddress;
      if (keywords?.fromOnly) queryBody.isFromOnly = keywords?.fromOnly;
      if (keywords?.toOnly) queryBody.isToOnly = keywords?.toOnly;
      queryBody.limit = pageSize;
      queryBody.offset = pageIndex * pageSize;

      const { ret, status, message } = await APICall.getTransactionHistory(
        queryBody
      );
      setTotalPage(roundUp(ret?.total / 10, 0));
      if (status === "OK") {
        const transactionList = await Promise.all(
          ret?.dataArray?.map(async (txObj) => {
            if (txObj?.data?.tokenContract) {
              const findTokenInCache = tokenMetadata.filter(
                (e) => e?.tokenContract === txObj?.data?.tokenContract
              );
              const timeEvent = await getTimestamp(api, txObj?.blockNumber);
              if (findTokenInCache?.length > 0) {
                return {
                  token: {
                    address: txObj?.data?.tokenContract,
                    name: findTokenInCache[0].tokenName,
                    symbol: findTokenInCache[0].tokenSymbol,
                    decimal: parseInt(findTokenInCache[0].decimal),
                  },
                  tokenContract: txObj?.data?.tokenContract,
                  tokenSymbol: findTokenInCache[0].tokenSymbol,
                  amount: formatTokenAmount(
                    txObj?.data?.amount,
                    +findTokenInCache[0].decimal
                  ),
                  blockNumber: timeEvent,
                  time: txObj?.createdTime,
                  fromAddress: txObj?.fromAddress,
                  toAddress: txObj?.toAddress,
                  currentAccount: currentAccount?.address,
                  amountIcon:
                    keywords?.queryAddress?.length > 0 &&
                    (txObj?.fromAddress === keywords?.queryAddress ? (
                      <BsArrowUpRight
                        style={{ marginRight: "4px" }}
                        color="#31A5FF"
                      />
                    ) : (
                      <AiOutlineDownload style={{ marginRight: "4px" }} />
                    )),
                };
              } else {
                let queryResult = await execContractQuery(
                  currentAccount?.address,
                  "api",
                  psp22_contract.CONTRACT_ABI,
                  txObj?.data?.tokenContract,
                  0,
                  "psp22Metadata::tokenDecimals"
                );
                const decimal = queryResult?.toHuman()?.Ok;
                let queryResult1 = await execContractQuery(
                  currentAccount?.address,
                  "api",
                  psp22_contract.CONTRACT_ABI,
                  txObj?.data?.tokenContract,
                  0,
                  "psp22Metadata::tokenName"
                );
                const tokenName = queryResult1?.toHuman().Ok;
                let queryResult2 = await execContractQuery(
                  currentAccount?.address,
                  "api",
                  psp22_contract.CONTRACT_ABI,
                  txObj?.data?.tokenContract,
                  0,
                  "psp22Metadata::tokenSymbol"
                );
                const tokenSymbol = queryResult2?.toHuman().Ok;

                if (decimal && tokenName && tokenSymbol)
                  tokenMetadata.push({
                    tokenName,
                    tokenSymbol,
                    decimal,
                    tokenContract: txObj?.data?.tokenContract,
                  });
                return {
                  token: {
                    address: txObj?.data?.tokenContract,
                    name: tokenName,
                    symbol: tokenSymbol,
                    decimal: parseInt(decimal),
                  },
                  tokenContract: txObj?.data?.tokenContract,
                  tokenSymbol,
                  amount: formatTokenAmount(
                    txObj?.data?.amount,
                    +decimal
                  ),
                  blockNumber: timeEvent,
                  time: txObj?.createdTime,
                  fromAddress: txObj?.fromAddress,
                  toAddress: txObj?.toAddress,
                  currentAccount: currentAccount?.address,
                  amountIcon:
                    keywords?.queryAddress?.length > 0 &&
                    (txObj?.fromAddress === keywords?.queryAddress ? (
                      <BsArrowUpRight
                        style={{ marginRight: "4px" }}
                        color="#31A5FF"
                      />
                    ) : (
                      <AiOutlineDownload style={{ marginRight: "4px" }} />
                    )),
                };
              }
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

  // useEffect(() => {
  //   if (!!currentAccount?.address) tokenTransactionMutation.mutate();
  // }, [currentAccount]);

  const tableData = {
    tableHeader: [
      {
        accessorKey: "tokenSymbol",
        header: "Token",
      },
      {
        accessorKey: "tokenContract",
        header: "Contract Address",
      },
      {
        accessorKey: "fromAddress",
        header: "From",
      },
      {
        accessorKey: "toAddress",
        header: "To",
      },
      {
        accessorKey: "amount",
        header: "Amount",
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
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Token Transaction History"
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
                            selectedToken?.contractAddress,
                            keywords
                          );
                        }
                      }}
                    >{`Search token "${tokenAddressSearch}"`}</div>
                  )}
                  name="token"
                  placeholder={tokenAddressSearch?.length > 0 || "All token"}
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
                  options={[
                    {
                      label: "All token",
                    },
                    ...faucetTokensList?.map((token, idx) => ({
                      value: token?.contractAddress,
                      label: `${token?.symbol} (${
                        token?.name
                      }) - ${addressShortener(token?.contractAddress)}`,
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
                  // variant={isSelected ? "solid" : "outline"}
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
              placeholder="Search with From/To"
              // inputRightElementIcon={<SearchIcon color="#57527E" />}
            />
            {!isSmallerThanMd && (
              <Button
                sx={{ ml: "10px" }}
                isDisabled={false}
                onClick={() => {
                  //
                  if (pagination?.pageIndex !== 0) {
                    setPagination({ pageIndex: 0, pageSize: 10 });
                  } else {
                    tokenTransactionMutation.mutate(
                      tokenAddressSearch || selectedToken?.contractAddress,
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
          <Box
            display="flex"
            justifyContent={{ base: "flex-start", lg: "flex-end" }}
            marginTop={{ base: "20px", lg: "none" }}
          >
            <FormControl
              maxW={{
                base: "200px",
                lg: "205px",
              }}
              display="flex"
              alignItems="center"
            >
              <Switch
                id="from-only"
                isDisabled={
                  !(keywords?.queryAddress && currentAccount?.address)
                }
                isChecked={keywords?.fromOnly}
                onChange={() => {
                  if (keywords?.fromOnly === false)
                    setKeywords({
                      ...keywords,
                      fromOnly: true,
                      toOnly: false,
                    });
                  else
                    setKeywords({
                      ...keywords,
                      fromOnly: false,
                    });
                }}
              />
              <FormLabel
                htmlFor="my-stake"
                mb="0"
                ml="10px"
                fontWeight="400"
                whiteSpace="nowrap"
              >
                From Address only
              </FormLabel>
            </FormControl>

            <FormControl
              maxW="200px"
              display="flex"
              alignItems="center"
              justifyContent={{ base: "flex-end", lg: "none" }}
            >
              <Switch
                id="to-only"
                isDisabled={
                  !(keywords?.queryAddress && currentAccount?.address)
                }
                isChecked={keywords?.toOnly}
                onChange={() => {
                  if (keywords?.toOnly === false)
                    setKeywords({
                      ...keywords,
                      fromOnly: false,
                      toOnly: true,
                    });
                  else
                    setKeywords({
                      ...keywords,
                      toOnly: false,
                    });
                }}
              />
              <FormLabel
                mb="0"
                ml="10px"
                fontWeight="400"
                htmlFor="zero-reward-pools"
                whiteSpace="nowrap"
              >
                To Address Only
              </FormLabel>
            </FormControl>
          </Box>
          {isSmallerThanMd && (
            <Button
              width={"full"}
              isDisabled={false}
              onClick={() => {
                //
                if (pagination?.pageIndex !== 0) {
                  setPagination({ pageIndex: 0, pageSize: 10 });
                } else {
                  tokenTransactionMutation.mutate(
                    selectedToken?.contractAddress,
                    keywords
                  );
                }
              }}
            >
              Load
            </Button>
          )}
          <IWPaginationTable
            {...tableData}
            pagination={pagination}
            setPagination={setPagination}
            totalData={totalPage}
            mutation={tokenTransactionMutation}
          />
        </Stack>
      </SectionContainer>
    </>
  );
}
