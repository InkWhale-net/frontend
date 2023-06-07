import { Stack } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function MyPoolsPage({ api }) {
  const history = useHistory();
  const location = useLocation();
  const tokenSectionRef = useRef(null);
  const poolSectionRef = useRef(null);
  const farmSectionRef = useRef(null);

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

    tableBody: myStakingPoolsList,
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
      case "farms":
        scrollTo(farmSectionRef);
        break;
    }
  }, [location.search, history]);

  return (
    <>
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

      <MyNFTAndTokenPoolsTab scrollRef={farmSectionRef} />

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

const MyNFTAndTokenPoolsTab = ({ scrollRef }) => {
  const { myNFTPoolsList, myTokenPoolsList } = useSelector((s) => s.myPools);

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
    ],

    tableBody: myNFTPoolsList,
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
    ],

    tableBody: myTokenPoolsList,
  };

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="My Yield Farm Pools"
      description={<span>Stake NFT to earn tokens</span>}
      scrollRef={scrollRef}
    >
      <IWTable {...tableDataNFT} mode="NFT_FARM" />
    </SectionContainer>
  );
};
