import { APICall } from "api/client";
import { useEffect, useState } from "react";
import { formatTokenAmount } from "utils";

export function useBridgeHistory() {
  const [txHistory, setTxHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    APICall.getTransactionOfBridge()
      .then((res) => {
        const historyWithTransformedData = res.map((e) => ({
          ...e,
          id: e?.transactionId,
          from: "AlephZero Testnet",
          to: "5ire Testnet",
          amount: formatTokenAmount(e?.amount, 12),
          account: e?.trader,
          bridgeStatus: e?.status,
        }));
        setTxHistory(historyWithTransformedData);
        setIsLoading(false);
      })
      .catch((error) => {
        setTxHistory([]);
        setIsLoading(false);
        setError(error);
      });
  }, []);

  return {
    data: txHistory,
    isLoading,
    error,
  };
}
