import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { IWTable } from "components/table/IWTable";

import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { APICall } from "api/client";
import { SelectSearch } from "components/SelectSearch";
import { toastMessages } from "constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  addressShortener,
  delay,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  formatTokenAmount,
  isAddressValid,
  moveINWToBegin,
  roundUp,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import pool_generator_contract from "utils/contracts/pool_generator";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import { execContractTxAndCallAPI } from "utils/contracts";
import { appChain } from "constants";

export default function CreateStakePoolPage({ api }) {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { myStakingPoolsList, loading } = useSelector((s) => s.myPools);

  const [createTokenFee, setCreateFee] = useState("");
  const [faucetTokensList, setFaucetTokensList] = useState([]);

  const [selectedContractAddr, setSelectedContractAddr] = useState("");
  const [duration, setDuration] = useState("");
  const [apy, setApy] = useState("");
  const [maxStake, setMaxStake] = useState("");
  const [startTime, setStartTime] = useState(new Date());

  const [tokenBalance, setTokenBalance] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenInfor, setTokenInfor] = useState(null);
  const [stakingPoolList, setStakingPoolList] = useState([]);

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
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === selectedContractAddr
    );
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const bal = formatQueryResultToNumber(queryResult, foundItem?.decimal);
    setTokenBalance(bal);

    setTokenInfor(foundItem);
    if (!foundItem?.symbol) {
      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract_v2.CONTRACT_ABI,
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

      const fee = formatTokenAmount(result?.toHuman()?.Ok, appChain?.decimal);

      setCreateFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);

  const formatMaxStakingAmount = async (_myStakingPoolsList) => {
    setStakingPoolList(
      _myStakingPoolsList?.map((e) => ({
        ...e,
        maxStakingAmount:
          e?.maxStakingAmount &&
          formatTokenAmount(e?.maxStakingAmount, e?.tokenDecimal),
        totalStaked: formatTokenAmount(e?.totalStaked, e?.tokenDecimal),
      }))
    );
  };
  useEffect(() => {
    if (myStakingPoolsList) formatMaxStakingAmount(myStakingPoolsList);
    else dispatch(fetchMyStakingPools({ currentAccount }));
  }, [myStakingPoolsList]);
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

    if (+currentAccount?.balance?.inw2?.replaceAll(",", "") < +createTokenFee) {
      toast.error(
        `You don't have enough ${appChain?.inwName}. Create Stake Pool costs ${createTokenFee} ${appChain?.inwName}`
      );
      return;
    }

    if (+tokenBalance?.replaceAll(",", "") < +minReward?.replaceAll(",", "")) {
      toast.error(`You don't have enough ${tokenSymbol} to topup the reward`);
      return;
    }
    const endDate = startTime && new Date(startTime?.getTime());
    endDate?.setDate(startTime?.getDate() + parseInt(duration));
    if (!!endDate) {
      const currentDate = new Date();
      if (startTime < currentDate || endDate < currentDate) {
        toast.error(`Pool can not start or end in the past`);
        return;
      }
    } else {
      toast.error(`Invalid start Date & Time`);
      return;
    }

    const allowanceINWQr = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      psp22_contract_v2.CONTRACT_ADDRESS,
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
      psp22_contract_v2.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      pool_generator_contract.CONTRACT_ADDRESS
    );
    const allowanceToken = formatQueryResultToNumber(
      allowanceTokenQr,
      tokenInfor?.decimal
    ).replaceAll(",", "");
    let step = 1;
    console.log("createTokenFee", createTokenFee);
    //Approve
    if (allowanceINW < createTokenFee) {
      toast.success(`Step ${step}: Approving INW token...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract_v2.CONTRACT_ABI,
        psp22_contract_v2.CONTRACT_ADDRESS,
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
        psp22_contract_v2.CONTRACT_ABI,
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
      async (newContractAddress) => {
        await APICall.askBEupdate({
          type: "pool",
          poolContract: newContractAddress,
        });
      },
      currentAccount?.address,
      selectedContractAddr,
      formatNumToBN(maxStake, tokenInfor?.decimal || 12),
      parseInt(apy * 100),
      roundUp(duration * 24 * 60 * 60 * 1000, 0),
      startTime.getTime()
    );
    await delay(1000);

    await APICall.askBEupdate({ type: "pool", poolContract: "new" });

    setApy("");
    setDuration("");
    setMaxStake("");
    setStartTime(new Date());
    setSelectedContractAddr("");

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
          dispatch(fetchMyStakingPools({ currentAccount }));
        }

        fetchTokenBalance();
      }),
      {
        loading: "Please wait 10s for the data to be updated! ",
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

    tableBody: stakingPoolList,
  };

  const firstSearchValue = useMemo(() => {
    const ret = faucetTokensList
      ?.filter((item) => item.contractAddress === selectedContractAddr)
      .map((token) => ({
        value: token?.contractAddress,
        label: `${token?.symbol} (${token?.name}) - ${addressShortener(
          token?.contractAddress
        )}`,
      }));
    return ret?.length === 0 ? null : ret[0];
  }, [faucetTokensList, selectedContractAddr]);

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
              {+createTokenFee > 1
                ? formatNumDynDecimal(createTokenFee)
                : createTokenFee}{" "}
              {appChain?.inwName}
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
                value={firstSearchValue}
                name="token"
                placeholder="Select Token..."
                closeMenuOnSelect={true}
                // filterOption={filterOptions}
                isSearchable
                onChange={(data) => setSelectedContractAddr(data?.value ?? "")}
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
                value={`${currentAccount?.balance?.azero || 0} ${
                  appChain?.unit
                }`}
                label={`Your ${appChain?.unit} Balance`}
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
                value={`${
                  formatNumDynDecimal(
                    currentAccount?.balance?.inw2?.replaceAll(",", "")
                  ) || 0
                } ${appChain?.inwName}`}
                label={`Your ${appChain?.inwName} Balance`}
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
          customURLRowClick="/my-pool"
        />
      </SectionContainer>
    </>
  );
}
