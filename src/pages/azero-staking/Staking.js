import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { getStakeInfo } from "api/azero-staking/azero-staking";
import { doWithdrawRequest } from "api/azero-staking/azero-staking";
import { getApy } from "api/azero-staking/azero-staking";
import { getTotalStakers } from "api/azero-staking/azero-staking";
import { getTotalAzeroStaked } from "api/azero-staking/azero-staking";
import { doStakeAzero } from "api/azero-staking/azero-staking";
import {
  getMinStakingAmount,
  getMaxTotalStakingAmount,
} from "api/azero-staking/azero-staking";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { formatNumDynDecimal } from "utils";
import { delay } from "utils";
import { formatChainStringToNumber } from "utils";
import StakingTable from "./components/Table";
import { getRequestStatus } from "./Claim";
import { getWithdrawalRequestListByUser } from "api/azero-staking/azero-staking";

function Staking() {
  const { api } = useAppContext();
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const [stakeAmount, setStakeAmount] = useState("");

  const azeroBalance = useMemo(() => {
    const azeroBal = formatChainStringToNumber(currentAccount?.balance?.azero);
    return Number(azeroBal);
  }, [currentAccount?.balance?.azero]);

  async function handleStake() {
    if (azeroBalance < stakeAmount) {
      toast.error("Not enough AZERO balance!");
      return;
    }

    await doStakeAzero(api, currentAccount, stakeAmount);

    delay(1000).then(() => {
      fetchData(true);
      dispatch(fetchUserBalance({ currentAccount, api }));

      setStakeAmount("");
    });
  }
  const [footerInfo, setFooterInfo] = useState(null);
  const [statsInfo, setStatsInfo] = useState(null);

  const fetchData = useCallback(
    async (isMounted) => {
      if (!api) return;

      const minStakingAmount = await getMinStakingAmount(api);
      const maxTotalStakingAmount = await getMaxTotalStakingAmount(api);
      const stakeInfo = await getStakeInfo(api, currentAccount).then((res) => {
        if (!res) return 0;

        const stakingAmount =
          formatChainStringToNumber(res?.stakingAmount) / Math.pow(10, 12);
        return stakingAmount?.toFixed(4) ?? 0;
      });

      Promise.all([minStakingAmount, maxTotalStakingAmount, stakeInfo]).then(
        (resultArr) => {
          if (!isMounted) return;
          setFooterInfo(resultArr);
        }
      );

      const apy = await getApy(api);
      const totalAzeroStaked = await getTotalAzeroStaked(api);
      const totalStakers = await getTotalStakers(api).then((res) =>
        parseInt(res)
      );

      Promise.all([apy, totalAzeroStaked, totalStakers]).then((resultArr) => {
        if (!isMounted) return;
        setStatsInfo(resultArr);
      });
    },
    [api, currentAccount]
  );

  useEffect(() => {
    let isMounted = true;

    fetchData(isMounted);

    return () => (isMounted = false);
  }, [api, currentAccount, fetchData]);

  // ================

  const [unstakeAmount, setUnstakeAmount] = useState("");

  async function handleRequestUnstake() {
    if (footerInfo && footerInfo[2] < unstakeAmount) {
      toast.error("Not enough AZERO stakes!");
      return;
    }

    await doWithdrawRequest(api, currentAccount, unstakeAmount);

    delay(1000).then(() => {
      fetchData(true);
      setUnstakeAmount("");
    });
  }

  const [userRequestList, setUserRequestList] = useState([]);

  const fetchUserRequestList = useCallback(async () => {
    const requestedList = await getWithdrawalRequestListByUser(
      api,
      currentAccount
    );
    console.log("requestedList", requestedList);

    if (requestedList?.length) {
      const formattedRequestedList = requestedList.map((i) => {
        const withdrawalAmount =
          formatChainStringToNumber(i.amount) / Math.pow(10, 12);

        const azeroReward =
          formatChainStringToNumber(i.azeroReward) / Math.pow(10, 12);

        const totalAzero =
          formatChainStringToNumber(i.totalAzero) / Math.pow(10, 12);

        const inwReward =
          formatChainStringToNumber(i.inwReward) / Math.pow(10, 12);

        const requestTime =
          formatChainStringToNumber(i.requestTime) * Math.pow(10, 0);

        const requestStatus = getRequestStatus(i.status);

        return {
          ...i,
          withdrawalAmount,
          azeroReward,
          totalAzero,
          inwReward,
          requestStatus,
          requestTime: new Date(requestTime).toLocaleString(),
        };
      });

      setUserRequestList(formattedRequestedList);
    } else {
      setUserRequestList([]);
    }
  }, [api, currentAccount]);

  useEffect(() => {
    fetchUserRequestList();
  }, [fetchUserRequestList]);

  async function handleCallback() {
    delay(1000).then(() => {
      fetchUserRequestList();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  return (
    <>
      <IWCard w="full" variant="solid">
        <SimpleGrid gap="24px" columns={[1, 1, 2]} mb="18px">
          {/* Stake */}
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              type="number"
              placeholder="0"
              value={stakeAmount}
              onChange={({ target }) => setStakeAmount(target.value)}
              inputRightElementIcon={
                <Button
                  size="xs"
                  fontWeight="normal"
                  disabled={!currentAccount?.address}
                  onClick={() => setStakeAmount(azeroBalance)}
                >
                  Max
                </Button>
              }
            />
            <Button
              w="full"
              isDisabled={!currentAccount?.address || !stakeAmount}
              onClick={() => handleStake()}
            >
              {currentAccount?.address ? "Stake" : "Connect Wallet"}
            </Button>
          </Stack>

          {/* Request unstake */}
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <IWInput
              type="number"
              placeholder="0"
              value={unstakeAmount}
              onChange={({ target }) => setUnstakeAmount(target.value)}
              inputRightElementIcon={
                <Button
                  size="xs"
                  fontWeight="normal"
                  disabled={!currentAccount?.address}
                  onClick={() => setUnstakeAmount(footerInfo[2])}
                >
                  Max
                </Button>
              }
            />
            <Button
              w="full"
              isDisabled={!currentAccount?.address || !unstakeAmount}
              onClick={() => handleRequestUnstake()}
            >
              {currentAccount?.address ? "Request Unstake" : "Connect Wallet"}
            </Button>
          </Stack>
        </SimpleGrid>

        <FooterInfo info={footerInfo} />
      </IWCard>

      <IWCard w="full" variant="outline" title={`Statistics`} my="18px">
        <Stack
          mt="18px"
          w="100%"
          spacing="20px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          <StatsInfo info={statsInfo} />
        </Stack>
      </IWCard>

      <StakingTable tableBody={userRequestList} cb={handleCallback} />
    </>
  );
}

export default Staking;

function FooterInfo({ info }) {
  console.log("info", info);
  const formatInfo = [
    {
      title: "Min staking",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Max total staking",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "My Staked",
      number: info && info[2],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];

  return formatInfo?.map((i) => (
    <>
      <Flex
        key={i?.title}
        w="full"
        justify="space-between"
        direction={["column", "column", "row"]}
      >
        <Flex alignItems="center">
          {i?.title}
          {i?.hasTooltip && (
            <Tooltip fontSize="md" label={i?.tooltipContent}>
              <QuestionOutlineIcon ml="6px" color="text.2" />
            </Tooltip>
          )}
        </Flex>
        <Box
          color={{ base: "#57527E" }}
          fontWeight={{ base: "bold" }}
          fontSize={["16px", "18px"]}
        >
          {formatNumDynDecimal(i.number)} {i.denom}
        </Box>
      </Flex>
    </>
  ));
}

function StatsInfo({ info }) {
  const formattedInfo = [
    {
      title: "Annual Percentage Rate",
      number: info && info[0],
      denom: "%",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Total Staked (incl. pending withdrawal)",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Stakers",
      number: info && info[2],
      denom: "",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];

  return formattedInfo?.map((i) => (
    <>
      <Flex
        key={i?.title}
        w="full"
        justify="space-between"
        direction={["column", "column", "row"]}
      >
        <Flex alignItems="center">
          {i?.title}
          {i?.hasTooltip && (
            <Tooltip fontSize="md" label={i?.tooltipContent}>
              <QuestionOutlineIcon ml="6px" color="text.2" />
            </Tooltip>
          )}
        </Flex>
        <Box
          color={{ base: "#57527E" }}
          fontWeight={{ base: "bold" }}
          fontSize={["16px", "18px"]}
        >
          {formatNumDynDecimal(i.number)} {i.denom}
        </Box>
      </Flex>
    </>
  ));
}
