import { Link, Stack } from "@chakra-ui/react";

import AddressCopier from "components/address-copier/AddressCopier";
import { NFTBannerCard } from "components/card/Card";
import CardTwoColumn from "components/card/CardTwoColumn";
import { useChainContext } from "contexts/ChainContext";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatTokenAmount } from "utils";
import { roundDown } from "utils";
import { formatNumDynDecimal } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
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
  lptokenContract,
  lptokenDecimal,
  lptokenName,
  lptokenSymbol,
  tokenDecimal,
  isOldPool,
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { currentChain } = useChainContext();
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
      volume: `${formatNumDynDecimal(nftInfo?.volume)} ${currentChain?.unit}`,
      totalSupply: `${nftInfo?.nft_count} NFT${nftInfo?.nft_count > 1 && "s"}`,
      royaltyFee: `${(nftInfo?.royaltyFee / 100).toFixed(2)}%`,
    },
  };
  const [tokenTotalSupply, setTokenTotalSupply] = useState("");
  const [lptokenTotalSupply, setLPtokenTotalSupply] = useState("");
  const fetchTokenTotalSupply = async () => {
    try {
      let queryResult = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0,
        "psp22::totalSupply"
      );
      const rawTokenTotalSupply = queryResult.toHuman().Ok;
      setTokenTotalSupply(formatTokenAmount(rawTokenTotalSupply, tokenDecimal));
      if (!lptokenContract) return;
      let queryResult2 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        lptokenContract,
        0,
        "psp22::totalSupply"
      );
      const rawLPTokenTotalSupply = queryResult2.toHuman().Ok;
      setLPtokenTotalSupply(
        formatTokenAmount(rawLPTokenTotalSupply, lptokenDecimal)
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTokenTotalSupply();
  }, [tokenContract, lptokenContract]);

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
              content:
                mode === "NFT_FARM"
                  ? formatTokenAmount(multiplier, tokenDecimal)
                  : roundDown(multiplier, 6),
            },
            {
              title: "Start Date",
              content: `${new Date(startTime).toLocaleString("en-US")}`,
            },
            {
              title: "Pool Length",
              content: `${duration / 86400} day${duration / 86400 > 1 ? "s" : ""
                }`,
            },
            {
              title: "Reward Pool",
              content: `${formatNumDynDecimal(rewardPool)} ${tokenSymbol}`,
            },
            {
              title: "Max Staking Amount",
              content: `${formatNumDynDecimal(maxStakingAmount)} ${mode === "NFT_FARM" ? "NFT" : lptokenSymbol
                }${mode === "NFT_FARM" && maxStakingAmount > 1 ? "s" : ""}`,
            },
            {
              title: "Total Value Locked",
              content: `${formatNumDynDecimal(totalStaked)} ${mode === "NFT_FARM" ? "NFT" : lptokenSymbol
                }${mode === "NFT_FARM" && totalStaked > 1 ? "s" : ""}`,
            },
          ]}
        />
        <Stack w="full" spacing="30px">
          {mode === "TOKEN_FARM" ? (
            <CardTwoColumn
              title="Staking Token Information"
              data={[
                {
                  title: "Token Name",
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
                { title: "Token Decimal", content: lptokenDecimal },
              ]}
            />
          ) : null}

          <CardTwoColumn
            title="Reward Token Information"
            data={[
              { title: "Token Name", content: tokenName },
              {
                title: "Contract Address",
                content: <AddressCopier address={tokenContract} />,
              },
              {
                title: "Total Supply",
                content: `${formatNumDynDecimal(tokenTotalSupply)}`,
              },
              { title: "Token Symbol", content: tokenSymbol },
              { title: "Token Decimal", content: tokenDecimal },
            ]}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default PoolInfo;
