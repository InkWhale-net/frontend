import { SearchIcon } from "@chakra-ui/icons";
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
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { delay } from "utils";
import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import { useEffect } from "react";
import { useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { isPoolEnded } from "utils";
import IWInput from "components/input/Input";
import { IWMobileList } from "components/table/IWMobileList";
import { formatTokenAmount } from "utils";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { roundUp } from "utils";

export default function PoolsPage({ api }) {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allStakingPoolsList } = useSelector((s) => s.allPools);

  const [showMyStakedPools, setShowMyStakedPools] = useState(false);

  const [sortPools, setSortPools] = useState(-1);
  const [endedPools, setendedPools] = useState(false);

  const [keywords, setKeywords] = useState("");
  const [resultList, setResultList] = useState(null);
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
  const getSearchResult = () => {
    const result =
      poolsListDataFiltered?.filter((el) =>
        el.tokenSymbol.toLowerCase().includes(keywords.trim().toLowerCase())
      ) || [];
    if (!result?.length && !keywords) {
      setResultList();
      return;
    }

    setResultList(
      result.map((e, index) => {
        // setRemainStaking(roundUp(maxStakingAmount - totalStaked, 4));
        const maxObjStakingAmount =
          typeof e?.maxStakingAmount == "string"
            ? parseFloat(
                formatTokenAmount(e?.maxStakingAmount, e?.tokenDecimal)
              )
            : e?.maxStakingAmount;
        const remainStaking = roundUp(maxObjStakingAmount - e?.totalStaked, 4);
        return {
          ...e,
          maxStakingAmount: maxObjStakingAmount,
          hasTooltip: remainStaking === 0 && (
            <Tooltip fontSize="md" label="Max Staking Amount reached">
              <span style={{ marginLeft: "6px" }}>
                <AiOutlineExclamationCircle ml="6px" color="text.1" />
              </span>
            </Tooltip>
          ),
        };
      })
    );
  };

  useEffect(() => {
    delay(500);

    dispatch(
      fetchAllStakingPools({
        sort: sortPools,
        currentAccount,
      })
    );
  }, [currentAccount, dispatch, endedPools, sortPools]);

  const poolsListDataFiltered = useMemo(() => {
    let ret = allStakingPoolsList;

    if (showMyStakedPools) {
      ret = ret.filter((p) => p.stakeInfo);
    }

    if (endedPools) {
      ret = ret.filter((p) => isPoolEnded(p?.startTime, p?.duration));
    }

    return ret;
  }, [allStakingPoolsList, showMyStakedPools, endedPools]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      getSearchResult();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keywords, poolsListDataFiltered]);

  const tableData = {
    tableHeader: [
      {
        name: "tokenSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake & Earn",
      },
      {
        name: "totalStaked",
        hasTooltip: true,
        tooltipContent: `Total Value Locked: Total tokens staked into this pool`,
        label: "TVL",
      },
      {
        name: "apy",
        hasTooltip: false,
        tooltipContent: "",
        label: "APR",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
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

    tableBody: resultList || poolsListDataFiltered,
  };

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Staking Pools"
      description={<span>Stake tokens to earn more</span>}
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
            mb={{ base: "4px", lg: "0px" }}
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
                  isChecked={endedPools}
                  onChange={() => setendedPools(!endedPools)}
                />
                <FormLabel
                  mb="0"
                  ml="10px"
                  fontWeight="400"
                  htmlFor="zero-reward-pools"
                  whiteSpace="nowrap"
                >
                  Pool Ended Only
                </FormLabel>
              </FormControl>
            </Box>
          </Flex>
          {/*
          <Box minW="155px" maxW="160px">
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
          <IWMobileList {...tableData} />
        ) : (
          <IWTable {...tableData} />
        )}
      </Stack>
    </SectionContainer>
  );
}
