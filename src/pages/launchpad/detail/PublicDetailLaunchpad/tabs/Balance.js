import { Box, Button, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "contexts/AppContext";
import { useState } from "react";
import { formatTokenAmount } from "utils";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import { execContractTx } from "utils/contracts";
import { delay } from "utils";
import { toast } from "react-hot-toast";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { useEffect } from "react";
const Row = ({ label, value, divider = false, ...rest }) => {
  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          ...rest,
        }}
      >
        <Text>{label}</Text>
        <Text
          sx={{
            fontWeight: "512",
            color: "#57527E",
          }}
        >
          {value}
        </Text>
      </Box>
      {divider && <Divider />}
    </>
  );
};
const PhaseTag = ({ data, launchpadData }) => {
  //   const publicBuyer = publicBalance.find((e) => e?.phaseID == index);
  const { token } = launchpadData?.projectInfo || {};
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [publicBalance, setPublicBalance] = useState(null);
  const [WLBalance, setWLBalance] = useState(null);

  const getPublicBalance = async () => {
    try {
      const query = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicBuyer",
        data?.id,
        currentAccount?.address
      );
      const publicBuyer = query.toHuman().Ok;
      const decimalToken = parseInt(token.decimals);
      setPublicBalance({
        claimedAmount: formatTokenAmount(
          publicBuyer?.claimedAmount || 0,
          decimalToken
        ),
        lastUpdatedTime: formatTokenAmount(
          publicBuyer?.lastUpdatedTime,
          decimalToken
        ),
        purchasedAmount: formatTokenAmount(
          publicBuyer?.purchasedAmount || 0,
          decimalToken
        ),
        vestingAmount: formatTokenAmount(
          publicBuyer?.vestingAmount || 0,
          decimalToken
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getWLBalance = async () => {
    try {
      const query = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getWhitelistBuyer",
        data?.id,
        currentAccount?.address
      );
      const WLBuyer = query.toHuman().Ok;
      const decimalToken = parseInt(token.decimals);

      setWLBalance({
        claimedAmount: formatTokenAmount(WLBuyer?.claimedAmount, decimalToken),
        lastUpdatedTime: formatTokenAmount(
          WLBuyer?.lastUpdatedTime,
          decimalToken
        ),
        purchasedAmount: formatTokenAmount(
          WLBuyer?.purchasedAmount,
          decimalToken
        ),
        vestingAmount: formatTokenAmount(WLBuyer?.vestingAmount, decimalToken),
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data?.publicSaleInfor?.isPublic) getPublicBalance();
    if (data?.whitelist?.length) getWLBalance();
  }, [data, launchpadData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "2px solid #E3DFF3",
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <Heading size="md" sx={{ marginBottom: "4px" }}>
        {data?.name}
      </Heading>
      <Divider sx={{ marginBottom: "8px" }} />
      {data?.publicSaleInfor?.isPublic && (
        <>
          <Text
            size="md"
            sx={{ color: "#57527E", fontWeight: "500", mt: "16px" }}
          >
            Public Sale
          </Text>
          <Divider sx={{ marginBottom: "8px" }} />
          <Row
            label="Total purchased"
            value={`${publicBalance?.purchasedAmount || 0} ${token?.symbol}` || 0}
          />
          <Row
            label="Claimed"
            value={`${publicBalance?.claimedAmount || 0} ${token?.symbol}` || 0}
          />
          <Button
            isDisabled
            my="8px"
            w="full"
            height="40px"
            variant="outline"
            onClick={
              () => {}
              //   publicClaimHandler({ ...e, phaseID: publicBuyer?.phaseID })
            }
          >
            Claim
          </Button>
        </>
      )}
      {data?.whitelist?.length > 0 && (
        <>
          <Text
            size="md"
            sx={{ color: "#57527E", fontWeight: "500", mt: "16px" }}
          >
            Whitelist Sale
          </Text>
          <Divider sx={{ marginBottom: "8px" }} />
          <Row
            label="Total purchased"
            value={`${WLBalance?.purchasedAmount || 0} ${token?.symbol}` || 0}
          />
          <Row
            label="Claimed"
            value={`${WLBalance?.claimedAmount || 0} ${token?.symbol}` || 0}
          />
          <Button
            isDisabled
            my="8px"
            w="full"
            height="40px"
            variant="outline"
            onClick={
              () => {}
              //   publicClaimHandler({ ...e, phaseID: publicBuyer?.phaseID })
            }
          >
            Claim
          </Button>
        </>
      )}
    </Box>
  );
};
const BalanceTab = ({ launchpadContract, launchpadData }) => {
  const { token } = launchpadData?.projectInfo || {};
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [publicBalance, setPublicBalance] = useState([]);
  const dispatch = useDispatch();
  const phases = launchpadData?.phaseList;

  const publicClaimHandler = async (phase) => {
    try {
      const endTime = new Date(parseInt(phase?.endTime?.replace(/,/g, "")));
      const now = new Date();
      if (now > endTime) {
        await execContractTx(
          currentAccount,
          api,
          launchpad.CONTRACT_ABI,
          launchpadData?.launchpadContract,
          0, //-> value
          "launchpadContractTrait::publicClaim",
          phase?.phaseID
        );
        await delay(1000);
        await toast.promise(
          delay(2000).then(() => {
            if (currentAccount) {
              dispatch(fetchUserBalance({ currentAccount, api }));
            }
          }),
          {
            loading: "Fetching new data ... ",
            success: "Done !",
            error: "Could not fetch data!!!",
          }
        );
      } else {
        toast.error("Phase sale time not ended");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     if (currentAccount) getBalance();
  //   }, [currentAccount, launchpadData]);
  return (
    <TabLayout launchpadData={launchpadData}>
      {phases?.map((obj, index) => {
        return (
          <PhaseTag
            key={index}
            data={{ ...obj, id: index }}
            launchpadData={launchpadData}
          />
        );
      })}
    </TabLayout>
  );
};

export default BalanceTab;
