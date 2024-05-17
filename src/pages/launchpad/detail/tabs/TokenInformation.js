import { Box, Divider, Text } from "@chakra-ui/react";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import TabLayout from "../Layout";

const TokenInformation = ({ launchpadContract, launchpadData }) => {
  const { token } = launchpadData?.projectInfo || {};
  const mainTableHeader = [
    {
      label: "Name",
      header: "tokenName",
    },
    {
      label: "Symbol",
      header: "tokenSymbol",
    },
    {
      label: "Decimal",
      header: "tokenDecimal",
    },
    {
      label: "Address",
      header: "tokenContract",
    },
    {
      label: "Total supply",
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
  }, [
    token?.decimals,
    token?.name,
    token?.symbol,
    token?.tokenAddress,
    token?.totalSupply,
  ]);
  return (
    <>
      {mainTableHeader.map((e, index) => {
        return (
          <Box key={`token-${index}`}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Text>{e?.label}</Text>
              <Text>{formatDataCellTable(mainTabData, e?.header)}</Text>
            </Box>
            <Divider sx={{ marginBottom: "8px", marginTop: "8px" }} />
          </Box>
        );
      })}
    </>
  );
};

export default TokenInformation;
