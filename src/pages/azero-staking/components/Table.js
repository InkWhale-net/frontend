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
      hasTooltip: false,
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
      <Alert status="warning">
        <AlertIcon />
        Note: A fee of 5 INW will be charged and burned for each claim.{" "}
      </Alert>
      <IWTable {...tableData} mode="AZERO_STAKING" isDisableRowClick cb={cb} />
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

export function TxHistoryTable({ tableBody }) {

  const tableHeader = [
    {
      name: "requestUserAddress",
      hasTooltip: false,
      tooltipContent: `Request Status tooltip`,
      label: "Account",
    },
    {
      name: "requestId",
      hasTooltip: true,
      tooltipContent: "Withdrawal Request Id",
      label: "Id",
    },

    {
      name: "azeroAmount",
      hasTooltip: false,
      tooltipContent: "",
      label: "Amount",
    },
    {
      name: "stakeStatus",
      hasTooltip: false,
      tooltipContent: "",
      label: "Status",
    },
    {
      name: "dateTime",
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
      spacing="24px"
      alignItems="start"
      direction={{ base: "column" }}
    >
      <IWTable {...tableData} isDisableRowClick />
    </Stack>
  );
}
