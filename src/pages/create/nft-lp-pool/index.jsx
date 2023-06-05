import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { IWTable } from "components/table/IWTable";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { addressShortener } from "utils";
import { toast } from "react-hot-toast";
import { isAddressValid } from "utils";
import { execContractQuery } from "utils/contracts";
import { formatQueryResultToNumber } from "utils";
import psp22_contract from "utils/contracts/psp22_contract";
import { APICall } from "api/client";
import { toastMessages } from "constants";
import { execContractTx } from "utils/contracts";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { formatNumToBN, formatNumDynDecimal } from "utils";
import azt_contract from "utils/contracts/azt_contract";
import nft_pool_generator_contract from "utils/contracts/nft_pool_generator_contract";
import { fetchMyNFTPools } from "redux/slices/myPoolsSlice";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { roundUp } from "utils";
import ImageUploadIcon from "../token/UploadIcon";
import { SelectSearch } from "components/SelectSearch";
import { execContractTxAndCallAPI } from "utils/contracts";

export default function CreateNFTLPPage({ api }) {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);

  const [createTokenFee, setCreateTokenFee] = useState(0);

  const [faucetTokensList, setFaucetTokensList] = useState([]);
  const [selectedContractAddr, setSelectedContractAddr] = useState("");

  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollectionAddr, setSelectedCollectionAddr] = useState("");

  const [duration, setDuration] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [maxStake, setMaxStake] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const [tokenBalance, setTokenBalance] = useState(0);
  const [selectedTokenDecimal, setSelectedTokenDecimal] = useState(0);

  const fetchTokenBalance = useCallback(async () => {
    if (!selectedContractAddr) return;

    if (!currentAccount) {
      toast.error("Please connect wallet!");
      return;
    }

    if (!isAddressValid(selectedContractAddr)) {
      toast.error("Invalid address!");
      return;
    }

    let queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const bal = formatQueryResultToNumber(queryResult);
    setTokenBalance(bal);
    const foundItem = faucetTokensList.find(
      (item) => item.contractAddress === selectedContractAddr
    );
    if (!foundItem?.symbol) {
      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0,
        "psp22Metadata::tokenSymbol"
      );
      const tokenSymbol = queryResult1.toHuman().Ok;
      setTokenSymbol(tokenSymbol);
    } else {
      setTokenSymbol(foundItem?.symbol);
    }

    if (!foundItem?.decimal) {
      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0,
        "psp22Metadata::tokenDecimals"
      );
      const tokenDec = queryResult1.toHuman().Ok;
      setSelectedTokenDecimal(tokenDec);
    } else {
      setSelectedTokenDecimal(foundItem?.decimal);
    }
  }, [currentAccount, selectedContractAddr, faucetTokensList]);

  const collectionSelected = useMemo(() => {
    const foundItem = collectionList.find(
      (item) => item.nftContractAddress === selectedCollectionAddr
    );

    return foundItem;
  }, [collectionList, selectedCollectionAddr]);

  useEffect(() => {
    let isUnmounted = false;
    const getFaucetTokensListData = async () => {
      let { ret, status, message } = await APICall.getTokensList({});

      if (status === "OK") {
        if (isUnmounted) return;

        return setFaucetTokensList(ret);
      }

      toast.error(`Get faucet tokens list failed. ${message}`);
    };
    getFaucetTokensListData();

    const getCollectionListData = async () => {
      let { ret, status, message } = await APICall.getAllCollectionsFromArtZero(
        { isActive: true, ignoreNoNFT: false }
      );

      if (status === "OK") {
        if (isUnmounted) return;
        ret = ret.filter((el) => !el.name?.toLowerCase()?.includes("domain"));
        return setCollectionList(ret);
      }

      toast.error(`Get Collection list failed. ${message}`);
    };
    getCollectionListData();
    return () => (isUnmounted = true);
  }, []);

  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

  useEffect(() => {
    const fetchCreateTokenFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        nft_pool_generator_contract.CONTRACT_ABI,
        nft_pool_generator_contract.CONTRACT_ADDRESS,
        0,
        "genericPoolGeneratorTrait::getCreationFee"
      );

      const fee = formatQueryResultToNumber(result);

      setCreateTokenFee(fee);
    };
    if (!currentAccount?.address) return;
    fetchCreateTokenFee();
  }, [currentAccount]);

  async function createNFTLPHandler() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (
      !selectedContractAddr ||
      !selectedCollectionAddr ||
      !multiplier ||
      !duration ||
      !startTime
    ) {
      toast.error(`Please fill in all data!`);
      return;
    }

    if (!(duration > 0)) {
      toast.error(`Pool Length must be greater than 0`);
      return;
    }

    if (!(multiplier > 0)) {
      toast.error(`Annual Percentage Yield (APR) % must be greater than 0`);
      return;
    }

    if (!(maxStake > 0)) {
      toast.error(`Total Staking Cap must be greater than 0`);
      return;
    }

    if (
      !isAddressValid(selectedContractAddr) ||
      !isAddressValid(selectedCollectionAddr)
    ) {
      return toast.error("Invalid address!");
    }

    if (selectedTokenDecimal < 6) {
      return toast.error(
        "Invalid Token Decimal. Decimal of Reward token can not be less than 6 !"
      );
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) <
      createTokenFee
    ) {
      toast.error(
        `You don't have enough INW.Create Pool costs ${createTokenFee} INW`
      );
      return;
    }
    if (
      parseInt(tokenBalance?.replaceAll(",", "")) <
      minReward.replaceAll(",", "")
    ) {
      toast.error(`You don't have enough ${tokenSymbol} to topup the reward`);
      return;
    }

    const allowanceINWQr = await execContractQuery(
      currentAccount?.address,
      "api",
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      nft_pool_generator_contract.CONTRACT_ADDRESS
    );
    const allowanceINW = formatQueryResultToNumber(allowanceINWQr).replaceAll(
      ",",
      ""
    );
    const allowanceTokenQr = await execContractQuery(
      currentAccount?.address,
      "api",
      psp22_contract.CONTRACT_ABI,
      selectedContractAddr,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      nft_pool_generator_contract.CONTRACT_ADDRESS
    );
    const allowanceToken = formatQueryResultToNumber(
      allowanceTokenQr
    ).replaceAll(",", "");
    let step = 1;
    //Approve
    if (allowanceINW < createTokenFee.replaceAll(",", "")) {
      toast.success(`Step ${step}: Approving INW token...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0, //-> value
        "psp22::approve",
        nft_pool_generator_contract.CONTRACT_ADDRESS,
        formatNumToBN(Number.MAX_SAFE_INTEGER)
      );
      if (!approve) return;
    }
    if (allowanceToken < minReward.replaceAll(",", "")) {
      toast.success(`Step ${step}: Approving ${tokenSymbol} token...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract.CONTRACT_ABI,
        selectedContractAddr,
        0, //-> value
        "psp22::approve",
        nft_pool_generator_contract.CONTRACT_ADDRESS,
        formatNumToBN(Number.MAX_SAFE_INTEGER)
      );
      if (!approve) return;
    }

    await delay(3000);

    toast.success(`Step ${step}: Process ...`);

    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      nft_pool_generator_contract.CONTRACT_ABI,
      nft_pool_generator_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newPool",
      () => APICall.askBEupdate({ type: "nft", poolContract: "new" }),
      currentAccount?.address,
      selectedCollectionAddr,
      selectedContractAddr,
      maxStake,
      formatNumToBN(multiplier, selectedTokenDecimal),
      roundUp(duration * 24 * 60 * 60 * 1000, 0),
      startTime.getTime()
    );

    // await APICall.askBEupdate({ type: "nft", poolContract: "new" });

    setMultiplier("");
    setDuration("");
    setStartTime(new Date());
    // setSelectedContractAddr("");
    // setSelectedCollectionAddr("");

    await delay(3000);

    toast.promise(
      delay(30000).then(() => {
        if (currentAccount) {
          dispatch(fetchMyNFTPools({ currentAccount }));
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        fetchTokenBalance();
      }),
      {
        loading: "Please wait a minute for the data to be updated! ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  }
  const { myNFTPoolsList, loading } = useSelector((s) => s.myPools);

  const minReward = useMemo(
    () => formatNumDynDecimal(maxStake * duration * multiplier),
    [maxStake, duration, multiplier]
  );

  const tableData = {
    tableHeader: [
      {
        name: "nftInfo",
        hasTooltip: false,
        tooltipContent: "",
        label: "Stake Collection",
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
        tooltipContent: "Total Value Locked: Total NFT staked into this pool",
        label: "TVL",
      },
      {
        name: "rewardPool",
        hasTooltip: false,
        tooltipContent: `Available tokens to pay for stakers`,
        label: "Reward Pool",
      },
      {
        name: "maxStakingAmount",
        hasTooltip: true,
        tooltipContent: `How many tokens that users can stake into the pool`,
        label: "Total Staking Cap",
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

    tableBody: myNFTPoolsList,
  };

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "20px" }}
        title="Create NFT Yield Farm"
        description={
          <span>
            NFT Stakers get rewards in selected token. The creation costs
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {createTokenFee} INW
            </Text>
            . This currently only works with NFTs on ArtZero platform.
          </span>
        }
      >
        <VStack w="full">
          <SimpleGrid
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacingX={{ lg: "20px" }}
            spacingY={{ base: "20px", lg: "32px" }}
            mb={{ base: "30px" }}
          >
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Select NFT Collection
              </Heading>
              {/* <Select
                value={selectedCollectionAddr}
                // isDisabled={accountInfoLoading}
                id="nft-collection"
                placeholder="Select Collection"
                onChange={({ target }) => {
                  setSelectedCollectionAddr(target.value);
                }}
              >
                {collectionList?.map((token, idx) => (
                  <option key={idx} value={token.nftContractAddress}>
                    {token?.name} -{" "}
                    {addressShortener(token?.nftContractAddress)}
                  </option>
                ))}
              </Select> */}

              <SelectSearch
                name="collection"
                placeholder="Select Collection..."
                closeMenuOnSelect={true}
                isSearchable
                onChange={(selected) => {
                  setSelectedCollectionAddr(selected.nftContractAddress);
                }}
                options={collectionList?.map((token, idx) => ({
                  value: token?.name,
                  nftContractAddress: token?.nftContractAddress,
                  label: `${token?.name} - ${addressShortener(
                    token?.nftContractAddress
                  )}`,
                }))}
              ></SelectSearch>
            </Box>

            <Box w="full">
              <IWInput
                onChange={({ target }) =>
                  setSelectedCollectionAddr(target.value)
                }
                value={selectedCollectionAddr}
                isDisabled
                placeholder="Contract Address"
                label="Collection contract address"
              />
            </Box>

            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Select Token To Reward Stakers
              </Heading>
              {/* <Select
                value={selectedContractAddr}
                id="token-collection"
                placeholder="Select token"
                onChange={({ target }) => {
                  setSelectedContractAddr(target.value);
                }}
              >
                {faucetTokensList?.map((token, idx) => (
                  <option key={idx} value={token.contractAddress}>
                    {token?.symbol} ({token?.name}) -{" "}
                    {addressShortener(token?.contractAddress)}
                  </option>
                ))}
              </Select> */}

              <SelectSearch
                name="token"
                placeholder="Select Token..."
                closeMenuOnSelect={true}
                // filterOption={filterOptions}
                isSearchable
                onChange={({ value }) => {
                  setSelectedContractAddr(value);
                }}
                options={faucetTokensList?.map((token, idx) => ({
                  value: token?.contractAddress,
                  label: `${token?.symbol} (${
                    token?.name
                  }) - ${addressShortener(token?.contractAddress)}`,
                }))}
              ></SelectSearch>
            </Box>

            <Box w="full">
              <IWInput
                onChange={({ target }) => setSelectedContractAddr(target.value)}
                value={selectedContractAddr}
                placeholder="Contract Address"
                label="or enter token contract address"
              />
            </Box>

            <Box w="full">
              <IWInput
                placeholder="0"
                type="number"
                value={duration}
                label="Pool Length (days)"
                onChange={({ target }) => setDuration(target.value)}
              />
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.azero || 0} AZERO`}
                label="Your AZERO Balance"
              />
            </Box>
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Start Date & Time
              </Heading>
              <Flex
                h="52px"
                borderWidth="1px"
                justifyContent="start"
                borderRadius="5px"
              >
                <DateTimePicker
                  locale="en-EN"
                  value={startTime}
                  onChange={setStartTime}
                />
              </Flex>
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.inw || 0} INW`}
                label="Your INW Balance"
              />
            </Box>

            <Box w="full">
              <IWInput
                type="number"
                placeholder="0"
                label={
                  <>
                    Multiplier
                    <Tooltip
                      fontSize="smaller"
                      label={
                        "Multiplier determines how many reward tokens will the staker receive per 1 NFT in 24 hours"
                      }
                    >
                      <QuestionOutlineIcon ml="6px" pb={"2px"} color="text.2" />
                    </Tooltip>
                  </>
                }
                value={multiplier}
                onChange={({ target }) => setMultiplier(target.value)}
              />
            </Box>

            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${tokenBalance || 0} ${tokenSymbol || ""}`}
                label={`Your ${tokenSymbol || "Token"} Balance`}
              />
            </Box>
            <Box w="full">
              <IWInput
                value={maxStake}
                onChange={({ target }) => setMaxStake(target.value)}
                type="number"
                label={
                  <>
                    Total Staking Cap{" "}
                    {collectionSelected?.name
                      ? `(${collectionSelected.name})`
                      : ""}
                    <Tooltip
                      fontSize="smaller"
                      label={
                        "How many NFTs that users can stake into the pool "
                      }
                    >
                      <QuestionOutlineIcon ml="6px" pb={"2px"} color="text.2" />
                    </Tooltip>
                  </>
                }
                placeholder="0"
              />
            </Box>
            <Box w="full">
              <IWInput
                isDisabled={true}
                value={`${minReward || 0} ${tokenSymbol || ""}`}
                label={
                  <>
                    Total Rewards
                    <Tooltip
                      fontSize="smaller"
                      label={
                        " Pool creator has to add this amount upfront into the pool to pay for stakers' interest."
                      }
                    >
                      <QuestionOutlineIcon ml="6px" pb={"2px"} color="text.2" />
                    </Tooltip>
                  </>
                }
              />
            </Box>
          </SimpleGrid>

          <Button w="full" maxW={{ lg: "260px" }} onClick={createNFTLPHandler}>
            Create NFT Yield Farm
          </Button>
        </VStack>
      </SectionContainer>

      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="My NFT Yield Farm"
        description=""
      >
        <IWTable
          {...tableData}
          mode="NFT_FARM"
          loading={loading}
          customURLRowClick="/my-pools"
        />
      </SectionContainer>
    </>
  );
}
