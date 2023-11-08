import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";

export default function StakingTable({ tableBody, cb }) {
  const tableData = {
    tableHeader,
    tableBody,
  };

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column" }}
    >
      <IWTable
        {...tableData}
        mode="AZERO_STAKING"
        isDisableRowClick
        cb={cb}
      />
      <Alert status="warning">
        <AlertIcon />
        Note: 5 $INW will be charged and burned for each claim!{" "}
      </Alert>
    </Stack>
  );
}

const tableHeader = [
  {
    name: "requestIndex",
    hasTooltip: false,
    tooltipContent: "",
    label: "Id",
  },
  {
    name: "requestStatus",
    hasTooltip: true,
    tooltipContent: `Request Status tooltip`,
    label: "Status",
  },
  {
    name: "withdrawalAmount",
    hasTooltip: false,
    tooltipContent: "",
    label: "Withdrawal Amount",
  },
  {
    name: "azeroReward",
    hasTooltip: false,
    tooltipContent: ``,
    label: "Rewards",
  },
];
