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
import { useAppContext } from "contexts/AppContext";
import { useChainContext } from "contexts/ChainContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTokenPools } from "redux/slices/myPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  addressShortener,
  delay,
  formatNumDynDecimal,
  formatNumToBNEther,
  formatQueryResultToNumberEthers,
  formatTextAmount,
  formatTokenAmount,
  isAddressValid,
  roundUp,
} from "utils";
import {
  execContractQuery,
  execContractTx,
  lp_pool_generator_contract,
  psp22_contract,
} from "utils/contracts";
import { execContractTxAndCallAPI } from "utils/contracts";
import { useMutation } from "react-query";

export default function CreateTokenLPPage() {
  const dispatch = useDispatch();
  const { api } = useAppContext();
  const { currentChain, unitDecimal } = useChainContext();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { myTokenPoolsList, loading } = useSelector((s) => s.myPools);
  const { allTokensList } = useSelector((s) => s.allPools);

  const [createTokenFee, setCreateFee] = useState("");

  const [selectedContractAddr, setSelectedContractAddr] = useState("");

  const [LPtokenContract, setLPTokenContract] = useState("");

  const [duration, setDuration] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [maxStake, setMaxStake] = useState("");

  const [tokenBalance, setTokenBalance] = useState(0);
  const [LPtokenBalance, setLPTokenBalance] = useState(0);

  const faucetTokensList = useMemo(() => {
    return allTokensList?.length > 0
      ? allTokensList.filter((e) => e?.contractAddress != selectedContractAddr)
      : [];
  }, [allTokensList, selectedContractAddr]);
  const pairTokenList = useMemo(() => {
    return allTokensList?.length > 0
      ? allTokensList.filter((e) => e?.contractAddress != LPtokenContract)
      : [];
  }, [allTokensList, LPtokenContract]);

  const tokenSymbol = useMemo(
    () =>
      pairTokenList.find(
        (item) => item.contractAddress === selectedContractAddr
      ),
    [pairTokenList, selectedContractAddr]
  );

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

    setTokenBalance(
      formatQueryResultToNumberEthers(queryResult, tokenSymbol?.decimal)
    );
  }, [currentAccount, selectedContractAddr, tokenSymbol]);

  const tokenLPSymbol = useMemo(() => {
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === LPtokenContract
    );

    return foundItem;
  }, [LPtokenContract, faucetTokensList]);

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

    setLPTokenBalance(
      formatQueryResultToNumberEthers(queryResultLP, tokenLPSymbol?.decimal)
    );
  }, [LPtokenContract, currentAccount, tokenLPSymbol]);

  useEffect(() => {
    fetchLPTokenBalance();
  }, [fetchLPTokenBalance]);

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
      const fee = formatTokenAmount(
        formatTextAmount(result?.toHuman()?.Ok),
        unitDecimal
      );

      setCreateFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);

  const minReward = useMemo(
    () => maxStake * duration * multiplier,
    [maxStake, duration, multiplier]
  );
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise(async (resolve) => {
      resolve(createTokenLPHandler());
    });
  });
  async function createTokenLPHandler() {
    let step = 1;
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

    if (!(duration > 0)) {
      toast.error(`Pool Length must be greater than 0`);
      return;
    }

    if (!(multiplier > 0)) {
      toast.error(`Multiplayer must be greater than 0`);
      return;
    }

    if (!(maxStake > 0)) {
      toast.error(`Total Staking Cap must be greater than 0`);
      return;
    }

    if (
      !isAddressValid(selectedContractAddr) ||
      !isAddressValid(LPtokenContract)
    ) {
      return toast.error("Invalid address!");
    }
    if (+currentAccount?.balance?.inw < +createTokenFee) {
      toast.error(
        `You don't have enough ${
          currentChain?.inwName
        }. Stake costs ${formatNumDynDecimal(createTokenFee)} ${
          currentChain?.inwName
        }`
      );
      return;
    }
    if (+tokenBalance < +minReward) {
      toast.error(
        `You don't have enough ${tokenSymbol?.symbol} to topup the reward`
      );
      return;
    }
    //Approve
    //Approve INW
    await new Promise(async (resolve, reject) => {
      try {
        toast("Step 1: Approving INW...");
        const allowanceINWQr = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract.CONTRACT_ABI,
          psp22_contract.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::allowance",
          currentAccount?.address,
          lp_pool_generator_contract.CONTRACT_ADDRESS
        );
        const allowanceINW = formatQueryResultToNumberEthers(
          allowanceINWQr,
          18
        );
        if (+allowanceINW < +createTokenFee) {
          toast.success(
            `Step ${step}: Approving ${currentChain?.inwName} token...`
          );
          step++;
          let approve = await execContractTxAndCallAPI(
            currentAccount,
            "api",
            async () => {
              resolve();
            },
            psp22_contract.CONTRACT_ABI,
            psp22_contract.CONTRACT_ADDRESS,
            0, //-> value
            "psp22::approve",
            lp_pool_generator_contract.CONTRACT_ADDRESS,
            formatNumToBNEther(createTokenFee, 18)
          );
          // if (!approve) reject();
        } else resolve();
      } catch (error) {
        console.log(error);
      }
    });

    // Allow reward
    await new Promise(async (resolve, reject) => {
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0, //-> value
        "psp22::allowance",
        currentAccount?.address,
        lp_pool_generator_contract.CONTRACT_ADDRESS
      );
      const allowanceToken = formatQueryResultToNumberEthers(
        allowanceTokenQr,
        tokenSymbol?.decimal
      );
      if (+allowanceToken < +minReward) {
        toast(`Step ${step}: Approving ${tokenSymbol?.symbol} token...`);
        step++;
        let approve = await execContractTxAndCallAPI(
          currentAccount,
          "api",
          psp22_contract.CONTRACT_ABI,
          selectedContractAddr,
          0, //-> value
          "psp22::approve",
          async () => {
            resolve();
          },
          lp_pool_generator_contract.CONTRACT_ADDRESS,
          formatNumToBNEther(+minReward - +allowanceToken, tokenSymbol?.decimal)
        );
        if (!approve) return;
      } else resolve();
    });
    await delay(1000);
    toast(`Process create...`);
    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      lp_pool_generator_contract.CONTRACT_ABI,
      lp_pool_generator_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newPool",
      async (newContractAddress) => {
        await APICall.askBEupdate({
          type: "lp",
          poolContract: newContractAddress,
        });
        setMultiplier("");
        setDuration("");
        setStartTime(new Date());
        setSelectedContractAddr("");
        setLPTokenContract("");

        await delay(3000);

        toast.promise(
          delay(10000).then(() => {
            if (currentAccount) {
              dispatch(fetchMyTokenPools({ currentAccount }));
              dispatch(fetchUserBalance({ currentAccount, api }));
            }

            fetchTokenBalance();
            fetchLPTokenBalance();
          }),
          {
            loading: "Please wait up to 10s for the data to be updated! ",
            success: "Done !",
            error: "Could not fetch data!!!",
          }
        );
      },
      currentAccount?.address,
      LPtokenContract,
      selectedContractAddr,
      formatNumToBNEther(maxStake, tokenLPSymbol?.decimal || 18),
      Number(+multiplier * 1000000).toString(),
      roundUp(duration * 24 * 60 * 60 * 1000, 0).toString(),
      startTime.getTime().toString()
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

    tableBody: myTokenPoolsList?.map((e) => {
      return {
        ...e,
        totalStaked: formatTokenAmount(e?.totalStaked, e?.lptokenDecimal),
      };
    }),
  };

  useEffect(() => {
    if (api) dispatch(fetchMyTokenPools({ currentAccount }));
  }, [api, currentAccount, dispatch]);
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Create Token Farming"
        description={
          <span>
            Stakers get rewards in selected token. The creation costs
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {+createTokenFee > 1
                ? formatNumDynDecimal(createTokenFee)
                : createTokenFee}{" "}
              {currentChain?.inwName}
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
              <SelectSearch
                name="token"
                placeholder="Select Token..."
                closeMenuOnSelect={true}
                // filterOption={filterOptions}
                isSearchable
                onChange={({ value }) => {
                  setLPTokenContract(value);
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
                onChange={({ target }) => setLPTokenContract(target.value)}
                value={LPtokenContract}
                placeholder="Contract Address"
                label="or enter token contract address"
              />
            </Box>
            <IWInput
              isDisabled
              value={`${LPtokenBalance || 0}`}
              // label={`Your ${tokenLPSymbol || "Token"} Balance`}
              label={`Token Balance`}
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenLPSymbol?.symbol}
                </Heading>
              }
            />
            <Box></Box>

            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Select Token To Reward Stakers
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
                options={pairTokenList?.map((token, idx) => ({
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
            <IWInput
              isDisabled
              label={`Reward Token Balance`}
              value={`${tokenBalance || 0}`}
              // label={`Your ${tokenSymbol || "Token"} Balance`}
              inputRightElementIcon={
                <Heading as="h5" size="h5" fontWeight="semibold">
                  {tokenSymbol?.symbol}
                </Heading>
              }
            />
            <Box></Box>

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
                  currentChain?.unit
                }`}
                label={`Your ${currentChain?.unit} Balance`}
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
                value={`${
                  formatNumDynDecimal(
                    currentAccount?.balance?.inw2?.replaceAll(",", "")
                  ) || 0
                } ${currentChain?.inwName}`}
                label={`Your ${currentChain?.inwName} Balance`}
              />
            </Box>

            <Box w="full">
              <IWInput
                type="number"
                placeholder="0"
                label={
                  <>
                    Multiplier
                    <Tooltip
                      fontSize="md"
                      label="Multiplier determines how many reward tokens will the staker receive per 1 token in 24 hours"
                    >
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  </>
                }
                value={multiplier}
                onChange={({ target }) => setMultiplier(target.value)}
              />
            </Box>
            {/* 
            <Box w="full">
              <Stack
                spacing="10px"
                flexDirection={{ base: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems="end"
                w="full"
              >
                
              </Stack>
            </Box> */}
            <Box w="full">
              <IWInput
                value={maxStake}
                onChange={({ target }) => setMaxStake(target.value)}
                type="number"
                label={
                  <>
                    Total Staking Cap{" "}
                    {tokenLPSymbol?.symbol ? `(${tokenLPSymbol?.symbol})` : ""}{" "}
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
                value={`${minReward || 0} ${tokenSymbol?.symbol || ""}`}
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
            maxW={{ lg: "260px" }}
            isLoading={isLoading}
            onClick={() => mutate()}
          >
            Create Pool
          </Button>
        </VStack>
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My Token Farming Pools"
        description=""
      >
        <IWTable
          {...tableData}
          mode="TOKEN_FARM"
          loading={loading}
          customURLRowClick="/my-farming"
        />
      </SectionContainer>
    </>
  );
}
