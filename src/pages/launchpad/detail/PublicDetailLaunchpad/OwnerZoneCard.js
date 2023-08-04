import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatNumToBN } from "utils";
import { execContractTxAndCallAPI } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const OwnerZoneCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const [ownerBalance, setOwnerBalance] = useState(0);

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
  }, [currentAccount?.address, launchpadData?.launchpadContract]);

  useEffect(() => {
    api && fetchBalance();
  }, [
    api,
    currentAccount.address,
    fetchBalance,
    launchpadData.launchpadContract,
  ]);

  const ownerWithdrawHandler = async () => {
    const endTime = launchpadData?.endTime?.replaceAll(",", "");

    if (endTime > Date.now()) {
      return toast.error("Launchpad not ended yet!");
    }

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
      <Box my="16px">
        <Text>Balance: {ownerBalance.toFixed(4)} AZERO</Text>
      </Box>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={ownerWithdrawHandler}
        isDisabled={ownerBalance < 0.0001}
      >
        Withdraw Balance
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Comming soon ...")}
      >
        Whitelist Manager
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Comming soon ...")}
      >
        Update Project Info
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Comming soon ...")}
      >
        Update Phase
      </Button>

      <Button
        my="8px"
        w="full"
        height="40px"
        variant="outline"
        onClick={() => toast("Comming soon ...")}
      >
        Minting History
      </Button>
    </Box>
  );
};

export default OwnerZoneCard;
