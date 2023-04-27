import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { IWTable } from "components/table/IWTable";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { addressShortener } from "utils";
import { toast } from "react-hot-toast";
import { isAddressValid } from "utils";
import { execContractQuery } from "utils/contracts";
import { formatQueryResultToNumber } from "utils";
import psp22_contract from "utils/contracts/psp22_contract";
import { APICall } from "api/client";
import { toastMessages } from "constants";
import { execContractTx } from "utils/contracts";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { formatNumToBN } from "utils";
import azt_contract from "utils/contracts/azt_contract";
import lp_pool_generator_contract from "utils/contracts/lp_pool_generator_contract";
import { fetchMyTokenPools } from "redux/slices/myPoolsSlice";

export default function CreateTokenLPPage({ api }) {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { myTokenPoolsList, loading } = useSelector((s) => s.myPools);

  const [createTokenFee, setCreateTokenFee] = useState(0);

  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [selectedContractAddr, setSelectedContractAddr] = useState("");

  const [LPtokenContract, setLPTokenContract] = useState("");

  const [duration, setDuration] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [startTime, setStartTime] = useState(new Date());

  const [tokenBalance, setTokenBalance] = useState(0);
  const [LPtokenBalance, setLPTokenBalance] = useState(0);

  const fetchTokenBalance = useCallback(async () => {
    if (!selectedContractAddr) return;

    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return;
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

    const bal = formatQueryResultToNumber(queryResult);
    setTokenBalance(bal);
  }, [currentAccount, selectedContractAddr]);

  const tokenSymbol = useMemo(() => {
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === selectedContractAddr
    );

    return foundItem?.symbol;
  }, [faucetTokensList, selectedContractAddr]);

  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

  const fetchLPTokenBalance = useCallback(async () => {
    if (!LPtokenContract) return;

    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return;
    }

    if (!isAddressValid(LPtokenContract)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResultLP = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      LPtokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balLP = formatQueryResultToNumber(queryResultLP);
    setLPTokenBalance(balLP);
  }, [LPtokenContract, currentAccount]);

  const tokenLPSymbol = useMemo(() => {
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === LPtokenContract
    );

    return foundItem?.symbol;
  }, [LPtokenContract, faucetTokensList]);

  useEffect(() => {
    fetchLPTokenBalance();
  }, [fetchLPTokenBalance]);

  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getTokensList({});

      if (status === "OK") {
        if (isUnmounted) return;

        return setFaucetTokensList(ret);
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();

    return () => (isUnmounted = true);
  }, []);

  useEffect(() => {
    const fetchCreateTokenFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        lp_pool_generator_contract.CONTRACT_ABI,
        lp_pool_generator_contract.CONTRACT_ADDRESS,
        0,
        "genericPoolGeneratorTrait::getCreationFee"
      );

      const fee = formatQueryResultToNumber(result);

      setCreateTokenFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);

  async function createTokenLPHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      !selectedContractAddr ||
      !LPtokenContract ||
      !multiplier ||
      !duration ||
      !startTime
    ) {
      toast.error(`Please fill in all data!`);
      return;
    }

    if (
      !isAddressValid(selectedContractAddr) ||
      !isAddressValid(LPtokenContract)
    ) {
      return toast.error("Invalid address!");
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) <
      createTokenFee
    ) {
      toast.error(
        `You don't have enough INW. Stake costs ${createTokenFee} INW`
      );
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      lp_pool_generator_contract.CONTRACT_ADDRESS,
      formatNumToBN(createTokenFee)
    );

    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_generator_contract.CONTRACT_ABI,
      lp_pool_generator_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newPool",
      currentAccount?.address,
      LPtokenContract,
      selectedContractAddr,
      formatNumToBN(multiplier, 6),
      duration * 24 * 60 * 60 * 1000,
      startTime.getTime()
    );

    await APICall.askBEupdate({ type: "lp", poolContract: "new" });

    setMultiplier("");
    setDuration("");
    setStartTime(new Date());
    setSelectedContractAddr("");
    setLPTokenContract("");

    await delay(3000);

    toast.promise(
      delay(15000).then(() => {
        if (currentAccount) {
          dispatch(fetchMyTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchTokenBalance();
        fetchLPTokenBalance();
      }),
      {
        loading: "Please wait up to 15s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  const tableData = {
    tableHeader: [
      {
        name: "lptokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake",
      },
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Earn",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: `Total Value Locked: Total tokens staked into this pool`,
        label: "TVL",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
      },
      {
        name: "multiplier",
        hasTooltip: true,
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 token in 24 hours.`,
        label: "Multiplier",
      },
      {
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Expired In",
      },
    ],

    tableBody: myTokenPoolsList,
  };

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Create Token Yield Farm"
        description={
          <span>
            Stakers get rewards in selected token. The creation costs
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {createTokenFee} INW
            </Text>
          </span>
        }
      >
        <VStack w="full">
          <SimpleGrid
            w="full"
            mb={{ base: "30px" }}
            spacingX={{ lg: "20px" }}
            columns={{ base: 1, lg: 2 }}
            spacingY={{ base: "20px", lg: "32px" }}
          >
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Select Token To Stake
              </Heading>
              <Select
                value={LPtokenContract}
                id="token-collection"
                placeholder="Select token"
                onChange={({ target }) => {
                  setLPTokenContract(target.value);
                }}
              >
                {faucetTokensList?.map((token, idx) => (
                  <option key={idx} value={token.contractAddress}>
                    {token?.symbol} ({token?.name}) -{" "}
                    {addressShortener(token?.contractAddress)}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w="full">
              <IWInput
                onChange={({ target }) => setLPTokenContract(target.value)}
                value={LPtokenContract}
                placeholder="Contract Address"
                label="or enter token contract address"
              />
            </Box>

            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Select Token To Reward Stakers
              </Heading>
              <Select
                value={selectedContractAddr}
                id="token-collection"
                placeholder="Select token"
                onChange={({ target }) => {
                  setSelectedContractAddr(target.value);
                }}
              >
                {faucetTokensList?.map((token, idx) => (
                  <option key={idx} value={token.contractAddress}>
                    {token?.symbol} ({token?.name}) -{" "}
                    {addressShortener(token?.contractAddress)}
                  </option>
                ))}
              </Select>
            </Box>

            <Box w="full">
              <IWInput
                onChange={({ target }) => setSelectedContractAddr(target.value)}
                value={selectedContractAddr}
                placeholder="Contract Address"
                label="or enter token contract address"
              />
            </Box>

            <Box w="full">
              <IWInput
                placeholder="0"
                type="number"
                value={duration}
                label="Pool Length (days)"
                onChange={({ target }) => setDuration(target.value)}
              />
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.azero || 0} AZERO`}
                label="Your AZERO Balance"
              />
            </Box>
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Start Date & Time
              </Heading>
              <Flex
                h="52px"
                borderWidth="1px"
                justifyContent="start"
                borderRadius="5px"
              >
                <DateTimePicker
                  disableClock
                  disableCalendar
                  locale="en-EN"
                  value={startTime}
                  onChange={setStartTime}
                />
              </Flex>
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.inw || 0} INW`}
                label="Your INW Balance"
              />
            </Box>

            <Box w="full">
              <IWInput
                type="number"
                placeholder="0"
                label="Multiplier "
                value={multiplier}
                onChange={({ target }) => setMultiplier(target.value)}
              />
            </Box>

            <Box w="full">
              <Stack
                spacing="10px"
                flexDirection={{ base: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems="end"
                w="full"
              >
                <IWInput
                  isDisabled={true}
                  value={`${LPtokenBalance || 0}`}
                  // label={`Your ${tokenLPSymbol || "Token"} Balance`}
                  label={`Your Token Balance`}
                  inputRightElementIcon={
                    <Heading as="h5" size="h5" fontWeight="semibold">
                      {tokenLPSymbol}
                    </Heading>
                  }
                />
                <IWInput
                  ml={{ lg: "10px" }}
                  isDisabled={true}
                  value={`${tokenBalance || 0}`}
                  // label={`Your ${tokenSymbol || "Token"} Balance`}
                  inputRightElementIcon={
                    <Heading as="h5" size="h5" fontWeight="semibold">
                      {tokenSymbol}
                    </Heading>
                  }
                />
              </Stack>
            </Box>
          </SimpleGrid>

          <Button
            w="full"
            maxW={{ lg: "260px" }}
            onClick={createTokenLPHandler}
          >
            Create Token Yield Farm
          </Button>
        </VStack>
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My Yield Farm Pools"
        description=""
      >
        <IWTable
          {...tableData}
          mode="TOKEN_FARM"
          loading={loading}
          customURLRowClick="/my-pools"
        />
      </SectionContainer>
    </>
  );
}
