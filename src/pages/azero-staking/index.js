import SectionContainer from "components/container/SectionContainer";

import React from "react";
import Staking from "./Staking";
import Claim from "./Claim";
import Request from "./Request";
import StakingTabs from "./components/Tab";
import { useMediaQuery } from "@chakra-ui/react";

function AzeroStaking() {
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
      label: isBigScrn ? "Claim Rewards" : "Claim",
      component: <Claim />,
      isDisabled: false,
    },
  ];

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Azero Staking"
      description="Stake AZERO to earn 7% APY and 48 hours unstaking."
    >
      <StakingTabs tabsData={tabsData} />
    </SectionContainer>
  );
}

export default AzeroStaking;
