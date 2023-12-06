import { Stack } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";

export default function RequestListTable({ tableBody }) {
  const tableHeader = [
    {
      name: "requestIndex",
      hasTooltip: false,
      tooltipContent: "",
      label: "Index",
    },
    {
      name: "requestUserAddress",
      hasTooltip: true,
      tooltipContent: `User Address`,
      label: "User Address",
    },
    {
      name: "azeroAmount",
      hasTooltip: false,
      tooltipContent: "",
      label: "Amount",
    },
    {
      name: "dateTime",
      hasTooltip: false,
      tooltipContent: ``,
      label: "Request Time ",
    },
    {
      name: "requestStatus",
      hasTooltip: false,
      tooltipContent: ``,
      label: "Status ",
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
