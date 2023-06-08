import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
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
import { toastMessages } from "constants";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";
import { formatNumDynDecimal } from "utils";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { roundUp } from "utils";
import { SelectSearch } from "components/SelectSearch";
import { execContractTxAndCallAPI } from "utils/contracts";
import { moveINWToBegin } from "utils";

export default function CreateStakePoolPage({ api }) {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { myStakingPoolsList, loading } = useSelector((s) => s.myPools);

  const [createTokenFee, setCreateTokenFee] = useState(0);
  const [faucetTokensList, setFaucetTokensList] = useState([]);

  const [selectedContractAddr, setSelectedContractAddr] = useState("");
  const [duration, setDuration] = useState("");
  const [apy, setApy] = useState("");
  const [maxStake, setMaxStake] = useState("");
  const [startTime, setStartTime] = useState(new Date());

  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");

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
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === selectedContractAddr
    );
    if (!foundItem?.symbol) {
      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0,
        "psp22Metadata::tokenSymbol"
      );
      const tokenSymbol = queryResult1.toHuman().Ok;
      setTokenSymbol(tokenSymbol);
    } else {
      setTokenSymbol(foundItem?.symbol);
    }
  }, [currentAccount, selectedContractAddr, faucetTokensList]);

  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

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

    if (!(duration > 0)) {
      toast.error(`Pool Length must be greater than 0`);
      return;
    }

    if (!(apy > 0)) {
      toast.error(`Annual Percentage Rate (APR) % must be greater than 0`);
      return;
    }

    if (!(maxStake > 0)) {
      toast.error(`Total Staking Cap must be greater than 0`);
      return;
    }

    if (!isAddressValid(selectedContractAddr)) {
      return toast.error("Invalid address!");
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) <
      createTokenFee?.replaceAll(",", "")
    ) {
      toast.error(
        `You don't have enough INW. Create Stake Pool costs ${createTokenFee} INW`
      );
      return;
    }

    if (
      parseInt(tokenBalance?.replaceAll(",", "")) <
      minReward?.replaceAll(",", "")
    ) {
      toast.error(`You don't have enough ${tokenSymbol} to topup the reward`);
      return;
    }
    const endDate = startTime && new Date(startTime?.getTime());
    endDate?.setDate(startTime?.getDate() + parseInt(duration));
    if (!!endDate) {
      const currentDate = new Date();
      if (endDate < currentDate) {
        toast.error(`Pool can not end in the pass`);
        return;
      }
    } else {
      toast.error(`Invalid start Date & Time`);
      return;
    }

    const allowanceINWQr = await execContractQuery(
      currentAccount?.address,
      "api",
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      pool_generator_contract.CONTRACT_ADDRESS
    );
    const allowanceINW = formatQueryResultToNumber(allowanceINWQr).replaceAll(
      ",",
      ""
    );
    const allowanceTokenQr = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      pool_generator_contract.CONTRACT_ADDRESS
    );
    const allowanceToken = formatQueryResultToNumber(
      allowanceTokenQr
    ).replaceAll(",", "");
    let step = 1;

    //Approve
    if (allowanceINW < createTokenFee.replaceAll(",", "")) {
      toast.success(`Step ${step}: Approving INW token...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0, //-> value
        "psp22::approve",
        pool_generator_contract.CONTRACT_ADDRESS,
        formatNumToBN(Number.MAX_SAFE_INTEGER)
      );
      if (!approve) return;
    }
    if (allowanceToken < minReward.replaceAll(",", "")) {
      toast.success(`Step ${step}: Approving ${tokenSymbol} token...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0, //-> value
        "psp22::approve",
        pool_generator_contract.CONTRACT_ADDRESS,
        formatNumToBN(Number.MAX_SAFE_INTEGER)
      );
      if (!approve) return;
    }

    await delay(3000);
    toast.success(`Step ${step}: Process...`);
    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      pool_generator_contract.CONTRACT_ABI,
      pool_generator_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newPool",
      () => APICall.askBEupdate({ type: "pool", poolContract: "new" }),
      currentAccount?.address,
      selectedContractAddr,
      formatNumToBN(maxStake, 12),
      parseInt(apy * 100),
      roundUp(duration * 24 * 60 * 60 * 1000, 0),
      startTime.getTime()
    );

    setApy("");
    setDuration("");
    setStartTime(new Date());

    await delay(3000);

    toast.promise(
      delay(30000).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
          dispatch(fetchMyStakingPools({ currentAccount }));
        }

        fetchTokenBalance();
      }),
      {
        loading: "Please wait a minute for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  const minReward = useMemo(
    () => formatNumDynDecimal((maxStake * duration * apy) / 100 / 365),
    [maxStake, duration, apy]
  );

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
        name: "apy",
        hasTooltip: false,
        tooltipContent: "",
        label: "APR",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
      },
      {
        name: "maxStakingAmount",
        hasTooltip: true,
        tooltipContent: `How many tokens that users can stake into the pool`,
        label: " Total Staking Cap ",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: `Total Value Locked: Total tokens staked into this pool`,
        label: "TVL",
      },

      {
        name: "duration",
        hasTooltip: false,
        tooltipContent: "",
        label: "End in",
      },
    ],

    tableBody: myStakingPoolsList,
  };
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Create Staking Pool"
        description={
          <span>
            Staker earns tokens at fixed APR. The creation costs
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
                label="Annual Percentage Rate (APR) %"
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
            <Box w="full">
              <IWInput
                value={maxStake}
                onChange={({ target }) => setMaxStake(target.value)}
                type="number"
                label={
                  <>
                    Total Staking Cap {tokenSymbol ? `(${tokenSymbol})` : ""}{" "}
                    <Tooltip
                      fontSize="smaller"
                      label={
                        "How many tokens that users can stake into the pool "
                      }
                    >
                      <QuestionOutlineIcon ml="6px" pb={"2px"} color="text.2" />
                    </Tooltip>
                  </>
                }
                placeholder="0"
              />
            </Box>
            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${minReward || 0} ${tokenSymbol || ""}`}
                label={
                  <>
                    Total Rewards
                    <Tooltip
                      fontSize="smaller"
                      label={
                        " Pool creator has to add this amount upfront into the pool to pay for stakers' interest."
                      }
                    >
                      <QuestionOutlineIcon ml="6px" pb={"2px"} color="text.2" />
                    </Tooltip>
                  </>
                }
              />
            </Box>
          </SimpleGrid>

          <Button
            w="full"
            maxW={{ lg: "220px" }}
            onClick={createStakingPoolHandler}
          >
            Create{" "}
          </Button>
        </VStack>
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My Staking Pools"
        description=""
      >
        <IWTable
          {...tableData}
          mode="STAKING_POOL"
          loading={loading}
          customURLRowClick="/my-pools"
        />
      </SectionContainer>
    </>
  );
}
