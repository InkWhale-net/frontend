import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatChainStringToNumber } from "utils";
import { formatNumDynDecimal, formatTokenAmount, roundUp } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";

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
const BalanceCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const [tokenBalance, setTokenBalance] = useState([]);
  // const {whitelist, setWhitelist}
  const getBalance = async () => {
    try {
      let queryResult = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        launchpadData.tokenContract,
        0,
        "psp22::balanceOf",
        currentAccount?.address
      );
      const tokenBalance = queryResult.toHuman().Ok;

      setTokenBalance(
        formatNumDynDecimal(
          roundUp(
            formatTokenAmount(
              tokenBalance,
              parseInt(launchpadData.projectInfo.token.decimals)
            )
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAccount) getBalance();
  }, [currentAccount, launchpadData]);

  const tokenDecimal = launchpadData?.projectInfo?.token?.decimals;
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
    <>
      <Box
        sx={{
          marginTop: "12px",
          border: "2.8px solid #E3DFF3",
          borderRadius: "8px",
          paddingTop: "20px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "12px",
        }}
      >
        <Heading size="md" sx={{ marginBottom: "4px" }}>
          Your balance
        </Heading>
        <Divider
          sx={{
            marginBottom: "8px",
          }}
        />
        <Row label="INW" value={currentAccount?.balance?.inw} />
        <Row label="AZERO" value={currentAccount?.balance?.azero} />
        <Row
          label={launchpadData?.projectInfo?.token?.name}
          value={tokenBalance || 0}
        />
      </Box>
      <Box
        sx={{
          marginTop: "12px",
          border: "2.8px solid #E3DFF3",
          borderRadius: "8px",
          paddingTop: "20px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "12px",
        }}
      >
        <Heading size="md" sx={{ marginBottom: "4px" }}>
          Launchpad Balance
        </Heading>
        <Divider
          sx={{
            marginBottom: "8px",
          }}
        />
        <Row
          label="Total Token For Sale"
          value={`${totalSupply} ${tokenSymbol}`}
        />
        <Row
          label="Available Amount"
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
          label="Total Whitelist Added"
          value={`${formattedTotalWhitelist?.length} address(es)`}
        />
        <Row
          label="Total Whitelist Claimed"
          value={`${totalWhitelistClaimed?.length} address(es)`}
        />
      </Box>
    </>
  );
};

export default BalanceCard;
