import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Box,
  CircularProgress,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import { APICall, ipfsClient } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import {
  dayToMilisecond,
  delay,
  formatNumToBN,
  formatQueryResultToNumber,
  getEstimatedGasBatchTx,
} from "utils";
import {
  execContractQuery,
  execContractTx,
  execContractTxAndCallAPI,
} from "utils/contracts";
import { launchpad } from "utils/contracts";
import { launchpad_generator } from "utils/contracts";
import { psp22_contract } from "utils/contracts";
import { useCreateLaunchpad } from "./CreateLaunchpadContext";
import { processStringToArray } from "./utils";
import { formatTokenAmount } from "utils";
import { formatTextAmount } from "utils";

const StepItem = ({
  isActive,
  isError,
  isSuccess,
  label,
  callback,
  newLpAddress,
  activeStep,
}) => {
  useEffect(() => {
    if (isActive) {
      callback();
    }
  }, [isActive]);
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: "8px" }}>
      <Box sx={{ w: "32px" }}>
        {isSuccess ? (
          <CheckCircleIcon color="#65E229" />
        ) : isActive ? (
          isError ? (
            <WarningIcon color="#EA4A61" />
          ) : (
            <CircularProgress isIndeterminate color="#A4F4F9" size="20px" />
          )
        ) : null}
      </Box>
      <Text
        sx={{
          ml: "8px",
          fontWeight: isActive ? "bold" : null,
          color: isActive ? "#57527E" : null,
        }}
      >
        {label}
      </Text>
    </Box>
  );
};

const FinishModal = ({}) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const {
    launchpadData,
    finishModalVisible: visible,
    setFinishModalVisible: setVisible,
    createTokenFee,
  } = useCreateLaunchpad();
  const [activeStep, setActiveStep] = useState(0);
  const [isError, setIsError] = useState(false);
  const { api } = useAppContext();
  const [newLpAddress, setNewLpAddress] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const stepList = [
    {
      label: "Approve INW",
      callback: async () => {
        try {
          await new Promise(async (resolve, reject) => {
            try {
              if (activeStep != 0) reject("Approve INW fail");
              const allowanceINWQr = await execContractQuery(
                currentAccount?.address,
                "api",
                psp22_contract.CONTRACT_ABI,
                psp22_contract.CONTRACT_ADDRESS,
                0, //-> value
                "psp22::allowance",
                currentAccount?.address,
                launchpad_generator.CONTRACT_ADDRESS
              );

              const allowanceINW = allowanceINWQr.toHuman().Ok;
              if (
                formatTokenAmount(formatTextAmount(allowanceINW), 12) <
                +formatTextAmount(createTokenFee)
              ) {
                let approve = await execContractTxAndCallAPI(
                  currentAccount,
                  "api",
                  psp22_contract.CONTRACT_ABI,
                  psp22_contract.CONTRACT_ADDRESS,
                  0, //-> value
                  "psp22::approve",
                  async () => {
                    setActiveStep((prev) => prev + 1);
                    resolve();
                  },
                  launchpad_generator.CONTRACT_ADDRESS,
                  formatNumToBN(createTokenFee.replaceAll(",", ""))
                );

                if (!approve) {
                  setIsError(true);
                  reject("Approve INW fail");
                }
              } else {
                setActiveStep((prev) => prev + 1);
                resolve();
              }
            } catch (error) {
              setIsError(true);
              console.log(error);
              reject("Approve INW fail");
            }
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
    {
      label: "Approve token",
      callback: async () => {
        try {
          await new Promise(async (resolve, reject) => {
            try {
              if (activeStep != 1) reject("Approve Token fail");
              const allowanceTokenQr = await execContractQuery(
                currentAccount?.address,
                "api",
                psp22_contract.CONTRACT_ABI,
                launchpadData?.token?.tokenAddress,
                0, //-> value
                "psp22::allowance",
                currentAccount?.address,
                launchpad_generator.CONTRACT_ADDRESS
              );

              const allowanceToken = formatTokenAmount(
                formatTextAmount(allowanceTokenQr?.toHuman().Ok),
                +launchpadData?.token?.decimals
              );

              if (+allowanceToken < +launchpadData?.totalSupply) {
                let approve = await execContractTxAndCallAPI(
                  currentAccount,
                  "api",
                  psp22_contract.CONTRACT_ABI,
                  launchpadData?.token?.tokenAddress,
                  0, //-> value
                  "psp22::approve",
                  async () => {
                    setActiveStep((prev) => prev + 1);
                    resolve();
                  },
                  launchpad_generator.CONTRACT_ADDRESS,
                  formatNumToBN(
                    launchpadData?.totalSupply,
                    launchpadData?.token?.decimals
                  )
                );
                if (!approve) {
                  setIsError(true);
                  reject("Approve Token fail");
                }
              } else {
                setActiveStep((prev) => prev + 1);
                resolve();
              }
            } catch (error) {
              setIsError(true);
              console.log(error);
              reject("Approve Token fail");
            }
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
    {
      label: "Create launchpad",
      callback: async () => {
        try {
          await new Promise(async (resolve, reject) => {
            try {
              if (activeStep != 2) reject("Process create fail");
              const project_info_ipfs = await ipfsClient.add(
                JSON.stringify(launchpadData)
              );
              // ===================================
              const callbackFn = async (newContractAddress) => {
                setNewLpAddress(newContractAddress);
                await APICall.askBEupdate({
                  type: "launchpad",
                  poolContract: newContractAddress,
                });
                toast.promise(
                  delay(10000).then(() => {
                    dispatch(fetchLaunchpads({}));
                    history.push("/launchpad");
                    resolve();
                  }),
                  {
                    loading:
                      "Please wait up to 10s for the data to be updated! ",
                    success:
                      "Thank you for submitting. Your Project has been created successfully. It will need enabling by our team. We will get in touch with you within the next 48 hours. In the meantime, you can navigate to My Project page to check status of your project.",
                    error: "Could not fetch data!!!",
                  }
                );
              };

              const totalSupply = parseUnits(
                launchpadData?.totalSupply.toString(),
                parseInt(launchpadData?.token.decimals)
              );

              const phasesVector = launchpadData.phase.map((p) => {
                const decimals = launchpadData?.token.decimals;
                const capAmount = p.capAmount ?? 0;
                const publicAmount = p?.allowPublicSale
                  ? p?.phasePublicAmount.toString().replaceAll(",", "")
                  : 0;
                const publicPrice = p?.allowPublicSale
                  ? p?.phasePublicPrice.toString().replaceAll(",", "")
                  : 0;

                const phase = {
                  name: p.name,
                  startTime: p?.startDate?.getTime().toString(),
                  endTime: p?.endDate?.getTime(),
                  immediateReleaseRate: parseInt(
                    (parseFloat(p?.immediateReleaseRate) * 100).toFixed()
                  ).toString(),
                  vestingDuration:
                    parseFloat(p?.immediateReleaseRate) == 100
                      ? 0
                      : dayToMilisecond(parseFloat(p?.vestingLength)),

                  vestingUnit:
                    parseFloat(p?.immediateReleaseRate) == 100
                      ? 1
                      : dayToMilisecond(parseFloat(p?.vestingUnit)),
                  capAmount: formatNumToBN(capAmount, decimals),
                  isPublic: p.allowPublicSale,
                  publicAmount: formatNumToBN(publicAmount, decimals),
                  publicPrice: formatNumToBN(publicPrice),
                };

                return api.createType("PhaseInput", phase);
              });

              const result = await execContractTxAndCallAPI(
                currentAccount,
                "api",
                launchpad_generator.CONTRACT_ABI,
                launchpad_generator.CONTRACT_ADDRESS,
                0, //-> value
                "newLaunchpad",
                callbackFn,
                project_info_ipfs.path,
                launchpadData?.token?.tokenAddress,
                totalSupply,
                phasesVector
              );
              if (!result) {
                setIsError(true);
                reject("Process create fail");
              }
            } catch (error) {
              setIsError(true);
              console.log(error);
              reject("Process create fail");
            }
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
  ];
  useEffect(() => {
    if (visible) {
      setIsError(false);
      setActiveStep(0);
    }
  }, [visible]);
  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Launchpad Create Processing</ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px" }}>
          {stepList.map((e, index) => (
            <StepItem
              {...e}
              isActive={index == activeStep}
              isSuccess={activeStep > index}
              isError={isError}
              newLpAddress={newLpAddress}
              activeStep={activeStep}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinishModal;
