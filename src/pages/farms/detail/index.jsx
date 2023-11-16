import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
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
import { formatDataCellTable } from "components/table/IWPaginationTable";
import IWTabs from "components/tabs/IWTabs";
import { toastMessages } from "constants";
import { useAppContext } from "contexts/AppContext";
import useInterval from "hook/useInterval";
import { MaxStakeButton } from "pages/pools/detail/MaxStakeButton";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
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
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import nft_pool_contract from "utils/contracts/nft_pool_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import psp34_standard from "utils/contracts/psp34_standard";
import PoolInfo from "./PoolInfor";
import { formatTextAmount } from "utils";

const FarmDetailPage = () => {
  const params = useParams();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { allNFTPoolsList, allTokenPoolsList } = useSelector((s) => s.allPools);
  const [refetchData, setRefetchData] = useState();
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0);

  const farmMode = useMemo(() => {
    if (location.pathname.includes("/farming/")) return "TOKEN_FARM";
    if (location.pathname.includes("/farms/")) return "NFT_FARM";
    return 0;
  }, [currentAccount, location, api]);

  const [currentNFTPoolData, setCurrentNFTPoolData] = useState(null);

  const currentNFTPool = useMemo(
    () =>
      allNFTPoolsList?.find((p) => p?.poolContract === params?.contractAddress),
    [allNFTPoolsList, params?.contractAddress]
  );

  const currentTokenPool = useMemo(
    () =>
      allTokenPoolsList?.find(
        (p) => p?.poolContract === params?.contractAddress
      ),
    [allTokenPoolsList, params?.contractAddress]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateTokenData = async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
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
    if (currentNFTPool && farmMode === "NFT_FARM") {
      updateTokenData();
    }
  }, [currentNFTPool]);

  useEffect(() => {
    if (farmMode == "TOKEN_FARM") {
      dispatch(fetchAllTokenPools({ currentAccount }));
    }
    if (farmMode == "NFT_FARM") {
      dispatch(fetchAllNFTPools({ currentAccount }));
    }
  }, [currentAccount, api, farmMode]);

  const cardData = {
    cardHeaderList: [
      {
        name: farmMode == "NFT_FARM" ? "nftInfo" : "lptokenName",
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
        tooltipContent:
          farmMode == "NFT_FARM"
            ? currentNFTPool?.isMaxStakingAmount
              ? "Max Staking Amount reached"
              : "Total Value Locked: Total NFT staked into this pool"
            : currentTokenPool?.isMaxStakingAmount
            ? "Max Staking Amount reached"
            : "Total Value Locked: Total tokens staked into this pool",
        label: "TVL",
        tooltipIcon:
          farmMode == "NFT_FARM"
            ? currentNFTPool?.isMaxStakingAmount && (
                <AiOutlineExclamationCircle ml="6px" color="text.1" />
              )
            : currentTokenPool?.isMaxStakingAmount && (
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
        tooltipContent: `Multiplier determines how many reward tokens will the staker receive per 1 ${
          farmMode === "NFT_FARM" ? "NFT" : "token"
        } in 24 hours.`,
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
      rewardPool:
        farmMode === "NFT_FARM"
          ? currentNFTPool?.rewardPool
          : currentTokenPool?.rewardPool,
    },
  };

  const tabsData = [
    {
      label: "My Stakes & Rewards",
      component:
        farmMode === "NFT_FARM" ? (
          <MyStakeRewardInfoNFT
            mode={farmMode}
            refetchData={refetchData}
            currentNFTPool={currentNFTPool}
            {...currentNFTPool}
            {...currentAccount}
          />
        ) : (
          <MyStakeRewardInfoToken
            mode={farmMode}
            {...currentTokenPool}
            {...currentAccount}
          />
        ),
      isDisabled: false,
    },
    {
      label: <>Pool Info</>,
      component: (
        <PoolInfo
          mode={farmMode}
          {...currentNFTPoolData}
          {...currentTokenPool}
          rewardPool={
            farmMode === "NFT_FARM"
              ? currentNFTPool?.rewardPool
              : currentTokenPool?.rewardPool
          }
          totalStaked={
            farmMode === "NFT_FARM"
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
        <SectionContainer>
          <Breadcrumb
            spacing="4px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem color="text.2">
              <BreadcrumbLink
                href={farmMode === "NFT_FARM" ? "#/farms" : "#/farming"}
              >
                {farmMode === "NFT_FARM" ? "NFT Staking Pool" : "Token Farming"}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.1">
              <BreadcrumbLink>Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </SectionContainer>
      </Show>

      <SectionContainer
        title={`${
          farmMode === "NFT_FARM"
            ? "NFT Staking Pool"
            : farmMode === "TOKEN_FARM"
            ? "Token Farming"
            : null
        }`}
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
                            farmMode
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
        mode={farmMode}
        refetchData={refetchData}
        setRefetchData={setRefetchData}
        {...currentNFTPool}
      />
    </>
  );
};

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
  currentNFTPool,
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
        lastRewardUpdate: Number(
          formatChainStringToNumber(info.lastRewardUpdate)
        ),
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
      psp22_contract_v2.CONTRACT_ABI,
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
  }, [fetchTokenBalance, fetchUserStakeInfo, poolContract]);

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
        [...Array(+stakeInfo?.stakedValue)].map(async (_, idx) => {
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
          disableBtn={currentNFTPool?.isMaxStakingAmount}
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

    await delay(2000);

    fetchUserStakeInfo();
    fetchTokenBalance();

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
    toast("Step 1: Approving...");

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

    toast("Step 2: Process...");

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
      +formatTextAmount(currentAccount?.balance?.inw2) <
      +formatTextAmount(unstakeFee)
    ) {
      toast.error(
        `You don't have enough INW V2. Unstake costs ${unstakeFee} INW V2`
      );
      return;
    }

    //Approve
    toast("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      psp22_contract_v2.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee)
    );

    if (!approve) return;

    await delay(3000);

    toast("Step 2: Process...");

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
              title: "INW V2 Balance",
              content: `${
                formatNumDynDecimal(formatTextAmount(balance?.inw2)) || 0
              } INW V2`,
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
  lptokenDecimal,
  lptokenSymbol,
  multiplier,
  lptokenContract,
  duration,
  startTime,
  totalStaked,
  maxStakingAmount,
  ...rest
}) => {
  const dispatch = useDispatch();
  const { currentAccount, api } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);

  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();

  const [LPTokenAmount, setLPTokenAmount] = useState();

  const [LPtokenBalance, setLPTokenBalance] = useState();
  const availableStakeAmount = +maxStakingAmount - +totalStaked;
  const fetchUserStakeInfo = useCallback(async () => {
    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0,
      "genericPoolContractTrait::getStakeInfo",
      currentAccount?.address
    );

    let info = queryResult?.toHuman().Ok;
    if (info) {
      info = {
        ...info,
        stakedValue: formatChainStringToNumber(info.stakedValue),
        lastRewardUpdate: Number(
          formatChainStringToNumber(info.lastRewardUpdate)
        ),
        unclaimedReward: formatChainStringToNumber(info.unclaimedReward),
      };
    }
    setStakeInfo(info);
  }, [currentAccount, poolContract]);

  const fetchTokenBalance = useCallback(async () => {
    const result = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      tokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balance = formatQueryResultToNumber(result, tokenDecimal);
    setTokenBalance(balance);
    const resultLP = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      lptokenContract,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const balanceLP = formatQueryResultToNumber(resultLP, lptokenDecimal);
    setLPTokenBalance(formatChainStringToNumber(balanceLP));
  }, [currentAccount?.address, lptokenContract, tokenContract]);

  useEffect(() => {
    fetchUserStakeInfo();
    fetchTokenBalance();
  }, [fetchTokenBalance, fetchUserStakeInfo]);

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

    await delay(2000);

    fetchUserStakeInfo();
    fetchTokenBalance();
    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }
      }),
      {
        loading: "Please wait up to 10s for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }
  const validateStakeTokenLP = async () => {
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

    if (+formatChainStringToNumber(LPtokenBalance) < +LPTokenAmount) {
      toast.error("There is not enough balance!");
      return;
    }
    if (!(availableStakeAmount - +LPTokenAmount >= 0)) {
      toast.error(`Max staking amount is ${availableStakeAmount}`);
      return;
    }
    return true;
  };
  async function onValidateUnstake() {
    try {
      let queryResult = await execContractQuery(
        currentAccount?.address,
        api,
        lp_pool_contract.CONTRACT_ABI,
        poolContract,
        0,
        "genericPoolContractTrait::getStakeInfo",
        currentAccount?.address
      );

      let info = queryResult?.toHuman().Ok;

      const userCurrentStake = info?.stakedValue
        ? formatTokenAmount(info?.stakedValue, +lptokenDecimal)
        : 0;
      console.log(userCurrentStake);
      if (+userCurrentStake === 0) {
        toast.error(`You musk stake first`);
        return false;
      }
      if (+LPTokenAmount > +userCurrentStake) {
        toast.error(
          `You can not unstake higher ${formatNumDynDecimal(
            userCurrentStake
          )} ${tokenSymbol}`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error(error);
      toast.error(`Unknow error`);
    }
  }
  async function stakeTokenLPHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    //Approve
    toast("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      lptokenContract,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(LPTokenAmount, lptokenDecimal)
    );
    if (!approve) return;

    await delay(3000);

    toast("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "stake",
      formatNumToBN(LPTokenAmount, lptokenDecimal)
    );

    await APICall.askBEupdate({ type: "lp", poolContract });

    await delay(2000);
    fetchUserStakeInfo();
    fetchTokenBalance();
    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

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
      +formatTextAmount(currentAccount?.balance?.inw2) <
      +formatTextAmount(unstakeFee)
    ) {
      toast.error(
        `You don't have enough INW V2. Unstake costs ${unstakeFee} INW V2`
      );
      return;
    }

    if (!LPTokenAmount || LPTokenAmount < 0 || LPTokenAmount === "0") {
      toast.error("Invalid Amount!");
      return;
    }
    if (
      Number(
        formatTokenAmount(stakeInfo?.stakedValue?.toString(), lptokenDecimal)
      ) < LPTokenAmount
    ) {
      toast.error("There is not enough balance!");
      return;
    }

    //Approve
    toast("Step 1: Approving...");

    let approve = await execContractTx(
      currentAccount,
      "api",
      psp22_contract_v2.CONTRACT_ABI,
      psp22_contract_v2.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::approve",
      poolContract,
      formatNumToBN(unstakeFee)
    );

    if (!approve) return;

    await delay(3000);

    toast("Step 2: Process...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "unstake",
      formatNumToBN(LPTokenAmount, lptokenDecimal)
    );

    await APICall.askBEupdate({ type: "lp", poolContract });

    await delay(3000);
    fetchUserStakeInfo();
    fetchTokenBalance();

    toast.promise(
      delay(10000).then(() => {
        if (currentAccount) {
          dispatch(fetchAllTokenPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

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
      lptokenDecimal,
      startTime,
      duration,
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
              title: "INW V2 Balance",
              content: `${
                formatNumDynDecimal(formatTextAmount(balance?.inw2)) || 0
              } INW V2`,
            },
            {
              title: `${tokenSymbol} Balance`,
              content: `${tokenBalance || 0} ${tokenSymbol}`,
            },
            {
              title: `${lptokenSymbol} Balance`,
              content: `${
                formatNumDynDecimal(LPtokenBalance) || 0
              } ${lptokenSymbol}`,
            },
          ]}
        />
        <CardThreeColumn
          title="Staking Information"
          data={[
            {
              title: `My Stakes ${nftInfo?.name ? `(${nftInfo?.name})` : ""}`,
              content: `${formatNumDynDecimal(
                +formatTokenAmount(
                  stakeInfo?.stakedValue?.toString(),
                  lptokenDecimal
                )
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
              content: `${unclaimedRewardToken || 0}`,
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
              alignItems={{ base: "flex-start", lg: "flex-start" }}
            >
              <Box>
                <IWInput
                  value={LPTokenAmount}
                  onChange={({ target }) => setLPTokenAmount(target.value)}
                  type="number"
                  placeholder="Enter amount"
                  inputRightElementIcon={
                    <MaxStakeButton
                      setStakeMax={() => {
                        if (
                          !(availableStakeAmount > 0) ||
                          isPoolEnded(startTime, duration) ||
                          isPoolNotStart(startTime, duration)
                        ) {
                          setLPTokenAmount(0);
                          return;
                        }

                        if (
                          +availableStakeAmount >
                          +formatTextAmount(LPtokenBalance)
                        )
                          setLPTokenAmount(LPtokenBalance.toString());

                        if (
                          +formatTextAmount(LPtokenBalance) >
                          +availableStakeAmount
                        )
                          setLPTokenAmount(availableStakeAmount.toString());
                      }}
                      setUnstakeMax={() => {
                        setLPTokenAmount(
                          formatTextAmount(
                            formatTokenAmount(
                              stakeInfo?.stakedValue?.toString(),
                              lptokenDecimal
                            )
                          )
                        );
                      }}
                    />
                  }
                />
                <Text sx={{ fontSize: "14px" }}>
                  {availableStakeAmount > 0
                    ? `Max staking amount: ${availableStakeAmount}`
                    : `Max staking amount reached`}
                </Text>
              </Box>

              <HStack
                ml={{ base: "0", lg: "20px" }}
                mt={{ base: "10px", lg: "0px" }}
                maxW={{ base: "full", lg: "245px" }}
                w="full"
                spacing="10px"
                justifyContent="space-between"
              >
                <ConfirmModal
                  disableBtn={
                    !(availableStakeAmount > 0) ||
                    isPoolEnded(startTime, duration) ||
                    isPoolNotStart(startTime, duration) ||
                    !(LPTokenAmount?.length > 0)
                  }
                  action="stake"
                  buttonVariant="primary"
                  buttonLabel="Stake"
                  onValidate={validateStakeTokenLP}
                  onClick={stakeTokenLPHandler}
                  message={formatMessageStakingPool(
                    "stake",
                    LPTokenAmount,
                    lptokenSymbol,
                    unstakeFee
                  )}
                />
                <ConfirmModal
                  disableBtn={
                    !(
                      +formatTokenAmount(
                        stakeInfo?.stakedValue,
                        lptokenDecimal
                      ) > 0
                    ) || !(LPTokenAmount?.length > 0)
                  }
                  action="unstake"
                  buttonVariant="primary"
                  buttonLabel="Unstake"
                  onValidate={onValidateUnstake}
                  onClick={unstakeTokenLPHandler}
                  message={formatMessageStakingPool(
                    "unstake",
                    LPTokenAmount,
                    lptokenSymbol,
                    unstakeFee
                  )}
                />
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

const formatMessageStakingPool = (action, amount, tokenSymbol, unstakeFee) => {
  if (action === "stake") {
    return (
      <>
        You are staking {amount} {tokenSymbol}.<br />
        Unstaking later will cost you {Number(unstakeFee)?.toFixed(0)} INW V2.
        Continue?
      </>
    );
  }

  if (action === "unstake") {
    return (
      <>
        You are unstaking {amount} {tokenSymbol}.<br />
        Unstaking will cost you {Number(unstakeFee)?.toFixed(0)} INW V2.
        Continue?
      </>
    );
  }
};
export default FarmDetailPage;
