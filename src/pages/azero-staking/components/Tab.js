import {
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCardOneColumn from "components/card/CardOneColumn";
import { useSelector } from "react-redux";

export default function StakingTabs({ tabsData, onChangeTab, ...rest }) {
  const { currentAccount } = useSelector((s) => s.wallet);

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      {/* Side column */}
      <IWCardOneColumn
        title="My Account"
        data={prepareAccountInfo(currentAccount)}
      />

      <Tabs onChange={onChangeTab} isLazy w="full">
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
            <TabPanel py="18px" key={idx}>
              {component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

function prepareAccountInfo(currentAccount) {
  const { address, balance } = currentAccount || {};

  return [
    {
      title: "Account Address",
      content: !address ? (
        "No account selected"
      ) : (
        <AddressCopier address={address} />
      ),
    },
    {
      title: "Azero Balance",
      content: `${balance?.azero ?? 0} AZERO`,
    },
    {
      title: "INW Balance",
      content: `${balance?.inw ?? 0} INW`,
    },
  ];
}
