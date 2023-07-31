import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";

const TokenInformation = ({ launchpadContract, launchpadData }) => {
  const { projectInfor, token } = launchpadData?.projectInfo;
  const mainTableHeader = [
    {
      label: "Token Name",
      header: "tokenName",
    },
    {
      label: "Token Symbol",
      header: "tokenSymbol",
    },
    {
      label: "Token Decimal",
      header: "tokenDecimal",
    },
    {
      label: "Token Address",
      header: "tokenContract",
    },
    {
      label: "Token total supply",
      header: "totalSupply",
    },
  ];
  const mainTabData = useMemo(() => {
    return {
      tokenName: token?.name,
      tokenSymbol: token?.symbol,
      tokenDecimal: token?.decimals,
      tokenContract: token?.tokenAddress,
      totalSupply: roundUp(token?.totalSupply?.replaceAll(",", "")),
    };
  }, [launchpadContract, launchpadData]);
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <Box w={{ base: "full" }} paddingTop={{ base: "4px" }}>
        <Divider sx={{ marginBottom: "16px" }} />
        {mainTableHeader.map((e, index) => {
          console.log(mainTabData);
          return (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Text>{e?.label}</Text>
                <Text>{formatDataCellTable(mainTabData, e?.header)}</Text>
              </Box>
              <Divider sx={{ marginBottom: "8px", marginTop: "8px" }} />
            </>
          );
        })}
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

export default TokenInformation;
