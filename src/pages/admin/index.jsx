import IWTabs from "components/tabs/IWTabs";
import React, { useState, useEffect } from "react";
import SaleInfoTab from "./components/SaleInfoTab";
import SectionContainer from "components/container/SectionContainer";

export default function AdminPage() {
  const tabsData = [
    {
      label: <>Sale Info</>,
      component: <SaleInfoTab />,
      isDisabled: false,
    },
  ];

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
    >
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
}
