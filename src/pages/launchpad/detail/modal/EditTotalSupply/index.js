import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import NumberInputWrapper from "components/input/NumberInput";
import { useAppContext } from "contexts/AppContext";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { formatNumToBN } from "utils";
import { delay } from "utils";
import { formatChainStringToNumber } from "utils";
import { formatQueryResultToNumber } from "utils";
import { formatNumDynDecimal, formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import * as Yup from "yup";

const EditTotalSupply = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const dispatch = useDispatch();

  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);

  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const isPhaseStart =
    Date.now() > formatChainStringToNumber(launchpadData?.startTime);
  const isOwner = launchpadData?.owner === currentAccount?.address;
  const tokenSymbol = launchpadData?.projectInfo?.token?.symbol;
  const tokenAddress = launchpadData?.projectInfo?.token?.tokenAddress;
  const totalSupply =
    formatChainStringToNumber(launchpadData?.totalSupply) /
    Math.pow(10, tokenDecimal);

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
      // setOnCreateNew(false);
      // setNewData(null);
      // setSelectedPhaseIndex(-1);
    } else {
      if (launchpadData) fetchPhaseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, launchpadData]);

  const minAllowed = totalSupply - availableTokenAmount;

  const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const queryResult = await execContractQuery(
        currentAccount?.address,
        api,
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22::balanceOf",
        currentAccount?.address
      );

      const tokenBal = formatQueryResultToNumber(queryResult);

      setTokenBalance(tokenBal);
    };
    api && fetchData();
  }, [api, currentAccount?.address, tokenAddress]);

  return (
    <>
      <Modal
        isOpen={visible}
        isCentered
        size="lg"
        onClose={() => setVisible(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{ totalSupply }}
            validationSchema={Yup.object().shape({
              totalSupply: Yup.number()
                .required(`This field is required`)
                .min(
                  minAllowed,
                  `Total Supply must be greater than or equal to ${minAllowed} ${tokenSymbol}`
                )
                .max(
                  parseInt(tokenBalance?.replaceAll(",", "")),
                  `Total Supply must be less than or equal to ${parseInt(
                    tokenBalance?.replaceAll(",", "")
                  )} ${tokenSymbol}`
                ),
            })}
            onSubmit={async (values) => {
              console.log("isPhaseStart", isPhaseStart);
              if (isPhaseStart) {
                return toast.error("You can not edit when project started!");
              }

              if (!isOwner) {
                return toast.error("Only owner can edit!");
              }

              try {
                // check approve additional portion
                const additionalPortion = values?.totalSupply - totalSupply;

                if (additionalPortion > 0) {
                  toast("Approving approve additional token...");

                  const allowanceTokenQr = await execContractQuery(
                    currentAccount?.address,
                    "api",
                    psp22_contract_v2.CONTRACT_ABI,
                    launchpadData?.projectInfo?.token?.tokenAddress,
                    0, //-> value
                    "psp22::allowance",
                    currentAccount?.address,
                    launchpadData?.launchpadContract
                  );

                  const allowanceToken =
                    allowanceTokenQr?.toHuman().Ok?.replaceAll(",", "") /
                    10 ** launchpadData?.projectInfo?.token?.decimals;

                  if (additionalPortion > allowanceToken) {
                    await execContractTx(
                      currentAccount,
                      "api",
                      psp22_contract_v2.CONTRACT_ABI,
                      launchpadData?.projectInfo?.token?.tokenAddress,
                      0, //-> value
                      "psp22::approve",
                      launchpadData?.launchpadContract,
                      formatNumToBN(
                        additionalPortion,
                        launchpadData?.token?.decimals
                      )
                    );
                  }
                }
                // End check approve additional portion

                const result = await execContractTx(
                  currentAccount,
                  api,
                  launchpad.CONTRACT_ABI,
                  launchpadData?.launchpadContract,
                  0, //-> value
                  "launchpadContractTrait::setTotalSupply",
                  formatNumToBN(values?.totalSupply)
                );

                if (result) {
                  await delay(200);

                  await APICall.askBEupdate({
                    type: "launchpad",
                    poolContract: launchpadData?.launchpadContract,
                  });

                  toast.promise(
                    delay(5000).then(() => {
                      setVisible(false);
                      dispatch(fetchLaunchpads({}));
                    }),
                    {
                      loading:
                        "Please wait up to 5s for the data to be updated! ",
                      success: "Success",
                      error: "Could not fetch data!!!",
                    }
                  );
                }
              } catch (error) {
                console.log("error", error);
              }
            }}
          >
            {({ dirty, isValid, isSubmitting }) => (
              <Form>
                <ModalHeader>Edit total token for sale</ModalHeader>

                <ModalCloseButton onClick={() => setVisible(false)} />
                <ModalBody
                  sx={{ pb: "28px", maxHeight: "80vh", overflow: "auto" }}
                >
                  <SimpleGrid
                    w="full"
                    columns={{ base: 1, lg: 2 }}
                    spacingX={{ lg: "20px" }}
                    spacingY={{ base: "20px" }}
                    mb={{ base: "30px" }}
                  >
                    <Text>Current total supply</Text>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Text>{`${formatNumDynDecimal(
                        parseInt(totalSupply)
                      )} ${tokenSymbol}`}</Text>
                    </Box>

                    <Text>Available token amount </Text>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Text>{`${formatNumDynDecimal(
                        availableTokenAmount
                      )} ${tokenSymbol}`}</Text>
                    </Box>

                    <Text>Your {tokenSymbol} token balance</Text>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Text>{`${formatNumDynDecimal(
                        parseInt(tokenBalance?.replaceAll(",", ""))
                      )} ${tokenSymbol}`}</Text>
                    </Box>
                  </SimpleGrid>

                  <Stack>
                    <Text textAlign="left" color="brand.grayLight">
                      {`New Total Supply (max ${formatNumDynDecimal(
                        parseInt(tokenBalance?.replaceAll(",", ""))
                      )} ${tokenSymbol})`}
                    </Text>
                    <NumberInputWrapper
                      type="number"
                      name="totalSupply"
                      hasStepper={false}
                      step={1}
                      precision={0}
                      placeholder="Royalty Fee"
                      isDisabled={isSubmitting}
                      min={minAllowed}
                      max={tokenBalance}
                    />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    w="full"
                    type="submit"
                    isDisabled={!(dirty && isValid) || isSubmitting}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditTotalSupply;
