import SectionContainer from "components/container/SectionContainer";
import { useRef } from "react";
import SwapTab from "./swap";
import IWTabs from "components/tabs/IWTabs";
import BridgeTab from "./bridge";

const BridgePage = () => {
  const amountRef = useRef(null);
  const tabsData = [
    {
      label: <>Bridge</>,
      component: <BridgeTab amountRef={amountRef} />,
      isDisabled: false,
    },
    {
      label: <>Swap</>,
      component: <SwapTab amountRef={amountRef} />,
      isDisabled: false,
    },
  ];
  return (
    <SectionContainer mt={{ base: "0px", xl: "8px" }}>
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
};
export default BridgePage;
