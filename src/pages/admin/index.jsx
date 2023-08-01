import IWTabs from "components/tabs/IWTabs";
import React, { useState, useEffect } from "react";
import SaleInfoTab from "./components/SaleInfoTab";
import SectionContainer from "components/container/SectionContainer";
import Launchpad from "./components/Launchpad";

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
  ];

  return (
    <SectionContainer mt={{ base: "0px", xl: "20px" }}>
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
}
