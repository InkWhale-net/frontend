import { Box, Button } from "@chakra-ui/react";
import { APICall } from "api/client";
import IWTextArea from "components/input/TextArea";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import {
  processStringToArray,
  verifyWhitelist,
} from "pages/launchpad/create/utils";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { delay } from "utils";
import { execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const AddBulk = ({
  launchpadData,
  selectedPhase,
  availableTokenAmount,
  setSelectedMode,
}) => {
  const { currentAccount } = useSelector((state) => state.wallet);
  const { api } = useAppContext();
  const [wlString, setWlString] = useState(null);

  const dispatch = useDispatch();

  const addBulkWLHandler = async () => {
    try {
      const isWlValid = await verifyWhitelist(wlString);
      if (!isWlValid) {
        toast.error("Invalid whitelist string");
        return;
      }
      const wlData = processStringToArray(wlString);
      const currentWl = launchpadData?.phaseList[selectedPhase]?.whitelist;
      if (
        wlData?.filter((e) => {
          return !currentWl.some((obj) => obj.account === e?.address);
        })?.length != wlData?.length
      ) {
        toast.error("Whitelist address existed");
        return;
      }
      const totalAmountWL = wlData.reduce((acc, object) => {
        return acc + +object?.amount;
      }, 0);
      if (!(totalAmountWL <= availableTokenAmount)) {
        toast.error("Not enough available token");
        return;
      }
      const result = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "launchpadContractTrait::addMultiWhitelists",
        selectedPhase,
        wlData.map((e) => e?.address),
        wlData.map((e) =>
          parseUnits(
            e?.amount.toString(),
            parseInt(launchpadData?.projectInfo?.token.decimals)
          )
        ),
        wlData.map((e) => parseUnits(e?.price.toString(), 12))
      );
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: launchpadData?.launchpadContract,
      });
      if (result) {
        setSelectedMode(0);
        toast.promise(
          delay(6000).then(() => {
            dispatch(fetchLaunchpads({ isActive: 0 }));
          }),
          {
            loading: "Please wait up to 6s for the data to be updated! ",
            success: "Whitelist updated",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ pt: "20px", px: "20px", w: "full" }}>
      <IWTextArea
        sx={{
          height: "132px",
        }}
        value={wlString}
        onChange={({ target }) => setWlString(target.value)}
        placeholder={`Enter one address, whitelist amount and price on each line. A decimal separator of amount must use dot (.)\nSample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn, 100, 0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL, 20, 2`}
      />
      <Button
        isDisabled={!(wlString?.length > 0)}
        mt="16px"
        w="full"
        size="md"
        onClick={() => addBulkWLHandler()}
      >
        Add Whitelist
      </Button>
    </Box>
  );
};
export default AddBulk;