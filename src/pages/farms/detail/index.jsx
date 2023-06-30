import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  Heading,
  Show,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { isBoolean } from "@polkadot/util";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import IWCardNFTWrapper from "components/card/CardNFTWrapper";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import NFTGroup from "components/card/NFTGroup";
import IWInput from "components/input/Input";
import ConfirmModal from "components/modal/ConfirmModal";
import { formatDataCellTable } from "components/table/IWTable";
import IWTabs from "components/tabs/IWTabs";
import { toastMessages } from "constants";
import useInterval from "hook/useInterval";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchAllNFTPools,
  fetchAllTokenPools,
} from "redux/slices/allPoolsSlice";
import { closeBulkDialog, updateUnstakeFee } from "redux/slices/bulkStakeSlide";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  calcUnclaimedRewardNftLP,
  calcUnclaimedRewardTokenLP,
  delay,
  formatChainStringToNumber,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  formatTokenAmount,
  isPoolEnded,
  isPoolNotStart,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import psp34_standard from "utils/contracts/psp34_standard";
import PoolInfo from "./PoolInfor";

export default function FarmDetailPage() {
  const params = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allNFTPoolsList, allTokenPoolsList } = useSelector((s) => s.allPools);
  const [refetchData, setRefetchData] = useState();

  const [currentNFTPoolData, setCurrentNFTPoolData] = useState(null);

  const currentNFTPool = useMemo(() => {
    const nftPool = allNFTPoolsList?.find(
      (p) => p?.poolContract === params?.contractAddress
    );

    return nftPool;
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
  const maxStaked = useMemo(() => {
    return !(
      parseFloat(currentNFTPool?.maxStakingAmount) -
        currentNFTPool?.totalStaked >
      0
    );
  }, [currentNFTPool]);
  const updateTokenData = async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      currentNFTPool?.tokenContract,
      0,
      "psp22::totalSupply"
    );
    const rawTotalSupply = queryResult.toHuman().Ok;

    setCurrentNFTPoolData({
      ...currentNFTPool,
      tokenTotalSupply: formatTokenAmount(
        rawTotalSupply.replaceAll(",", ""),
        currentNFTPool?.tokenDecimal
      ),
      maxStakingAmount: parseFloat(currentNFTPool?.maxStakingAmount),
    });
  };

  useEffect(() => {
    if (currentNFTPool) {
      updateTokenData();
    }
  }, [currentNFTPool]);

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
        tooltipContent: maxStaked
          ? "Max Staking Amount reached"
          : "Total Value Locked: Total tokens staked into this pool",
        label: "TVL",
        tooltipIcon: maxStaked && (
          <AiOutlineExclamationCircle ml="6px" color="text.1" />
        ),
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
      ...currentNFTPoolData,
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
            maxStaked={maxStaked}
            mode={currMode}
            refetchData={refetchData}
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
          {...currentNFTPoolData}
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
              <BreadcrumbLink href="#/farms">Staking Pool</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.2">
              <BreadcrumbLink>
                {currMode === "NFT_FARM" ? "NFT " : "Token"} Staking Pool
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
        } Staking Pool`}
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
                ({ name, hasTooltip, label, tooltipContent, tooltipIcon }) => {
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
                            <span style={{ marginLeft: "6px" }}>
                              {tooltipIcon ? (
                                tooltipIcon
                              ) : (
                                <AiOutlineQuestionCircle color="text.2" />
                              )}
                            </span>
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
      <NFTGroup
        mode={currMode}
        refetchData={refetchData}
        setRefetchData={setRefetchData}
        {...currentNFTPool}
      />
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
  refetchData,
  totalStaked,
  maxStakingAmount,
  maxStaked,
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

    const balance = formatQueryResultToNumber(result, tokenDecimal);
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
      setAvailableNFT(
        ret?.filter((nft) => nft?.owner === currentAccount?.address)
      );
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
          if (!!stakedID?.U64) {
            const { status, ret } = await APICall.getNFTByIdFromArtZero({
              collection_address: nftInfo?.nftContractAddress,
              token_id: stakedID?.U64?.replaceAll(",", ""),
            });

            if (status === "OK") {
              return ret[0];
            }
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
      dispatch(updateUnstakeFee(fee));
      setUnstakeFee(fee);
    };

    fetchFee();
  }, [currentAccount?.address, currentAccount?.balance, poolContract]);

  const tabsNFTData = [
    {
      label: "Available NFTs",
      component: (
        <AvailableNFTs
          disableBtn={maxStaked}
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

    await APICall.askBEupdate({ type: "nft", poolContract });

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

  const getStakeNft = () => {
    if (!isBoolean(refetchData)) return;
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
  };

  useEffect(() => {
    dispatch(closeBulkDialog());
    getStakeNft();
  }, [refetchData]);

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
    await APICall.askBEupdateNFTFromArtZero({
      token_id: tokenID,
      collection_address: NFTtokenContract,
    });

    await delay(3000);

    toast.promise({
      loading: "Please wait up to 10s for the data to be updated! ",
      success: "Done !",
      error: "Could not fetch data!!!",
    });
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
          <IWTabs
            tabsData={tabsNFTData}
            onChangeTab={() => dispatch(closeBulkDialog())}
          />
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
  }, [currentAccount?.address, poolContract]);

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

const AvailableNFTs = (props) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { isAllowStake } = props;

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
