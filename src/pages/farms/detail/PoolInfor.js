import { Link, Stack } from "@chakra-ui/react";

import AddressCopier from "components/address-copier/AddressCopier";
import { NFTBannerCard } from "components/card/Card";
import CardTwoColumn from "components/card/CardTwoColumn";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";
const PoolInfo = ({
  mode,
  nftInfo,
  poolContract,
  startTime,
  duration,
  rewardPool,
  totalStaked,
  maxStakingAmount,
  tokenSymbol,
  tokenName,
  tokenContract,
  multiplier,
  tokenTotalSupply,
  lptokenContract,
  lptokenDecimal,
  lptokenName,
  lptokenSymbol,
  lptokenTotalSupply,
  tokenDecimal,
  ...rest
}) => {
  const cardDataPoolInfo = {
    cardHeaderList: [
      {
        name: "collectionLink",
        hasTooltip: false,
        tooltipContent: "",
        label: "ArtZero Collection Link",
      },
      {
        name: "totalSupply",
        hasTooltip: false,
        tooltipContent: "",
        label: "NFT Supply",
      },
      {
        name: "royaltyFee",
        hasTooltip: false,
        tooltipContent: "",
        label: "Royalty Fee",
      },
      {
        name: "volume",
        hasTooltip: false,
        tooltipContent: "",
        label: "Volume",
      },
    ],

    cardValue: {
      collectionLink: (
        <Link
          isExternal
          href={`https://a0.artzero.io/collection/${nftInfo?.nftContractAddress}`}
        >
          {nftInfo?.name}
        </Link>
      ),
      volume: `${formatNumDynDecimal(nftInfo?.volume)} AZERO`,
      totalSupply: `${nftInfo?.nft_count} NFT${nftInfo?.nft_count > 1 && "s"}`,
      royaltyFee: `${(nftInfo?.royaltyFee / 100).toFixed(2)}%`,
    },
  };

  return (
    <>
      {mode === "NFT_FARM" ? (
        <NFTBannerCard cardData={cardDataPoolInfo} nftInfo={nftInfo} />
      ) : null}

      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <CardTwoColumn
          title="General Information"
          data={[
            {
              title: "Pool Contract Address",
              content: <AddressCopier address={poolContract} />,
            },
            {
              title: "Multiplier",
              content: multiplier
              ,
            },
            {
              title: "Start Date",
              content: `${new Date(startTime).toLocaleString("en-US")}`,
            },
            {
              title: "Pool Length",
              content: `${duration / 86400} day${
                duration / 86400 > 1 ? "s" : ""
              }`,
            },
            {
              title: "Reward Pool",
              content: `${formatNumDynDecimal(rewardPool)} ${tokenSymbol}`,
            },
            {
              title: "Max Staking Amount",
              content: `${formatNumDynDecimal(maxStakingAmount)} ${mode === "NFT_FARM" ? "NFT" : lptokenSymbol}${
                mode === "NFT_FARM" && maxStakingAmount > 1 ? "s" : ""
              }`,
            },
            {
              title: "Total Value Locked",
              content: `${formatNumDynDecimal(formatTokenAmount(totalStaked, lptokenDecimal))} ${mode === "NFT_FARM" ? "NFT" : lptokenSymbol}${
                mode === "NFT_FARM" && totalStaked > 1 ? "s" : ""
              }`,
            },
          ]}
        />
        <Stack w="full" spacing="30px">
          {mode === "TOKEN_FARM" ? (
            <CardTwoColumn
              title="Staking Token Information"
              data={[
                {
                  title: "Total Name",
                  content: lptokenName,
                },
                {
                  title: "Contract Address",
                  content: <AddressCopier address={lptokenContract} />,
                },
                {
                  title: "Total Supply",
                  content: `${formatNumDynDecimal(lptokenTotalSupply)}`,
                },
                { title: "Token Symbol", content: lptokenSymbol },
              ]}
            />
          ) : null}

          <CardTwoColumn
            title="Reward Token Information"
            data={[
              { title: "Total Name", content: tokenName },
              {
                title: "Contract Address",
                content: <AddressCopier address={tokenContract} />,
              },
              {
                title: "Total Supply",
                content: `${formatNumDynDecimal(tokenTotalSupply)}`,
              },
              { title: "Token Symbol", content: tokenSymbol },
            ]}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default PoolInfo;
