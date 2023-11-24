import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { APICall } from "api/client";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { isValidAddress } from "pages/launchpad/create/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { delay } from "utils";
import { execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const AddSingleWL = ({
  launchpadData,
  selectedPhase,
  selectedWL,
  setSelectedWL,
  availableTokenAmount,
  phaseCapAmount,
  whitelist,
}) => {
  const { currentAccount } = useSelector((state) => state.wallet);
  const { api } = useAppContext();
  const [wlData, setWLData] = useState({
    address: "",
    amount: "",
    price: "",
  });
  useEffect(() => {
    setWLData(
      selectedWL
        ? {
            address: selectedWL?.account,
            amount: (+selectedWL?.amount).toString(),
            price: (+selectedWL?.price).toString(),
          }
        : {
            address: "",
            amount: "",
            price: "",
          }
    );
  }, [selectedWL]);
  const dispatch = useDispatch();

  const addSingleWLHandler = async () => {
    try {
      if (availableTokenAmount * 1 <= 0) {
        toast.error(`No available token amount!`);
        return;
      }

      if (phaseCapAmount < wlData?.amount) {
        toast.error(
          `Whitelist amount can not be greater than phase cap amount!`
        );
        return;
      }

      const currentWl = launchpadData?.phaseList[selectedPhase]?.whitelist;
      if (currentWl.some((obj) => obj.address === wlData?.address)) {
        toast.error("Whitelist address existed");
        return;
      }
      if (+wlData?.amount > +availableTokenAmount) {
        toast.error(`Maximum amount is ${availableTokenAmount}`);
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
      if (result) {
        setWLData({
          address: "",
          amount: "",
          price: "",
        });
        toast.promise(
          delay(4000).then(() => {
            dispatch(fetchLaunchpads({}));
          }),
          {
            loading: "Please wait up to 4s for the data to be updated! ",
            success: "Whitelist updated",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSingleWLHandler = async () => {
    try {
      if (availableTokenAmount * 1 <= 0) {
        toast.error(`No available token amount!`);
        return;
      }

      if (phaseCapAmount < wlData?.amount) {
        toast.error(
          `Whitelist amount can not be greater than phase cap amount!`
        );
        return;
      }

      if (
        wlData?.amount < 0 ||
        +wlData?.amount - +selectedWL?.amount > +availableTokenAmount
      ) {
        toast.error("Invalid token amount");
        return;
      }

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "launchpadContractTrait::updateMultiWhitelists",
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
      if (result) {
        setWLData({
          address: "",
          amount: "",
          price: "",
        });
        toast.promise(
          delay(4000).then(() => {
            dispatch(fetchLaunchpads({}));
          }),
          {
            loading: "Please wait up to 4s for the data to be updated! ",
            success: "Whitelist updated",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isWhitelistEditable = useMemo(() => {
    return +selectedWL?.claimedAmount > 0;
  }, [selectedWL]);

  // ++++++++++++++++++++++++++
  const inWLList = whitelist?.map((i) => i.account).includes(wlData?.address);

  useEffect(() => {
    if (inWLList) {
      const found = whitelist?.find((i) => i.account === wlData?.address);

      setWLData((prev) => ({ ...prev, ...found }));
    } else {
      setWLData((prev) => ({
        ...prev,
        amount: "",
        price: "",
      }));
    }
  }, [inWLList, whitelist, wlData?.address]);

  return (
    <Box sx={{ pt: "0px" }}>
      {isWhitelistEditable ? (
        <Box
          sx={{
            bg: "#FED1CA",
            display: "flex",
            alignItems: "center",
            px: "10px",
            py: "8px",
            mt: "10px",
            borderRadius: "4px",
          }}
        >
          <AiFillExclamationCircle />
          <Text sx={{ ml: "8px" }}>
            You can not edit this whitelist account
          </Text>
        </Box>
      ) : (
        <>
          <>
            <Text sx={{ fontWeight: "700" }}>Whitelist Address</Text>
            <IWInput
              disabled={launchpadData?.requireKyc && !selectedWL}
              size="md"
              value={wlData?.address}
              width={{ base: "full" }}
              onChange={({ target }) =>
                setWLData({ ...wlData, address: target.value })
              }
              placeholder="Address"
            />

            <Text sx={{ fontWeight: "700" }}>Amount</Text>
            <IWInput
              disabled={launchpadData?.requireKyc && !selectedWL}
              type="number"
              size="md"
              value={wlData?.amount}
              width={{ base: "full" }}
              onChange={({ target }) =>
                setWLData({ ...wlData, amount: target.value })
              }
              placeholder="0"
            />

            <Text sx={{ fontWeight: "700" }}>Price</Text>
            <IWInput
              disabled={launchpadData?.requireKyc && !selectedWL}
              type="number"
              size="md"
              value={wlData?.price}
              width={{ base: "full" }}
              onChange={({ target }) =>
                setWLData({ ...wlData, price: target.value })
              }
              placeholder="0"
            />
          </>

          {inWLList ? (
            <Box
              alignItems="center"
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                w="full"
                disabled={!selectedWL}
                m="16px 2px"
                size="md"
                sx={{ bg: "#F6F6FC" }}
                _hover={{ bg: "#E3E1EC" }}
                onClick={() => setSelectedWL(null)}
              >
                Cancel
              </Button>

              <Button
                w="full"
                isDisabled={
                  !selectedWL ||
                  !(
                    wlData?.address?.length > 0 &&
                    wlData?.amount?.length > 0 &&
                    wlData?.price?.length > 0 &&
                    (wlData?.address !== selectedWL?.account ||
                      wlData?.amount !== (+selectedWL?.amount).toString() ||
                      wlData?.price !== (+selectedWL?.price).toString())
                  )
                }
                m="16px 2px"
                size="md"
                onClick={() => updateSingleWLHandler()}
              >
                Update
              </Button>
            </Box>
          ) : (
            <Flex>
              {!launchpadData?.requireKyc ? (
                <>
                  <Button
                    w="full"
                    // disabled={!selectedWL}
                    m="16px 2px"
                    size="md"
                    sx={{ bg: "#F6F6FC" }}
                    _hover={{ bg: "#E3E1EC" }}
                    onClick={() => {
                      setWLData({
                        address: "",
                        amount: "",
                        price: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={
                      !(
                        wlData?.address?.length > 0 &&
                        wlData?.amount?.length > 0 &&
                        wlData?.price?.length > 0 &&
                        isValidAddress(wlData?.address)
                      )
                    }
                    m="16px 2px"
                    w="full"
                    size="md"
                    onClick={() => addSingleWLHandler()}
                  >
                    Add New
                  </Button>
                </>
              ) : null}
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};
export default AddSingleWL;
