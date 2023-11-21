import IWTabs from "components/tabs/IWTabs";
import React, {  } from "react";
import SaleInfoTab from "./components/SaleInfoTab";
import SectionContainer from "components/container/SectionContainer";
import Launchpad from "./components/Launchpad";
import AzeroStakingAdmin from "./components/AzeroStakingAdmin";

export default function AdminPage() {
  const tabsData = [
    {
      label: <>Sale Info</>,
      component: <SaleInfoTab />,
      isDisabled: false,
    },
    {
      label: <>Launchpad</>,
      component: <Launchpad />,
      isDisabled: false,
    },
    {
      label: <>Azero Staking</>,
      component: <AzeroStakingAdmin />,
      isDisabled: false,
    },
  ];

  return (
    <SectionContainer mt={{ base: "0px", xl: "20px" }}>
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
}
