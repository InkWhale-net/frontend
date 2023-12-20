import SectionContainer from "components/container/SectionContainer";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import Staking from "./Staking";

import StakingTabs from "./components/Tab";
import { Box, Flex, SimpleGrid, Stack, Tooltip } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { getApy } from "api/azero-staking/azero-staking";
import { useSelector } from "react-redux";
import { getTotalAzeroStaked } from "api/azero-staking/azero-staking";
import { getTotalStakers } from "api/azero-staking/azero-staking";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { formatNumDynDecimal } from "utils";
import IWCard from "components/card/Card";
import { APICall } from "api/client";
import { formatChainStringToNumber } from "utils";
import { TxHistoryTable } from "./components/Table";
import { stakeStatus } from "constants";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { getInwMultiplier } from "api/azero-staking/azero-staking";

function AzeroStaking() {
  const { api } = useAppContext();

  const [apy, setApy] = useState(0);
  const [inwMultiplier, setInwMultiplier] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!api) return;
      // 5 ~ 5% // 500 ~500%

      const apy = await getApy(api).then((res) => parseInt(res)?.toFixed(2));
      setApy(apy);
      const inwMultiplier = await getInwMultiplier();

      // 10 ~ 10 INW/day
      setInwMultiplier(inwMultiplier);
    };
    fetchData();
  }, [api]);

  const tabsData = [
    {
      label: "Stake",
      component: <Staking />,
      isDisabled: false,
    },
    {
      label: "Transaction History",
      component: <TransactionHistory />,
      isDisabled: false,
    },
  ];

  const inwApy = parseFloat(inwMultiplier) * 365 * 0.006 * 100;
  const totalApy = parseFloat(inwApy) + parseFloat(apy);

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Azero Staking"
      description={`Stake AZERO to earn ${formatNumDynDecimal(
        totalApy
      )}% APY and up to 48 hours unstaking.`}
    >
      <StatsInfo totalApy={totalApy} inwApy={inwApy} />
      <StakingTabs tabsData={tabsData} />
    </SectionContainer>
  );
}

export default AzeroStaking;

function StatsInfo({ totalApy, inwApy }) {
  const { api } = useAppContext();

  const { currentAccount } = useSelector((s) => s.wallet);
  const [info, setInfo] = useState(null);

  const fetchData = useCallback(
    async (isMounted) => {
      if (!api) return;

      const apy = await getApy(api);
      const totalAzeroStaked = await getTotalAzeroStaked(api);
      const totalStakers = await getTotalStakers(api).then((res) =>
        parseInt(res)
      );

      Promise.all([apy, totalAzeroStaked, totalStakers]).then((resultArr) => {
        if (!isMounted) return;
        setInfo(resultArr);
      });
    },
    [api]
  );

  useEffect(() => {
    let isMounted = true;

    fetchData(isMounted);

    return () => (isMounted = false);
  }, [api, currentAccount, fetchData]);

  const formattedInfo = [
    {
      title: "APR",
      number: (
        <Tooltip
          label={
            <Stack p="8px">
              <SimpleGrid columns={2}>
                <Flex>AZERO Rewards APY</Flex>
                <Flex justifyContent="right">
                  {formatNumDynDecimal(info && info[0])}%
                </Flex>
              </SimpleGrid>
              <SimpleGrid columns={2}>
                <Flex>INW Rewards APY </Flex>
                <Flex justifyContent="right">
                  {formatNumDynDecimal(inwApy)}%
                </Flex>
              </SimpleGrid>
            </Stack>
          }
          aria-label="A tooltip"
        >
          <Flex>{formatNumDynDecimal(totalApy)} %</Flex>
        </Tooltip>
      ),
      denom: "",
      hasTooltip: true,
      tooltipContent: "Annual Percentage Rate",
    },
    {
      title: "TVL",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Total Staked (incl. pending withdrawal)",
    },
    {
      title: "Stakers",
      number: info && info[2],
      denom: "",
      hasTooltip: true,
      tooltipContent: "Total users staked",
    },
  ];

  return (
    <IWCard w="full" variant="outline" mb="40px">
      <SimpleGrid columns={[1, 1, 3]} w="100%" spacing="32px" mb="14px">
        {formattedInfo?.map((i) => (
          <Fragment key={i?.title}>
            <IWCard w="full" variant="solid">
              <Flex
                w="full"
                justify="center"
                alignItems="center"
                direction={["column"]}
              >
                <Flex alignItems="center" fontSize="2xl" mb="18px">
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
                  fontSize={["2xl"]}
                >
                  {i.title === "APR" ? i.number : formatNumDynDecimal(i.number)}{" "}
                  {i.denom}
                </Box>
              </Flex>
            </IWCard>
          </Fragment>
        ))}
      </SimpleGrid>
    </IWCard>
  );
}

function TransactionHistory() {
  const [loading, setLoading] = useState(true);
  const [txHistory, setTxHistory] = useState([]);

  const fetchAll = useCallback(async (isMounted) => {
    try {
      setLoading(true);
      // pendingTxHistory
      const { ret: pendingTxHistory } = await APICall.getEventData({
        type: 0,
        limit: 5,
        offset: 0,
      });
      console.log("pendingTxHistory", pendingTxHistory);

      const pendingTxHistoryFormatted = pendingTxHistory?.map((i) => ({
        ...i,
        requestId: "-",
        requestUserAddress: i.staker,
        stakeStatus: "-",
        azeroAmount: formatChainStringToNumber(i.amount) / Math.pow(10, 12),
        dateTime: new Date(
          formatChainStringToNumber(i.time) * 1
        ).toLocaleString(),
      }));

      // readyTxHistory
      const { ret: readyTxHistory } = await APICall.getEventData({
        type: 1,
        limit: 5,
        offset: 0,
      });
      console.log("readyTxHistory", readyTxHistory);
      const readyTxHistoryFormatted = readyTxHistory?.map((i) => ({
        ...i,
        requestUserAddress: i.user,
        stakeStatus: "Ready",
        azeroAmount: formatChainStringToNumber(i.amount) / Math.pow(10, 12),
        dateTime: new Date(
          formatChainStringToNumber(i.time) * 1
        ).toLocaleString(),
      }));

      // unstakedTxHistory
      const { ret: unstakedTxHistory } = await APICall.getEventData({
        type: 2,
        limit: 5,
        offset: 0,
      });
      console.log("unstakedTxHistory", unstakedTxHistory);
      const unstakedTxHistoryFormatted = unstakedTxHistory?.map((i) => ({
        ...i,
        requestUserAddress: i.user,
        stakeStatus: stakeStatus.UNSTAKED,
        azeroAmount: formatChainStringToNumber(i.amount) / Math.pow(10, 12),
        dateTime: new Date(
          formatChainStringToNumber(i.time) * 1
        ).toLocaleString(),
      }));

      // cancelledTxHistory
      const { ret: cancelledTxHistory } = await APICall.getEventData({
        type: 3,
        limit: 5,
        offset: 0,
      });
      console.log("cancelledTxHistory", cancelledTxHistory);
      const cancelledTxHistoryFormatted = cancelledTxHistory?.map((i) => ({
        ...i,
        requestUserAddress: i.user,
        stakeStatus: stakeStatus.CANCELLED,
        azeroAmount: formatChainStringToNumber(i.amount) / Math.pow(10, 12),
        dateTime: new Date(
          formatChainStringToNumber(i.time) * 1
        ).toLocaleString(),
      }));

      const ret = [
        ...pendingTxHistoryFormatted,
        ...readyTxHistoryFormatted,
        ...unstakedTxHistoryFormatted,
        ...cancelledTxHistoryFormatted,
      ];

      ret.sort((a, b) => {
        return b.blockNumber - a.blockNumber;
      });

      if (!isMounted) return;

      setTxHistory(ret);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toast.error("error", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchAll(isMounted);

    return () => (isMounted = false);
  }, [fetchAll]);

  return loading ? (
    <Flex justify="center" align="center" py="16px">
      <ClipLoader color="#57527E" loading size={36} speedMultiplier={1.5} />
    </Flex>
  ) : (
    <Flex maxW="840px">
      <TxHistoryTable tableBody={txHistory} />
    </Flex>
  );
}
