import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading, Stack, Tooltip } from "@chakra-ui/react";
import { getStakeInfo } from "api/azero-staking/azero-staking";
import { doWithdrawRequest } from "api/azero-staking/azero-staking";
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

import { getWithdrawalRequestListByUser } from "api/azero-staking/azero-staking";
import { MaxStakeButton } from "pages/pools/detail/MaxStakeButton";
import { stakeStatus } from "constants";

function Staking() {
  const { api } = useAppContext();
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const [amount, setAmount] = useState("");

  const azeroBalance = useMemo(() => {
    const azeroBal = formatChainStringToNumber(currentAccount?.balance?.azero);
    return Number(azeroBal);
  }, [currentAccount?.balance?.azero]);

  const [myStaked, setMyStaked] = useState(0);
  const [maxUnstaking, setMaxUnstaking] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const stakeInfo = await getStakeInfo(api, currentAccount).then((res) => {
        if (!res) return 0;

        const stakingAmount =
          formatChainStringToNumber(res?.stakingAmount) / Math.pow(10, 12);
        const withdrawalRequestAmount =
          formatChainStringToNumber(res?.withdrawalRequestAmount) /
          Math.pow(10, 12);
        return {
          stakingAmount: stakingAmount?.toFixed(4) ?? 0,
          maxUnstakingAmount: stakingAmount - withdrawalRequestAmount,
        };
      });

      setMyStaked(stakeInfo?.stakingAmount);
      setMaxUnstaking(stakeInfo?.maxUnstakingAmount);
    };

    api && fetch();
  }, [api, currentAccount]);

  async function handleStake() {
    if (footerInfo && Number(footerInfo[0]) > Number(amount)) {
      toast.error(`Min AZERO stake is ${footerInfo && footerInfo[0]} AZERO`);
      return;
    }

    if (maxStakingCalc < amount) {
      toast.error(`Max AZERO stake is ${maxStakingCalc} AZERO`);
      return;
    }

    if (azeroBalance < amount) {
      toast.error("Not enough AZERO balance!");
      return;
    }

    if (azeroBalance < 0.25) {
      toast.error("Low AZERO balance!");
      return;
    }

    if (
      footerInfo &&
      footerInfo[1] - parseInt(myStaked) - 0.25 < amount &&
      !!parseInt(myStaked)
    ) {
      toast.error(
        `Max stake amount is ${formatNumDynDecimal(
          footerInfo && footerInfo[1] - parseInt(myStaked) - 0.25
        )} AZERO`
      );
      return;
    }

    try {
      await doStakeAzero(api, currentAccount, amount);

      delay(1000).then(() => {
        fetchData(true);
        dispatch(fetchUserBalance({ currentAccount, api }));
        fetchUserRequestList();
        setAmount("");
      });
    } catch (error) {
      console.log("error", error);
      toast.error("error", error);
    }
  }
  const [footerInfo, setFooterInfo] = useState(null);

  const fetchData = useCallback(
    async (isMounted) => {
      if (!api) return;

      const minStakingAmount = await getMinStakingAmount(api);
      const maxTotalStakingAmount = await getMaxTotalStakingAmount(api);
      const stakeInfo = await getStakeInfo(api, currentAccount).then((res) => {
        if (!res) return 0;

        const stakingAmount =
          formatChainStringToNumber(res?.stakingAmount) / Math.pow(10, 12);
        return stakingAmount ?? 0;
      });
      Promise.all([minStakingAmount, maxTotalStakingAmount, stakeInfo]).then(
        (resultArr) => {
          if (!isMounted) return;
          setFooterInfo(resultArr);
        }
      );
    },
    [api, currentAccount]
  );

  useEffect(() => {
    let isMounted = true;

    fetchData(isMounted);

    return () => (isMounted = false);
  }, [api, currentAccount, fetchData]);

  // ================

  async function handleRequestUnstake() {
    if (azeroBalance < 0.25) {
      toast.error("Low AZERO balance!");
      return;
    }

    if (footerInfo && Number(footerInfo[0]) > Number(amount)) {
      toast.error(`Min AZERO unstake is ${footerInfo && footerInfo[0]} AZERO`);
      return;
    }

    if (maxUnstaking < amount) {
      toast.error(`Max AZERO unstake is ${maxUnstaking} AZERO`);
      return;
    }

    if (maxUnstaking < amount) {
      toast.error("Not enough AZERO unstake!");
      return;
    }

    try {
      await doWithdrawRequest(api, currentAccount, amount);

      delay(1000).then(() => {
        fetchData(true);
        dispatch(fetchUserBalance({ currentAccount, api }));
        fetchUserRequestList();
        setAmount("");
      });
    } catch (error) {
      console.log("error", error);
      toast.error("error", error);
    }
  }

  const [userRequestList, setUserRequestList] = useState([]);

  const fetchUserRequestList = useCallback(async () => {
    const requestedList = await getWithdrawalRequestListByUser(
      api,
      currentAccount
    );

    if (requestedList?.length) {
      let formattedRequestedList = requestedList.map((i) => {
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

      formattedRequestedList.sort((a, b) => {
        return (
          formatChainStringToNumber(b?.requestIndex) -
          formatChainStringToNumber(a?.requestIndex)
        );
      });

      setUserRequestList(formattedRequestedList);
    } else {
      setUserRequestList([]);
    }
  }, [api, currentAccount]);

  useEffect(() => {
    api && fetchUserRequestList();
  }, [api, fetchUserRequestList]);

  async function handleCallback() {
    delay(1000).then(() => {
      fetchUserRequestList();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  const maxStakingCalc =
    azeroBalance - 0.25 <= 0
      ? 0
      : Math.min(
          azeroBalance - 0.25,
          footerInfo && footerInfo[1] - footerInfo[2]
        );

  return (
    <>
      <IWCard w="full" variant="solid" mb="24px">
        <Stack
          mb="16px"
          w="100%"
          spacing="16px"
          direction={["column", "column", "row"]}
        >
          <IWInput
            type="number"
            placeholder="0"
            value={amount}
            onChange={({ target }) => setAmount(target.value)}
            inputRightElementIcon={
              <MaxStakeButton
                disabled={!currentAccount?.address}
                setStakeMax={() => {
                  setAmount(maxStakingCalc);
                }}
                setUnstakeMax={() => setAmount(maxUnstaking)}
              />
            }
          />

          <Button
            w={["full", "full", "full", "45%"]}
            onClick={() => handleStake()}
            isDisabled={!currentAccount?.address || !azeroBalance || !amount}
          >
            {currentAccount?.address ? "Stake" : "Connect Wallet"}
          </Button>

          <Button
            w={["full", "full", "full", "45%"]}
            onClick={() => handleRequestUnstake()}
            isDisabled={
              !currentAccount?.address ||
              (footerInfo && !footerInfo[2]) ||
              !amount
            }
          >
            {currentAccount?.address ? "Request Unstake" : "Connect Wallet"}
          </Button>
        </Stack>

        <FooterInfo info={footerInfo} />
      </IWCard>

      <Heading as="h3" size="h3" mb="16px">
        My Unstake History
      </Heading>

      <StakingTable tableBody={userRequestList} cb={handleCallback} />
    </>
  );
}

export default Staking;

function FooterInfo({ info }) {
  const formatInfo = [
    {
      title: "Min staking",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    // {
    //   title: 'Max total staking',
    //   number: info && info[1],
    //   denom: 'AZERO',
    //   hasTooltip: false,
    //   tooltipContent: 'Content of tooltip ',
    // },
    {
      title: "Remain total staking",
      number: info && info[1] - info[2],
      denom: "AZERO",
      hasTooltip: false,
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

export function getRequestStatus(status) {
  switch (parseInt(status)) {
    case 0:
      return stakeStatus.PENDING;
    case 1:
      return stakeStatus.READY;
    case 2:
      return stakeStatus.UNSTAKED;
    case 3:
      return stakeStatus.CANCELLED;
    default:
      return "n/a";
  }
}
// pub status: u8 // 0: waiting, 1: is Ready to unstake, 2: unstaked
