import { APICall } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { getTimestamp } from "utils";
import { formatTokenAmount } from "utils";
import { getTimestampFirechain } from "utils/contracts/firechain";

export function useBridgeHistory() {
  const [txHistory, setTxHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { api } = useAppContext();

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const fetchData = async (isMounted) => {
      try {
        let tx = await APICall.getTransactionOfBridge({
          page: 1,
          limit: 9999,
        });

        tx = tx.sort((a, b) => b.blockNumber - a.blockNumber);

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
              bridgeStatus: e?.status,
              blockTime,
            };
          })
        );

        if (!isMounted) {
          return;
        }
        setTxHistory(ret);
        setIsLoading(false);
      } catch (error) {
        setTxHistory([]);
        setIsLoading(false);
        setError(error);
      }
    };

    api && fetchData(isMounted);

    return () => (isMounted = false);
  }, [api]);

  return {
    data: txHistory,
    isLoading,
    error,
  };
}
