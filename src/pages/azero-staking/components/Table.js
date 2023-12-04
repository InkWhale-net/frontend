import { Alert, AlertIcon, Stack } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";

export default function StakingTable({ tableBody, cb }) {
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
      label: "Amount",
    },
  ];

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
      <IWTable {...tableData} mode="AZERO_STAKING" isDisableRowClick cb={cb} />
      <Alert status="warning">
        <AlertIcon />
        Note: 5 INW will be charged and burned for each claim!{" "}
      </Alert>
    </Stack>
  );
}

export function ClaimRewardsTable({ tableBody }) {
  const tableHeader = [
    {
      name: "shortTxId",
      hasTooltip: false,
      tooltipContent: "",
      label: "TX Id",
    },
    {
      name: "interestAccount",
      hasTooltip: true,
      tooltipContent: `Request Status tooltip`,
      label: "Interest Account",
    },
    {
      name: "masterAccount",
      hasTooltip: false,
      tooltipContent: "",
      label: "Master Account",
    },
    {
      name: "claimedTime",
      hasTooltip: false,
      tooltipContent: ``,
      label: "Time ",
    },
  ];

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
      <IWTable {...tableData} isDisableRowClick />
    </Stack>
  );
}
