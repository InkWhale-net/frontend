import { Box, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

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
const StatusCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [publicBalance, setPublicBalance] = useState([]);
  // const {whitelist, setWhitelist}
  const dispatch = useDispatch();
  const phases = launchpadData?.phaseList;
  const getBalance = async () => {
    try {
      const publicBuyerList = await Promise.all(
        phases?.map(async (e, index) => {
          const query = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getPublicBuyer",
            index,
            currentAccount?.address
          );
          const publicBuyer = query.toHuman().Ok;
          const decimalToken = parseInt(
            launchpadData.projectInfo.token.decimals
          );
          return {
            phaseID: index,
            claimedAmount: formatTokenAmount(
              publicBuyer?.claimedAmount,
              decimalToken
            ),
            lastUpdatedTime: formatTokenAmount(
              publicBuyer?.lastUpdatedTime,
              decimalToken
            ),
            purchasedAmount: formatTokenAmount(
              publicBuyer?.purchasedAmount,
              decimalToken
            ),
            vestingAmount: formatTokenAmount(
              publicBuyer?.vestingAmount,
              decimalToken
            ),
          };
        })
      );
      // const WLBuyerList = await Promise.all(
      //   phases.map(async (e, index) => {
      //     const query = await execContractQuery(
      //       currentAccount?.address,
      //       api,
      //       launchpad.CONTRACT_ABI,
      //       launchpadData?.launchpadContract,
      //       0,
      //       "launchpadContractTrait::getPublicBuyer",
      //       index,
      //       currentAccount?.address
      //     );
      //     const publicBuyer = query.toHuman().Ok;
      //     const decimalToken = parseInt(
      //       launchpadData.projectInfo.token.decimals
      //     );
      //     return {
      //       phaseID: index,
      //       claimedAmount: formatTokenAmount(
      //         publicBuyer?.claimedAmount,
      //         decimalToken
      //       ),
      //       lastUpdatedTime: formatTokenAmount(
      //         publicBuyer?.lastUpdatedTime,
      //         decimalToken
      //       ),
      //       purchasedAmount: formatTokenAmount(
      //         publicBuyer?.purchasedAmount,
      //         decimalToken
      //       ),
      //       vestingAmount: formatTokenAmount(
      //         publicBuyer?.vestingAmount,
      //         decimalToken
      //       ),
      //     };
      //   })
      // );
      setPublicBalance(publicBuyerList);
    } catch (error) {
      console.log(error);
    }
  };
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
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "12px",
      }}
    >
      <Heading size="md" sx={{ marginBottom: "16px" }}>
        Public balance
      </Heading>

      {phases?.map((e, index) => {
        const publicBuyer = publicBalance.find((e) => e?.phaseID == index);
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Heading size="md" sx={{ marginBottom: "4px" }}>
              {e?.name}
            </Heading>
            <Divider sx={{ marginBottom: "8px" }} />
            <Row
              sx={{ marginTop: "100px" }}
              label="Public purchased"
              value={publicBuyer?.purchasedAmount || 0}
            />
            <Row label="Claimed" value={publicBuyer?.claimedAmount || 0} />
            <Button
              my="8px"
              w="full"
              height="40px"
              variant="outline"
              onClick={() =>
                publicClaimHandler({ ...e, phaseID: publicBuyer?.phaseID })
              }
            >
              Claim
            </Button>
          </Box>
        );
      })}
    </Box>
  );
};

export default StatusCard;
