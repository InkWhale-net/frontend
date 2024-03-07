import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import SaleTab from "components/tabs/SaleTab";
import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import SwapTab from "./swap";
import IWTabs from "components/tabs/IWTabs";
import BridgeTab from "./bridge";
const BridgePage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const amountRef = useRef(null);
  const tabsData = [
    {
      label: <>Swap</>,
      component: <SwapTab amountRef={amountRef} />,
      isDisabled: false,
    },
    {
      label: <>Bridge</>,
      component: <BridgeTab amountRef={amountRef} />,
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
