import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { InfiniteTable } from "components/table/InfiniteTable";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineDownload } from "react-icons/ai";
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

export default function TokensPage() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    getTokenTransaction(selectedToken?.contractAddress);
  }, [selectedToken]);

  useEffect(() => {
    if (!(keywords?.queryAddress?.length > 0))
      getTokenTransaction(selectedToken?.contractAddress);
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

  const getTokenTransaction = async (tokenContract, keywordData) => {
    let queryBody = {};
    if (tokenContract) queryBody.tokenContract = tokenContract;
    if (keywordData?.queryAddress)
      queryBody.queryAddress = keywordData?.queryAddress;
    if (keywordData?.fromOnly) queryBody.isFromOnly = keywordData?.fromOnly;
    if (keywordData?.toOnly) queryBody.isToOnly = keywordData?.toOnly;

    const { ret, status, message } = await APICall.getTransactionHistory(
      queryBody
    );
    if (status === "OK") {
      const transactionList = await Promise.all(
        ret?.map(async (txObj) => {
          if (txObj?.data?.tokenContract) {
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
              return {
                token: {
                  address: txObj?.data?.tokenContract,
                  name: tokenName,
                  symbol: tokenSymbol,
                  decimal: parseInt(decimal),
                },
                tokenContract: txObj?.data?.tokenContract,
                tokenSymbol,
                amount: formatNumDynDecimal(
                  formatTokenAmount(
                    txObj?.data?.amount?.replaceAll(",", ""),
                    parseInt(decimal)
                  )
                ),
                time: txObj?.createdTime,
                fromAddress: txObj?.fromAddress,
                toAddress: txObj?.toAddress,
                currentAccount: currentAccount?.address,
                amountIcon:
                  keywords?.queryAddress?.length > 0 &&
                  (txObj?.fromAddress == currentAccount?.address ? (
                    <BsArrowUpRight
                      style={{ marginRight: "4px" }}
                      color="#31A5FF"
                    />
                  ) : (
                    <AiOutlineDownload style={{ marginRight: "4px" }} />
                  )),
              };
          }
        })
      );
      setTransactions(transactionList.filter((e) => e));
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!!currentAccount?.address) getTokenTransaction();
  }, [currentAccount]);

  const tableData = {
    tableHeader: [
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Token",
      },
      {
        name: "tokenContract",
        hasTooltip: false,
        tooltipContent: "",
        label: "Contract Address",
      },
      {
        name: "fromAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "From",
      },
      {
        name: "toAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "To",
      },
      {
        name: "amount",
        hasTooltip: false,
        tooltipContent: "",
        label: "Amount",
      },
      {
        name: "time",
        hasTooltip: false,
        tooltipContent: "",
        label: "Time",
      },
    ],
    tableBody: transactions,
  };

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Token Transaction History"
        description={<span>Token Transaction History</span>}
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
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
                placeholder="All token"
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
              ></SelectSearch>
            </Box>
            <HStack
              color="text.1"
              fontSize="md"
              w="full"
              spacing={{ base: "0px", lg: "20px" }}
              justifyContent={{ base: "end" }}
              flexDirection={{ base: "column", lg: "row" }}
              align={{ base: "column", xl: "center" }}
              pt={{ base: "0px", lg: "10px" }}
            >
              <Flex
                w="full"
                mb={{ base: "4px", lg: "0px" }}
                align={{ base: "left", lg: "center" }}
                justifyContent={{ base: "end" }}
                spacing={{ base: "0px", lg: "20px" }}
                flexDirection={{ base: "column", lg: "row" }}
              >
                <IWInput
                  value={keywords?.queryAddress}
                  width={{ base: "full" }}
                  onChange={({ target }) =>
                    setKeywords({ ...keywords, queryAddress: target.value })
                  }
                  placeholder="Search with From/To"
                  // inputRightElementIcon={<SearchIcon color="#57527E" />}
                />
              </Flex>
              <Button
                isDisabled={false}
                onClick={() => {
                  getTokenTransaction(selectedToken?.contractAddress, keywords);
                }}
              >
                Load
              </Button>
            </HStack>
          </Stack>
          <Box
            display="flex"
            justifyContent={{ base: "flex-start", lg: "flex-end" }}
            marginTop={{ base: "20px", lg: "none" }}
          >
            <FormControl
              maxW={{
                base: "160px",
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
                  if (keywords?.fromOnly == false)
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
                  if (keywords?.toOnly == false)
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
          {transactions?.length > 0 ? (
            <InfiniteTable
              {...tableData}
              // tableBody={transactions?.slice(0, currentPage * 4) || []}
              // getNext={() => (hasMorePage ? setCurrentPage(currentPage + 1) : "")}
              // hasMore={hasMorePage}
              isDisableRowClick={true}
            />
          ) : (
            <Box textAlign={{ base: "center" }} w={{ base: "full" }}>
              No transaction data
            </Box>
          )}
        </Stack>
      </SectionContainer>
    </>
  );
}
