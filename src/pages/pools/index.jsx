import { SearchIcon } from "@chakra-ui/icons";
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
import { delay } from "utils";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";

import { IWTable } from "components/table/IWTable";
import { useEffect } from "react";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";

export default function PoolsPage({ api }) {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allStakingPoolsList } = useSelector((s) => s.allPools);

  const [showMyStakedPools, setShowMyStakedPools] = useState(false);

  const [sortPools, setSortPools] = useState(-1);
  const [hideZeroRewardPools, setHideZeroRewardPools] = useState(true);

  useEffect(() => {
    delay(500);

    dispatch(
      fetchAllStakingPools({
        sort: sortPools,
        showZeroPool: hideZeroRewardPools,
        currentAccount,
      })
    );
  }, [currentAccount, dispatch, hideZeroRewardPools, sortPools]);

  const poolsListDataFiltered = useMemo(() => {
    let ret = allStakingPoolsList;

    if (showMyStakedPools) {
      ret = allStakingPoolsList.filter((p) => p.stakeInfo);
    }

    return ret;
  }, [allStakingPoolsList, showMyStakedPools]);

  const tableData = {
    tableHeader: [
      {
        name: "tokenName",
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
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Expired In",
      },
      {
        name: "stakeInfo",
        hasTooltip: false,
        tooltipContent: "",
        label: "My Stake",
      },
    ],

    tableBody: poolsListDataFiltered,
  };

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Staking Pools"
      description={
        <span>Stake some tokens to earn more. High APR, low risk.</span>
      }
    >
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column" }}
      >
        <Stack
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
        </Stack>

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
            <FormControl maxW="135px" display="flex" alignItems="center">
              <Switch
                id="my-stake"
                isDisabled={!currentAccount?.address}
                isChecked={showMyStakedPools}
                onChange={() => setShowMyStakedPools(!showMyStakedPools)}
              />
              <FormLabel htmlFor="my-stake" mb="0" ml="10px" fontWeight="400">
                My Stake
              </FormLabel>
            </FormControl>

            <FormControl maxW="200px" display="flex" alignItems="center">
              <Switch
                id="zero-reward-pools"
                isChecked={hideZeroRewardPools}
                onChange={() => setHideZeroRewardPools(!hideZeroRewardPools)}
              />
              <FormLabel
                mb="0"
                ml="10px"
                fontWeight="400"
                htmlFor="zero-reward-pools"
              >
                Zero Reward Pools
              </FormLabel>
            </FormControl>
          </Flex>

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
                  {item === 1
                    ? "Low to hight"
                    : item === -1
                    ? "Hight to low"
                    : ""}
                </option>
              ))}
            </Select>
          </Box>
        </HStack>

        <IWTable {...tableData} />
      </Stack>
    </SectionContainer>
  );
}
