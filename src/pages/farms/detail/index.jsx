import { ChevronRightIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  Hide,
  HStack,
  Link,
  Show,
  Square,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";

import { useLocation } from "react-router-dom";
import IWCard from "components/card/Card";
import IWTabs from "components/tabs/IWTabs";
import ConfirmModal from "components/modal/ConfirmModal";
import IWCardOneColumn from "components/card/CardOneColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
import CardThreeColumn from "components/card/CardThreeColumn";
import IWCardNFTWrapper from "components/card/CardNFTWrapper";
import { formatDataCellTable } from "components/table/IWTable";
import { useSelector } from "react-redux";
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
import AddressCopier from "components/address-copier/AddressCopier";
import CardSocial from "components/card/CardSocial";
import ImageCloudFlare from "components/image-cf/ImageCF";
import { calcUnclaimedRewardTokenLP } from "utils";
import lp_pool_contract from "utils/contracts/lp_pool_contract";
import IWInput from "components/input/Input";

export default function FarmDetailPage() {
  // const params = useParams();
  const { currentAccount } = useSelector((s) => s.wallet);

  const location = useLocation();

  const currMode = location?.state?.mode;
  const { state } = useLocation();

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
        tooltipContent: "Lorem lorem",
        label: "TVL",
      },
      {
        name: "rewardPool",
        hasTooltip: true,
        tooltipContent: "Lorem lorem",
        label: "Reward Pool",
      },
      {
        name: "multiplier",
        hasTooltip: true,
        tooltipContent: "Lorem lorem",
        label: "Multiplier",
      },
      {
        name: "startTime",
        hasTooltip: false,
        tooltipContent: "",
        label: "Expired In",
      },
    ],

    cardValue: {
      ...state,
    },
  };

  const tabsData = [
    {
      label: "My Stakes & Rewards",
      component:
        currMode === "NFT_FARM" ? (
          <MyStakeRewardInfoNFT {...state} {...currentAccount} />
        ) : (
          <MyStakeRewardInfoToken {...state} {...currentAccount} />
        ),
      isDisabled: false,
    },
    {
      label: (
        <>
          Pool Info<Show above="md">rmation</Show>
        </>
      ),
      component: <PoolInfo {...state} />,
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
                          {formatDataCellTable(cardData?.cardValue, name)}
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
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);

  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();
  const [availableNFT, setAvailableNFT] = useState([]);
  const [stakedNFT, setStakedNFT] = useState([]);

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

    let info = queryResult?.toHuman();

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

          let stakedID = queryResult?.toHuman();

          const { status, ret } = await APICall.getNftByIdFromArtZero({
            collection_address: nftInfo?.nftContractAddress,
            token_id: parseInt(stakedID.U64),
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

  const tabsNFTData = [
    {
      label: "Available NFTs",
      component: (
        <AvailableNFTs
          action="Stake NFT"
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

    await delay(2000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

  async function stakeNftHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!rewardPool || parseInt(rewardPool) < 0) {
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

    toast.success("Step 2: Process staking...");

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

    toast.success("Please wait up to 10s for the data to be updated");

    await delay(5000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

  async function unstakeNftHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      parseInt(currentAccount?.balance?.wal?.replaceAll(",", "")) < unstakeFee
    ) {
      toast.error(`You don't have enough WAL. Unstake costs ${unstakeFee} WAL`);
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

    toast.success("Step 2: Process unstaking...");

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

    toast.success("Please wait up to 10s for the data to be updated");

    await delay(5000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

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
              title: "Account Balance",
              content: `${balance?.azero || 0} AZERO`,
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
              title: `My Stakes (${nftInfo?.name})`,
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
              title: "My Unclaimed Rewards (FOD)",
              content: `${calcUnclaimedRewardNftLP({
                ...stakeInfo,
                multiplier,
                tokenDecimal,
              })}`,
            },
          ]}
        >
          <ConfirmModal
            action="claim"
            buttonVariant="outline"
            buttonLabel="Claim Rewards"
            onClick={handleClaimNFTLP}
            message="Claim Rewards costs 10 WAL. Continue?"
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
  ...rest
}) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [unstakeFee, setUnstakeFee] = useState(0);

  const [stakeInfo, setStakeInfo] = useState(null);
  const [tokenBalance, setTokenBalance] = useState();

  const [LPTokenAmount, setLPTokenAmount] = useState();

  const [LPtokenBalance, setLPTokenBalance] = useState();

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

    let info = queryResult?.toHuman();

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

    await delay(2000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

  async function stakeTokenLPHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!rewardPool || parseInt(rewardPool) < 0) {
      toast.error("There is no reward balance in this pool!");
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

    toast.success("Step 2: Process staking...");

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
    setLPTokenAmount(0);

    toast.success("Please wait up to 10s for the data to be updated");

    await delay(5000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

  async function unstakeTokenLPHandler(tokenID) {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      parseInt(currentAccount?.balance?.wal?.replaceAll(",", "")) < unstakeFee
    ) {
      toast.error(`You don't have enough WAL. Unstake costs ${unstakeFee} WAL`);
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

    toast.success("Step 2: Process unstaking...");

    await execContractTx(
      currentAccount,
      "api",
      lp_pool_contract.CONTRACT_ABI,
      poolContract,
      0, //-> value
      "unstake",
      formatNumToBN(LPTokenAmount)
    );

    await APICall.askBEupdate({ type: "nft", poolContract });
    setLPTokenAmount(0);
    toast.success("Please wait up to 10s for the data to be updated");

    await delay(5000).then(() => {
      fetchUserStakeInfo();
      fetchTokenBalance();
    });
  }

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
              title: "WAL Balance",
              content: `${balance?.wal || 0} WAL`,
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
              title: `My Stakes (${nftInfo?.name})`,
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
              title: "My Unclaimed Rewards (FOD)",
              content: `${calcUnclaimedRewardTokenLP({
                ...stakeInfo,
                multiplier,
                tokenDecimal,
              })}`,
            },
          ]}
        >
          <ConfirmModal
            action="claim"
            buttonVariant="outline"
            buttonLabel="Claim Rewards"
            onClick={handleClaimTokenLP}
            message="Claim Rewards costs 10 WAL. Continue?"
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
                  message="Unstake costs 10 WAL. Continue?"
                />
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
        tooltipContent: "Lorem lorem",
        label: "Royalty Fee",
      },
      {
        name: "volume",
        hasTooltip: false,
        tooltipContent: "Lorem lorem",
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
      volume: `${nftInfo?.volume} AZERO`,
      totalSupply: `${nftInfo?.nft_count} NFT${nftInfo?.nft_count > 1 && "s"}`,
      royaltyFee: `${nftInfo?.royalFee / 100}%`,
    },
  };

  return (
    <>
      {mode === "NFT_FARM" ? (
        <IWCard
          mb={{ base: "24px", lg: "30px" }}
          pt={{ lg: "10px" }}
          pb={{ lg: "24px" }}
        >
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Square
              mr={{ lg: "24px" }}
              maxW={{ base: "300px", sm: "320px", lg: "160" }}
              maxH={{ base: "300px", sm: "320px", lg: "160" }}
              borderRadius="10px"
              overflow="hidden"
            >
              <ImageCloudFlare
                borderWidth="1px"
                w="full"
                h="full"
                size="500"
                alt={nftInfo?.name}
                borderRadius="5px"
                src={nftInfo?.avatarImage}
              />
            </Square>

            <Stack w="full" alignItems="start">
              <HStack
                alignItems="center"
                justifyContent="space-between"
                w="full"
              >
                <Heading as="h2" size="h2" lineHeight="38px">
                  {nftInfo?.name}{" "}
                </Heading>

                {/* Big screen card */}
                <Show above="md">
                  <CardSocial
                    twitterUrl={nftInfo?.twitter}
                    discordUrl={nftInfo?.discord}
                    telegramUrl={nftInfo?.telegram}
                  />
                </Show>
              </HStack>

              <HStack justifyContent={{ base: "start" }} w="full">
                <Heading as="h4" size="h4" fontWeight="600" lineHeight="25px">
                  <AddressCopier address={nftInfo?.nftContractAddress} />
                </Heading>
              </HStack>

              {/* Small screen card */}
              <Hide above="md">
                <CardSocial
                  twitterUrl={nftInfo?.twitter}
                  discordUrl={nftInfo?.discord}
                  telegramUrl={nftInfo?.telegram}
                />
              </Hide>

              <HStack
                justifyContent="space-between"
                w="full"
                pb={{ base: "24px", lg: "0px" }}
              >
                <Flex
                  w="full"
                  minH="70px"
                  flexDirection={{ base: "column", lg: "row" }}
                  justifyContent={{ base: "space-between" }}
                >
                  {cardDataPoolInfo?.cardHeaderList?.map(
                    ({ name, hasTooltip, label, tooltipContent }) => {
                      return name === "myStake" ? null : (
                        <Flex
                          key={name}
                          w={{ lg: "fit-content" }}
                          justifyContent="center"
                          mt={{ base: "15px", lg: "0px" }}
                          flexDirection={{ base: "column", lg: "column" }}
                        >
                          <Flex
                            w={{ base: "full" }}
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
                            w={{ base: "full" }}
                            color="text.1"
                            fontWeight="600"
                            fontSize={{ base: "16px", lg: "20px" }}
                            lineHeight="28px"
                            justify={{ base: "start" }}
                            alignItems={{ base: "center" }}
                          >
                            <Text> {cardDataPoolInfo?.cardValue[name]}</Text>{" "}
                          </Flex>
                        </Flex>
                      );
                    }
                  )}
                </Flex>
              </HStack>
            </Stack>
          </Flex>
        </IWCard>
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
              content: addressShortener(poolContract),
            },
            {
              title: "Multiplier",
              content: (multiplier / 10 ** 12).toFixed(6),
            },
            {
              title: "Start Date",
              content: `${new Date(startTime).toLocaleString("en-US")}`,
            },
            { title: "Pool Length", content: `${duration / 86400} days` },
            {
              title: "Reward Pool",
              content: `${formatNumDynDecimal(rewardPool)} ${tokenSymbol}`,
            },
            {
              title: "Total Value Locked",
              content: `${formatNumDynDecimal(totalStaked)} NFT${
                totalStaked > 1 ? "s" : ""
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

const AvailableNFTs = (props) => (
  // { data, action, actionHandler }
  <>
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <IWCardNFTWrapper {...props} />
    </Stack>
  </>
);

const StakedNFTs = (props) => (
  <Stack
    w="full"
    spacing="30px"
    alignItems="start"
    direction={{ base: "column", lg: "row" }}
  >
    <IWCardNFTWrapper {...props} />
  </Stack>
);
