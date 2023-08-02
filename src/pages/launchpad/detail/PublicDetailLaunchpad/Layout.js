import { Box, Stack } from "@chakra-ui/react";
import SaleCard from "./SaleCard";
import OwnerZoneCard from "./OwnerZoneCard";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import WhitelistSaleCard from "./WhitelistSaleCard";

const TabLayout = ({ children, ...rest }) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const isLaunchpadOwner = useMemo(
    () => currentAccount?.address === rest?.launchpadData?.owner,

    [currentAccount?.address, rest?.launchpadData?.owner]
  );

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        w={{ base: "full" }}
        paddingTop={{ base: "4px" }}
      >
        {children}
      </Box>
      <Box
        minW={{ base: "full", md: "280px", xl: "370px" }}
        w={{ base: "full", lg: "30%" }}
      >
        <SaleCard {...rest} />
        {/* <StatusCard /> */}
        <WhitelistSaleCard {...rest} />
        {isLaunchpadOwner && <OwnerZoneCard {...rest} />}
      </Box>
    </Stack>
  );
};

export default TabLayout;
