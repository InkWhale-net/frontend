import { Stack } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import MyNFTAndTokenPoolsTab from "./MyNFTAndTokenPoolsTab";
import MyBalance from "./MyBalance";
import { formatTokenAmount } from "utils";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";

export default function MyPoolsPage({ api }) {
  const history = useHistory();
  const location = useLocation();
  const tokenSectionRef = useRef(null);
  const poolSectionRef = useRef(null);
  const balanceSectionRef = useRef(null);
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);

  const { myStakingPoolsList } = useSelector((s) => s.myPools);

  const { allTokensList } = useSelector((s) => s.allPools);

  useEffect(() => {
    if (!currentAccount?.address) {
      history.push("/");
    }
  }, [currentAccount, history]);

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
    ],

    tableBody: myStakingPoolsList?.map((e) => {
      return {
        ...e,
        totalStaked: formatTokenAmount(e?.totalStaked, e?.lptokenDecimal),
      };
    }),
  };

  const tableDataTokens = {
    tableHeader: [
      {
        name: "contractAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "Contract Address",
      },
      {
        name: "creator",
        hasTooltip: false,
        tooltipContent: "",
        label: "Creator",
      },
      {
        name: "name",
        hasTooltip: false,
        tooltipContent: "",
        label: "Name",
      },
      {
        name: "symbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Symbol",
      },
      {
        name: "tokenIconUrl",
        hasTooltip: false,
        tooltipContent: "",
        label: "Icon",
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
        label: "Initial Mint",
      },
    ],

    tableBody: allTokensList?.filter(
      (el) => el.creator === currentAccount?.address
    ),
  };
  useEffect(() => {
    dispatch(fetchMyStakingPools({ currentAccount }));
  }, [currentAccount]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const componentId = searchParams.get("section");
    const scrollTo = (ref) => {
      const targetPosition = ref.current.offsetTop - 50;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    };

    switch (componentId) {
      case "token":
        scrollTo(tokenSectionRef);
        break;
      case "pools":
        scrollTo(poolSectionRef);
        break;
      case "balance":
        scrollTo(balanceSectionRef);
        break;
    }
  }, [location.search, history]);

  return (
    <>
      <MyBalance scrollRef={balanceSectionRef} />
      <SectionContainer
        id="mytoken"
        mt={{ base: "0px", xl: "20px" }}
        title="My Staking Pools"
        description={
          <span>Stake tokens to earn more. High APR, low risk.</span>
        }
        scrollRef={poolSectionRef}
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
        >
          <IWTable {...tableData} mode="STAKING_POOL" />
        </Stack>
      </SectionContainer>

      <MyNFTAndTokenPoolsTab mode="NFT_FARM" />

      <MyNFTAndTokenPoolsTab mode="TOKEN_FARM" />

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My Tokens"
        description={``}
        scrollRef={tokenSectionRef}
      >
        <IWTable {...tableDataTokens} isDisableRowClick={true} />
      </SectionContainer>
    </>
  );
}
