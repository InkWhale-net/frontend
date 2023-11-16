import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatTokenAmount, roundDown, roundUp } from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import TabLayout from "../Layout";
import { formatChainStringToNumber } from "utils";
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
  const dispatch = useDispatch();

  const publicClaimHandler = async () => {
    try {
      const startTime = new Date(parseInt(data?.startTime?.replace(/,/g, "")));
      const endTime = new Date(parseInt(data?.endTime?.replace(/,/g, "")));
      const now = new Date();
      if (now > endTime) {
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

        const vestingDuration = parseInt(
          data?.vestingDuration?.replace(/,/g, "")
        );
        // const endVestingTime = parseInt(endTime.getTime()) + vestingDuration;
        //   console.log(endVestingTime)

        const vestingUnit = parseInt(data?.vestingUnit?.replaceAll(/,/g, ""));
        const claimNumberOfTime = roundUp(vestingDuration / vestingUnit, 0);

        const purchasedAmount = parseFloat(publicBalance?.purchasedAmount);
        const vestingAmount =
          purchasedAmount *
          (1 -
            parseFloat(data?.immediateReleaseRate?.replaceAll(/,/g, "")) /
              10000);
        const claimUnit = roundDown(vestingAmount / claimNumberOfTime);

        const claimedAmount =
          parseFloat(publicBalance?.claimedAmount) -
          (purchasedAmount - vestingAmount);
        const claimedNumberOfTime = roundDown(claimedAmount / claimUnit, 0);
        const claimableNumberOfTime = Math.floor(
          (now.getTime() - endTime.getTime()) / vestingUnit
        );

        if (claimableNumberOfTime > claimedNumberOfTime) {
          await execContractTx(
            currentAccount,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0, //-> value
            "launchpadContractTrait::publicClaim",
            data?.id
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
          toast.error("Wait until next claimable time");
        }
      } else {
        toast.error("Phase sale time not ended");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const WLClaimHandler = async () => {
    try {
      // const startTime = new Date(parseInt(data?.startTime?.replace(/,/g, "")));
      const endTime = new Date(parseInt(data?.endTime?.replace(/,/g, "")));
      const now = new Date();
      if (now > endTime) {
        const vestingDuration = parseInt(
          data?.vestingDuration?.replace(/,/g, "")
        );
        // const endVestingTime = parseInt(endTime.getTime()) + vestingDuration;
        //   console.log(endVestingTime)

        const vestingUnit = parseInt(data?.vestingUnit?.replace(/,/g, ""));
        const claimNumberOfTime = roundUp(vestingDuration / vestingUnit, 0);

        const purchasedAmount = parseFloat(WLBalance?.purchasedAmount);

        const vestingAmount =
          purchasedAmount *
          (1 -
            parseFloat(data?.immediateReleaseRate.replaceAll(/,/g, "")) /
              10000);
        const claimUnit = roundDown(vestingAmount / claimNumberOfTime);

        const claimedAmount =
          parseFloat(WLBalance?.claimedAmount) -
          (purchasedAmount - vestingAmount);
        const claimedNumberOfTime = roundDown(claimedAmount / claimUnit, 0);
        const claimableNumberOfTime = Math.floor(
          (now.getTime() - endTime.getTime()) / vestingUnit
        );
        if (claimableNumberOfTime > claimedNumberOfTime) {
          await execContractTx(
            currentAccount,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0, //-> value
            "launchpadContractTrait::whitelistClaim",
            data?.id
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
          toast.error("Wait until next claimable time");
        }
      } else {
        toast.error("Phase sale time not ended");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
          claimedAmount: formatChainStringToNumber(
            WLBuyer?.claimedAmount,
            decimalToken
          ),
          amount: formatTokenAmount(WLBuyer?.amount, decimalToken),
          price: formatTokenAmount(WLBuyer?.price, decimalToken),
          lastUpdatedTime: formatTokenAmount(
            WLBuyer?.lastUpdatedTime,
            decimalToken
          ),
          purchasedAmount: formatTokenAmount(
            WLBuyer?.purchasedAmount,
            decimalToken
          ),
          vestingAmount: formatTokenAmount(
            WLBuyer?.vestingAmount,
            decimalToken
          ),
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (data?.publicSaleInfor?.isPublic) getPublicBalance();
    if (data?.whitelist?.length) getWLBalance();
  }, [api, currentAccount?.address, data, launchpadData, token.decimals]);

  const publicPhaseInfo =
    formatChainStringToNumber(data.publicSaleInfor.price) /
    Math.pow(10, token.decimals);


  const endTime = parseInt(formatChainStringToNumber(data?.endTime));
  const endVestingTime = parseInt(
    formatChainStringToNumber(data?.endVestingTime)
  );
  const vestingDuration = parseInt(
    formatChainStringToNumber(data?.vestingDuration)
  );
  const vestingUnit = parseInt(
    formatChainStringToNumber(data?.vestingUnit)
  );
  const totalVestingUnits = parseInt(
    formatChainStringToNumber(data?.totalVestingUnits)
  );

  let nextClaimWl = endTime + vestingUnit;

  const temp_next = calcNextClaimTime(
    endTime,
    vestingUnit,
    vestingDuration,
    totalVestingUnits
  );

  if (temp_next && temp_next[0]) {
    nextClaimWl = temp_next[1];
  }

  const now = Date.now();

  if (now > endVestingTime) {
    nextClaimWl = endVestingTime;
  }

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
      {/* {data?.publicSaleInfor?.isPublic && ( */}
      <>
        <Text
          size="md"
          sx={{ color: "#57527E", fontWeight: "500", mt: "16px" }}
        >
          Public Sale
        </Text>
        <Divider sx={{ marginBottom: "8px" }} />
        <Row
          label="Total Purchased"
          value={`${publicBalance?.purchasedAmount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Public price"
          value={`${publicPhaseInfo || 0} AZERO` || 0}
        />
        <Row
          label="Total Vesting"
          value={`${publicBalance?.vestingAmount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Claimed"
          value={`${publicBalance?.claimedAmount || 0} ${token?.symbol}` || 0}
        />
        <Button
          isDisabled={
            !(parseFloat(publicBalance?.purchasedAmount) > 0) &&
            publicBalance?.purchasedAmount === publicBalance?.claimedAmount
          }
          my="8px"
          w="full"
          height="40px"
          variant="outline"
          onClick={() => publicClaimHandler()}
        >
          Claim
        </Button>
      </>
      {/* )} */}
      {/* {data?.whitelist?.length > 0 && ( */}
      <>
        <Text
          size="md"
          sx={{ color: "#57527E", fontWeight: "500", mt: "16px" }}
        >
          Whitelist Sale
        </Text>
        <Divider sx={{ marginBottom: "8px" }} />
        <Row
          label="Whitelist Amount"
          value={`${WLBalance?.amount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Whitelist Price"
          value={`${WLBalance?.price || 0} AZERO` || 0}
        />
        <Row
          label="Total Purchased"
          value={`${WLBalance?.purchasedAmount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Total Vesting"
          value={`${WLBalance?.vestingAmount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Claimed"
          value={`${WLBalance?.claimedAmount || 0} ${token?.symbol}` || 0}
        />
        <Row
          label="Next Claim"
          value={`${new Date(parseInt(nextClaimWl)).toLocaleString()} ` ?? "-"}
        />
        <Button
          isDisabled={!(parseFloat(WLBalance?.purchasedAmount) > 0)}
          my="8px"
          w="full"
          height="40px"
          variant="outline"
          onClick={() => WLClaimHandler()}
        >
          Claim
        </Button>
      </>
      {/* )} */}
      {/* {!(data?.publicSaleInfor?.isPublic || data?.whitelist?.length) && (
        <Text>No data</Text>
      )} */}
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

function calcNextClaimTime(
  endTime,
  vestingUnit,
  vestingDuration,
  totalVestingUnits
) {
  const now = Date.now();

  const gapTime = now - endTime;
  const claimCount = Math.floor(vestingDuration / gapTime);

  if (gapTime > 0 && claimCount < totalVestingUnits) {
    return [true, endTime + claimCount * vestingUnit];
  }
}
