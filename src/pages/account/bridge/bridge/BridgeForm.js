import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Spacer, Text, Tooltip } from "@chakra-ui/react";
import IWCard from "components/card/Card";
import { supportedChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { Form, Formik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoSwapVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatNumToBNEther, formatQueryResultToNumber } from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import azero_manager_bridge from "utils/contracts/azero_manager_bridge";
import psp22_contract from "utils/contracts/psp22_contract";
import * as Yup from "yup";
import { BridgeInput } from "./BridgeInput";
import { execContractQueryFireChain } from "utils/contracts/firechain/";
import fire_psp22_contract from "utils/contracts/firechain/fire_psp22_contract";
import fire_bridge_token_contract from "utils/contracts/firechain/fire_bridge_token_contract";
import { execContractTxFireChain } from "utils/contracts/firechain";
import { formatQueryResultToNumberEthers } from "utils";

const supportedChainBridge = supportedChain.filter(
  (e) => e?.bridgeTo?.length > 0
);

export function BridgeForm() {
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((state) => state.wallet);

  const [isSendOtherAddress, setIsSendOtherAddress] = useState(false);

  const balanceFirechain = currentAccount?.balance?.["firechain-testnet"];

  const onBridgeToken = async (values) => {
    try {
      if (values?.fromChain === "firechain-testnet") {
        const allowanceTokenQrF = await execContractQueryFireChain(
          currentAccount?.address,
          fire_psp22_contract.CONTRACT_ABI,
          fire_psp22_contract.CONTRACT_ADDRESS,
          "psp22::allowance",
          currentAccount?.address,
          fire_bridge_token_contract.CONTRACT_ADDRESS
        );

        const allowanceInwF = formatQueryResultToNumberEthers(
          allowanceTokenQrF,
          18
        ).replaceAll(",", "");

        if (+allowanceInwF < +values.fromAmount) {
          toast("Step1: Approve...");
          console.log(
            `Step1: Approve... ${fire_bridge_token_contract.CONTRACT_ADDRESS}`
          );

          let approve = await execContractTxFireChain(
            currentAccount,
            fire_psp22_contract.CONTRACT_ABI,
            fire_psp22_contract.CONTRACT_ADDRESS,
            0, //-> value
            "psp22::approve",
            fire_bridge_token_contract.CONTRACT_ADDRESS,
            formatNumToBNEther(values.fromAmount, 18)
          );
          if (!approve) return;
        }

        await delay(9000).then(async () => {
          toast("Step2: Swap...");
          console.log("Swap amount", formatNumToBNEther(values.fromAmount, 18));
          console.log(
            "Swap receiver",
            isSendOtherAddress ? values.toAddress : currentAccount?.address
          );
          await execContractTxFireChain(
            currentAccount,
            fire_bridge_token_contract.CONTRACT_ABI,
            fire_bridge_token_contract.CONTRACT_ADDRESS,
            0,
            "createNewTransaction",
            formatNumToBNEther(values.fromAmount, 18),
            isSendOtherAddress ? values.toAddress : currentAccount?.address
          );
        });

        await delay(15000).then(() => {
          if (currentAccount) {
            dispatch(fetchUserBalance({ currentAccount, api }));
          }
        });
      }

      if (values?.fromChain === "alephzero-testnet") {
        // ===========================================================
        // if (!currentAccount) {
        //   return toast.error("Please connect wallet!");
        // }
        // if (!(+amount > 0)) {
        //   toast.error("Please enter valid amount!");
        //   return;
        // }
        // if (+inwBalance < +amount) {
        //   toast.error(
        //     `Maximum swap amount is ${formatNumDynDecimal(inwBalance)}`
        //   );
        //   return;
        // }

        const allowanceTokenQr = await execContractQuery(
          currentAccount?.address,
          api,
          psp22_contract.CONTRACT_ABI,
          psp22_contract.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::allowance",
          currentAccount?.address,
          azero_manager_bridge.CONTRACT_ADDRESS
        );

        const allowanceINW = formatQueryResultToNumber(
          allowanceTokenQr
        ).replaceAll(",", "");

        if (+allowanceINW < +values.fromAmount) {
          toast("Step1: Approve...");

          let approve = await execContractTx(
            currentAccount,
            api,
            psp22_contract.CONTRACT_ABI,
            psp22_contract.CONTRACT_ADDRESS,
            0, //-> value
            "psp22::approve",
            azero_manager_bridge.CONTRACT_ADDRESS,
            formatNumToBNEther(values.fromAmount)
          );
          if (!approve) return;
        }
        await delay(2000).then(async () => {
          toast("Step2: Swap...");

          await execContractTx(
            currentAccount,
            api,
            azero_manager_bridge.CONTRACT_ABI,
            azero_manager_bridge.CONTRACT_ADDRESS,
            0,
            "createNewTransaction",
            formatNumToBNEther(values.fromAmount),
            isSendOtherAddress ? values.toAddress : currentAccount?.address
          );
        });

        await delay(15000).then(() => {
          if (currentAccount) {
            dispatch(fetchUserBalance({ currentAccount, api }));
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={{
        fromChain: "alephzero-testnet",
        fromAmount: "",
        toChain: "firechain-testnet",
        toAmount: "",
        toAddress: "",
        gasApprove: 0,
        gasExec: 0,
      }}
      validationSchema={validateBridgeInfo(9999999)}
      onSubmit={async (values, formHelper) => {
        await onBridgeToken(values);

        formHelper.resetForm();
        setIsSendOtherAddress(false);
      }}
    >
      {({ values, dirty, isValid, isSubmitting, setFieldValue }) => {
        const { selectedFromChain, selectedToChain } =
          getSelectedChainInfo(values);

        return (
          <Form>
            <Flex flexDirection={["column"]}>
              <IWCard variant="solid">
                <BridgeInput
                  name="fromAmount"
                  address={currentAccount?.address}
                  selectedChain={selectedFromChain}
                  supportedChainBridge={supportedChainBridge}
                />
              </IWCard>

              <Flex my="12px" w="full" justifyContent="center">
                <Button
                  w="52px"
                  h="52px"
                  variant="ghost"
                  onClick={() => {
                    setFieldValue("fromChain", values.toChain);
                    setFieldValue("toChain", values.fromChain);
                  }}
                >
                  <IoSwapVertical fontSize="32px" />
                </Button>
              </Flex>

              <IWCard variant="solid">
                <BridgeInput
                  name="toAmount"
                  address={currentAccount?.address}
                  selectedChain={selectedToChain}
                  supportedChainBridge={supportedChainBridge}
                  isSendOtherAddress={isSendOtherAddress}
                  setIsSendOtherAddress={setIsSendOtherAddress}
                />
              </IWCard>

              <Box w="full" mt="8px">
                <Flex w="full" fontSize="sm" alignItems="center">
                  <Flex fontSize="sm" alignItems="center">
                    <Text>
                      Gas fee:{" "}
                      {(
                        parseFloat(values.gasApprove) +
                        parseFloat(values.gasExec)
                      ).toFixed(8) || 0}{" "}
                      AZERO
                    </Text>
                    <Tooltip
                      fontSize="sm"
                      label={
                        <Box>
                          <Text>
                            Approval gas fee: {values.gasApprove} AZERO
                          </Text>
                          <Text>Execute gas fee: {values.gasExec} AZERO</Text>
                        </Box>
                      }
                    >
                      <QuestionOutlineIcon ml="6px" />
                    </Tooltip>
                  </Flex>
                </Flex>
                <Flex w="full" fontSize="sm" alignItems="center">
                  <Flex fontSize="sm" alignItems="center">
                    <Text>
                      Platform fee (5%): ~{" "}
                      {((values.fromAmount * 5) / 100).toFixed(2) || 0} INW
                    </Text>
                    <Tooltip fontSize="sm" label="Platform fee: 5%">
                      <QuestionOutlineIcon ml="6px" />
                    </Tooltip>
                  </Flex>

                  <Spacer />

                  <Flex fontSize="sm" alignItems="center">
                    <Text>Est. Time: 2m 30s </Text>
                    <Tooltip fontSize="sm" label="Est. time for finish tx ">
                      <QuestionOutlineIcon ml="6px" />
                    </Tooltip>
                  </Flex>
                </Flex>
              </Box>

              <Button
                mt="16px"
                isDisabled={!(dirty && isValid) || isSubmitting}
                type="submit"
                w={["full"]}
              >
                {isSubmitting ? (
                  <ClipLoader
                    color="#57527E"
                    loading
                    size={18}
                    speedMultiplier={1.5}
                  />
                ) : currentAccount?.address ? (
                  "Bridge"
                ) : (
                  "Connect wallet"
                )}
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
}

function getSelectedChainInfo(values) {
  return {
    selectedFromChain: supportedChain.find((e) => e?.key === values?.fromChain),
    selectedToChain: supportedChain.find((e) => e?.key === values?.toChain),
  };
}

function validateBridgeInfo(maxValue) {
  return () =>
    Yup.object().shape({
      fromChain: Yup.string().required("This field is a required"),
      fromAmount: Yup.number("Amount must be a number.")
        .max(maxValue, `Amount must be less than or equal to ${maxValue}`)
        .min(1, `Amount must be greater than or equal to 1`)
        .required("This field is a required"),
      toChain: Yup.string().required("This field is a required"),
      toAddress: Yup.string(),
      toAmount: Yup.number("Amount must be a number."),
    });
}
