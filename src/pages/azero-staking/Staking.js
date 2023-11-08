import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Tooltip } from "@chakra-ui/react";
import { getStakeInfo } from "api/azero-staking/azero-staking";
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
import { useSelector } from "react-redux";
import { delay } from "utils";
import { formatChainStringToNumber } from "utils";

function Staking() {
  const { api } = useAppContext();

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
      fetchData();
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

  return (
    <>
      <IWCard w="full" variant="solid">
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
          <FooterInfo info={footerInfo} />
        </Stack>
      </IWCard>

      <IWCard w="full" variant="outline" title={`Statistics`} mt="18px">
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
    </>
  );
}

export default Staking;

function FooterInfo({ info }) {
  const formatInfo = [
    {
      title: "Min staking amount",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Max total staking amount",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Staked amount",
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
        direction={["column", "row"]}
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
          {i.number} {i.denom}
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
      title: "Total Staked (Included pending withdrawal)",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: true,
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
        direction={["column", "row"]}
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
          {i.number} {i.denom}
        </Box>
      </Flex>
    </>
  ));
}
