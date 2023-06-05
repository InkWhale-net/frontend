/* eslint-disable no-unused-vars */
// import { SearchIcon } from "@chakra-ui/icons";
// import IWInput from "components/input/Input";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Stack,
  Switch,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import IWTabs from "components/tabs/IWTabs";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { delay } from "utils";
import { fetchAllNFTPools } from "redux/slices/allPoolsSlice";
import { fetchAllTokenPools } from "redux/slices/allPoolsSlice";
import { isPoolEnded } from "utils";
import IWInput from "components/input/Input";

export default function FarmsPage() {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allNFTPoolsList, allTokenPoolsList, loading } = useSelector(
    (s) => s.allPools
  );

  const [sortPools, setSortPools] = useState(-1);
  const [hideZeroRewardPools, setHideZeroRewardPools] = useState(true);

  const [showMyStakedPools, setShowMyStakedPools] = useState(false);

  const [endedPools, setEndedPools] = useState(false);

  const [keywords, setKeywords] = useState("");
  const [resultList, setResultList] = useState(null);

  const searchCondition = (el) => {
    return (
      el.tokenSymbol.toLowerCase().includes(keywords.trim().toLowerCase()) ||
      el.tokenName.toLowerCase().includes(keywords.trim().toLowerCase()) ||
      el?.nftInfo?.name.toLowerCase().includes(keywords.trim().toLowerCase())
    );
  };

  const getSearchResult = () => {
    const result = nftLPListFiltered?.filter((el) => searchCondition(el)) || [];
    if (!result?.length && !keywords) {
      setResultList();
      return;
    }
    setResultList(result);
  };

  useEffect(() => {
    delay(500);

    dispatch(
      fetchAllNFTPools({
        sort: sortPools,
        showZeroPool: hideZeroRewardPools,
        currentAccount,
      })
    );

    dispatch(
      fetchAllTokenPools({
        sort: sortPools,
        showZeroPool: hideZeroRewardPools,
        currentAccount,
      })
    );
  }, [currentAccount, dispatch, hideZeroRewardPools, sortPools]);

  const nftLPListFiltered = useMemo(() => {
    let ret = allNFTPoolsList;

    if (showMyStakedPools) {
      ret = ret.filter((p) => p.stakeInfo);
    }

    if (endedPools) {
      ret = ret.filter((p) =>
        isPoolEnded(p?.startTime, p?.duration)
      );
    }

    return ret;
  }, [allNFTPoolsList, showMyStakedPools, endedPools]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      getSearchResult();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keywords, nftLPListFiltered]);

  const tokenLPListFiltered = useMemo(() => {
    let ret = allTokenPoolsList;

    if (showMyStakedPools) {
      ret = allTokenPoolsList.filter((p) => p.stakeInfo);
    }

    return ret;
  }, [allTokenPoolsList, showMyStakedPools]);

  const tableDataNFT = {
    tableHeader: [
      {
        name: "nftInfo",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake",
      },
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Earn",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: `Total Value Locked: Total tokens staked into this pool`,
        label: "TVL",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
      },
      {
        name: "multiplier",
        hasTooltip: true,
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 NFTs in 24 hours.`,
        label: "Multiplier",
      },
      {
        name: "status",
        hasTooltip: false,
        tooltipContent: "",
        label: "Status",
      },
      {
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Countdown",
      },
      {
        name: "stakeInfo",
        hasTooltip: false,
        tooltipContent: "",
        label: "My Stake",
      },
    ],

    tableBody: resultList || nftLPListFiltered,
  };

  const tableDataToken = {
    tableHeader: [
      {
        name: "lptokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake",
      },
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Earn",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: `Total Value Locked: Total tokens staked into this pool`,
        label: "TVL",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
      },
      {
        name: "multiplier",
        hasTooltip: true,
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 token in 24 hours.`,
        label: "Multiplier",
      },
      {
        name: "status",
        hasTooltip: false,
        tooltipContent: "",
        label: "Status",
      },
      {
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Countdown",
      },
      {
        name: "stakeInfo",
        hasTooltip: false,
        tooltipContent: "",
        label: "My Stake",
      },
    ],

    tableBody: tokenLPListFiltered,
  };

  const tabsData = [
    {
      label: <>NFT Yield Farms</>,
      component: <IWTable {...tableDataNFT} mode="NFT_FARM" />,
      isDisabled: false,
    },
    // {
    //   label: <>Token Yield Farms</>,
    //   component: <IWTable {...tableDataToken} mode="TOKEN_FARM" />,
    //   isDisabled: false,
    // },
  ];

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="NFT Staking Pools"
      description={<span>Stake NFT to earn tokens</span>}
    >
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column" }}
      >
        {/* <Stack
          w="100%"
          spacing="20px"
          direction={{ base: "column" }}
          align={{ base: "column", xl: "center" }}
        >
          <IWInput
            type="number"
            placeholder="Search"
            inputRightElementIcon={<SearchIcon color="text.1" />}
          />
        </Stack> */}

        <HStack
          color="text.1"
          fontSize="md"
          w="full"
          spacing={{ base: "0px", lg: "20px" }}
          justifyContent={{ base: "end" }}
          flexDirection={{ base: "column", lg: "row" }}
          align={{ base: "column", xl: "center" }}
          pt={{ base: "0px", lg: "10px" }}
        >
          <Flex
            w="full"
            mb={{ base: "10px", lg: "0px" }}
            align={{ base: "center" }}
            justifyContent={{ base: "end" }}
            spacing={{ base: "0px", lg: "20px" }}
          >
            <IWInput
              value={keywords}
              width="350px"
              onChange={({ target }) => setKeywords(target.value)}
              placeholder="Search"
            />
            <FormControl maxW="205px" display="flex" alignItems="center">
              <Switch
                id="my-stake"
                isDisabled={!currentAccount?.address}
                isChecked={showMyStakedPools}
                onChange={() => setShowMyStakedPools(!showMyStakedPools)}
              />
              <FormLabel htmlFor="my-stake" mb="0" ml="10px" fontWeight="400">
                My Stake Only
              </FormLabel>
            </FormControl>

            <FormControl maxW="200px" display="flex" alignItems="center">
              <Switch
                id="zero-reward-pools"
                isChecked={endedPools}
                onChange={() => setEndedPools(!endedPools)}
              />
              <FormLabel
                mb="0"
                ml="10px"
                fontWeight="400"
                htmlFor="zero-reward-pools"
              >
                Farm Ended Only
              </FormLabel>
            </FormControl>
          </Flex>

          {/* <Box minW="155px" maxW="160px">
            <Select
              id="token"
              fontSize="md"
              fontWeight="400"
              variant="unstyled"
              defaultValue={-1}
              cursor="pointer"
              border="0px red dotted"
              placeholder="Sort by selection"
              onChange={({ target }) => setSortPools(target.value)}
            >
              {[1, -1].map((item, idx) => (
                <option key={idx} value={item}>
                  {item === -1 ? "New to old" : item === 1 ? "Old to new" : ""}
                </option>
              ))}
            </Select>
          </Box> */}
        </HStack>

        <IWTabs tabsData={tabsData} loading={loading} />
      </Stack>
    </SectionContainer>
  );
}
