import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
// import { useState } from "react";

export default function IWTabs({ tabsData, onChangeTab, ...rest }) {
  // const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      onChange={onChangeTab}
      isLazy
      w="full"
    >
      <TabList>
        {tabsData?.map(({ label }, idx) => (
          <Tab
            px="0"
            mr="20px"
            key={idx}
            justifyContent="start"
            _focus={{ borderWidth: "0px" }}
            minW={{ base: "fit-content", lg: "250px" }}
          >
            <Heading as="h3" size="h3">
              {label}
            </Heading>
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabsData?.map(({ component }, idx) => (
          <TabPanel key={idx}>{component}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
