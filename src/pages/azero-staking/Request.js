import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Tooltip } from "@chakra-ui/react";
import { doWithdrawRequest } from "api/azero-staking/azero-staking";
import { getWithdrawalRequestListByUser } from "api/azero-staking/azero-staking";
import { getStakeInfo } from "api/azero-staking/azero-staking";
import IWCard from "components/card/Card";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { delay } from "utils";
import { formatChainStringToNumber } from "utils";

function Request() {
  const { api } = useAppContext();

  const { currentAccount } = useSelector((s) => s.wallet);

  const [stakingInfo, setStakingInfo] = useState([0, 0, 0, "Not request yet"]);
  const [requestAmount, setRequestAmount] = useState("");

  async function handleRequestClaim() {
    if (stakingInfo[0] < requestAmount) {
      toast.error("Not enough AZERO stakes!");
      return;
    }

    await doWithdrawRequest(api, currentAccount, requestAmount);

    delay(1000).then(() => {
      fetchData();
      setRequestAmount("");
    });
  }

  const fetchData = useCallback(
    async (isMounted) => {
      let ret = [];

      const info = await getStakeInfo(api, currentAccount);

      if (!info) {
        setStakingInfo([0, 0, 0, "Not request yet"]);
        return;
      }

      const stakingAmount =
        formatChainStringToNumber(info?.stakingAmount) / Math.pow(10, 12);

      const unclaimedAzeroReward =
        formatChainStringToNumber(info?.unclaimedAzeroReward) /
        Math.pow(10, 12);

      const unclaimedInwReward =
        formatChainStringToNumber(info?.unclaimedInwReward) / Math.pow(10, 12);

      ret = [
        stakingAmount?.toFixed(4),
        unclaimedAzeroReward?.toFixed(4),
        unclaimedInwReward?.toFixed(4),
      ];

      const lastRequestedList = await getWithdrawalRequestListByUser(
        api,
        currentAccount
      );

      if (lastRequestedList?.length) {
        const lastRequest = lastRequestedList[lastRequestedList?.length - 1];
        let requestTime =
          formatChainStringToNumber(lastRequest.requestTime) * Math.pow(10, 0);

        ret.push(new Date(requestTime).toLocaleString());
      } else {
        ret.push("Not request yet");
      }

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

  return (
    <IWCard w="full" variant="outline" title={`Staking Information`}>
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
            <IWInput
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
            />

            <Button
              w="full"
              isDisabled={!currentAccount?.address || !requestAmount}
              onClick={() => handleRequestClaim()}
            >
              {currentAccount?.address
                ? "Request to withdraw"
                : "Connect Wallet"}
            </Button>
          </Stack>
        </IWCard>
      </Stack>
    </IWCard>
  );
}

export default Request;

function StakingInfo({ info }) {
  const formattedInfo = [
    {
      title: "My stakes",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "AZERO Unclaimed Rewards",
      number: info && info[1],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "INW Unclaimed Rewards",
      number: info && info[2],
      denom: "INW",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Last requested",
      number: info && info[3],
      denom: "",
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
        direction={["column", "row"]}
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
          {i.number} {i.denom}
        </Box>
      </Flex>
    </>
  ));
}
