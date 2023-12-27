/* eslint-disable no-unused-vars */
import { SearchIcon } from "@chakra-ui/icons";
// import IWInput from "components/input/Input";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Switch,
  useBreakpointValue,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import IWInput from "components/input/Input";
import { IWMobileList } from "components/table/IWMobileList";
import { IWTable } from "components/table/IWTable";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllNFTPools,
  fetchAllTokenPools,
} from "redux/slices/allPoolsSlice";
import { isPoolNotStart } from "utils";
import { delay, isPoolEnded } from "utils";

export default function LPPoolsPage() {
  const dispatch = useDispatch();
  const { api } = useAppContext();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allNFTPoolsList, allTokenPoolsList, loading } = useSelector(
    (s) => s.allPools
  );

  const [sortPools, setSortPools] = useState(-1);
  const [hideZeroRewardPools, setHideZeroRewardPools] = useState(true);

  const [showMyStakedPools, setShowMyStakedPools] = useState(false);

  const [endedPools, setEndedPools] = useState(false);
  const [livePools, setLivePools] = useState(false);

  const [keywords, setKeywords] = useState("");
  const [resultList, setResultList] = useState(null);
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
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
  }, [currentAccount, api, dispatch, hideZeroRewardPools, sortPools]);

  const nftLPListFiltered = useMemo(() => {
    let ret = allNFTPoolsList;

    if (showMyStakedPools) {
      ret = ret.filter((p) => +p?.stakeInfo?.stakedValue > 0);
    }

    if (endedPools) {
      ret = ret.filter((p) => isPoolEnded(p?.startTime, p?.duration));
    }
    if (livePools) {
      ret = ret.filter(
        (p) =>
          !isPoolEnded(p?.startTime, p?.duration) &&
          !isPoolNotStart(p?.startTime)
      );
    }

    return ret;
  }, [allNFTPoolsList, showMyStakedPools, endedPools, livePools]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      getSearchResult();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywords, nftLPListFiltered]);

  const tokenLPListFiltered = useMemo(() => {
    let ret = allTokenPoolsList;

    if (showMyStakedPools) {
      ret = allTokenPoolsList.filter((p) => p?.stakeInfo?.stakedValue > 0);
    }

    if (endedPools) {
      ret = ret.filter((p) => isPoolEnded(p?.startTime, p?.duration));
    }

    if (livePools) {
      ret = ret.filter(
        (p) =>
          !isPoolEnded(p?.startTime, p?.duration) &&
          !isPoolNotStart(p?.startTime)
      );
    }

    return ret;
  }, [allTokenPoolsList, showMyStakedPools, endedPools, livePools]);
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
        showTooltipIconContent: true,
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

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Token Farming"
      description={
        <span>Lock in one token, get another token as your reward</span>
      }
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
            align={{ base: "left", lg: "center" }}
            justifyContent={{ base: "end" }}
            spacing={{ base: "0px", lg: "20px" }}
            flexDirection={{ base: "column", lg: "row" }}
          >
            <IWInput
              value={keywords}
              width={{ base: "full", lg: "350px" }}
              onChange={({ target }) => setKeywords(target.value)}
              placeholder="Search"
              inputRightElementIcon={<SearchIcon color="#57527E" />}
            />
            <Box
              display="flex"
              justifyContent={{ base: "flex-start", lg: "flex-end" }}
              marginTop={{ base: "20px", lg: "none" }}
            >
              <FormControl
                maxW={{
                  base: "160px",
                  lg: "205px",
                }}
                display="flex"
                alignItems="center"
              >
                <Switch
                  id="my-stake"
                  isDisabled={!currentAccount?.address}
                  isChecked={showMyStakedPools}
                  onChange={() => setShowMyStakedPools(!showMyStakedPools)}
                />
                <FormLabel
                  htmlFor="my-stake"
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  whiteSpace="nowrap"
                >
                  My Stake Only
                </FormLabel>
              </FormControl>

              <FormControl
                maxW="200px"
                display="flex"
                alignItems="center"
                justifyContent={{ base: "flex-end", lg: "none" }}
              >
                <Switch
                  id="zero-reward-pools"
                  isChecked={livePools}
                  onChange={() => {
                    const newValue = !livePools;
                    setLivePools(newValue);
                    if (newValue == true) setEndedPools(false);
                  }}
                />
                <FormLabel
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  htmlFor="zero-reward-pools"
                  whiteSpace="nowrap"
                >
                  Pool Live Only
                </FormLabel>
              </FormControl>
              <FormControl
                maxW="200px"
                display="flex"
                alignItems="center"
                justifyContent={{ base: "flex-end", lg: "none" }}
              >
                <Switch
                  id="zero-reward-pools"
                  isChecked={endedPools}
                  onChange={() => {
                    const newValue = !endedPools;
                    setEndedPools(newValue);
                    if (newValue == true) setLivePools(false);
                  }}
                />
                <FormLabel
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  htmlFor="zero-reward-pools"
                  whiteSpace="nowrap"
                >
                  Pools Ended Only
                </FormLabel>
              </FormControl>
            </Box>
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

        {isSmallerThanMd ? (
          <IWMobileList {...tableDataToken} mode="TOKEN_FARM" />
        ) : (
          <IWTable {...tableDataToken} mode="TOKEN_FARM" />
        )}
      </Stack>
    </SectionContainer>
  );
}