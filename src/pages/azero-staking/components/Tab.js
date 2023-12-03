import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
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
import { doClaimRewards } from "api/azero-staking/azero-staking";
import { getStakeInfo } from "api/azero-staking/azero-staking";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { formatNumDynDecimal } from "utils";
import { formatChainStringToNumber } from "utils";

export default function StakingTabs({ tabsData, onChangeTab }) {
  return (
    <Stack
      w="full"
      spacing="30px"
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

    fetch();
  }, [api, currentAccount]);

  return (
    <VStack w={["full", "full", "auto"]} spacing="24px">
      {/* Side column */}
      <IWCardOneColumn
        title="My Account"
        data={[
          ...prepareAccountInfo(currentAccount),
          {
            title: "My Staked",
            content: `${formatNumDynDecimal(myStaked) ?? 0} AZERO`,
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
      title: "Azero Balance",
      content: `${balance?.azero ?? 0} AZERO`,
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

  const [info, setInfo] = useState([0, 0]);
  const fetchData = useCallback(
    async (isMounted) => {
      let ret = [];

      const info = await getStakeInfo(api, currentAccount);

      // {
      //   stakingAmount: '0',
      //   unclaimedAzeroReward: '110,841,577,878',
      //   claimedAzeroReward: '0',
      //   unclaimedInwReward: '80,914,351,851,850',
      //   claimedInwReward: '0',
      //   lastUpdated: '1,701,422,400,000',
      //   lastUnclaimedAzeroReward: '110,841,577,878',
      //   lastUnclaimedInwReward: '80,914,351,851,850',
      //   lastAnchored: '1,701,333,524,000',
      //   lastRewardsClaimed: '0'
      // }
      if (!info) {
        setInfo([0, 0]);
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

  async function handleClaimRewards() {
    if (info[0] <= 0) {
      toast.error("No rewards!");
      return;
    }

    await doClaimRewards(api, currentAccount);

    delay(1000).then(() => {
      fetchData(true);
      // fetchUserClaimedList();
      dispatch(fetchUserBalance({ currentAccount, api }));
    });
  }

  const formattedInfo = [
    {
      title: "AZERO Unclaimed",
      number: info && info[0],
      denom: "AZERO",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
    {
      title: "INW Unclaimed",
      number: info && info[1],
      denom: "INW",
      hasTooltip: true,
      tooltipContent: "Content of tooltip ",
    },
  ];

  return (
    <>
      <>
        {formattedInfo?.map((i) => (
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
              {i.number || 0} {i.denom}
            </Box>
          </Flex>
        ))}

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
              isDisabled={!currentAccount?.address}
              onClick={() => handleClaimRewards()}
            >
              {currentAccount?.address ? "Claim rewards" : "Connect Wallet"}
            </Button>
          </Stack>
        </IWCard>
      </>
    </>
  );
}
