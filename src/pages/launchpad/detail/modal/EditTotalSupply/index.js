import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import {
  validatePhaseData,
  verifyWhitelist,
} from "pages/launchpad/create/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import {
  dayToMilisecond,
  delay,
  formatNumDynDecimal,
  formatTokenAmount,
  millisecondsInADay,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const EditTotalSupply = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(-1);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [onCreateNew, setOnCreateNew] = useState(true);
  const [newData, setNewData] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const dispatch = useDispatch();
  const phaseListData = useMemo(() => {
    return launchpadData?.phaseList?.map((e) => ({
      ...e,
      immediateReleaseRate:
        parseFloat(e?.immediateReleaseRate?.replace(/,/g, "")) / 100,
      name: e?.name,
      startDate: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
      endDate: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      vestingLength:
        parseFloat(e?.vestingDuration?.replace(/,/g, "")) / millisecondsInADay,
      vestingUnit:
        parseFloat(e?.vestingUnit?.replace(/,/g, "")) / millisecondsInADay,
      allowPublicSale: e?.publicSaleInfor?.isPublic,
      phasePublicAmount: formatTokenAmount(
        e?.publicSaleInfor?.totalAmount,
        tokenDecimal
      ),
      phasePublicPrice: formatTokenAmount(e?.publicSaleInfor?.price, 12),
    }));
  }, [launchpadData]);

  const fetchPhaseData = async () => {
    const result = await execContractQuery(
      currentAccount?.address,
      api,
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = result.toHuman().Ok;
    setAvailableTokenAmount(formatTokenAmount(availableAmount, tokenDecimal));
  };
  useEffect(() => {
    if (!visible) {
      setOnCreateNew(false);
      setNewData(null);
      setSelectedPhaseIndex(-1);
    } else {
      if (launchpadData) fetchPhaseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, launchpadData]);

  const handleCreateNewPhase = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (newData?.whiteList)
        if (!verifyWhitelist(newData?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }
      const phaseList = [...phaseListData, newData];
      if (
        !validatePhaseData(phaseList, {
          overlapseErrorMsgL:
            "New phase duration overlaps 1 or more phases. Please choose other time range",
        })
      )
        return;

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "addNewPhase",
        newData?.name,
        newData?.startDate?.getTime(),
        newData?.endDate?.getTime(),
        newData?.immediateReleaseRate === 100
          ? parseInt(
              (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
            )
          : parseInt(
              (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
            ),
        newData?.immediateReleaseRate === 100
          ? 0
          : dayToMilisecond(parseFloat(newData?.vestingLength)),
        newData?.immediateReleaseRate === 100
          ? 1
          : dayToMilisecond(parseFloat(newData?.vestingUnit)),
        newData?.allowPublicSale,
        newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicPrice.toString(), 12)
          : null
      );
      if (result) {
        await delay(200);
        await APICall.askBEupdate({
          type: "launchpad",
          poolContract: launchpadData?.launchpadContract,
        });
        toast.promise(
          delay(5000).then(() => {
            dispatch(fetchLaunchpads({ isActive: 0 }));
            setOnCreateNew(false);
            setVisible(false);
          }),
          {
            loading: "Please wait up to 5s for the data to be updated! ",
            success: "Success",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isPhaseEditable = useMemo(() => {
    if (selectedPhaseIndex >= 0) {
      const phaseData = phaseListData[selectedPhaseIndex];

      if (phaseData?.endDate < new Date() || phaseData?.startDate < new Date())
        return false;
      else return true;
    } else {
      return true;
    }
  }, [selectedPhaseIndex]);
  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit total token for sale</ModalHeader>

        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px", maxHeight: "80vh", overflow: "auto" }}>
          <SimpleGrid
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacingX={{ lg: "20px" }}
            spacingY={{ base: "20px", lg: "32px" }}
            mb={{ base: "30px" }}
          >
            <Text>Available token amount</Text>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Text>{`${formatNumDynDecimal(availableTokenAmount)} 
            ${launchpadData?.projectInfo?.token?.symbol}`}</Text>
            </Box>
          </SimpleGrid>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default EditTotalSupply;
