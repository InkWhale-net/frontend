import { Alert, AlertIcon, Box, Button, Flex, Text } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";
import { useBridgeHistory } from "./useBridgeHistory";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";

export function BridgeHistoryTable() {
  const { data: txHistory, isLoading, error, refetch } = useBridgeHistory();

  useEffect(() => {
    const Id = setInterval(() => refetch(true), 3000);

    return () => clearInterval(Id);
  }, [refetch]);

  if (error) {
    return (
      <Box mt="24px">
        <Alert status="error">
          <AlertIcon />
          Error: {error?.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box my="24px" w="full">
      <Flex justify="center" w="full">
        <Text my="16px" fontWeight={700} fontSize={24} color="#57527e">
          History
        </Text>
      </Flex>

      <Flex justify="center" w="full">
        {isLoading ? (
          <ClipLoader color="#57527E" loading size={18} speedMultiplier={1.5} />
        ) : txHistory.length ? (
          <IWTable
            tableHeader={tableHeader}
            tableBody={txHistory}
            isDisableRowClick={true}
          />
        ) : (
          <Text>No history found.</Text>
        )}
      </Flex>
    </Box>
  );
}

const tableHeader = [
  {
    name: "id",
    hasTooltip: false,
    tooltipContent: "",
    label: "ID",
  },
  {
    name: "bridgeStatus",
    hasTooltip: false,
    tooltipContent: "",
    label: "Status",
  },
  {
    name: "account",
    hasTooltip: false,
    tooltipContent: "",
    label: "Trader",
  },
  {
    name: "fromChain",
    hasTooltip: false,
    tooltipContent: "",
    label: "From",
  },
  {
    name: "toChain",
    hasTooltip: false,
    tooltipContent: "",
    label: "To",
  },
  {
    name: "inwAmount",
    hasTooltip: false,
    tooltipContent: "",
    label: "Amount",
  },
  {
    name: "blockTime",
    hasTooltip: false,
    tooltipContent: "",
    label: "Block Time",
  },
];
