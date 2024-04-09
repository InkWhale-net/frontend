import { APICall } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import { getTimestamp } from "utils";
import { formatTokenAmount } from "utils";
import { getTimestampFirechain } from "utils/contracts/firechain";

export function useBridgeHistory() {
  const [txHistory, setTxHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { api } = useAppContext();

  const fetchData = useCallback(
    async (isMounted) => {
      try {
        let tx = await APICall.getTransactionOfBridge({
          page: 1,
          limit: 9999,
        });

        const ret = await Promise.all(
          tx.map(async (e) => {
            const blockTime =
              parseInt(e.from) === 1
                ? await getTimestamp(api, e?.blockNumber)
                : await getTimestampFirechain(e?.blockNumber);

            return {
              id: e?.transactionId,
              fromChain: e.from,
              toChain: e.to,
              inwAmount: formatTokenAmount(
                e?.amount,
                parseInt(e.from) === 1 ? 12 : 18
              ),
              account: e?.trader,
              accountReceiver: e?.receiver,
              bridgeStatus: e?.status,
              blockTime,
            };
          })
        );

        if (!isMounted) {
          return;
        }

        setTxHistory((prev) => {
          return prev[0]?.bridgeStatus === ret[0]?.bridgeStatus &&
            prev?.length === ret?.length
            ? prev
            : ret;
        });
        setIsLoading(false);
      } catch (error) {
        setTxHistory([]);
        setIsLoading(false);
        setError(error);
      }
    },
    [api]
  );

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    api && fetchData(isMounted);

    return () => (isMounted = false);
  }, [api, fetchData]);

  return {
    data: txHistory,
    isLoading,
    error,
    refetch: fetchData,
  };
}
