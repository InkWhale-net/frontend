import { Alert, AlertIcon, Box, Flex, Text } from "@chakra-ui/react";
import { IWTable } from "components/table/IWTable";
import { useBridgeHistory } from "./useBridgeHistory";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { delay } from "utils";

const wss1Url = process.env.REACT_APP_WSS1_URL;
const wss2Url = process.env.REACT_APP_WSS2_URL;
const wss3Url = process.env.REACT_APP_WSS3_URL;
const wss4Url = process.env.REACT_APP_WSS4_URL;
const wss5Url = process.env.REACT_APP_WSS5_URL;
const wss6Url = process.env.REACT_APP_WSS6_URL;
const wss7Url = process.env.REACT_APP_WSS7_URL;
const wss8Url = process.env.REACT_APP_WSS8_URL;
const wss9Url = process.env.REACT_APP_WSS9_URL;
const wss10Url = process.env.REACT_APP_WSS10_URL;

export function BridgeHistoryTable() {
  const { data: txHistory, isLoading, error, refetch } = useBridgeHistory();

  const {} = useWebSocket(wss1Url, {
    onOpen: () => console.log(`connected websocket ${wss1Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 1");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss1Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss1Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss2Url, {
    onOpen: () => console.log(`connected websocket ${wss2Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 2");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss2Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss2Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss3Url, {
    onOpen: () => console.log(`connected websocket ${wss3Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 3");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss3Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss3Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss4Url, {
    onOpen: () => console.log(`connected websocket ${wss4Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 4");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss4Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss4Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss5Url, {
    onOpen: () => console.log(`connected websocket ${wss5Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 5");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss5Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss5Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss6Url, {
    onOpen: () => console.log(`connected websocket ${wss6Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 6");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss6Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss6Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss7Url, {
    onOpen: () => console.log(`connected websocket ${wss7Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 7");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss7Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss7Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss8Url, {
    onOpen: () => console.log(`connected websocket ${wss8Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 8");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss8Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss8Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss9Url, {
    onOpen: () => console.log(`connected websocket ${wss9Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 9");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss9Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss9Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });
  const {} = useWebSocket(wss10Url, {
    onOpen: () => console.log(`connected websocket ${wss10Url}`),
    onMessage: (event) => {
      const message = JSON.parse(event?.data);
      console.log({ message });
      if (
        message?.event == "added Transactions" ||
        message?.event == "updated Transactions"
      ) {
        console.log("start refetch 10");
        refetch(true);
      }
    },
    onClose: () => console.log(`disconnected websocket ${wss10Url}`),
    onError: (error) => {
      console.log(`Error from websocket ${wss10Url}`);
      console.log(error);
    },
    shouldReconnect: (closeEvent) => true,
  });

  // useEffect(() => {
  //   const Id = setInterval(() => refetch(true), 3000);

  //   return () => clearInterval(Id);
  // }, [refetch]);

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
    name: "accountReceiver",
    hasTooltip: false,
    tooltipContent: "",
    label: "Receiver",
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
