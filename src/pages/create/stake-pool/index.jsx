import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { IWTable } from "components/table/IWTable";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { isAddressValid } from "utils";
import { formatNumToBN } from "utils";
import { formatQueryResultToNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import { execContractTx } from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import { APICall } from "api/client";
import { addressShortener } from "utils";
import DateTimePicker from "react-datetime-picker";
import pool_generator_contract from "utils/contracts/pool_generator";
import lp_pool_generator_contract from "utils/contracts/lp_pool_generator_contract";
import { toastMessages } from "constants";

export default function CreateStakePoolPage({ api }) {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);

  const [createTokenFee, setCreateTokenFee] = useState(0);
  const [faucetTokensList, setFaucetTokensList] = useState([]);

  const [selectedContractAddr, setSelectedContractAddr] = useState("");
  const [duration, setDuration] = useState(0);
  const [apy, setApy] = useState(0);
  const [startTime, setStartTime] = useState(new Date());

  const [tokenBalance, setTokenBalance] = useState(0);

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

  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getFaucetTokensList();

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
        pool_generator_contract.CONTRACT_ABI,
        pool_generator_contract.CONTRACT_ADDRESS,
        0,
        "genericPoolGeneratorTrait::getCreationFee"
      );

      const fee = formatQueryResultToNumber(result);

      setCreateTokenFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);

  async function createStakingPoolHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!selectedContractAddr || !apy || !duration || !startTime) {
      toast.error(`Please fill in all data!`);
      return;
    }

    if (!isAddressValid(selectedContractAddr)) {
      return toast.error("Invalid address!");
    }

    if (parseInt(currentAccount?.balance?.wal) < createTokenFee) {
      toast.error(
        `You don't have enough WAL. Stake costs ${createTokenFee} WAL`
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
      pool_generator_contract.CONTRACT_ADDRESS,
      formatNumToBN(createTokenFee)
    );

    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process unstaking...");

    await execContractTx(
      currentAccount,
      "api",
      pool_generator_contract.CONTRACT_ABI,
      pool_generator_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newPool",
      currentAccount?.address,
      selectedContractAddr,
      parseInt(apy * 100),
      duration * 24 * 60 * 60 * 1000,
      startTime.getTime()
    );

    await APICall.askBEupdate({ type: "pool", poolContract: "new" });

    setApy(0);
    setDuration(0);
    setStartTime(new Date());

    toast.success("Please wait up to 10s for the data to be updated");

    await delay(2000).then(() => {
      currentAccount && dispatch(fetchUserBalance({ currentAccount, api }));
      fetchTokenBalance();
    });
  }

  const [myPoolList, setMyPoolList] = useState([]);

  useEffect(() => {
    const fetchMyPools = async () => {
      const { status, ret } = await APICall.getUserStakingPools({
        owner: currentAccount?.address,
      });

      if (status === "OK") {
        console.log("ret", ret);
        setMyPoolList(ret);
      }
    };
    fetchMyPools();
  }, [currentAccount?.address]);

  const tableData = {
    tableHeader: [
      {
        name: "poolContract",
        hasTooltip: false,
        tooltipContent: "",
        label: "Pool Address",
      },

      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Symbol",
      },
      {
        name: "tokenDecimal",
        hasTooltip: false,
        tooltipContent: "",
        label: "Decimal",
      },
      {
        name: "tokenTotalSupply",
        hasTooltip: false,
        tooltipContent: "",
        label: "Initial Mint",
      },
      {
        name: "apy",
        hasTooltip: false,
        tooltipContent: "",
        label: "APY",
      },
      {
        name: "rewardPool",
        hasTooltip: false,
        tooltipContent: "",
        label: "Reward Pool",
      },
      {
        name: "totalStaked",
        hasTooltip: false,
        tooltipContent: "",
        label: "TVL",
      },

      {
        name: "duration",
        hasTooltip: false,
        tooltipContent: "",
        label: "End in",
      },
    ],

    tableBody: [...myPoolList],
  };
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Create  Staking Pools"
        description={
          <span>
            Staker earns tokens at fixed APR. The creation costs
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {createTokenFee} WAL
            </Text>
          </span>
        }
      >
        <VStack w="full">
          <SimpleGrid
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacingX={{ lg: "20px" }}
            spacingY={{ base: "20px", lg: "32px" }}
            mb={{ base: "30px" }}
          >
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Token Contract Address
              </Heading>
              <Select
                label="Token Contract Address"
                value={selectedContractAddr}
                // isDisabled={accountInfoLoading}
                id="token"
                placeholder="Select token"
                onChange={({ target }) => {
                  console.log("target.value", target.value);

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
                placeholder="Address to check"
                label="or enter token contract address"
              />
            </Box>

            <Box w="full">
              <IWInput
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
                value={`${currentAccount?.balance?.wal || 0} WAL`}
                label="Your WAL Balance"
              />
            </Box>

            <Box w="full">
              <IWInput
                type="number"
                placeholder="0%"
                label="Annual Percentage Yield (APR) %"
                value={apy}
                onChange={({ target }) => setApy(target.value)}
              />
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${tokenBalance || 0} ${tokenSymbol || ""}`}
                label={`Your ${tokenSymbol || "Token"} Balance`}
              />
            </Box>
          </SimpleGrid>

          <Button
            w="full"
            maxW={{ lg: "220px" }}
            onClick={createStakingPoolHandler}
          >
            Create Staking Pool{" "}
          </Button>
        </VStack>
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My Staking Pools"
        description=""
      >
        <IWTable {...tableData} />
      </SectionContainer>
    </>
  );
}
