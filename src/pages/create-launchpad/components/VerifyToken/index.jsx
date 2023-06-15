import { Box, Flex, Heading, Link, SimpleGrid } from "@chakra-ui/react";
import { current } from "@reduxjs/toolkit";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import IWInput from "components/input/Input";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { formatQueryResultToNumber } from "utils";
import { formatNumDynDecimal } from "utils";
import { addressShortener } from "utils";
import { moveINWToBegin } from "utils";
import { roundUp } from "utils";
import { isAddressValid } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";

export default function VerifyToken() {
  const [tokenInfo, setTokenInfo] = useState({});
  const { currentAccount } = useSelector((s) => s.wallet);
  const [tokenAddress, setTokenAddress] = useState("");
  const { allTokensList } = useSelector((s) => s.allPools);

  const tokenList = useMemo(() => {
    return (
      allTokensList?.filter(
        (token) => token.creator === currentAccount?.address
      ) || []
    );
  }, [currentAccount?.address, allTokensList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (tokenAddress) {
        loadTokenInfo();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [tokenAddress]);

  async function loadTokenInfo() {
    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return setTokenInfo({});
    }

    if (!isAddressValid(tokenAddress)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResultOwner = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "ownable::owner"
    );
    const ownerToken = queryResultOwner.toHuman().Ok;
    if (currentAccount?.address !== ownerToken) {
      toast.error("You are not token owner!");
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

    const balance = formatQueryResultToNumber(queryResult);

    let queryResult1 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "psp22Metadata::tokenSymbol"
    );
    const tokenSymbol = queryResult1.toHuman().Ok;
    let queryResult2 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "psp22Metadata::tokenName"
    );
    const tokenName = queryResult2.toHuman().Ok;
    let queryResult3 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "psp22::totalSupply"
    );
    const rawTotalSupply = queryResult3.toHuman().Ok;

    let queryResult4 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "psp22Metadata::tokenDecimals"
    );
    const decimals = queryResult4.toHuman().Ok;
    const totalSupply = roundUp(
      rawTotalSupply?.replaceAll(",", "") / 10 ** parseInt(decimals),
      0
    );
    let queryResult5 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenAddress,
      0,
      "ownable::owner"
    );
    const owner = queryResult5?.toHuman()?.Ok;
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

    setTokenInfo((prev) => {
      return {
        ...prev,
        symbol: tokenSymbol,
        balance: balance,
        name: tokenName,
        totalSupply: formatNumDynDecimal(totalSupply, 4),
        decimals,
        owner,
        tokenIconUrl,
      };
    });
  }
  return (
    <>
      <Box w={{ base: "full" }}>
        <SimpleGrid
          w="full"
          columns={{ base: 1, lg: 2 }}
          spacingX={{ lg: "20px" }}
          spacingY={{ base: "20px", lg: "32px" }}
          mb={{ base: "30px" }}
        >
          <Box w="full">
            <Heading as="h4" size="h4" mb="12px">
              Select Token
            </Heading>
            <SelectSearch
              name="token"
              placeholder="Select Token..."
              closeMenuOnSelect={true}
              // filterOption={filterOptions}
              isSearchable
              onChange={({ value }) => {
                setTokenAddress(value);
              }}
              options={tokenList?.map((token, idx) => ({
                value: token?.contractAddress,
                label: `${token?.symbol} (${token?.name}) - ${addressShortener(
                  token?.contractAddress
                )}`,
              }))}
            ></SelectSearch>
          </Box>
          <Box w="full">
            <IWInput
              onChange={({ target }) => setTokenAddress(target.value)}
              value={tokenAddress}
              placeholder="Contract Address"
              label="or enter token contract address"
            />
          </Box>
        </SimpleGrid>
        <Flex
          py="12px"
          borderBottom={"1px solid #E3DFF3"}
          justifyContent={"space-between"}
        >
          <div>Name:</div>
          <div>{tokenInfo?.symbol}</div>
        </Flex>
        <Flex
          py="12px"
          borderBottom={"1px solid #E3DFF3"}
          justifyContent={"space-between"}
        >
          <div>Symbol:</div>
          <div>{tokenInfo?.name}</div>
        </Flex>
        <Flex
          py="12px"
          borderBottom={"1px solid #E3DFF3"}
          justifyContent={"space-between"}
        >
          <div>Decimals:</div>
          <div>{tokenInfo?.decimals}</div>
        </Flex>
        <Flex
          py="12px"
          borderBottom={"1px solid #E3DFF3"}
          justifyContent={"space-between"}
        >
          <div>Total supply:</div>
          <div>{tokenInfo?.totalSupply}</div>
        </Flex>
        <Flex
          py="12px"
          borderBottom={"1px solid #E3DFF3"}
          justifyContent={"space-between"}
        >
          <div>Balance:</div>
          <div>{tokenInfo?.balance}</div>
        </Flex>
      </Box>
    </>
  );
}
