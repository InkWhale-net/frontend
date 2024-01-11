import { ChevronRightIcon } from "@chakra-ui/icons";

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  CircularProgress,
  Flex,
  HStack,
  Show,
  Stack,
  Text,
  Tooltip,
  useInterval,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";

import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
import ConfirmModal from "components/modal/ConfirmModal";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import IWTabs from "components/tabs/IWTabs";
import { toastMessages } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  calcUnclaimedReward,
  chainDenom,
  delay,
  formatChainStringToNumber,
  formatNumDynDecimal,
  formatNumToBNEther,
  formatQueryResultToNumber,
  formatTextAmount,
  formatTokenAmount,
  isPoolEnded,
  isPoolNotStart,
  roundUp,
} from "utils";
import {
  execContractQuery,
  execContractTxAndCallAPI,
  pool_contract,
  psp22_contract,
} from "utils/contracts";
import { MaxStakeButton } from "./MaxStakeButton";

export default function PoolDetailPage() {
  const params = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const { allStakingPoolsList } = useSelector((s) => s.allPools);
  const [isOldPool, setIsOldPool] = useState(null);
  const dispatch = useDispatch();

  const currentPool = useMemo(
    () =>
      allStakingPoolsList?.find(
        (p) => p?.poolContract === params?.contractAddress
      ),
    [allStakingPoolsList, params?.contractAddress]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cardData = {
    cardHeaderList: [
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake & Earn",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: currentPool?.isMaxStakingAmount
          ? "Max Staking Amount reached"
          : `Total Value Locked: Total tokens staked into this pool`,
        tooltipIcon: roundUp(
          +currentPool?.maxStakingAmount - +currentPool?.totalStaked,
          4
        ) <= 0 && <AiOutlineExclamationCircle ml="6px" color="text.1" />,
        label: "TVL",
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
        name: "status",
        hasTooltip: false,
        tooltipContent: "",
        label: "Status",
      },
      {
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Countdown",
      },
    ],

    cardValue: currentPool,
  };
  const tabsData = [
    {
      label: "My Stakes & Rewards",
      component: (
        <MyStakeRewardInfo
          {...currentPool}
          {...currentAccount}
          isOldPool={isOldPool}
        />
      ),
      isDisabled: false,
    },
    {
      label: <span>Pool Info</span>,
      component: (
        <PoolInfo
          {...currentPool}
          rewardPool={currentPool?.rewardPool}
          totalStaked={currentPool?.totalStaked}
          api={api}
          isOldPool={isOldPool}
        />
      ),
      isDisabled: false,
    },
  ];
  const fetchIsOldPool = async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      pool_contract.CONTRACT_ABI,
      currentPool?.poolContract,
      0,
      "genericPoolContractTrait::inwContract"
    );
    const inwContract = queryResult.toHuman().Ok;
    setIsOldPool(inwContract == psp22_contract.CONTRACT_ADDRESS);
  };
  useEffect(() => {
    if (currentPool && api) fetchIsOldPool();
  }, [currentPool, api]);
  useEffect(() => {
    if (api) {
      dispatch(fetchAllStakingPools({ currentAccount }));
    }
  }, [api, currentAccount]);

  if (currentPool)
    return (
      <>
        <Show above="md">
          <SectionContainer>
            <Breadcrumb
              spacing="4px"
              separator={<ChevronRightIcon color="gray.500" />}
            >
              <BreadcrumbItem color="text.2">
                <BreadcrumbLink href="#/pools">Staking Pools</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem color="text.1">
                <BreadcrumbLink>Detail</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </SectionContainer>
        </Show>

        <SectionContainer title="Staking Pool Detail">
          <Stack
            w="full"
            spacing="30px"
            alignItems="start"
            direction={{ base: "column" }}
          >
            <IWCard
              mt="16px"
              w="full"
              variant="solid"
              border="1px solid #E3DFF3"
              bg="bg.1"
            >
              <Flex
                minH="70px"
                flexDirection={{ base: "column", lg: "row" }}
                justifyContent={{ base: "space-between" }}
              >
                {cardData?.cardHeaderList?.map((item) => {
                  const {
                    name,
                    hasTooltip,
                    label,
                    tooltipContent,
                    tooltipIcon,
                  } = item;

                  return (
                    <Flex
                      mt={{ base: "15px", lg: "0px" }}
                      w="full"
                      key={name}
                      justifyContent="center"
                      flexDirection={{ base: "row", lg: "column" }}
                    >
                      <Flex
                        w={{ base: "45%", lg: "full" }}
                        color="text.2"
                        fontWeight="400"
                        fontSize="16px"
                        lineHeight="28px"
                        alignItems="center"
                      >
                        {label}
                        {hasTooltip && (
                          <Tooltip fontSize="md" label={tooltipContent}>
                            <span style={{ marginLeft: "6px" }}>
                              {tooltipIcon ? (
                                tooltipIcon
                              ) : (
                                <AiOutlineQuestionCircle color="text.2" />
                              )}
                            </span>
                          </Tooltip>
                        )}
                      </Flex>

                      <Flex
                        color="text.1"
                        fontWeight="600"
                        lineHeight="28px"
                        justify={{ base: "start" }}
                        alignItems={{ base: "center" }}
                        w={{ base: "55%", lg: "full" }}
                        fontSize={{ base: "16px", lg: "20px" }}
                      >
                        <Text>
                          {formatDataCellTable(cardData?.cardValue, name)}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </IWCard>
          </Stack>
        </SectionContainer>

        <SectionContainer mt={{ base: "-28px", xl: "-48px" }}>
          <IWTabs tabsData={tabsData} />
        </SectionContainer>
      </>
    );
  return (
    <Flex h="calc(100vh/2)" justify="center" alignItems="center">
      <CircularProgress isIndeterminate color="#93F0F5" />
    </Flex>
  );
}

const MyStakeRewardInfo = ({
  tokenSymbol,
  address,
  balance,
  apy,
  poolContract,
  tokenContract,
  rewardPool,
  duration,
  startTime,
  tokenDecimal,
  maxStakingAmount,
  totalStaked,
  isOldPool,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const [unstakeFee, setUnstakeFee] = useState(0);
  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();

  const [amount, setAmount] = useState("");
  const remainStaking = +maxStakingAmount - +totalStaked;

  const fetchUserStakeInfo = useCallback(async () => {
    if (!currentAccount?.balance && currentAccount && api) {
      dispatch(fetchUserBalance({ currentAccount, api }));
      return;
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      api,
      pool_contract.CONTRACT_ABI,
      poolContract,
      0,
      "genericPoolContractTrait::getStakeInfo",
      currentAccount?.address
    );

    let info = queryResult?.toHuman().Ok;
    if (info) {
      info = {
        ...info,
        lastRewardUpdate: Number(
          formatChainStringToNumber(info.lastRewardUpdate)
        ),
        stakedValue: formatChainStringToNumber(info.stakedValue),
        unclaimedReward: formatChainStringToNumber(info.unclaimedReward),
      };
    }
    setStakeInfo(info);
  }, [api, currentAccount?.address, currentAccount?.balance, poolContract]);
  const fetchTokenBalance = useCallback(async () => {
    // if (!currentAccount?.balance) return;
    try {
      const result = await execContractQuery(
        currentAccount?.address,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0,
        "psp22::balanceOf",
        currentAccount?.address
      );
      const balance = formatQueryResultToNumber(result, tokenDecimal);
      setTokenBalance(balance);
    } catch (error) {
      console.log(error);
    }
  }, [api, currentAccount?.address, currentAccount?.balance, tokenContract]);

  useEffect(() => {
    if (isOldPool != null) {
      fetchUserStakeInfo();
      fetchTokenBalance();
    }
  }, [
    api,
    currentAccount?.address,
    currentAccount?.balance,
    fetchTokenBalance,
    fetchUserStakeInfo,
    poolContract,
    isOldPool,
  ]);

  useEffect(() => {
    const fetchFee = async () => {
      if (!currentAccount?.balance) return;

      try {
        const result = await execContractQuery(
          currentAccount?.address,
          api,
          pool_contract.CONTRACT_ABI,
          poolContract,
          0,
          "genericPoolContractTrait::unstakeFee"
        );

        const fee = formatQueryResultToNumber(result);
        setUnstakeFee(formatTextAmount(fee));
      } catch (error) {
        console.log(error);
      }
    };

    fetchFee();
  }, [api, currentAccount?.address, currentAccount?.balance, poolContract]);

  const claimMutation = useMutation(async () => {
    try {
      return await handleClaimRewards();
    } catch (error) {
      console.error("Error in claimMutation:", error);
      throw error;
    }
  });
  async function handleClaimRewards() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }
    await new Promise(async (resolve, reject) => {
      try {
        const result = await execContractTxAndCallAPI(
          currentAccount,
          api,
          pool_contract.CONTRACT_ABI,
          poolContract,
          0, //-> value
          "claimReward",
          async () => {
            await APICall.askBEupdate({ type: "pool", poolContract });
            await delay(500);
            fetchUserStakeInfo();
            fetchTokenBalance();

            await delay(2000).then(() => {
              if (currentAccount) {
                dispatch(fetchAllStakingPools({ currentAccount }));
                dispatch(fetchUserBalance({ currentAccount, api }));
              }
              resolve();
            });
          }
        );
        if (!result) reject();
      } catch (error) {
        reject("Reject fail");
        console.log(error);
      }
    });
  }

  async function onValidateStake() {
    try {
      if (!currentAccount) {
        toast.error(toastMessages.NO_WALLET);
        return false;
      }

      if (isPoolEnded(startTime, duration)) {
        toast.error("Pool is ended!");
        return false;
      }
      if (!amount || +formatTextAmount(tokenBalance) < +amount) {
        toast.error("Invalid Amount!");
        return false;
      }

      if (!rewardPool || +rewardPool <= 0) {
        toast.error("There is no reward balance in this pool!");
        return false;
      }

      if (+formatChainStringToNumber(tokenBalance) < +amount) {
        toast.error("Not enough tokens!");
        return false;
      }
      if (roundUp(+maxStakingAmount - +totalStaked) === 0) {
        toast.error(`Max staking amount reached`);
        return false;
      }
      const remainStaking = roundUp(maxStakingAmount - totalStaked);
      if (remainStaking - +amount < 0) {
        toast.error(
          `You can not stake more than ${formatNumDynDecimal(
            remainStaking
          )} ${tokenSymbol}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      toast.error(`Unknow error`);
    }
  }
  const stakeMutation = useMutation(async () => {
    try {
      return await handleStake();
    } catch (error) {
      console.error("Error in stakeMutation:", error);
      throw error;
    }
  });
  const unStakeMutation = useMutation(async () => {
    try {
      return await handleUnstake();
    } catch (error) {
      console.error("Error in UnStakeMutation:", error);
      throw error;
    }
  });
  async function handleStake() {
    try {
      //Approve
      await new Promise(async (resolve, reject) => {
        try {
          toast("Step 1: Approving...");
          let approve = await execContractTxAndCallAPI(
            currentAccount,
            api,
            psp22_contract.CONTRACT_ABI,
            tokenContract,
            0, //-> value
            "psp22::approve",
            async () => {
              resolve();
            },
            poolContract,
            formatNumToBNEther(amount, tokenDecimal)
          );
          if (!approve) reject("Approve fail");
        } catch (error) {
          console.log(error);
          reject("Approve fail");
        }
      });
      await delay(500);
      await new Promise(async (resolve, reject) => {
        try {
          toast("Step 2: Process...");
          const result = await execContractTxAndCallAPI(
            currentAccount,
            api,
            pool_contract.CONTRACT_ABI,
            poolContract,
            0, //-> value
            "stake",
            async () => {
              await APICall.askBEupdate({ type: "pool", poolContract });
              await delay(5000).then(() => {
                if (currentAccount) {
                  dispatch(fetchAllStakingPools({ currentAccount }));
                  dispatch(fetchUserBalance({ currentAccount, api }));
                }
                fetchUserStakeInfo();
                fetchTokenBalance();
                setAmount("");
                resolve();
              });
            },
            formatNumToBNEther(amount, tokenDecimal)
          );
          if (!result) reject("Process fail");
        } catch (error) {
          console.log(error);
          reject("Process fail");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function onValidateUnstake() {
    try {
      if (!currentAccount) {
        toast.error(toastMessages.NO_WALLET);
        return false;
      }

      if (
        !isOldPool &&
        +formatTextAmount(currentAccount?.balance?.inw2) < +unstakeFee
      ) {
        toast.error(
          `You don't have enough INW V2. Unstake costs ${unstakeFee} INW V2!`
        );
        return false;
      }
      if (
        isOldPool &&
        +formatTextAmount(currentAccount?.balance?.inw) < +unstakeFee
      ) {
        toast.error(
          `You don't have enough INW. Unstake costs ${unstakeFee} INW!`
        );
        return false;
      }

      if (!amount) {
        toast.error("Invalid Amount!");
        return false;
      }
      if (!stakeInfo?.stakedValue) {
        toast.error("No staking info!");
        return false;
      }
      let queryResult = await execContractQuery(
        currentAccount?.address,
        api,
        pool_contract.CONTRACT_ABI,
        poolContract,
        0,
        "genericPoolContractTrait::getStakeInfo",
        currentAccount?.address
      );

      let info = queryResult?.toHuman().Ok;

      const userCurrentStake =
        formatTokenAmount(info?.stakedValue, +tokenDecimal) || 0;
      if (!(+userCurrentStake > 0)) {
        toast.error(`You musk stake first`);
        return false;
      }
      if (+amount > +userCurrentStake) {
        toast.error(
          `You can not unstake higher ${formatNumDynDecimal(
            userCurrentStake
          )} ${tokenSymbol}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      toast.error(`Unknow error`);
    }
  }
  async function handleUnstake() {
    //Approve
    await new Promise(async (resolve, reject) => {
      try {
        toast("Step 1: Approving...");
        let approve = await execContractTxAndCallAPI(
          currentAccount,
          api,
          psp22_contract.CONTRACT_ABI,
          psp22_contract.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::approve",
          async () => resolve(),
          poolContract,
          formatNumToBNEther(unstakeFee)
        );
        if (!approve) reject("Approve fail");
      } catch (error) {
        console.log(error);
        reject("Approve fail");
      }
    });
    await delay(500);

    await new Promise(async (resolve, reject) => {
      try {
        toast("Step 2: Process...");
        const result = await execContractTxAndCallAPI(
          currentAccount,
          api,
          pool_contract.CONTRACT_ABI,
          poolContract,
          0, //-> value
          "unstake",
          async () => {
            await APICall.askBEupdate({ type: "pool", poolContract });
            await delay(5000).then(() => {
              if (currentAccount) {
                dispatch(fetchAllStakingPools({ currentAccount }));
                dispatch(fetchUserBalance({ currentAccount, api }));
              }
              fetchUserStakeInfo();
              fetchTokenBalance();
              setAmount("");
              resolve();
            });
          },
          formatNumToBNEther(amount, tokenDecimal)
        );
        if (!result) reject("Approve fail");
      } catch (error) {
        console.log(error);
        reject("Process fail");
      }
    });
  }

  const [unclaimedReward, setUnclaimedReward] = useState(0);

  const updateStakingInfo = () => {
    const ret = calcUnclaimedReward({
      ...stakeInfo,
      apy,
      tokenDecimal,
      startTime,
      duration,
    });
    setUnclaimedReward(ret);
  };

  useInterval(() => updateStakingInfo(), 1000);

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <IWCardOneColumn
        title="My Account"
        data={[
          {
            title: "Account Address",
            content: address ? (
              <AddressCopier address={address} />
            ) : (
              "No account selected"
            ),
          },
          {
            title: `${chainDenom[process.env.REACT_APP_CHAIN]} Balance`,
            content: `${balance?.azero || 0} ${
              chainDenom[process.env.REACT_APP_CHAIN]
            }`,
          },
          {
            title: "INW Balance",
            content: `${
              formatNumDynDecimal(formatTextAmount(balance?.inw)) || 0
            } INW`,
          },
          {
            title: `${tokenSymbol} Balance`,
            content: `${
              formatNumDynDecimal(tokenBalance?.replaceAll(",", "")) || 0
            } ${tokenSymbol}`,
          },
        ]}
      />

      <CardThreeColumn
        title="Staking Information"
        data={[
          {
            title: "My Stakes ",
            content: `${formatNumDynDecimal(
              formatTokenAmount(stakeInfo?.stakedValue, +tokenDecimal)
            )} ${tokenSymbol}`,
          },
          {
            title: "Last Claim",
            content: `${
              !currentAccount
                ? "No account selected"
                : !stakeInfo?.lastRewardUpdate
                ? "Not claimed yet"
                : new Date(stakeInfo?.lastRewardUpdate).toLocaleString("en-US")
            }`,
          },
          {
            title: "My Unclaimed Rewards",
            content: `${formatNumDynDecimal(unclaimedReward, 8)}`,
          },
        ]}
      >
        <ConfirmModal
          isLoading={claimMutation.isLoading}
          action="claim"
          buttonVariant="primary"
          buttonLabel="Claim Rewards"
          disableBtn={!(+unclaimedReward > 0) || claimMutation.isLoading}
          onClick={() => claimMutation.mutate()}
          message="Claim All Rewards. Continue?"
        />

        <IWCard mt="24px" w="full" variant="solid">
          <Flex
            w="100%"
            spacing="20px"
            flexDirection={{ base: "column", lg: "row" }}
            alignItems={{ base: "center", lg: "center" }}
          >
            <IWInput
              value={amount}
              onChange={({ target }) => setAmount(target.value)}
              type="number"
              placeholder="Enter amount"
              inputRightElementIcon={
                <MaxStakeButton
                  setStakeMax={() => {
                    if (
                      isPoolEnded(startTime, duration) ||
                      isPoolNotStart(startTime) ||
                      !(remainStaking > 0)
                    ) {
                      setAmount(0);
                      return;
                    }
                    const tokenBalanceAmount =
                      +formatChainStringToNumber(tokenBalance);
                    if (remainStaking > tokenBalanceAmount)
                      setAmount(tokenBalanceAmount);
                    if (tokenBalanceAmount > remainStaking)
                      setAmount(remainStaking);
                  }}
                  setUnstakeMax={() => {
                    if (!(totalStaked > 0)) {
                      setAmount(0);
                      return;
                    }

                    setAmount(
                      formatTokenAmount(
                        stakeInfo?.stakedValue,
                        tokenDecimal
                      )?.toString()
                    );
                  }}
                />
              }
              // isDisabled={!(remainStaking > 0)}
            />

            <HStack
              ml={{ base: "0", lg: "20px" }}
              mt={{ base: "10px", lg: "0px" }}
              maxW={{ base: "full", lg: "245px" }}
              w="full"
              spacing="10px"
              justifyContent="space-between"
            >
              <ConfirmModal
                isLoading={stakeMutation.isLoading}
                action="stake"
                buttonVariant="primary"
                buttonLabel="Stake"
                onValidate={onValidateStake}
                disableBtn={
                  !Number(amount) ||
                  isPoolEnded(startTime, duration) ||
                  isPoolNotStart(startTime) ||
                  !(remainStaking > 0) ||
                  stakeMutation.isLoading
                }
                onClick={() => stakeMutation.mutate()}
                message={formatMessageStakingPool(
                  "stake",
                  amount,
                  tokenSymbol,
                  unstakeFee,
                  isOldPool
                )}
              />

              <ConfirmModal
                isLoading={unStakeMutation.isLoading}
                action="unstake"
                buttonVariant="primary"
                buttonLabel="Unstake"
                disableBtn={
                  !(+amount > 0) ||
                  !(totalStaked > 0) ||
                  unStakeMutation.isLoading
                }
                onClick={() => unStakeMutation.mutate()}
                onValidate={onValidateUnstake}
                message={formatMessageStakingPool(
                  "unstake",
                  amount,
                  tokenSymbol,
                  unstakeFee,
                  isOldPool
                )}
              />
            </HStack>
          </Flex>
          <Box fontSize={14} ml="2px">
            {currentAccount &&
              !isPoolEnded(startTime, duration) &&
              (!(remainStaking > 0)
                ? "Max staking amount reached"
                : `Max staking amount: ${formatNumDynDecimal(remainStaking)}`)}
          </Box>
        </IWCard>
      </CardThreeColumn>
    </Stack>
  );
};

const PoolInfo = (props) => {
  const {
    poolContract,
    apy,
    startTime,
    duration,
    rewardPool,
    totalStaked,
    tokenContract,
    tokenName,
    tokenSymbol,
    maxStakingAmount,
    tokenDecimal,
    api,
    owner,
    isOldPool,
  } = props;
  const { currentAccount } = useSelector((s) => s.wallet);
  const [totalSupply, setTotalSupply] = useState(0);

  const getPoolInfo = async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenContract,
      0,
      "psp22::totalSupply"
    );
    const rawTotalSupply = queryResult?.toHuman()?.Ok;

    const totalSupply = roundUp(
      formatTokenAmount(formatTextAmount(rawTotalSupply), +tokenDecimal)
    );
    setTotalSupply(totalSupply);
  };

  useEffect(() => {
    getPoolInfo();
  }, [currentAccount?.address, api, tokenContract]);

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <CardTwoColumn
        title="General Information"
        data={[
          {
            title: "Pool Contract Address",
            content: <AddressCopier address={poolContract} />,
          },
          { title: "APR", content: `${apy / 100}%` },
          {
            title: "Start Date",
            content: `${new Date(startTime).toLocaleString("en-US")}`,
          },
          { title: "Pool Length (days)", content: duration / 86400 },
          {
            title: "Reward Pool",
            content: `${formatNumDynDecimal(rewardPool)} ${tokenSymbol}`,
          },
          {
            title: "Max Staking Amount",
            content: `${formatNumDynDecimal(maxStakingAmount)} ${tokenSymbol}`,
          },
          {
            title: "Total Value Locked",
            content: `${formatNumDynDecimal(totalStaked)} ${tokenSymbol}`,
          },
          {
            title: "Creator",
            content: <AddressCopier address={owner} />,
          },
        ]}
      />

      <CardTwoColumn
        title="Staking Token Information"
        data={[
          { title: "Token Name", content: tokenName },
          {
            title: "Contract Address",
            content: <AddressCopier address={tokenContract} />,
          },
          {
            title: "Total Supply",
            content: `${formatNumDynDecimal(totalSupply)}`,
          },
          { title: "Token Symbol", content: tokenSymbol },
        ]}
      />
    </Stack>
  );
};

const formatMessageStakingPool = (
  action,
  amount,
  tokenSymbol,
  unstakeFee,
  isOldPool
) => {
  if (action === "stake") {
    return (
      <>
        You are staking {formatNumDynDecimal(amount)} {tokenSymbol}.<br />
        Unstaking later will cost you {formatNumDynDecimal(
          Number(unstakeFee)
        )}{" "}
        {isOldPool ? "INW" : "INW V2."}. Continue?
      </>
    );
  }

  if (action === "unstake") {
    return (
      <>
        You are unstaking {amount} {tokenSymbol}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)}{" "}
        {isOldPool ? "INW" : "INW V2."}
        Continue?
      </>
    );
  }
};
