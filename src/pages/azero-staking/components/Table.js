import { Stack } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";

export default function StakingTable() {
  const tableData = {
    tableHeader,
    tableBody: [],
  };

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column" }}
    >
      <IWTable {...tableData} mode="STAKING_POOL" />
    </Stack>
  );
}

const tableHeader = [
  {
    name: "reqiestId",
    hasTooltip: false,
    tooltipContent: "",
    label: "Reqiest Id",
  },
  {
    name: "requestStatus",
    hasTooltip: true,
    tooltipContent: `Request Status tooltip`,
    label: "Request Status",
  },
  {
    name: "withdrawalAmount",
    hasTooltip: false,
    tooltipContent: "",
    label: "Withdrawal Amount",
  },
  {
    name: "rewards",
    hasTooltip: false,
    tooltipContent: ``,
    label: "Rewards",
  },
  {
    name: "action",
    hasTooltip: false,
    tooltipContent: "",
    label: "Action",
  },
];
