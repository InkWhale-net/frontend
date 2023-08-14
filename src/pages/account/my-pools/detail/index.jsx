import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  HStack,
  Show,
  Stack,
  Text,
  VStack,
  Link,
  Button,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";

import IWCard from "components/card/Card";
import ConfirmModal from "components/modal/ConfirmModal";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
import { useLocation, useParams } from "react-router-dom";
import { addressShortener } from "utils";
import { formatNumDynDecimal } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import psp22_contract from "utils/contracts/psp22_contract";
import { formatQueryResultToNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import { useEffect } from "react";
import { execContractTx } from "utils/contracts";
import pool_contract from "utils/contracts/pool_contract";
import { delay } from "utils";
import { formatNumToBN } from "utils";
import { toast } from "react-hot-toast";
import { formatChainStringToNumber } from "utils";
import { useCallback } from "react";
import { toastMessages } from "constants";
import { APICall } from "api/client";
import { BannerCard } from "components/card/Card";
import { NFTBannerCard } from "components/card/Card";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import { useMemo } from "react";
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { isPoolEnded } from "utils";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";
import { fetchMyTokenPools } from "redux/slices/myPoolsSlice";
import { fetchAllTokenPools } from "redux/slices/allPoolsSlice";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { fetchMyNFTPools } from "redux/slices/myPoolsSlice";
import { fetchAllNFTPools } from "redux/slices/allPoolsSlice";
import AddressCopier from "components/address-copier/AddressCopier";
import { BN } from "bn.js";
import { roundUp } from "utils";
import { roundDown } from "utils";
import { formatTokenAmount } from "utils";

export default function MyPoolDetailPage({ api }) {
  const [state, setState] = useState({});
  const { currentAccount } = useSelector((s) => s.wallet);
  const { myStakingPoolsList, myNFTPoolsList, myTokenPoolsList } = useSelector(
    (s) => s.myPools
  );
  const params = useParams();

  // const { state } = useLocation();
  const currentStakingPool = useMemo(() => {
    const item = myStakingPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
    if (item) {
      setState({ mode: "STAKING_POOL" });
    }
    return item;
  }, [myStakingPoolsList, params]);

  const currentNFTPool = useMemo(() => {
    const item = myNFTPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
    if (item) {
      setState({ mode: "NFT_FARM" });
    }
    return item;
  }, [myNFTPoolsList, params]);

  const currentTokenPool = useMemo(() => {
    const item = myTokenPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
    if (item) {
      setState({ mode: "TOKEN_FARM" });
    }
    return item;
  }, [myTokenPoolsList, params]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stakingPoolCardData = {
    cardHeaderList: [
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

    cardValue: {
      ...currentStakingPool,
    },
  };

  const tokenPoolCardData = {
    cardHeaderList: [
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
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 NFT in 24 hours.`,
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

    cardValue: {
      ...currentTokenPool,
    },
  };

  const nftPoolCardData = {
    cardHeaderList: [
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
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 NFT in 24 hours.`,
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

    cardValue: {
      ...currentNFTPool,
    },
  };

  const nftBannerCardData = {
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
          href={`https://a0.artzero.io/collection/${currentNFTPool?.nftInfo?.nftContractAddress}`}
        >
          {currentNFTPool?.nftInfo?.name}
        </Link>
      ),
      volume: `${currentNFTPool?.nftInfo?.volume} AZERO`,
      totalSupply: `${currentNFTPool?.nftInfo?.nft_count} NFT${
        currentNFTPool?.nftInfo?.nft_count > 1 && "s"
      }`,
      royaltyFee: `${(currentNFTPool?.nftInfo?.royaltyFee / 100).toFixed(2)}%`,
    },
  };

  return (
    <>
      <Show above="md">
        <SectionContainer mt={{ xl: "-48px" }} mb={{ xl: "-32px" }}>
          <Breadcrumb
            spacing="4px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem color="text.1">
              <BreadcrumbLink href="#/my-pools">My Pools</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.2">
              <BreadcrumbLink>Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </SectionContainer>
      </Show>

      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title={`${
          state?.mode === "STAKING_POOL"
            ? "Staking Pool Detail"
            : state?.mode === "NFT_FARM"
            ? "NFT Staking Pools"
            : state?.mode === "TOKEN_FARM"
            ? "Token Staking Pool"
            : "Pools"
        }`}
      >
        {state?.mode === "STAKING_POOL" ? (
          <BannerCard cardData={stakingPoolCardData} mode={state?.mode} />
        ) : state?.mode === "TOKEN_FARM" ? (
          <BannerCard cardData={tokenPoolCardData} mode={state?.mode} />
        ) : state?.mode === "NFT_FARM" ? (
          <BannerCard cardData={nftPoolCardData} mode={state?.mode} />
        ) : (
          ""
        )}
      </SectionContainer>

      <SectionContainer mt={{ base: "-28px", xl: "-48px" }}>
        {state?.mode === "NFT_FARM" ? (
          <NFTBannerCard
            cardData={nftBannerCardData}
            nftInfo={currentNFTPool?.nftInfo}
          />
        ) : null}
      </SectionContainer>

      <SectionContainer mt={{ base: "-28px", xl: "-48px" }}>
        {state?.mode === "STAKING_POOL" ? (
          <MyPoolInfo
            mode={state?.mode}
            {...currentStakingPool}
            {...currentAccount}
          />
        ) : state?.mode === "NFT_FARM" ? (
          <MyPoolInfo
            mode={state?.mode}
            {...currentNFTPool}
            {...currentAccount}
          />
        ) : state?.mode === "TOKEN_FARM" ? (
          <MyPoolInfo
            mode={state?.mode}
            {...currentTokenPool}
            {...currentAccount}
          />
        ) : (
          <></>
        )}
      </SectionContainer>
    </>
  );
}

const MyPoolInfo = ({
  tokenSymbol,
  address,
  balance,
  apy,
  poolContract,
  tokenContract,
  startTime,
  duration,
  totalStaked,
  rewardPool,
  maxStakingAmount,
  tokenName,
  tokenTotalSupply,
  mode,
  multiplier,
  nftInfo,
  lptokenContract,
  lptokenSymbol,
  lptokenName,
  lptokenTotalSupply,
  tokenDecimal,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { currentAccount, api } = useSelector((s) => s.wallet);

  const [tokenBalance, setTokenBalance] = useState();

  const [amount, setAmount] = useState("");

  const [withdrawbleAm, setWithdrawbleAm] = useState("");

  const fetchTokenBalance = useCallback(async () => {
    if (!currentAccount?.balance) return;

    const result = await execContractQuery(
      currentAccount?.address,
      api,
      psp22_contract.CONTRACT_ABI,
      tokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balance = formatQueryResultToNumber(result, parseInt(tokenDecimal));
    setTokenBalance(balance);
    if (isPoolEnded(startTime, duration)) {
      const unclaimRwQr = await execContractQuery(
        currentAccount?.address,
        "api",
        pool_contract.CONTRACT_ABI,
        poolContract,
        0,
        "genericPoolContractTrait::totalUnclaimedReward"
      );
      const unclaimRw = formatQueryResultToNumber(
        unclaimRwQr,
        parseInt(tokenDecimal)
      );
      const withdrawableRs = rewardPool - +unclaimRw.replaceAll(",", "");
      setWithdrawbleAm(roundDown(withdrawableRs, 4));
    }
  }, [
    api,
    currentAccount?.address,
    currentAccount?.balance,
    duration,
    poolContract,
    rewardPool,
    startTime,
    tokenContract,
  ]);

  useEffect(() => {
    mode !== "TOKEN_FARM" && fetchTokenBalance();
  }, [fetchTokenBalance, mode]);

  const [LPtokenBalance, setLPTokenBalance] = useState();

  const fetchLPTokenBalance = useCallback(async () => {
    if (!currentAccount?.balance) return;

    const result = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      tokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );
    const balance = formatQueryResultToNumber(result);
    setTokenBalance(balance);
    const resultLP = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      lptokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balanceLP = formatQueryResultToNumber(resultLP);
    setLPTokenBalance(balanceLP);
  }, [
    currentAccount?.address,
    currentAccount?.balance,
    lptokenContract,
    tokenContract,
  ]);

  useEffect(() => {
    mode === "TOKEN_FARM" && fetchLPTokenBalance();
  }, [fetchLPTokenBalance, mode]);

  useEffect(() => {
    if (currentAccount && api) {
      dispatch(fetchAllNFTPools({ currentAccount }));
    }
  }, [currentAccount, api]);
  const cardData = useMemo(() => {
    let ret = [
      {
        title: "Account Address",
        content: address ? (
          <AddressCopier address={address} />
        ) : (
          "No account selected"
        ),
      },
      {
        title: "AZERO Balance",
        content: `${balance?.azero || 0} AZERO`,
      },
      {
        title: "INW Balance",
        content: `${balance?.inw || 0} INW`,
      },
      {
        title: `${tokenSymbol} Balance`,
        content: `${tokenBalance || 0} ${tokenSymbol}`,
      },
    ];

    if (mode === "TOKEN_FARM") {
      ret.push({
        title: `${lptokenSymbol} Balance`,
        content: `${LPtokenBalance || 0} ${lptokenSymbol}`,
      });
    }

    return ret;
  }, [
    LPtokenBalance,
    address,
    balance?.azero,
    balance?.inw,
    lptokenSymbol,
    mode,
    tokenBalance,
    tokenSymbol,
  ]);

  const setMaxReward = () => {
    if (roundUp(withdrawbleAm) > 0.0001) {
      setAmount(withdrawbleAm);
    }
  };

  async function handleAddRewards() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (isPoolEnded(startTime, duration)) {
      toast.error("Pool is ended!");
      return;
    }

    if (!amount) {
      toast.error("Invalid Amount!");
      return;
    }

    if (formatChainStringToNumber(tokenBalance) < amount) {
      toast.error("Not enough tokens!");
      return;
    }

    if (mode === "STAKING_POOL") {
      //Approve
      toast.success("Step 1: Approving...");

      let approve = await execContractTx(
        currentAccount,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0, //-> value
        "psp22::approve",
        poolContract,
        formatNumToBN(amount, tokenDecimal)
      );
      if (!approve) return;

      await delay(3000);

      toast.success("Step 2: Process...");

      await execContractTx(
        currentAccount,
        api,
        pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::topupRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "pool", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyStakingPools({ currentAccount }));
            dispatch(fetchAllStakingPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }

    if (mode === "NFT_FARM") {
      //Approve
      toast.success("Step 1: Approving...");

      let approve = await execContractTx(
        currentAccount,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0, //-> value
        "psp22::approve",
        poolContract,
        formatNumToBN(amount, tokenDecimal)
      );
      if (!approve) return;

      await delay(3000);

      toast.success("Step 2: Process...");

      await execContractTx(
        currentAccount,
        api,
        nft_pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::topupRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "nft", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyNFTPools({ currentAccount }));
            dispatch(fetchAllNFTPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }

    if (mode === "TOKEN_FARM") {
      //Approve
      toast.success("Step 1: Approving...");

      let approve = await execContractTx(
        currentAccount,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenContract,
        0, //-> value
        "psp22::approve",
        poolContract,
        formatNumToBN(amount, tokenDecimal)
      );
      if (!approve) return;

      await delay(3000);

      toast.success("Step 2: Process...");

      await execContractTx(
        currentAccount,
        api,
        lp_pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::topupRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "lp", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyTokenPools({ currentAccount }));
            dispatch(fetchAllTokenPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          fetchLPTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }
  }

  async function handleRemoveRewards() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!amount) {
      toast.error("Invalid Amount!");
      return;
    }

    let currentTime = new Date().getTime();

    if (currentTime < parseInt(startTime) + duration * 1000) {
      toast.error("You have to wait until pool ends to withdraw!");
      return;
    }

    if (rewardPool < amount) {
      toast.error("Not enough reward tokens!");
      return;
    }
    if (mode === "STAKING_POOL") {
      toast.success("Process...");
      await execContractTx(
        currentAccount,
        api,
        pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::withdrawRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "pool", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyStakingPools({ currentAccount }));
            dispatch(fetchAllStakingPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }

    if (mode === "NFT_FARM") {
      toast.success("Process...");

      await execContractTx(
        currentAccount,
        api,
        nft_pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::withdrawRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "nft", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyNFTPools({ currentAccount }));
            dispatch(fetchAllNFTPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }

    if (mode === "TOKEN_FARM") {
      toast.success("Process...");

      await execContractTx(
        currentAccount,
        api,
        lp_pool_contract.CONTRACT_ABI,
        poolContract,
        0, //-> value
        "genericPoolContractTrait::withdrawRewardPool",
        formatNumToBN(amount, tokenDecimal)
      );

      await APICall.askBEupdate({ type: "pool", poolContract });

      await delay(3000);

      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchMyTokenPools({ currentAccount }));
            dispatch(fetchAllTokenPools({ currentAccount }));
            dispatch(fetchUserBalance({ currentAccount, api }));
          }

          fetchTokenBalance();
          fetchLPTokenBalance();
          setAmount("");
        }),
        {
          loading: "Please wait up to 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
      );
    }
  }
  return (
    <>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCardOneColumn title="My Account" data={cardData} />

        <VStack flexDirection="column" spacing="30px">
          <CardThreeColumn
            title="General Information"
            data={[
              {
                title: "Pool Contract Address",
                content: <AddressCopier address={poolContract} />,
              },
              {
                title: mode === "STAKING_POOL" ? "APR" : "Multiplier",
                content:
                  mode === "STAKING_POOL"
                    ? `${apy / 100}%`
                    : mode === "NFT_FARM"
                    ? `${(multiplier / 10 ** 12).toFixed(2)}`
                    : mode === "TOKEN_FARM"
                    ? `${(multiplier / 10 ** 6).toFixed(2)}`
                    : `${apy / 100}%`,
              },
              {
                title: "Start Date",
                content: `${new Date(startTime).toLocaleString("en-US")}`,
              },
              {
                title: "Pool Length (days)",
                content: `${duration / 86400}`,
              },
              {
                title: "Reward Pool",
                content: `${formatNumDynDecimal(rewardPool)} ${tokenSymbol}`,
              },
              {
                title: "Withdrawble Amount",
                content: `${formatNumDynDecimal(withdrawbleAm)} ${tokenSymbol}`,
              },
              {
                title: "Max Staking Amount",
                content: `${formatNumDynDecimal(
                  formatTokenAmount(maxStakingAmount, tokenDecimal)
                )} ${tokenSymbol}`,
              },
              {
                title: "Total Value Locked",
                content: `${formatNumDynDecimal(totalStaked)} ${
                  mode === "NFT_FARM"
                    ? `NFT`
                    : mode === "TOKEN_FARM"
                    ? lptokenSymbol
                    : tokenSymbol
                }`,
              },
            ]}
          >
            <IWCard mt="24px" w="full" variant="solid">
              <Flex
                w="100%"
                spacing="20px"
                flexDirection={{ base: "column", lg: "row" }}
                alignItems={{ base: "center", lg: "center" }}
              >
                <IWInput
                  value={amount}
                  onChange={({ target }) => setAmount(target.value)}
                  type="number"
                  placeholder="Enter amount to remove"
                  inputRightElementIcon={
                    <Button w="50px" height={"40px"} onClick={setMaxReward}>
                      Max
                    </Button>
                  }
                />

                <HStack
                  ml={{ base: "0", lg: "20px" }}
                  mt={{ base: "10px", lg: "0px" }}
                  maxW={{ base: "full", lg: "50%" }}
                  w="full"
                  spacing="10px"
                  justifyContent="space-between"
                >
                  {/* <ConfirmModal
                    action="stake"
                    buttonVariant="primary"
                    buttonLabel="Add Rewards"
                    onClick={handleAddRewards}
                    message={`Add to reward pool ${amount} ${tokenSymbol}. Continue?`}
                  /> */}

                  <ConfirmModal
                    action="unstake"
                    buttonVariant="primary"
                    buttonLabel="Remove Rewards"
                    onClick={handleRemoveRewards}
                    disableBtn={!(withdrawbleAm > 0.0001 && amount > 0)}
                    message={`Remove from reward pool ${amount} ${tokenSymbol}. Continue?`}
                  />
                </HStack>
              </Flex>
            </IWCard>

            <Text
              mt="10px"
              textAlign="left"
              w="full"
              fontSize="md"
              lineHeight="28px"
            >
              Note: You will be able to withdraw undistributed rewards after
              Pool is expired on{" "}
              <Text as="span" color="black">
                {new Date(startTime + duration * 1000).toLocaleString("en-US")}
              </Text>
            </Text>
          </CardThreeColumn>

          {mode === "TOKEN_FARM" ? (
            <>
              {" "}
              <CardTwoColumn
                title="Staking Token Information"
                data={[
                  { title: "Token Name", content: lptokenName },
                  {
                    title: "Contract Address",
                    content: <AddressCopier address={lptokenContract} />,
                  },
                  {
                    title: "Total Supply",
                    content: `${formatNumDynDecimal(
                      lptokenTotalSupply,
                      0
                    )} ${lptokenSymbol}`,
                  },
                  { title: "Token Symbol", content: lptokenSymbol },
                ]}
              />
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
                    content: `${formatNumDynDecimal(
                      tokenTotalSupply,
                      0
                    )} ${tokenSymbol}`,
                  },
                  { title: "Token Symbol", content: tokenSymbol },
                ]}
              />
            </>
          ) : (
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
                  content: `${formatNumDynDecimal(
                    tokenTotalSupply,
                    0
                  )} ${tokenSymbol}`,
                },
                { title: "Token Symbol", content: tokenSymbol },
              ]}
            />
          )}
        </VStack>
      </Stack>
    </>
  );
};
