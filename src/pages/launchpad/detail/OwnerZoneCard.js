import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { formatNumToBN, formatTokenAmount } from "utils";
import { execContractQuery, execContractTxAndCallAPI } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import { useModalLPDetail } from "./modal/ModelContext";
import { formatChainStringToNumber } from "utils";
import { delay } from "utils";
import { fetchUserBalance } from "redux/slices/walletSlice";

const OwnerZoneCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const {
    showWLModal,
    showPhaseModal,
    showEditInforModal,
    showEditTotalSupply,
  } = useModalLPDetail();
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);

  const [ownerBalance, setOwnerBalance] = useState(0);
  const [unsoldToken, setUnsoldToken] = useState(0);
  const [isDisableWithdrawNBurn, setIsDisableWithdrawNBurn] = useState(false);

  const dispatch = useDispatch();

  const fetchBalance = useCallback(async () => {
    const queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getBalance"
    );

    const ret = queryResult?.toHuman().Ok?.Ok;
    setOwnerBalance(parseInt(ret?.replaceAll(",", ""), 10) / 10 ** 12);
    const fetchUnsoldToken = await execContractQuery(
      currentAccount?.address,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = fetchUnsoldToken?.toHuman()?.Ok;
    setUnsoldToken(formatTokenAmount(availableAmount, tokenDecimal));

    if (launchpadData?.phaseList?.length > 0) {
      const resultQuery = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicSaleInfo",
        0
      );
      const publicSaleInfor = resultQuery?.toHuman().Ok;
      setIsDisableWithdrawNBurn(
        !(
          publicSaleInfor?.isBurned == false &&
          publicSaleInfor?.isWithdrawn == false
        )
      );
    }
  }, [currentAccount?.address, launchpadData?.launchpadContract]);

  useEffect(() => {
    api && fetchBalance();
  }, [
    api,
    currentAccount?.address,
    fetchBalance,
    launchpadData?.launchpadContract,
  ]);
  const ownerWithdrawUnsoldHandler = async () => {
    const endTime = launchpadData?.endTime?.replaceAll(",", "");

    if (endTime > Date.now()) {
      return toast.error("Launchpad not ended yet!");
    }

    if (+unsoldToken < 0.0001) {
      return toast.error("Balance is zero!");
    }

    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::withdrawUnsoldTokens",
      fetchBalance,
      currentAccount?.address
    );

    await delay(500).then(() => {
      if (currentAccount) {
        dispatch(fetchUserBalance({ currentAccount, api }));
      }
    });
    fetchBalance();
  };
  const ownerBurnUnsoldHandler = async () => {
    const endTime = launchpadData?.endTime?.replaceAll(",", "");

    if (endTime > Date.now()) {
      return toast.error("Launchpad not ended yet!");
    }

    if (+unsoldToken < 0.0001) {
      return toast.error("Balance is zero!");
    }

    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::burnUnsoldTokens",
      fetchBalance
    );
    fetchBalance();
  };
  const ownerWithdrawHandler = async () => {
    if (ownerBalance < 0.0001) {
      return toast.error("Balance is zero!");
    }

    toast.success(`Withdrawing ${ownerBalance.toFixed(4)} AZERO...`);

    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::withdraw",
      fetchBalance,
      formatNumToBN(ownerBalance),
      currentAccount?.address
    );
  };
  const fetchOwnerData = useCallback(async () => {
    // const totalTokenSold = launchpadData?.phaseList?.map(async (acc, phase) => {
    //   const publicSaleInfor = await execContractQuery(
    //     currentAccount?.address,
    //     "api",
    //     launchpad.CONTRACT_ABI,
    //     launchpadData?.launchpadContract,
    //     0,
    //     "launchpadContractTrait::getPublicSaleInfo",
    //     phase?.phaseID
    //   );
    //   console.log(publicSaleInfor?.toHuman().Ok);
    // }, 0);
  });
  useEffect(() => {
    fetchOwnerData();
  }, [currentAccount, api, launchpadData]);
  // ############################

  const tokenSymbol = launchpadData?.projectInfo?.token?.symbol;

  const totalSupply =
    formatChainStringToNumber(launchpadData?.totalSupply) /
    Math.pow(10, tokenDecimal);

  const availableAmount =
    formatChainStringToNumber(launchpadData?.availableTokenAmount) /
    Math.pow(10, tokenDecimal);

  const totalWhitelistByPhase = launchpadData?.phaseList?.map((p) => {
    const totalSoldAmount = p?.whitelist?.reduce(
      (prev, curr) =>
        prev +
        formatChainStringToNumber(curr.purchasedAmount) /
          Math.pow(10, tokenDecimal),
      0
    );
    return { ...p, totalSoldAmount };
  });

  const totalWhitelist = launchpadData?.phaseList?.reduce((prev, curr) => {
    return prev.concat(curr?.whitelist);
  }, []);

  const formattedTotalWhitelist = useMemo(
    () =>
      totalWhitelist?.map((w) => ({
        ...w,
        amount:
          formatChainStringToNumber(w?.amount) / Math.pow(10, tokenDecimal),
        claimedAmount:
          formatChainStringToNumber(w?.claimedAmount) /
          Math.pow(10, tokenDecimal),
        price: formatChainStringToNumber(w?.price) / Math.pow(10, tokenDecimal),
        purchasedAmount:
          formatChainStringToNumber(w?.purchasedAmount) /
          Math.pow(10, tokenDecimal),
        vestingAmount:
          formatChainStringToNumber(w?.vestingAmount) /
          Math.pow(10, tokenDecimal),
      })),
    [totalWhitelist, tokenDecimal]
  );

  const totalSoldAmount = formattedTotalWhitelist?.reduce(
    (prev, curr) => prev + curr.purchasedAmount,
    0
  );

  const totalWhitelistAddedAmount = formattedTotalWhitelist?.reduce(
    (prev, curr) => prev + curr.amount,
    0
  );

  const totalWhitelistClaimed = formattedTotalWhitelist?.filter(
    (w) => !!w.claimedAmount
  );

  return (
    <Box
      sx={{
        marginTop: "12px",
        border: "2.8px solid #E3DFF3",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "12px",
      }}
    >
      <Heading as="h4" size="md" mb='8px'>
        Owner Zone
      </Heading>
      {/* <Text sx={{ mt: "20px", fontWeight: "700", color: "#57527E " }}>
        Launchpad Balance
      </Text> */}
      <Divider
        sx={{
          marginBottom: "8px",
        }}
      />
      <Row label="Token For Sale" value={`${totalSupply} ${tokenSymbol}`} />
      <Row
        label="Distributed token"
        value={`${availableAmount} ${tokenSymbol}`}
      />
      <Row
        label="Total Whitelist Added"
        value={`${totalWhitelistAddedAmount} ${tokenSymbol}`}
      />
      <Row label="Total Sold" value={`${totalSoldAmount} ${tokenSymbol}`} />

      {totalWhitelistByPhase?.map((p, idx) => (
        <Row
          key={idx}
          label={` - ${p?.name}`}
          value={`${p.totalSoldAmount} ${tokenSymbol}`}
        />
      ))}
      <Row
        label="Whitelist Address Added"
        value={`${formattedTotalWhitelist?.length}`}
      />
      <Row
        label="Whitelist Address Claimed"
        value={`${totalWhitelistClaimed?.length}`}
      />
      <Divider />
      <Box mt="16px" display="flex" justifyContent="space-between">
        <Text>Launchpad Balance</Text>
        <Text>{ownerBalance.toFixed(4)}AZERO</Text>
      </Box>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerWithdrawHandler}
        isDisabled={ownerBalance < 0.0001}
      >
        Withdraw AZERO
      </Button>

      <Divider />
      {/* <Box mt="16px" display="flex" justifyContent="space-between">
        <Text>{launchpadData?.projectInfo?.token?.symbol}</Text>
        <Text>{formatNumDynDecimal(unsoldToken)}</Text>
      </Box> */}

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerWithdrawUnsoldHandler}
        isDisabled={+unsoldToken < 0.0001 || isDisableWithdrawNBurn}
      >
        Withdraw Unsold {launchpadData?.projectInfo?.token?.symbol} token
      </Button>
      <Button
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerBurnUnsoldHandler}
        isDisabled={+unsoldToken < 0.0001 || isDisableWithdrawNBurn}
      >
        Burn unsold {launchpadData?.projectInfo?.token?.symbol} token
      </Button>
      <Text sx={{ mt: "20px", fontWeight: "700", color: "#57527E " }}>
        Edit
      </Text>
      <Divider />

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => showEditTotalSupply()}
      >
        Edit total token for sale
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => showEditInforModal()}
      >
        Update Project Info
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => showPhaseModal()}
      >
        Update Phase
      </Button>
      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => showWLModal()}
      >
        {launchpadData?.requireKyc
          ? "Manage KYC & Whitelist"
          : "Whitelist Manager"}
      </Button>
      {/* <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Coming soon ...")}
      >
        Minting History
      </Button> */}
    </Box>
  );
};

export default OwnerZoneCard;

const Row = ({ label, value, divider = false, ...rest }) => {
  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          ...rest,
        }}
      >
        <Text>{label}</Text>
        <Text>{value}</Text>
      </Box>
      {divider && <Divider />}
    </>
  );
};
