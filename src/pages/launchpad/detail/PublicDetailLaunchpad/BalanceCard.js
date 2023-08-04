import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { formatNumDynDecimal } from "utils";
import { roundUp } from "utils";
import { delay } from "utils";
import { formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
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
  return (
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
  );
};

export default BalanceCard;
