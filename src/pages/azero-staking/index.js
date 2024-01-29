import SectionContainer from "components/container/SectionContainer";

import { Fragment, useCallback, useEffect, useState } from "react";
import Staking from "./Staking";

import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  SimpleGrid,
  Stack,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import { getApy, getInwMultiplier, getTotalAzeroStaked, getTotalStakers } from "api/azero-staking/azero-staking";
import { APICall } from "api/client";
import IWCard from "components/card/Card";
import IWPaginationTable from "components/table/IWPaginationTable";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatChainStringToNumber, formatNumDynDecimal } from "utils";
import StakingTabs from "./components/Tab";

function AzeroStaking() {
  const { api } = useAppContext();

  const [apy, setApy] = useState(0);
  const [inwMultiplier, setInwMultiplier] = useState(null);
  const [isBigScreen] = useMediaQuery("(min-width: 480px)");

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
      label: isBigScreen ? "My Transaction" : "My TX",
      component: <MyTransactionHistory />,
      isDisabled: false,
    },
    {
      label: isBigScreen ? "Transaction History" : "TX History",
      component: <TransactionHistory />,
      isDisabled: false,
    },
  ];

  const inwApy = parseFloat(inwMultiplier) * 365 * 0.006 * 100;
  const totalApy = parseFloat(inwApy) + parseFloat(apy);

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title={`${appChain?.unit} Staking`}
      description={`Stake ${appChain?.unit} to earn ${formatNumDynDecimal(
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
                <Flex>{appChain?.unit} Rewards APY</Flex>
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
      denom: appChain?.unit,
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
  const [resultTotalPage, setResultTotalPage] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const fetchAll = useCallback(
    async (isMounted) => {
      try {
        setLoading(true);

        const { ret } = await APICall.getEventData({
          type: [0, 1, 2, 3, 4],
          limit: 9999,
          offset: 0,
        });

        setResultTotalPage(Math.ceil(ret?.length / pagination?.pageSize));

        const { ret: txHistory } = await APICall.getEventData({
          type: [0, 1, 2, 3, 4],
          limit: pagination.pageSize,
          offset: pagination.pageSize * pagination.pageIndex,
        });
        console.log("txHistory", txHistory);

        const txHistoryFormatted = txHistory?.map((i) => ({
          ...i,
          requestId: i.type === 0 || i.type === 4 ? "-" : i.data?.requestId,
          requestUserAddress: i.user,
          stakeStatus:
            i.type === 0
              ? "Staked"
              : i.type === 1
                ? "Requested Unstake"
                : i.type === 2
                  ? "Cancelled"
                  : i.type === 3
                    ? "Unstaked"
                    : i.type === 4
                      ? "Claimed Rewards"
                      : "",
          azeroAmount:
            formatChainStringToNumber(i.data?.amount ?? i.data?.azeroAmount) /
            Math.pow(10, 12),
          dateTime: new Date(
            formatChainStringToNumber(i.time) * 1
          ).toLocaleString(),
        }));

        txHistoryFormatted?.sort((a, b) => {
          return b.blockNumber - a.blockNumber;
        });

        if (!isMounted) return;

        setTxHistory(txHistoryFormatted);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("error", error);
        toast.error("error", error);
      }
    },
    [pagination.pageIndex, pagination.pageSize]
  );

  useEffect(() => {
    let isMounted = true;

    fetchAll(isMounted);

    return () => (isMounted = false);
  }, [fetchAll]);

  return (
    <IWPaginationTable
      tableBody={txHistory}
      tableHeader={tableHeader}
      pagination={pagination}
      setPagination={setPagination}
      totalData={resultTotalPage}
      fontSize="16px"
      mode="TX_HISTORY"
    />
  );
}

const tableHeader = [
  {
    accessorKey: "requestUserAddress",
    header: "Account",
  },
  {
    accessorKey: "requestId",
    header: "Id",
  },

  {
    accessorKey: "azeroAmount",
    header: "Amount",
  },
  {
    accessorKey: "stakeStatus",
    header: "Status",
  },
  {
    accessorKey: "dateTime",
    header: "Time ",
  },
];

function MyTransactionHistory() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [loading, setLoading] = useState(true);
  const [txHistory, setTxHistory] = useState([]);
  const [resultTotalPage, setResultTotalPage] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const fetchAll = useCallback(
    async (isMounted) => {
      try {
        setLoading(true);

        const { ret } = await APICall.getMyEventData({
          user: currentAccount?.address,
          type: [0, 1, 2, 3, 4],
          limit: 9999,
          offset: 0,
        });

        setResultTotalPage(Math.ceil(ret?.length / pagination?.pageSize));

        const { ret: txHistory } = await APICall.getMyEventData({
          user: currentAccount?.address,
          type: [0, 1, 2, 3, 4],
          limit: pagination.pageSize,
          offset: pagination.pageSize * pagination.pageIndex,
        });
        console.log("txHistory", txHistory);

        const txHistoryFormatted = txHistory?.map((i) => ({
          ...i,
          requestId: i.type === 0 || i.type === 4 ? "-" : i.data?.requestId,
          requestUserAddress: i.user,
          stakeStatus:
            i.type === 0
              ? "Staked"
              : i.type === 1
                ? "Requested Unstake"
                : i.type === 2
                  ? "Cancelled"
                  : i.type === 3
                    ? "Unstaked"
                    : i.type === 4
                      ? "Claimed Rewards"
                      : "",
          azeroAmount:
            formatChainStringToNumber(i.data?.amount ?? i.data?.azeroAmount) /
            Math.pow(10, 12),
          dateTime: new Date(
            formatChainStringToNumber(i.time) * 1
          ).toLocaleString(),
        }));

        txHistoryFormatted?.sort((a, b) => {
          return b.blockNumber - a.blockNumber;
        });

        if (!isMounted) return;

        setTxHistory(txHistoryFormatted);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("error", error);
        toast.error("error", error);
      }
    },
    [currentAccount?.address, pagination.pageIndex, pagination.pageSize]
  );

  useEffect(() => {
    let isMounted = true;

    fetchAll(isMounted);

    return () => (isMounted = false);
  }, [fetchAll]);

  return (
    <IWPaginationTable
      tableBody={txHistory}
      tableHeader={tableHeader}
      pagination={pagination}
      setPagination={setPagination}
      totalData={resultTotalPage}
      fontSize="16px"
      mode="TX_HISTORY"
    />
  );
}
