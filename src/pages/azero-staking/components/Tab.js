import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
  useInterval,
} from "@chakra-ui/react";
import { doClaimRewards, getLastAzeroInterestTopup, getStakeInfo } from "api/azero-staking/azero-staking";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWCountDown from "components/countdown/CountDown";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatChainStringToNumber, formatNumDynDecimal } from "utils";

const oneDay = 1000 * 60 * 60 * 24;
const tenMins = 1000 * 60 * 10;

export default function StakingTabs({ tabsData, onChangeTab }) {
  return (
    <Stack
      w="full"
      spacing="24px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <LeftColumn />
      <Tabs onChange={onChangeTab} isLazy w="full">
        <TabList>
          {tabsData?.map(({ label }, idx) => (
            <Tab
              px="0"
              mr="20px"
              key={idx}
              justifyContent="start"
              _focus={{ borderWidth: "0px" }}
              minW={{ base: "fit-content", lg: "250px" }}
            >
              <Heading as="h3" size="h3">
                {label}
              </Heading>
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabsData?.map(({ component }, idx) => (
            <TabPanel py="18px" key={idx}>
              {component}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

const LeftColumn = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const [myStaked, setMyStaked] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const stakeInfo = await getStakeInfo(api, currentAccount).then((res) => {
        if (!res) return 0;

        const stakingAmount =
          formatChainStringToNumber(res?.stakingAmount) / Math.pow(10, 12);
        return stakingAmount?.toFixed(4) ?? 0;
      });
      setMyStaked(stakeInfo);
    };

    api && fetch();
  }, [api, currentAccount]);

  return (
    <VStack
      w={["full", "full", "full"]}
      maxW={["auto", "auto", "320px"]}
      spacing="24px"
    >
      {/* Side column */}
      <IWCardOneColumn
        minW="full"
        title="My Account"
        data={[
          ...prepareAccountInfo(currentAccount),
          {
            title: "My Staked",
            content: `${formatNumDynDecimal(myStaked) ?? 0} ${appChain?.unit}`,
          },
        ]}
      />
      <IWCard w="full" variant="outline" title={`Rewards Information`}>
        <Stack
          mt="18px"
          w="100%"
          spacing="8px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          <StakingInfo />
        </Stack>
      </IWCard>
    </VStack>
  );
};

function prepareAccountInfo(currentAccount) {
  const { address, balance } = currentAccount || {};
  return [
    {
      title: "Account Address",
      content: !address ? (
        "No account selected"
      ) : (
        <AddressCopier address={address} />
      ),
    },
    {
      title: `${appChain?.unit} Balance`,
      content: `${balance?.azero ?? 0} ${appChain?.unit}`,
    },
    {
      title: "INW Balance",
      content: `${balance?.inw ?? 0} INW`,
    },
  ];
}

function StakingInfo() {
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);

  const [info, setInfo] = useState([0, 0, 0, 0]);
  const [lastAnchored, setLastAnchored] = useState(null);

  const fetchData = useCallback(
    async (isMounted) => {
      let ret = [];

      const info = await getStakeInfo(api, currentAccount);

      const lastAnchored = formatChainStringToNumber(info?.lastAnchored);
      setLastAnchored(lastAnchored);
      // {
      //   stakingAmount: '49,500,000,000,000,000',
      //   unclaimedAzeroReward: '14,995,447,683,282',
      //   claimedAzeroReward: '130,101,374,593,301',
      //   unclaimedInwReward: '1,016,477,132,245,370',
      //   claimedInwReward: '8,819,014,606,361,569',
      //   lastUpdated: '1,706,665,945,000',
      //   lastUnclaimedAzeroReward: '6,223,183,128,488',
      //   lastUnclaimedInwReward: '421,842,913,495,370',
      //   lastAnchored: '1,706,586,106,000',
      //   lastRewardsClaimed: '1,706,586,106,000',
      //   withdrawalRequestAmount: '0'
      // }

      if (!info) {
        setInfo([0, 0, 0, 0]);
        return;
      }

      const unclaimedAzeroReward =
        formatChainStringToNumber(info?.unclaimedAzeroReward) /
        Math.pow(10, 12);

      const unclaimedInwReward =
        formatChainStringToNumber(info?.unclaimedInwReward) / Math.pow(10, 12);

      const claimedAzeroReward =
        formatChainStringToNumber(info?.claimedAzeroReward) / Math.pow(10, 12);

      const claimedInwReward =
        formatChainStringToNumber(info?.claimedInwReward) / Math.pow(10, 12);

      const lastRewardsClaimedTime = formatChainStringToNumber(
        info?.lastRewardsClaimed
      );

      ret = [
        unclaimedAzeroReward?.toFixed(4),
        unclaimedInwReward?.toFixed(4),
        claimedAzeroReward?.toFixed(4),
        claimedInwReward?.toFixed(4),
        lastRewardsClaimedTime,
      ];

      if (!isMounted) return;

      setInfo(ret);
    },
    [api, currentAccount]
  );

  useEffect(() => {
    let isMounted = true;
    api && fetchData(isMounted);

    return () => (isMounted = false);
  }, [api, fetchData]);

  useInterval(() => {
    api && fetchData(true);
  }, 1000);

  const [nextClaimTime, setNextClaimTime] = useState(0);
  const [lastAzeroInterestTopupTimer, setLastAzeroInterestTopupTimer] =
    useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const lastAzeroInterestTopup = await getLastAzeroInterestTopup();

      const nextTime = parseInt(lastAzeroInterestTopup) + tenMins + oneDay;

      setLastAzeroInterestTopupTimer(lastAzeroInterestTopup);
      setNextClaimTime(nextTime);
    };

    api && fetchData();
  }, [api]);

  async function handleClaimRewards() {
    if (info[0] <= 0) {
      toast.error("No rewards!");
      return;
    }

    if (parseInt(info[4]) !== 0 && info[4] >= lastAzeroInterestTopupTimer) {
      console.log(`Wait until there is a new top-ups for ${appChain?.unit} interest`);
      toast.error("Invalid Time To Claim Rewards!");
      return;
    }

    await doClaimRewards(api, currentAccount);

    delay(1000).then(() => {
      fetchData(true);
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  // Total Claimed AZERO ~ info[2]
  const lastClaimTime =
    info && (parseInt(info[2]) === 0 ? "Not claim yet" : info[4]);

  const formattedInfo = [
    {
      title: `Estimated ${appChain?.unit} earnings`,
      number: info && info[0],
      denom: appChain?.unit,
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Estimated INW earnings",
      number: info && info[1],
      denom: "INW",
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: `Total Claimed ${appChain?.unit}`,
      number: info && info[2],
      denom: appChain?.unit,
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Total Claimed INW",
      number: info && info[3],
      denom: "INW",
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "Last Claimed Time",
      number: lastClaimTime,
      denom: "",
      hasTooltip: false,
      tooltipContent: "Content of tooltip ",
    },
  ];

  return (
    <>
      <>
        {formattedInfo?.map((i) => {
          return i?.number === undefined ? null : (
            <Flex
              key={i?.title}
              w="full"
              justify="space-between"
              direction={["column"]}
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
                {i.title === "Last Claimed Time" ? (
                  <>
                    {!i?.number
                      ? "Not claim yet"
                      : !!parseInt(i?.number)
                        ? new Date(parseInt(i?.number)).toLocaleString("en-US")
                        : i?.number}
                  </>
                ) : (
                  <>
                    {formatNumDynDecimal(i.number) || 0} {i.denom}
                  </>
                )}
              </Box>
            </Flex>
          );
        })}

        {lastAnchored > lastAzeroInterestTopupTimer ? (
          <>
            {/* Claimed */}
            <Flex w="full" justify="space-between" direction={["column"]}>
              <Flex alignItems="center">Est. Next Claim</Flex>
              <Box
                color={{ base: "#57527E" }}
                fontWeight={{ base: "bold" }}
                fontSize={["16px", "18px"]}
              >
                <IWCountDown date={nextClaimTime} />
              </Box>
            </Flex>
          </>
        ) : (
          <>
            {/* Not claim yet */}
            <></>
          </>
        )}

        <IWCard w="full" variant="solid">
          <Stack
            w="100%"
            spacing="20px"
            direction={{ base: "column" }}
            align={{ base: "column", xl: "center" }}
          >
            <Button
              w="full"
              fontSize={["16px", "16px", "18px"]}
              isDisabled={
                !lastClaimTime ||
                !currentAccount?.address ||
                lastAnchored >= lastAzeroInterestTopupTimer
              }
              onClick={() => handleClaimRewards()}
            >
              {currentAccount?.address ? "Claim rewards" : "Connect Wallet"}
            </Button>
          </Stack>
        </IWCard>
        {lastAnchored > lastAzeroInterestTopupTimer ? (
          <Alert
            status="warning"
            fontSize={"16px"}
            style={{ lineHeight: "normal" }}
          >
            <AlertIcon />
            User can claim the rewards approx every 24 hours.
          </Alert>
        ) : null}
      </>
    </>
  );
}
