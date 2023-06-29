import { ChevronRightIcon, QuestionOutlineIcon } from "@chakra-ui/icons";

import {
  AiOutlineQuestionCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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

import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
import ConfirmModal from "components/modal/ConfirmModal";
import { formatDataCellTable } from "components/table/IWTable";
import IWTabs from "components/tabs/IWTabs";
import { toastMessages } from "constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  calcUnclaimedReward,
  delay,
  formatChainStringToNumber,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  isPoolEnded,
  isPoolNotStart,
  roundUp,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import pool_contract from "utils/contracts/pool_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import { formatTokenAmount } from "utils";

export default function PoolDetailPage({ api }) {
  const params = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allStakingPoolsList } = useSelector((s) => s.allPools);
  const [remainStaking, setRemainStaking] = useState(null);

  const currentPool = useMemo(() => {
    const poolData = allStakingPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
    return {
      ...poolData,
      maxStakingAmount:
        typeof poolData?.maxStakingAmount == "string"
          ? parseFloat(
              formatTokenAmount(
                poolData?.maxStakingAmount,
                poolData?.tokenDecimal
              )
            )
          : poolData?.maxStakingAmount,
      // totalStaked: parseFloat(
      //   formatTokenAmount(poolData?.totalStaked, poolData?.tokenDecimal)
      // ),
    };
  }, [allStakingPoolsList, params?.contractAddress]);

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
        tooltipContent:
          remainStaking === 0
            ? "Max Staking Amount reached"
            : `Total Value Locked: Total tokens staked into this pool`,
        tooltipIcon: roundUp(
          currentPool?.maxStakingAmount -
            parseFloat(
              formatTokenAmount(
                currentPool?.totalStaked,
                currentPool?.tokenDecimal
              )
            ),
          4
        ) === 0 && <AiOutlineExclamationCircle ml="6px" color="text.1" />,
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

    cardValue: {
      ...currentPool,
      totalStaked: currentPool?.totalStaked,
      rewardPool: currentPool?.rewardPool,
    },
  };

  const tabsData = [
    {
      label: <span>Pool Information</span>,
      component: (
        <PoolInfo
          {...currentPool}
          rewardPool={currentPool?.rewardPool}
          totalStaked={currentPool?.totalStaked}
        />
      ),
      isDisabled: false,
    },
    {
      label: "My Stakes & Rewards",
      component: (
        <MyStakeRewardInfo
          {...currentPool}
          {...currentAccount}
          remainStaking={remainStaking}
          setRemainStaking={setRemainStaking}
        />
      ),
      isDisabled: false,
    },
  ];

  return (
    <>
      <Show above="md">
        <SectionContainer mt={{ xl: "-48px" }} mb={{ xl: "-32px" }}>
          <Breadcrumb
            spacing="4px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem color="text.1">
              <BreadcrumbLink href="#/pools">Staking Pools</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.2">
              <BreadcrumbLink>Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </SectionContainer>
      </Show>

      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Staking Pool Detail"
      >
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
                const { name, hasTooltip, label, tooltipContent, tooltipIcon } =
                  item;

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
  remainStaking,
  setRemainStaking,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { currentAccount, api } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);
  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();

  const [amount, setAmount] = useState("");

  const fetchUserStakeInfo = useCallback(async () => {
    if (!currentAccount?.balance) return;

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
        lastRewardUpdate: formatChainStringToNumber(info.lastRewardUpdate),
        stakedValue: formatChainStringToNumber(info.stakedValue),
        unclaimedReward: formatChainStringToNumber(info.unclaimedReward),
      };
    }
    setStakeInfo(info);
  }, [api, currentAccount?.address, currentAccount?.balance, poolContract]);

  const fetchTokenBalance = useCallback(async () => {
    if (!currentAccount?.balance) return;
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

      setRemainStaking(
        roundUp(
          maxStakingAmount -
            parseFloat(formatTokenAmount(totalStaked, tokenDecimal)),
          4
        )
      );
    } catch (error) {
      console.log(error);
    }
  }, [api, currentAccount?.address, currentAccount?.balance, tokenContract]);

  useEffect(() => {
    fetchUserStakeInfo();
    fetchTokenBalance();
  }, [
    api,
    currentAccount?.address,
    currentAccount?.balance,
    fetchTokenBalance,
    fetchUserStakeInfo,
    poolContract,
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
        setUnstakeFee(fee);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFee();
  }, [api, currentAccount?.address, currentAccount?.balance, poolContract]);

  async function handleClaimRewards() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    // if (stakeInfo?.unclaimedReward < 0) {
    //   toast.error("No reward tokens!");
    //   return;
    // }
    try {
      await execContractTx(
        currentAccount,
        api,
        pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "claimReward"
      );

      await APICall.askBEupdate({ type: "pool", poolContract });
    } catch (error) {
      console.log(error);
    }

    await delay(6000).then(() => {
      if (currentAccount) {
        dispatch(fetchAllStakingPools({ currentAccount }));
        dispatch(fetchUserBalance({ currentAccount, api }));
      }
      fetchUserStakeInfo();
      fetchTokenBalance();
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

      if (!amount || +tokenBalance?.replaceAll(",", "") < +amount) {
        toast.error("Invalid Amount!");
        return false;
      }

      if (!rewardPool || +rewardPool <= 0) {
        toast.error("There is no reward balance in this pool!");
        return false;
      }

      if (formatChainStringToNumber(tokenBalance) < amount) {
        toast.error("Not enough tokens!");
        return false;
      }
      if (roundUp(maxStakingAmount - totalStaked) === 0) {
        toast.error(`Max Staking Amount reached`);
        return false;
      }
      if (maxStakingAmount - totalStaked - amount < 0) {
        toast.error(
          `You can not stake more than ${formatNumDynDecimal(
            roundUp(maxStakingAmount - totalStaked)
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

  async function handleStake() {
    try {
      //Approve
      toast.success("Step 1: Approving...");

      let approve = await execContractTx(
        currentAccount,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0, //-> value
        "psp22::approve",
        poolContract,
        formatNumToBN(amount, tokenDecimal)
      );
      if (!approve) return;

      await delay(3000);

      toast.success("Step 2: Process...");
      await execContractTx(
        currentAccount,
        api,
        pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "stake",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "pool", poolContract });
    } catch (error) {
      console.log(error);
    }

    await delay(6000).then(() => {
      if (currentAccount) {
        dispatch(fetchAllStakingPools({ currentAccount }));
        dispatch(fetchUserBalance({ currentAccount, api }));
      }
      fetchUserStakeInfo();
      fetchTokenBalance();
      setAmount("");
    });
  }
  async function onValidateUnstake() {
    try {
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
        info?.stakedValue?.replaceAll(",", "") / 10 ** tokenDecimal || 0;
      if (userCurrentStake === 0) {
        toast.error(`You musk stake first`);
        return false;
      }
      if (amount > userCurrentStake) {
        toast.error(
          `You can not unstake higher ${userCurrentStake} ${tokenSymbol}`
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
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) < unstakeFee
    ) {
      toast.error(
        `You don't have enough INW. Unstake costs ${unstakeFee} INW!`
      );
      return;
    }

    if (!amount) {
      toast.error("Invalid Amount!");
      return;
    }

    if (stakeInfo?.stakedValue / 10 ** tokenDecimal < amount) {
      toast.error("Not enough tokens!");
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      api,
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee, tokenDecimal)
    );

    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      api,
      pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "unstake",
      formatNumToBN(amount, tokenDecimal)
    );

    await APICall.askBEupdate({ type: "pool", poolContract });

    await delay(6000).then(() => {
      if (currentAccount) {
        dispatch(fetchAllStakingPools({ currentAccount }));
        dispatch(fetchUserBalance({ currentAccount, api }));
      }
      fetchUserStakeInfo();
      fetchTokenBalance();
      setAmount("");
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
            title: "AZERO Balance",
            content: `${balance?.azero || 0} AZERO`,
          },
          {
            title: "INW Balance",
            content: `${balance?.inw || 0} INW`,
          },
          {
            title: `${tokenSymbol} Balance`,
            content: `${tokenBalance || 0} ${tokenSymbol}`,
          },
        ]}
      />

      <CardThreeColumn
        title="Staking Information"
        data={[
          {
            title: "My Stakes ",
            content: `${formatNumDynDecimal(
              stakeInfo?.stakedValue / 10 ** tokenDecimal
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
            title: "My Unclaimed Rewards ",
            content: `${unclaimedReward}`,
          },
        ]}
      >
        <ConfirmModal
          action="claim"
          buttonVariant="primary"
          buttonLabel="Claim Rewards"
          disableBtn={!(+unclaimedReward > 0)}
          onClick={handleClaimRewards}
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
              placeholder="Enter amount to stake or unstake"
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
                action="stake"
                buttonVariant="primary"
                buttonLabel="Stake"
                onValidate={onValidateStake}
                disableBtn={
                  !Number(amount) ||
                  isPoolEnded(startTime, duration) ||
                  isPoolNotStart(startTime)
                }
                onClick={handleStake}
                message={formatMessageStakingPool(
                  "stake",
                  amount,
                  tokenSymbol,
                  unstakeFee
                )}
              />

              <ConfirmModal
                action="unstake"
                buttonVariant="primary"
                buttonLabel="Unstake"
                disableBtn={!Number(amount)}
                onClick={handleUnstake}
                onValidate={onValidateUnstake}
                message={formatMessageStakingPool(
                  "unstake",
                  amount,
                  tokenSymbol,
                  unstakeFee
                )}
              />
            </HStack>
          </Flex>
          <Box fontSize={14} ml="2px">
            {remainStaking > 0
              ? `Max Staking Amount: ${formatNumDynDecimal(remainStaking)}`
              : "Max Staking Amount reached"}
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
    tokenTotalSupply,
    tokenSymbol,
    maxStakingAmount,
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
    const rawTotalSupply = queryResult.toHuman().Ok;
    let queryResult1 = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenContract,
      0,
      "psp22Metadata::tokenDecimals"
    );
    const decimals = queryResult1.toHuman().Ok;

    const totalSupply = roundUp(
      formatTokenAmount(rawTotalSupply?.replaceAll(",", ""), parseInt(decimals))
    );
    setTotalSupply(totalSupply);
  };

  useEffect(() => {
    getPoolInfo();
  }, [currentAccount]);

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <CardTwoColumn
        title="Staking Token Information"
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
        ]}
      />

      <CardTwoColumn
        title="General Information"
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

const formatMessageStakingPool = (action, amount, tokenSymbol, unstakeFee) => {
  if (action === "stake") {
    return (
      <>
        You are staking {amount} {tokenSymbol}.<br />
        Unstaking later will cost you {Number(unstakeFee)?.toFixed(0)} INW.
        Continue?
      </>
    );
  }

  if (action === "unstake") {
    return (
      <>
        You are unstaking {amount} ${tokenSymbol}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)} INW. Continue?
      </>
    );
  }
};
