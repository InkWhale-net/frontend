import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Show,
  Stack,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import IWCard from "components/card/Card";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { InfiniteTable } from "components/table/InfiniteTable";
import IWTabs from "components/tabs/IWTabs";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatTokenAmount } from "utils";
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

export default function TokensPage() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keywords, setKeywords] = useState("");
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
    console.log(selectedToken);
  }, [selectedToken]);
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

  const getTokenTransaction = async () => {
    const { ret, status, message } = await APICall.getTransactionHistory({
      tokenContract: "5FrXTf3NXRWZ1wzq9Aka7kTGCgGotf6wifzV7RzxoCYtrjiX",
      fromAddress: currentAccount.address,
    });

    if (status === "OK") {
      const transactionList = await Promise.all(
        ret?.map(async (txObj) => {
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
          const tokenName = queryResult1.toHuman().Ok;
          let queryResult2 = await execContractQuery(
            currentAccount?.address,
            "api",
            psp22_contract.CONTRACT_ABI,
            txObj?.data?.tokenContract,
            0,
            "psp22Metadata::tokenSymbol"
          );
          const tokenSymbol = queryResult2.toHuman().Ok;
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
          };
        })
      );
      setTransactions(transactionList);
      // setTransactions([]);
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!!currentAccount) getTokenTransaction();
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
                  value={keywords}
                  width={{ base: "full" }}
                  onChange={({ target }) => setKeywords(target.value)}
                  placeholder="Search with From/To"
                  inputRightElementIcon={<SearchIcon color="#57527E" />}
                />
                {/* <Box
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
                  id="my-stake"
                  isDisabled={!currentAccount?.address}
                  isChecked={showMyStakedPools}
                  onChange={() => setShowMyStakedPools(!showMyStakedPools)}
                />
                <FormLabel
                  htmlFor="my-stake"
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  whiteSpace="nowrap"
                >
                  My Stake Only
                </FormLabel>
              </FormControl>

              <FormControl
                maxW="200px"
                display="flex"
                alignItems="center"
                justifyContent={{ base: "flex-end", lg: "none" }}
              >
                <Switch
                  id="zero-reward-pools"
                  isChecked={endedPools}
                  onChange={() => setendedPools(!endedPools)}
                />
                <FormLabel
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  htmlFor="zero-reward-pools"
                  whiteSpace="nowrap"
                >
                  Pool Ended Only
                </FormLabel>
              </FormControl>
            </Box> */}
              </Flex>
              {/*
          <Box minW="155px" maxW="160px">
            <Select
              id="token"
              fontSize="md"
              fontWeight="400"
              variant="unstyled"
              defaultValue={-1}
              cursor="pointer"
              border="0px red dotted"
              placeholder="Sort by selection"
              onChange={({ target }) => setSortPools(target.value)}
            >
              {[1, -1].map((item, idx) => (
                <option key={idx} value={item}>
                  {item === -1 ? "New to old" : item === 1 ? "Old to new" : ""}
                </option>
              ))}
            </Select>
          </Box> */}
            </HStack>
          </Stack>
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
