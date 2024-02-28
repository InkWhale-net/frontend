import { APICall } from "api/client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { resolveAZDomainToAddress } from "utils";
import { formatChainStringToNumber } from "utils";

const useSearchWalletAddress = () => {
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [resultTotalPage, setResultTotalPage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const fetchWalletAddress = useCallback(
    async (address) => {
      try {
        setLoading(true);

        const { ret } = await APICall.getMyEventData({
          user: address,
          type: [0, 1, 2, 3, 4],
          offset: 0,
        });

        setResultTotalPage(Math.ceil(ret?.length / pagination?.pageSize));

        const { ret: txHistory } = await APICall.getMyEventData({
          user: address,
          type: [0, 1, 2, 3, 4],
          limit: pagination.pageSize,
          offset: pagination.pageSize * pagination.pageIndex,
        });

        const txHistoryFormatted = txHistory?.map((i) => formatEvent(i));

        txHistoryFormatted?.sort((a, b) => {
          return b.blockNumber - a.blockNumber;
        });

        setSearchResults(txHistoryFormatted);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("error", error);
        toast.error("Fetch Wallet Address Error", error);
      }
    },
    [pagination.pageIndex, pagination.pageSize]
  );

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      const { ret } = await APICall.getEventData({
        type: [0, 1, 2, 3, 4],
        limit: 99999,
        offset: 0,
      });

      setResultTotalPage(Math.ceil(ret?.length / pagination?.pageSize));

      const { ret: txHistory } = await APICall.getEventData({
        type: [0, 1, 2, 3, 4],
        limit: pagination.pageSize,
        offset: pagination.pageSize * pagination.pageIndex,
      });

      const txHistoryFormatted = txHistory?.map((i) => formatEvent(i));

      txHistoryFormatted?.sort((a, b) => {
        return b.blockNumber - a.blockNumber;
      });

      setSearchResults(txHistoryFormatted);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      toast.error("error", error);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery === "") {
        fetchAll();
      } else {
        if (
          searchQuery?.toLowerCase()?.includes(".tzero") ||
          searchQuery?.toLowerCase()?.includes(".azero")
        ) {
          try {
            const address = await resolveAZDomainToAddress(searchQuery);
            console.log('searchQuery', searchQuery)
            console.log('address', address)
            await fetchWalletAddress(address);
          } catch (error) {
            toast.error(error);
          }
        } else {
          await fetchWalletAddress(searchQuery);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchAll, fetchWalletAddress, searchQuery]);

  return {
    setSearchQuery,
    fetchWalletAddress,
    searchResults,
    resultTotalPage,
    setPagination,
    loading,
    pagination,
    searchQuery,
  };
};

export { useSearchWalletAddress };

const formatEvent = (i) => ({
  ...i,
  requestId: i.type === 0 || i.type === 4 ? "-" : i.data?.requestId,
  requestUserAddress: i.user,
  stakeStatus:
    i.type === 0
      ? "Staked"
      : i.type === 1
      ? "Requested Unstake"
      : i.type === 2
      ? "Cancelled"
      : i.type === 3
      ? "Unstaked"
      : i.type === 4
      ? "Claimed Rewards"
      : "",
  azeroAmount:
    formatChainStringToNumber(i.data?.amount ?? i.data?.azeroAmount) /
    Math.pow(10, 12),
  dateTime: new Date(formatChainStringToNumber(i.time) * 1).toLocaleString(),
});
