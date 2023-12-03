import SectionContainer from "components/container/SectionContainer";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import Staking from "./Staking";

import StakingTabs from "./components/Tab";
import { Box, Flex, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { getApy } from "api/azero-staking/azero-staking";
import { useSelector } from "react-redux";
import { getTotalAzeroStaked } from "api/azero-staking/azero-staking";
import { getTotalStakers } from "api/azero-staking/azero-staking";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { formatNumDynDecimal } from "utils";
import IWCard from "components/card/Card";

function AzeroStaking() {
  const { api } = useAppContext();

  const [apy, setApy] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!api) return;

      const apy = await getApy(api).then((res) => parseInt(res)?.toFixed(2));
      setApy(apy);
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
      component: <>Transaction History</>,
      isDisabled: false,
    },
    // {
    //   label: "Claim",
    //   component: <Claim />,
    //   isDisabled: false,
    // },
  ];

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Azero Staking"
      description={`Stake AZERO to earn ${apy}% APY and 48 hours unstaking.`}
    >
      <StatsInfo />
      <StakingTabs tabsData={tabsData} />
    </SectionContainer>
  );
}

export default AzeroStaking;

function StatsInfo() {
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
      number: info && info[0],
      denom: "%",
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
                  {formatNumDynDecimal(i.number)} {i.denom}
                </Box>
              </Flex>
            </IWCard>
          </Fragment>
        ))}
      </SimpleGrid>
    </IWCard>
  );
}
