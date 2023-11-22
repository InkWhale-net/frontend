import SectionContainer from "components/container/SectionContainer";

import React, { useEffect, useState } from "react";
import Staking from "./Staking";
import Claim from "./Claim";
import Request from "./Request";
import StakingTabs from "./components/Tab";
import { useMediaQuery } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { getApy } from "api/azero-staking/azero-staking";

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

  const [isBigScrn] = useMediaQuery("(min-width: 480px)");

  const tabsData = [
    {
      label: isBigScrn ? "Stake Azero" : "Stake",
      component: <Staking />,
      isDisabled: false,
    },
    {
      label: isBigScrn ? "Withdrawal Request" : "Withdraw",
      component: <Request />,
      isDisabled: false,
    },
    {
      label: "Claim",
      component: <Claim />,
      isDisabled: false,
    },
  ];

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Azero Staking"
      description={`Stake AZERO to earn ${apy}% APY and 48 hours unstaking.`}
    >
      <StakingTabs tabsData={tabsData} />
    </SectionContainer>
  );
}

export default AzeroStaking;
