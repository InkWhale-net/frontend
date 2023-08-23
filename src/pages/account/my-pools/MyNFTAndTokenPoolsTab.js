import SectionContainer from "components/container/SectionContainer";

import { IWTable } from "components/table/IWTable";
import { useAppContext } from "contexts/AppContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyNFTPools } from "redux/slices/myPoolsSlice";

const MyNFTAndTokenPoolsTab = ({ mode }) => {
  const { myNFTPoolsList, myTokenPoolsList } = useSelector((s) => s.myPools);
  const { currentAccount } = useSelector((state) => state.wallet);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMyNFTPools({ currentAccount }));
  }, [currentAccount, api]);

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
      title={`My ${mode === "NFT_FARM" ? "NFT Staking" : "Token Farms"} Pools`}
      description={
        <span>
          Stake {`My ${mode === "NFT_FARM" ? "NFT" : "Token"}`} to earn tokens
        </span>
      }
    >
      {mode === "NFT_FARM" ? (
        <IWTable {...tableDataNFT} mode="NFT_FARM" />
      ) : (
        <IWTable {...tableDataToken} mode="TOKEN_FARM" />
      )}
    </SectionContainer>
  );
};

export default MyNFTAndTokenPoolsTab;
