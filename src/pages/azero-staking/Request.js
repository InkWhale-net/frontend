import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Stack,
  Tooltip,
  useInterval,
} from "@chakra-ui/react";
import { doClaimRewards } from "api/azero-staking/azero-staking";
import { getStakeInfo } from "api/azero-staking/azero-staking";
import IWCard from "components/card/Card";
import { useAppContext } from "contexts/AppContext";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { delay } from "utils";
import { formatChainStringToNumber } from "utils";
import { ClaimRewardsTable } from "./components/Table";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { APICall } from "api/client";
import { addressShortener } from "utils";

function Request() {
  const { api } = useAppContext();

  const { currentAccount } = useSelector((s) => s.wallet);

  const [stakingInfo, setStakingInfo] = useState([
    0,
    0,
    0,
    "Not request yet",
    0,
  ]);

  async function handleClaimRewards() {
    if (stakingInfo[0] <= 0) {
      toast.error("No rewards!");
      return;
    }

    await doClaimRewards(api, currentAccount);

    delay(1000).then(() => {
      fetchData(true);
      fetchUserClaimedList();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  const fetchData = useCallback(
    async (isMounted) => {
      let ret = [];

      const info = await getStakeInfo(api, currentAccount);

      if (!info) {
        setStakingInfo([0, 0, 0, "Not request yet", 0]);
        return;
      }

      const unclaimedAzeroReward =
        formatChainStringToNumber(info?.unclaimedAzeroReward) /
        Math.pow(10, 12);

      const unclaimedInwReward =
        formatChainStringToNumber(info?.unclaimedInwReward) / Math.pow(10, 12);

      ret = [unclaimedAzeroReward?.toFixed(4), unclaimedInwReward?.toFixed(4)];

      // const lastRequestedList = await getWithdrawalRequestListByUser(
      //   api,
      //   currentAccount
      // );

      // if (lastRequestedList?.length) {
      //   const lastRequest = lastRequestedList[lastRequestedList?.length - 1];
      //   let requestTime =
      //     formatChainStringToNumber(lastRequest.requestTime) * Math.pow(10, 0);

      //   ret.push(new Date(requestTime).toLocaleString());
      // } else {
      //   ret.push("Not request yet");
      // }

      // const maxWaitingTime = await getMaxWaitingTime();

      // if (maxWaitingTime) {
      //   ret.push(maxWaitingTime / 60000);
      // }

      if (!isMounted) return;

      setStakingInfo(ret);
    },
    [api, currentAccount]
  );

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);

    return () => (isMounted = false);
  }, [fetchData]);

  useInterval(() => {
    fetchData(true);
  }, 1000);

  // ==============
  const dispatch = useDispatch();

  const [userClaimedList, setUserClaimedList] = useState([]);

  const fetchUserClaimedList = useCallback(async () => {
    const { status, ret, message } = await APICall.getDistributionInfo();

    if (status === "OK") {
      console.log("message", message);
    }

    if (message?.length) {
      const formattedClaimedList = message.map((i) => {
        const interestAccount =
          formatChainStringToNumber(i.interestAccountAmount) / Math.pow(10, 12);

        const masterAccount =
          formatChainStringToNumber(i.masterAccountAmount) / Math.pow(10, 12);

        const shortTxId = addressShortener(i.txId);

        const claimedTime = new Date(i.timestamp).toLocaleString();

        return {
          ...i,
          claimedTime,
          shortTxId,
          interestAccount,
          masterAccount,
        };
      });

      setUserClaimedList(formattedClaimedList);
    } else {
      setUserClaimedList([]);
    }
  }, []);

  useEffect(() => {
    fetchUserClaimedList();
  }, [fetchUserClaimedList]);

  return (
    <>
      <IWCard
        mb="18px"
        w="full"
        variant="outline"
        title={`Staking Information`}
      >
        <Stack
          mt="18px"
          w="100%"
          spacing="8px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          <StakingInfo info={stakingInfo} />

          <IWCard w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              {/* <IWInput
              type="number"
              placeholder="0"
              value={requestAmount}
              onChange={({ target }) => setRequestAmount(target.value)}
              inputRightElementIcon={
                <Button
                  size="xs"
                  fontWeight="normal"
                  disabled={!currentAccount?.address}
                  onClick={() => setRequestAmount(stakingInfo[0])}
                >
                  Max
                </Button>
              }
            /> */}

              <Button
                w="full"
                fontSize={["16px", "16px", "18px"]}
                isDisabled={!currentAccount?.address}
                onClick={() => handleClaimRewards()}
              >
                {currentAccount?.address ? "Claim rewards" : "Connect Wallet"}
              </Button>
            </Stack>
          </IWCard>
        </Stack>
      </IWCard>
      <ClaimRewardsTable tableBody={userClaimedList} />
    </>
  );
}

export default Request;

function StakingInfo({ info }) {
  const formattedInfo = [
    {
      title: "AZERO Unclaimed Rewards",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "INW Unclaimed Rewards",
      number: info && info[1],
      denom: "INW",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];

  return formattedInfo?.map((i) => (
    <>
      <Flex
        key={i?.title}
        w="full"
        justify="space-between"
        direction={["column", "column", "row"]}
      >
        <Flex alignItems="center">
          {i?.title}
          {i?.hasTooltip && (
            <Tooltip fontSize="md" label={i?.tooltipContent}>
              <QuestionOutlineIcon ml="6px" color="text.2" />
            </Tooltip>
          )}
        </Flex>
        <Box
          color={{ base: "#57527E" }}
          fontWeight={{ base: "bold" }}
          fontSize={["16px", "18px"]}
        >
          {i.number || 0} {i.denom}
        </Box>
      </Flex>
    </>
  ));
}
