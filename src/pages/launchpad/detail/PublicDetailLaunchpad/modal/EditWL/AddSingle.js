import { Box, Button, Text } from "@chakra-ui/react";
import { APICall } from "api/client";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { delay } from "utils";
import { execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const AddSingleWL = ({ launchpadData, selectedPhase }) => {
  const { currentAccount } = useSelector((state) => state.wallet);
  const { api } = useAppContext();
  const [wlData, setWLData] = useState({
    address: "",
    amount: "",
    price: "",
  });
  const dispatch = useDispatch();
  const addSingleWLHandler = async () => {
    try {
      await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "launchpadContractTrait::addMultiWhitelists",
        selectedPhase,
        [wlData?.address],
        [
          parseUnits(
            wlData?.amount.toString(),
            parseInt(launchpadData?.projectInfo?.token.decimals)
          ),
        ],
        [parseUnits(wlData?.price.toString(), 12)]
      );
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: launchpadData?.launchpadContract,
      });
      setWLData({
        address: "",
        amount: "",
        price: "",
      });
      toast.promise(
        delay(4000).then(() => {
          dispatch(fetchLaunchpads({ isActive: 0 }));
        }),
        {
          loading: "Please wait up to 4s for the data to be updated! ",
          success: "Whitelist updated",
          error: "Could not fetch data!!!",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box sx={{ pt: "20px" }}>
      <Text sx={{ fontWeight: "700", color: "#57527E" }}>
        Whitelist Address
      </Text>
      <IWInput
        size="md"
        value={wlData?.address}
        width={{ base: "full" }}
        onChange={({ target }) =>
          setWLData({ ...wlData, address: target.value })
        }
        placeholder="Address"
      />
      <Text sx={{ fontWeight: "700", color: "#57527E" }}>Price</Text>
      <IWInput
        size="md"
        value={wlData?.price}
        width={{ base: "full" }}
        onChange={({ target }) => setWLData({ ...wlData, price: target.value })}
        placeholder="Price"
      />
      <Text sx={{ fontWeight: "700", color: "#57527E" }}>Amount</Text>
      <IWInput
        size="md"
        value={wlData?.amount}
        width={{ base: "full" }}
        onChange={({ target }) =>
          setWLData({ ...wlData, amount: target.value })
        }
        placeholder="Amount"
      />
      <Button mt="16px" w="full" size="md" onClick={() => addSingleWLHandler()}>
        Add Whitelist
      </Button>
    </Box>
  );
};
export default AddSingleWL;
