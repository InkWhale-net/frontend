import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  addressShortener,
  formatNumDynDecimal,
  formatQueryResultToNumber,
  isAddressValid,
  roundUp,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import { useHistory } from "react-router-dom";

export default function VerifyToken() {
  const { launchpadData, updateLaunchpadData } = useCreateLaunchpad();
  const [tokenInfo, setTokenInfo] = useState(null);
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const [tokenAddress, setTokenAddress] = useState("");
  const history = useHistory();

  const tokenList = useMemo(() => {
    return (
      allTokensList?.filter(
        (token) => token.creator === currentAccount?.address
      ) || []
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

    setTokenInfo({
      symbol: tokenSymbol,
      balance: balance,
      name: tokenName,
      totalSupply: formatNumDynDecimal(totalSupply, 4),
      decimals,
      owner,
      tokenIconUrl,
    });
  };
  const { isLoading } = useQuery(["query-token-infor", tokenAddress], () => {
    return new Promise(async (resolve) => {
      if (tokenAddress) {
        await loadTokenInfo();
      }
      resolve();
    });
    // const delayDebounceFn = setTimeout(() => {
    //
    // }, 200);
    // return () => clearTimeout(delayDebounceFn);
  });

  useEffect(() => {
    if (tokenInfo) updateLaunchpadData({ ...launchpadData, token: tokenInfo });
  }, [tokenInfo]);

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
        <Box w="full" display={{ base: "flex" }}>
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
          <Button onClick={() => history.push('/create/token')}>Create</Button>
        </Box>

        {isLoading && (
          <CircularProgress
            alignSelf={"center"}
            isIndeterminate
            size={"40px"}
            color="#93F0F5"
          />
        )}
        {tokenInfo && !isLoading && (
          <Box
            borderWidth={"1px"}
            padding={{ base: "8px" }}
            borderRadius={{ base: "4px" }}
          >
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Name:</Text>
              <Text>{tokenInfo?.symbol}</Text>
            </Flex>
            <Flex
              py="12px"
              // borderBottom={"1px solid #E3DFF3"}
              justifyContent={"space-between"}
            >
              <Text>Symbol:</Text>
              <Text>{tokenInfo?.name}</Text>
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
      {/* <SectionContainer
        title="Currency"
        description="User will pay with BNB for your token"
      >
        <RadioGroup onChange={setCurrencyOption} value={currencyOption}>
          <Stack direction="column">
            {currencyOptions.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </SectionContainer>
      <SectionContainer title="Fee Options">
        <RadioGroup onChange={setFeeOption} value={feeOption}>
          <Stack direction="column">
            {feeOptions.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </SectionContainer>
      <SectionContainer title="Currency">
        <RadioGroup onChange={setListingOption} value={listingOption}>
          <Stack direction="column">
            {listingOptions.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </SectionContainer> */}
    </>
  );
}
