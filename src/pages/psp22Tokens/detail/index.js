import { Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import SectionContainer from "components/container/SectionContainer";
import { IWMobileList } from "components/table/IWMobileList";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { IWTable } from "components/table/IWTable";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { fetchAllNFTPools } from "redux/slices/allPoolsSlice";
import { fetchAllTokenPools } from "redux/slices/allPoolsSlice";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { isPoolEnded } from "utils";
import { formatTokenAmountNumber, roundUp } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const TokenDetailPage = () => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const history = useHistory();
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
  const dispatch = useDispatch();
  const params = useParams();
  const { allStakingPoolsList } = useSelector((s) => s.allPools);
  const { allTokensList, allTokenPoolsList, allNFTPoolsList } = useSelector(
    (s) => s.allPools
  );
  const [tokenData, setTokenData] = useState(null);
  const tokenAddress = params?.tokenAddress;
  const tokenInfo = useMemo(() => {
    if (tokenAddress) {
      return allTokensList?.find(
        (e) => e?.contractAddress == params?.tokenAddress
      );
    }
  }, [params, allTokensList]);

  useEffect(() => {
    (async () => {
      console.log("tokenAddress", tokenAddress);
      if (tokenAddress) {
        let queryResult = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          tokenAddress,
          0,
          "psp22::totalSupply"
        );
        const rawTotalSupply = queryResult.toHuman().Ok;
        const totalSupply = roundUp(
          +formatTokenAmountNumber(rawTotalSupply, tokenInfo?.decimal),
          0
        );
        setTokenData({
          ...tokenInfo,
          tokenContract: tokenInfo?.contractAddress,
          tokenNameSymbol: tokenInfo?.name,
          totalSupply,
        });
      }
    })();
  }, [tokenInfo]);
  const cardData = {
    cardHeaderList: [
      {
        name: "contractAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "Token address",
      },
      {
        name: "creator",
        hasTooltip: false,
        tooltipContent: "",
        label: "Owner",
      },
      {
        name: "tokenNameSymbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Name",
      },
      {
        name: "decimal",
        hasTooltip: false,
        tooltipContent: "",
        label: "Decimal",
      },
      {
        name: "totalSupply",
        hasTooltip: false,
        tooltipContent: "",
        label: "Total Supply",
      },
    ],

    cardValue: tokenData,
  };
  useEffect(() => {
    dispatch(
      fetchAllStakingPools({
        currentAccount,
      })
    );
  }, [currentAccount, dispatch]);
  useEffect(() => {
    dispatch(
      fetchAllNFTPools({
        showZeroPool: true,
        currentAccount,
      })
    );

    dispatch(
      fetchAllTokenPools({
        showZeroPool: true,
        currentAccount,
      })
    );
  }, [currentAccount, dispatch]);
  const tokenPools = allStakingPoolsList?.filter(
    (obj) => obj?.tokenContract == tokenAddress
  );
  const nftLPListFiltered = allNFTPoolsList?.filter(
    (obj) => obj?.tokenContract == tokenAddress
  );
  // const farms =
  const poolTableData = {
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
        showTooltipIconContent: true,
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

    tableBody: tokenPools,
  };
  const farmTableData = {
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

    tableBody: nftLPListFiltered,
  };
  const lpTableData = {
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

    tableBody: allTokenPoolsList?.filter(
      (e) => !(isPoolEnded(e?.startTime, e?.duration) && +e?.totalStaked == 0) && (e?.tokenContract == tokenAddress || e?.lptokenContract == tokenAddress)
    ),
  };
  console.log(allTokenPoolsList);
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="Token information"
        description=""
        maxW="1800px"
      >
        <IWCard
          mt="16px"
          w="full"
          variant="solid"
          border="1px solid #E3DFF3"
          bg="bg.1"
        >
          <Flex
            minH="70px"
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent={{ base: "space-between" }}
            alignItems="start"
          >
            {cardData?.cardHeaderList?.map((item) => {
              const { name, label } = item;

              return (
                <Flex
                  p="4px"
                  mt={{ base: "15px", lg: "0px" }}
                  w="full"
                  key={name}
                  justifyContent="center"
                  flexDirection={{ base: "row", lg: "column" }}
                >
                  <Flex
                    w={{ base: "45%", lg: "full" }}
                    color="text.2"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="28px"
                    alignItems="center"
                  >
                    {label}
                  </Flex>

                  <Flex
                    color="text.1"
                    fontWeight="600"
                    lineHeight="28px"
                    justify={{ base: "start" }}
                    alignItems={{ base: "center" }}
                    w={{ base: "55%", lg: "full" }}
                    fontSize={{ base: "16px", lg: "20px" }}
                  >
                    <Text>
                      {tokenData &&
                        formatDataCellTable(cardData?.cardValue, name)}
                    </Text>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </IWCard>
      </SectionContainer>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="Token pools"
        description=""
        maxW="1800px"
      >
        {isSmallerThanMd ? (
          <IWMobileList
            customURLRowClick="/pools"
            {...poolTableData}
            mode="STAKING_POOL"
          />
        ) : (
          <IWTable
            customURLRowClick="/pools"
            {...poolTableData}
            mode="STAKING_POOL"
          />
        )}
      </SectionContainer>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="NFT Pools"
        description=""
        maxW="1800px"
      >
        {isSmallerThanMd ? (
          <IWMobileList
            customURLRowClick="/farms"
            {...farmTableData}
            mode="NFT_FARM"
          />
        ) : (
          <IWTable
            customURLRowClick="/farms"
            {...farmTableData}
            mode="NFT_FARM"
          />
        )}
      </SectionContainer>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="Token farming"
        description=""
        maxW="1800px"
      >
        {isSmallerThanMd ? (
          <IWMobileList
            customURLRowClick="/farming"
            {...lpTableData}
            mode="TOKEN_FARM"
          />
        ) : (
          <IWTable
            customURLRowClick="/farming"
            {...lpTableData}
            mode="TOKEN_FARM"
          />
        )}
      </SectionContainer>
    </>
  );
};

export default TokenDetailPage;
