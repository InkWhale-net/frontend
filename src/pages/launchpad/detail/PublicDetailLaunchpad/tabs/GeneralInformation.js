import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";

const GeneralInformation = ({ launchpadContract, launchpadData }) => {
  const { phase, projectInfor, roadmap, team, token, totalSupply } =
    launchpadData?.projectInfo;
  const mainTableHeader = [
    {
      label: "Launchpad contract",
      header: "contractAddress",
    },
    {
      label: "Description",
      header: "description",
    },
    {
      label: "Token total supply",
      header: "totalSupply",
    },

    {
      label: "Presale Start Time",
      header: "presaleStartTime",
    },
    {
      label: "Presale End Time",
      header: "presaleEndTime",
    },
  ];
  const mainTabData = useMemo(() => {
    return {
      contractAddress: launchpadContract,
      tokenSymbol: token?.symbol,
      description: projectInfor?.description,
      totalSupply: roundUp(totalSupply?.replaceAll(",", "")),
      presaleStartTime: format(
        projectInfor.startTime,
        "MMMM Do YYYY, h:mm:ss a"
      ),
      presaleEndTime: format(projectInfor.endTime, "MMMM Do YYYY, h:mm:ss a"),
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

export default GeneralInformation;
