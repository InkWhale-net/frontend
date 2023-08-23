import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatNumToBN } from "utils";
import { execContractQuery, execContractTxAndCallAPI } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import { useModalLPDetail } from "./modal/ModelContext";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";

const OwnerZoneCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const { showWLModal, showPhaseModal, showEditInforModal } =
    useModalLPDetail();
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);

  const [ownerBalance, setOwnerBalance] = useState(0);
  const [unsoldToken, setUnsoldToken] = useState(0);

  const fetchBalance = useCallback(async () => {
    const queryResult = await execContractQuery(
      currentAccount?.address,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getBalance"
    );

    const ret = queryResult?.toHuman().Ok.Ok;
    setOwnerBalance(parseInt(ret?.replaceAll(",", ""), 10) / 10 ** 12);
    const fetchUnsoldToken = await execContractQuery(
      currentAccount?.address,
      "api",
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = fetchUnsoldToken.toHuman().Ok;
    setUnsoldToken(formatTokenAmount(availableAmount, tokenDecimal));
  }, [currentAccount?.address, launchpadData?.launchpadContract]);

  useEffect(() => {
    api && fetchBalance();
  }, [
    api,
    currentAccount.address,
    fetchBalance,
    launchpadData.launchpadContract,
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
      <Heading as="h4" size="md">
        Owner Zone
      </Heading>
      <Text sx={{ mt: "20px", fontWeight: "700", color: "#57527E " }}>
        Launchpad Balance
      </Text>
      <Divider />
      <Box mt="16px" display="flex" justifyContent="space-between">
        <Text>AZERO</Text>
        <Text>{ownerBalance.toFixed(4)}</Text>
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
      <Box mt="16px" display="flex" justifyContent="space-between">
        <Text>{launchpadData?.projectInfo?.token?.symbol}</Text>
        <Text>{formatNumDynDecimal(unsoldToken)}</Text>
      </Box>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerWithdrawUnsoldHandler}
        isDisabled={+unsoldToken < 0.0001}
      >
        Withdraw {launchpadData?.projectInfo?.token?.symbol}
      </Button>
      <Button
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerBurnUnsoldHandler}
        isDisabled={+unsoldToken < 0.0001}
      >
        Burn unsold token
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
        Whitelist Manager
      </Button>
      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Coming soon ...")}
      >
        Minting History
      </Button>
    </Box>
  );
};

export default OwnerZoneCard;
