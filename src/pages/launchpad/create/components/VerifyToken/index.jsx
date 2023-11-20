import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  addressShortener,
  formatNumDynDecimal,
  formatQueryResultToNumber,
  getTokenOwner,
  isAddressValid,
  roundUp,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";

export default function VerifyToken() {
  const { launchpadData, updateLaunchpadData, current, nextStep } =
    useCreateLaunchpad();
  const [tokenInfo, setTokenInfo] = useState(null);
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const [tokenAddress, setTokenAddress] = useState("");
  const history = useHistory();

  const tokenList = useMemo(() => {
    return (
      allTokensList?.filter((token) => {
        return token.creator === currentAccount?.address;
      }) || []
    );
  }, [currentAccount?.address, allTokensList]);

  const loadTokenInfo = async () => {
    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return setTokenInfo({});
    }

    if (!isAddressValid(tokenAddress)) {
      toast.error("Invalid address!");
      return;
    }
    const { address: ownerToken } = await getTokenOwner(tokenAddress);

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
    setTokenInfo({
      symbol: tokenSymbol,
      balance: balance,
      name: tokenName,
      totalSupply: formatNumDynDecimal(totalSupply, 4),
      decimals,
      owner: ownerToken,
      tokenIconUrl,
    });
  };
  const { isFetching } = useQuery(["query-token-infor", tokenAddress], () => {
    return new Promise(async (resolve) => {
      if (tokenAddress) {
        await loadTokenInfo();
      }
      resolve();
    });
  });

  useEffect(() => {
    if (tokenInfo)
      updateLaunchpadData({
        ...launchpadData,
        token: { ...tokenInfo, tokenAddress },
      });
  }, [tokenInfo]);
  useEffect(() => {
    if (current == 0 && launchpadData?.token)
      setTokenInfo(launchpadData?.token);
  }, [current]);
  const tokenBalance = +tokenInfo?.balance?.replaceAll(",", "");
  return (
    <>
      <Box
        w={{ base: "full" }}
        display={{ base: "flex" }}
        flexDirection={{ base: "column" }}
      >
        <Heading as="h4" size="h4" mb="12px">
          Token Address
        </Heading>
        <Box
          w="full"
          display={{ base: "flex" }}
          flexDirection={["column-reverse", "column-reverse", "row"]}
        >
          <Box sx={{ flex: 1, paddingRight: "8px" }}>
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
            />
          </Box>
          <Button
            onClick={() => history.push("/create/token")}
            mb={["16px", "16px", "0px"]}
          >
            Create & Import
          </Button>
        </Box>
        {!(tokenList?.length > 0) && (
          <Text sx={{ textAlign: "center", marginTop: "20px" }}>
            No owned token. You need to Create or Import first
          </Text>
        )}

        {isFetching && (
          <CircularProgress
            alignSelf={"center"}
            isIndeterminate
            size={"40px"}
            color="#93F0F5"
            sx={{ marginTop: "8px" }}
          />
        )}
        {tokenInfo && !isFetching && (
          <Box
            borderWidth={"1px"}
            padding={{ base: "8px" }}
            borderRadius={{ base: "4px" }}
            marginTop={"8px"}
          >
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Name:</Text>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {tokenInfo?.tokenIconUrl && (
                  <Image
                    mr="8px"
                    h="42px"
                    w="42px"
                    borderRadius={"10px"}
                    src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${tokenInfo?.tokenIconUrl}`}
                    alt="logo"
                  />
                )}
                <Text>{tokenInfo?.name}</Text>
              </Box>
            </Flex>
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Symbol:</Text>
              <Text>{tokenInfo?.symbol}</Text>
            </Flex>
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Decimals:</Text>
              <Text>{tokenInfo?.decimals}</Text>
            </Flex>
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Total supply:</Text>
              <Text>{tokenInfo?.totalSupply}</Text>
            </Flex>
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Balance:</Text>
              <Text>{tokenInfo?.balance}</Text>
            </Flex>
          </Box>
        )}
      </Box>
      {tokenInfo && !(tokenBalance > 0) && !isFetching && (
        <Box bg="#FCE5E5" p="8px" mt="8px" borderRadius="4px">
          <Text color="#F17171">
            Your token balance need to be higher than 0
          </Text>
        </Box>
      )}
      <Flex justify="center" mt="20px">
        <Button
          isDisabled={!(tokenInfo && tokenBalance)}
          onClick={() => nextStep()}
          minW="100px"
        >
          Next
        </Button>
      </Flex>
    </>
  );
}
