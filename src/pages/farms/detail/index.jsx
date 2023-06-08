import { ChevronRightIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  HStack,
  Link,
  Show,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { useParams } from "react-router-dom";
import IWCard from "components/card/Card";
import IWTabs from "components/tabs/IWTabs";
import ConfirmModal from "components/modal/ConfirmModal";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import IWCardNFTWrapper from "components/card/CardNFTWrapper";
import { formatDataCellTable } from "components/table/IWTable";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { execContractQuery } from "utils/contracts";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import { formatChainStringToNumber } from "utils";
import psp22_contract from "utils/contracts/psp22_contract";
import { formatQueryResultToNumber } from "utils";
import { addressShortener } from "utils";
import { formatNumDynDecimal } from "utils";
import { calcUnclaimedRewardNftLP } from "utils";
import { toast } from "react-hot-toast";
import { toastMessages } from "constants";
import { execContractTx } from "utils/contracts";
import { delay } from "utils";
import { APICall } from "api/client";
import { formatNumToBN } from "utils";
import psp34_standard from "utils/contracts/psp34_standard";
import azt_contract from "utils/contracts/azt_contract";
import { calcUnclaimedRewardTokenLP } from "utils";
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import IWInput from "components/input/Input";
import { NFTBannerCard } from "components/card/Card";
import { useMemo } from "react";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { fetchAllNFTPools } from "redux/slices/allPoolsSlice";
import { fetchAllTokenPools } from "redux/slices/allPoolsSlice";
import { isPoolEnded } from "utils";
import useInterval from "hook/useInterval";
import AddressCopier from "components/address-copier/AddressCopier";
import { isPoolNotStart } from "utils";

export default function FarmDetailPage() {
  const params = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allNFTPoolsList, allTokenPoolsList } = useSelector((s) => s.allPools);

  const currentNFTPool = useMemo(() => {
    return allNFTPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
  }, [allNFTPoolsList, params?.contractAddress]);

  const currentTokenPool = useMemo(() => {
    return allTokenPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );
  }, [allTokenPoolsList, params?.contractAddress]);

  const currMode = currentNFTPool?.NFTtokenContract
    ? "NFT_FARM"
    : currentTokenPool?.lptokenContract
    ? "TOKEN_FARM"
    : "NO_MODE";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cardData = {
    cardHeaderList: [
      {
        name: currMode === "NFT_FARM" ? "nftInfo" : "lptokenName",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake",
      },
      {
        name: "tokenName",
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
      ...currentTokenPool,
      totalStaked:
        currMode === "NFT_FARM"
          ? currentNFTPool?.totalStaked
          : currentTokenPool?.totalStaked,
      rewardPool:
        currMode === "NFT_FARM"
          ? currentNFTPool?.rewardPool
          : currentTokenPool?.rewardPool,
    },
  };

  const tabsData = [
    {
      label: "My Stakes & Rewards",
      component:
        currMode === "NFT_FARM" ? (
          <MyStakeRewardInfoNFT
            mode={currMode}
            {...currentNFTPool}
            {...currentAccount}
          />
        ) : (
          <MyStakeRewardInfoToken
            mode={currMode}
            {...currentTokenPool}
            {...currentAccount}
          />
        ),
      isDisabled: false,
    },
    {
      label: <>Pool Information</>,
      component: (
        <PoolInfo
          mode={currMode}
          {...currentNFTPool}
          {...currentTokenPool}
          rewardPool={
            currMode === "NFT_FARM"
              ? currentNFTPool?.rewardPool
              : currentTokenPool?.rewardPool
          }
          totalStaked={
            currMode === "NFT_FARM"
              ? currentNFTPool?.totalStaked
              : currentTokenPool?.totalStaked
          }
        />
      ),
      isDisabled: false,
    },
  ];

  return (
    <>
      <Show above="md">
        <SectionContainer mt={{ xl: "-48px" }} mb={{ xl: "-32px" }}>
          <Breadcrumb
            spacing="4px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem color="text.1">
              <BreadcrumbLink href="#/farms">Yield Farm</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.2">
              <BreadcrumbLink>
                {currMode === "NFT_FARM" ? "NFT " : "Token"} Yield Farm
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </SectionContainer>
      </Show>

      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title={`${
          currMode === "NFT_FARM"
            ? "NFT"
            : currMode === "TOKEN_FARM"
            ? "Token"
            : null
        } Yield Farm`}
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column" }}
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
            >
              {cardData?.cardHeaderList?.map(
                ({ name, hasTooltip, label, tooltipContent }) => {
                  return name === "myStake" ? null : (
                    <Flex
                      mt={{ base: "15px", lg: "0px" }}
                      w={{ lg: "fit-content" }}
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
                        {hasTooltip && (
                          <Tooltip fontSize="md" label={tooltipContent}>
                            <QuestionOutlineIcon ml="6px" color="text.2" />
                          </Tooltip>
                        )}
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
                          {formatDataCellTable(
                            cardData?.cardValue,
                            name,
                            currMode
                          )}
                        </Text>{" "}
                      </Flex>
                    </Flex>
                  );
                }
              )}
            </Flex>
          </IWCard>
        </Stack>
      </SectionContainer>

      <SectionContainer mt={{ base: "-28px", xl: "-48px" }}>
        <IWTabs tabsData={tabsData} />
      </SectionContainer>
    </>
  );
}

// NFT LP
const MyStakeRewardInfoNFT = ({
  mode,
  tokenSymbol,
  address,
  balance,
  apy,
  poolContract,
  tokenContract,
  rewardPool,
  nftInfo,
  tokenDecimal,
  multiplier,
  NFTtokenContract,
  startTime,
  duration,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { currentAccount, api } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);

  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();
  const [availableNFT, setAvailableNFT] = useState(null);
  const [stakedNFT, setStakedNFT] = useState(null);

  const fetchUserStakeInfo = useCallback(async () => {
    if (!currentAccount?.balance) return;

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      nft_pool_contract.CONTRACT_ABI,
      poolContract,
      0,
      "genericPoolContractTrait::getStakeInfo",
      currentAccount?.address
    );

    let info = queryResult?.toHuman().Ok;
    if (info) {
      info = {
        ...info,
        lastRewardUpdate: formatChainStringToNumber(info.lastRewardUpdate),
        stakedValue: formatChainStringToNumber(info.stakedValue),
        unclaimedReward: formatChainStringToNumber(info.unclaimedReward),
      };
    }

    setStakeInfo(info);
  }, [currentAccount?.address, currentAccount?.balance, poolContract]);

  const fetchTokenBalance = useCallback(async () => {
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
  }, [currentAccount?.address, currentAccount?.balance, tokenContract]);

  useEffect(() => {
    fetchUserStakeInfo();
    fetchTokenBalance();
  }, [fetchTokenBalance, fetchUserStakeInfo]);

  const fetchAvailableNFT = useCallback(async () => {
    const { status, ret } =
      await APICall.getNFTsByOwnerAndCollectionFromArtZero({
        collection_address: nftInfo?.nftContractAddress,
        owner: currentAccount?.address,
      });

    if (status === "OK") {
      setAvailableNFT(ret);
    }
  }, [currentAccount?.address, nftInfo?.nftContractAddress]);

  const fetchStakedNFT = useCallback(async () => {
    let isUnmounted = false;

    if (stakeInfo?.stakedValue === 0) {
      setStakedNFT([]);
    }

    if (stakeInfo?.stakedValue > 0) {
      const listData = await Promise.all(
        [...Array(stakeInfo?.stakedValue)].map(async (_, idx) => {
          if (!currentAccount?.balance) return;

          let queryResult = await execContractQuery(
            currentAccount?.address,
            "api",
            nft_pool_contract.CONTRACT_ABI,
            poolContract,
            0,
            "nftStakingListTrait::getStakedId",
            currentAccount?.address,
            idx
          );

          let stakedID = queryResult?.toHuman().Ok;

          const { status, ret } = await APICall.getNFTByIdFromArtZero({
            collection_address: nftInfo?.nftContractAddress,
            token_id: parseInt(stakedID?.U64),
          });

          if (status === "OK") {
            return ret[0];
          }
        })
      );
      if (isUnmounted) return;

      setStakedNFT(listData);
    }
    return () => (isUnmounted = true);
  }, [
    currentAccount?.address,
    currentAccount?.balance,
    nftInfo?.nftContractAddress,
    poolContract,
    stakeInfo,
  ]);

  useEffect(() => {
    fetchStakedNFT();
    fetchAvailableNFT();
  }, [fetchAvailableNFT, fetchStakedNFT]);

  useEffect(() => {
    const fetchFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        nft_pool_contract.CONTRACT_ABI,
        poolContract,
        0,
        "genericPoolContractTrait::unstakeFee"
      );

      const fee = formatQueryResultToNumber(result);
      setUnstakeFee(fee);
    };

    fetchFee();
  }, [currentAccount?.address, currentAccount?.balance, poolContract]);

  const tabsNFTData = [
    {
      label: "Available NFTs",
      component: (
        <AvailableNFTs
          action="Stake NFT"
          unstakeFee={unstakeFee}
          data={availableNFT}
          actionHandler={stakeNftHandler}
        />
      ),
      isDisabled: false,
    },
    {
      label: "Staked NFTs",
      component: (
        <StakedNFTs
          action="Unstake NFT"
          unstakeFee={unstakeFee}
          data={stakedNFT}
          actionHandler={unstakeNftHandler}
        />
      ),
      isDisabled: false,
    },
  ];

  async function handleClaimNFTLP() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    await execContractTx(
      currentAccount,
      "api",
      nft_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "claimReward"
    );

    await APICall.askBEupdate({ type: "pool", poolContract });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllNFTPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  async function stakeNftHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (isPoolEnded(startTime, duration)) {
      toast.error("Pool is ended!");
      return;
    }

    if (isPoolNotStart(startTime)) {
      toast.error("Pool is not start!");
      return;
    }

    if (!rewardPool || parseInt(rewardPool) <= 0) {
      toast.error("There is no reward balance in this pool!");
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp34_standard.CONTRACT_ABI,
      NFTtokenContract,
      0, //-> value
      "psp34::approve",
      poolContract,
      { u64: tokenID },
      true
    );
    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      nft_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "stake",
      { u64: tokenID }
    );

    await APICall.askBEupdate({ type: "nft", poolContract });
    await APICall.askBEupdate({ type: "pool", poolContract });
    await APICall.askBEupdateNFTFromArtZero({
      token_id: tokenID,
      collection_address: NFTtokenContract,
    });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllNFTPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();
        fetchAvailableNFT();
        fetchStakedNFT();
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  async function unstakeNftHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) < unstakeFee
    ) {
      toast.error(`You don't have enough INW. Unstake costs ${unstakeFee} INW`);
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee)
    );

    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      nft_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "unstake",
      { u64: tokenID }
    );

    await APICall.askBEupdate({ type: "nft", poolContract });
    await APICall.askBEupdate({ type: "pool", poolContract });
    await APICall.askBEupdateNFTFromArtZero({
      token_id: tokenID,
      collection_address: NFTtokenContract,
    });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllNFTPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();
        fetchAvailableNFT();
        fetchStakedNFT();
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  const [unclaimedRewardNFT, setUnclaimedRewardNFT] = useState(0);

  const updateStakingInfo = () => {
    const ret = calcUnclaimedRewardNftLP({
      ...stakeInfo,
      multiplier,
      tokenDecimal,
      startTime,
      duration,
    });
    setUnclaimedRewardNFT(ret);
  };

  useInterval(() => updateStakingInfo(), 1000);

  return (
    <>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCardOneColumn
          minW={{ base: "full", md: "280px", xl: "370px" }}
          w={{ base: "full", lg: "30%" }}
          title="My Account"
          data={[
            {
              title: "Account Address",
              content: address
                ? addressShortener(address)
                : "No account selected",
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
          ]}
        />
        <CardThreeColumn
          title="Staking Information"
          data={[
            {
              title: `My Stakes ${nftInfo?.name ? `(${nftInfo?.name})` : ""}`,
              content: `${formatNumDynDecimal(stakeInfo?.stakedValue)}`,
            },
            {
              title: "Last Claim",
              content: `${
                !currentAccount
                  ? "No account selected"
                  : !stakeInfo?.lastRewardUpdate
                  ? "Not claimed yet"
                  : new Date(stakeInfo?.lastRewardUpdate).toLocaleString(
                      "en-US"
                    )
              }`,
            },
            {
              title: "My Unclaimed Rewards ",
              content: `${unclaimedRewardNFT}`,
            },
          ]}
        >
          <ConfirmModal
            action="claim"
            buttonVariant="primary"
            buttonLabel="Claim Rewards"
            onClick={handleClaimNFTLP}
            disableBtn={!(+unclaimedRewardNFT > 0)}
            message="Claim All Rewards. Continue?"
          />
        </CardThreeColumn>
      </Stack>

      {mode === "NFT_FARM" ? (
        <SectionContainer
          px="0px"
          // mt={{ base: "-38px", xl: "-48px" }}
        >
          <IWTabs tabsData={tabsNFTData} />
        </SectionContainer>
      ) : null}
    </>
  );
};

// TOKEN LP
const MyStakeRewardInfoToken = ({
  mode,
  tokenSymbol,
  address,
  balance,
  apy,
  poolContract,
  tokenContract,
  rewardPool,
  nftInfo,
  tokenDecimal,
  multiplier,
  lptokenContract,
  duration,
  startTime,
  ...rest
}) => {
  const dispatch = useDispatch();

  const { currentAccount, api } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);

  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();

  const [LPTokenAmount, setLPTokenAmount] = useState();

  const [LPtokenBalance, setLPTokenBalance] = useState();

  const fetchUserStakeInfo = useCallback(async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      nft_pool_contract.CONTRACT_ABI,
      poolContract,
      0,
      "genericPoolContractTrait::getStakeInfo",
      currentAccount?.address
    );

    let info = queryResult?.toHuman().Ok;

    if (info) {
      info = {
        ...info,
        lastRewardUpdate: formatChainStringToNumber(info.lastRewardUpdate),
        stakedValue: formatChainStringToNumber(info.stakedValue),
        unclaimedReward: formatChainStringToNumber(info.unclaimedReward),
      };
    }

    setStakeInfo(info);
  }, [currentAccount, poolContract]);

  const fetchTokenBalance = useCallback(async () => {
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
  }, [currentAccount?.address, lptokenContract, tokenContract]);

  useEffect(() => {
    fetchUserStakeInfo();
    fetchTokenBalance();
  }, [fetchTokenBalance, fetchUserStakeInfo]);

  useEffect(() => {
    const fetchFee = async () => {
      if (!currentAccount?.balance) return;

      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        nft_pool_contract.CONTRACT_ABI,
        poolContract,
        0,
        "genericPoolContractTrait::unstakeFee"
      );

      const fee = formatQueryResultToNumber(result);
      setUnstakeFee(fee);
    };

    fetchFee();
  }, [currentAccount?.address, currentAccount?.balance, poolContract]);

  async function handleClaimTokenLP() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "claimReward"
    );

    await APICall.askBEupdate({ type: "lp", poolContract });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  async function stakeTokenLPHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (isPoolEnded(startTime, duration)) {
      toast.error("Pool is ended!");
      return;
    }

    if (!LPTokenAmount || LPTokenAmount < 0 || LPTokenAmount === "0") {
      toast.error("Invalid Amount!");
      return;
    }

    if (!rewardPool || parseInt(rewardPool) <= 0) {
      toast.error("There is no reward balance in this pool!");
      return;
    }

    if (formatChainStringToNumber(LPtokenBalance) < LPTokenAmount) {
      toast.error("There is not enough balance!");
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      lptokenContract,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(LPTokenAmount)
    );
    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "stake",
      formatNumToBN(LPTokenAmount)
    );

    await APICall.askBEupdate({ type: "lp", poolContract });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();

        setLPTokenAmount("");
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  async function unstakeTokenLPHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) < unstakeFee
    ) {
      toast.error(`You don't have enough INW. Unstake costs ${unstakeFee} INW`);
      return;
    }

    if (!LPTokenAmount || LPTokenAmount < 0 || LPTokenAmount === "0") {
      toast.error("Invalid Amount!");
      return;
    }

    if (stakeInfo?.stakedValue / 10 ** 12 < LPTokenAmount) {
      toast.error("There is not enough balance!");
      return;
    }

    //Approve
    toast.success("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee)
    );

    if (!approve) return;

    await delay(3000);

    toast.success("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "unstake",
      formatNumToBN(LPTokenAmount)
    );

    await APICall.askBEupdate({ type: "lp", poolContract });

    await delay(3000);

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchUserStakeInfo();
        fetchTokenBalance();

        setLPTokenAmount("");
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }

  const [unclaimedRewardToken, setUnclaimedRewardToken] = useState(0);

  const updateStakingInfo = () => {
    const ret = calcUnclaimedRewardTokenLP({
      ...stakeInfo,
      multiplier,
      tokenDecimal,
    });
    setUnclaimedRewardToken(ret);
  };

  useInterval(() => updateStakingInfo(), 1000);

  return (
    <>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        <IWCardOneColumn
          minW={{ base: "full", md: "280px", xl: "370px" }}
          w={{ base: "full", lg: "30%" }}
          title="My Account"
          data={[
            {
              title: "Account Address",
              content: address
                ? addressShortener(address)
                : "No account selected",
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
            {
              title: `${rest?.lptokenSymbol} Balance`,
              content: `${LPtokenBalance || 0} ${rest?.lptokenSymbol}`,
            },
          ]}
        />
        <CardThreeColumn
          title="Staking Information"
          data={[
            {
              title: `My Stakes ${nftInfo?.name ? `(${nftInfo?.name})` : ""}`,
              content: `${formatNumDynDecimal(
                stakeInfo?.stakedValue / 10 ** 12
              )}`,
            },
            {
              title: "Last Claim",
              content: `${
                !currentAccount
                  ? "No account selected"
                  : !stakeInfo?.lastRewardUpdate
                  ? "Not claimed yet"
                  : new Date(stakeInfo?.lastRewardUpdate).toLocaleString(
                      "en-US"
                    )
              }`,
            },
            {
              title: "My Unclaimed Rewards ",
              content: `${unclaimedRewardToken}`,
            },
          ]}
        >
          <ConfirmModal
            action="claim"
            buttonVariant="primary"
            buttonLabel="Claim Rewards"
            disableBtn={!+unclaimedRewardToken > 0}
            onClick={handleClaimTokenLP}
            message="Claim All Rewards. Continue?"
          />
          <IWCard mt="24px" w="full" variant="solid">
            <Flex
              w="100%"
              spacing="20px"
              flexDirection={{ base: "column", lg: "row" }}
              alignItems={{ base: "center", lg: "center" }}
            >
              <IWInput
                value={LPTokenAmount}
                onChange={({ target }) => setLPTokenAmount(target.value)}
                type="number"
                placeholder="Enter amount"
                inputRightElementIcon={
                  <Heading as="h5" size="h5">
                    {rest?.lptokenSymbol}
                  </Heading>
                }
              />

              <HStack
                ml={{ base: "0", lg: "20px" }}
                mt={{ base: "10px", lg: "0px" }}
                maxW={{ base: "full", lg: "245px" }}
                w="full"
                spacing="10px"
                justifyContent="space-between"
              >
                <ConfirmModal
                  action="stake"
                  buttonVariant="primary"
                  buttonLabel="Stake"
                  onClick={stakeTokenLPHandler}
                  message={`Stake ${LPTokenAmount || 0} ${
                    rest?.lptokenSymbol
                  }. Continue?`}
                />

                <ConfirmModal
                  action="unstake"
                  buttonVariant="primary"
                  buttonLabel="Unstake"
                  onClick={unstakeTokenLPHandler}
                  message={`Unstake costs ${unstakeFee} INW. Continue?`}
                />
                {}
              </HStack>
            </Flex>
          </IWCard>
        </CardThreeColumn>
      </Stack>
    </>
  );
};

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
          href={`https://artzero.io/demotestnet/#/collection/${nftInfo?.nftContractAddress}`}
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
              content:
                mode === "TOKEN_FARM"
                  ? (multiplier / 10 ** 18).toFixed(2)
                  : (multiplier / 10 ** 12).toFixed(2),
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
              content: `${formatNumDynDecimal(maxStakingAmount)} ${"NFT"}${
                mode === "NFT_FARM" && maxStakingAmount > 1 ? "s" : ""
              }`,
            },
            {
              title: "Total Value Locked",
              content: `${formatNumDynDecimal(totalStaked)} ${"NFT"}${
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
                  content: addressShortener(lptokenContract),
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
                content: addressShortener(tokenContract),
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

const AvailableNFTs = (props) => {
  // { data, action, actionHandler }
  const { currentAccount } = useSelector((s) => s.wallet);

  if (!currentAccount?.address) {
    // return <Text>Please connect wallet!<Text/>
    return (
      <Heading size="h5" textAlign="center">
        Please connect wallet!
      </Heading>
    );
  }

  return (
    <>
      <Stack
        w="full"
        spacing="30px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        {props?.data?.length === 0 ? (
          <Text textAlign="center" w="full">
            There is no available NFTs
          </Text>
        ) : (
          <IWCardNFTWrapper {...props} />
        )}
      </Stack>
    </>
  );
};

const StakedNFTs = (props) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  if (!currentAccount?.address) {
    // return <Text>Please connect wallet!<Text/>
    return (
      <Heading size="h5" textAlign="center">
        Please connect wallet!
      </Heading>
    );
  }

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      {props?.data?.length === 0 ? (
        <Text textAlign="center" w="full">
          There is no staked NFTs
        </Text>
      ) : (
        <IWCardNFTWrapper {...props} />
      )}
    </Stack>
  );
};
