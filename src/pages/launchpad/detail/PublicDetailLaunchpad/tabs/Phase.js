import {
  Box,
  CircularProgress,
  Divider,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";

const PhaseInformation = ({ launchpadContract, launchpadData }) => {
  const { phaseList } = launchpadData || {};

  console.log(phaseList);

  return (
    <TabLayout>
      <div style={{}}></div>
      {/* <CircularProgress
        alignSelf={"center"}
        isIndeterminate
        size={"40px"}
        color="#93F0F5"
      /> */}
    </TabLayout>
  );
};

export default PhaseInformation;
