import { Box, Stack } from "@chakra-ui/react";
import SaleCard from "./SaleCard";

const TabLayout = ({ children }) => {
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
        <SaleCard />
        {/* <StatusCard /> */}
      </Box>
    </Stack>
  );
};

export default TabLayout;
