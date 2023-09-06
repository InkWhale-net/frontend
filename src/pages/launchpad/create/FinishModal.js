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
import { APICall, ipfsClient } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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
import azt_contract from "utils/contracts/azt_contract";
import launchpad from "utils/contracts/launchpad";
import launchpad_generator from "utils/contracts/launchpad_generator";
import psp22_contract from "utils/contracts/psp22_contract";
import { useCreateLaunchpad } from "./CreateLaunchpadContext";
import { processStringToArray } from "./utils";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";

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

  const bulkAddingWhitelist = async (launchpadContractAddress) => {
    return new Promise(async (resolve, reject) => {
      // const phaseQuery = await execContractQuery(
      //   currentAccount?.address,
      //   api,
      //   launchpad.CONTRACT_ABI,
      //   // createdLaunchpadContract,
      //   launchpadContractAddress,
      //   0, //-> value
      //   "launchpadContractTrait::getTotalPhase"
      // );
      // const totalPhase = phaseQuery.toHuman()?.Ok;
      const whitelist = launchpadData?.phase
        ?.map((e) => {
          if (e?.whiteList) return processStringToArray(e?.whiteList);
        })
        .filter((e) => e);
      if (whitelist?.length > 0) {
        // DO batch add whitelist
        let addWhitelistTxAll;
        const value = 0;
        const launchpadContract = new ContractPromise(
          api,
          launchpad.CONTRACT_ABI,
          launchpadContractAddress
        );
        const signer = window.nightlySigner;
        const gasLimit = await getEstimatedGasBatchTx(
          currentAccount?.address,
          launchpadContract,
          value,
          "launchpadContractTrait::addMultiWhitelists",
          0,
          whitelist[0].map((e) => e?.address),
          whitelist[0].map((e) =>
            parseUnits(
              e?.amount.toString(),
              parseInt(launchpadData?.token.decimals)
            )
          ),
          whitelist[0].map((e) => parseUnits(e?.price.toString(), 12))
        );
        await Promise.all(
          whitelist.map(async (info, index) => {
            const ret = launchpadContract.tx[
              "launchpadContractTrait::addMultiWhitelists"
            ](
              { gasLimit, value },
              index,
              info.map((e) => e?.address),
              info.map((e) =>
                parseUnits(
                  e?.amount?.toString(),
                  parseInt(launchpadData?.token.decimals)
                )
              ),
              info.map((e) => parseUnits(e?.price?.toString(), 12))
            );

            return ret;
          })
        ).then((res) => (addWhitelistTxAll = res));

        await api.tx.utility
          .batch(addWhitelistTxAll)
          .signAndSend(
            currentAccount?.address,
            { signer },
            async ({ events, status, dispatchError }) => {
              if (status?.isFinalized) {
                let totalSuccessTxCount = null;

                events.forEach(
                  async ({
                    event,
                    event: { data, method, section, ...rest },
                  }) => {
                    if (api.events.utility?.BatchInterrupted.is(event)) {
                      totalSuccessTxCount = data[0]?.toString();
                    }

                    if (api.events.utility?.BatchCompleted.is(event)) {
                      toast.success(
                        whitelist?.length == 1
                          ? "Added whitelist successfully"
                          : "All whitelist have been Added successfully"
                      );
                    }
                  }
                );

                // eslint-disable-next-line no-extra-boolean-cast
                if (!!totalSuccessTxCount) {
                  toast.error(
                    whitelist?.length == 1
                      ? "Adding whitelist not successfully!                "
                      : `Bulk adding are not fully successful! ${totalSuccessTxCount} adding completed successfully.`
                  );
                }
                // updateData();
              }
            }
          )
          .then((unsub) => {
            setActiveStep((prev) => prev + 1);
            resolve(unsub);
          })
          .catch((error) => {
            toast.error("The staking fail", error?.message);
            reject(error);
          });
      } else {
        setActiveStep((prev) => prev + 1);
        toast("No whitelist found");
        resolve(-1);
      }
    });
  };

  const stepList = [
    {
      label: "Approve INW",
      callback: async () => {
        try {
          if (activeStep != 0) return;
          const allowanceINWQr = await execContractQuery(
            currentAccount?.address,
            "api",
            azt_contract.CONTRACT_ABI,
            azt_contract.CONTRACT_ADDRESS,
            0, //-> value
            "psp22::allowance",
            currentAccount?.address,
            launchpadData?.token?.tokenAddress
          );
          const allowanceINW = formatQueryResultToNumber(
            allowanceINWQr
          ).replaceAll(",", "");
          if (allowanceINW < +createTokenFee.replaceAll(",", "")) {
            let approve = await execContractTx(
              currentAccount,
              "api",
              psp22_contract.CONTRACT_ABI,
              azt_contract.CONTRACT_ADDRESS,
              0, //-> value
              "psp22::approve",
              launchpad_generator.CONTRACT_ADDRESS,
              formatNumToBN(Number.MAX_SAFE_INTEGER)
            );
            if (approve) {
              setActiveStep((prev) => prev + 1);
            } else {
              setIsError(true);
              return;
            }
          } else setActiveStep((prev) => prev + 1);
        } catch (error) {
          setIsError(true);
          console.log(error);
        }
      },
    },
    {
      label: "Approve token",
      callback: async () => {
        try {
          if (activeStep != 1) return;
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
          const allowanceToken = formatQueryResultToNumber(
            allowanceTokenQr,
            launchpadData?.token?.decimals
          ).replaceAll(",", "");
          if (allowanceToken < +launchpadData?.totalSupply) {
            let approve = await execContractTx(
              currentAccount,
              "api",
              psp22_contract.CONTRACT_ABI,
              launchpadData?.token?.tokenAddress,
              0, //-> value
              "psp22::approve",
              launchpad_generator.CONTRACT_ADDRESS,
              formatNumToBN(
                Number.MAX_SAFE_INTEGER,
                launchpadData?.token?.decimals
              )
            );
            if (approve) {
              setActiveStep((prev) => prev + 1);
            } else {
              setIsError(true);
              return;
            }
          } else setActiveStep((prev) => prev + 1);
        } catch (error) {
          setIsError(true);
          console.log(error);
        }
      },
    },
    {
      label: "Create launchpad",
      callback: async () => {
        try {
          if (activeStep != 2) return;
          const project_info_ipfs = await ipfsClient.add(
            JSON.stringify(launchpadData)
          );
          console.log("activeStep", activeStep);
          const result = await execContractTxAndCallAPI(
            currentAccount,
            "api",
            launchpad_generator.CONTRACT_ABI,
            launchpad_generator.CONTRACT_ADDRESS,
            0, //-> value
            "newLaunchpad",
            async (newContractAddress) => {
              setNewLpAddress(newContractAddress);
              setActiveStep((prev) => prev + 1);
              await new Promise(async (resolve) => {
                resolve(bulkAddingWhitelist(newLpAddress));
              });
              await APICall.askBEupdate({
                type: "launchpad",
                poolContract: "new",
              });
              toast.promise(
                delay(10000).then(() => {
                  dispatch(fetchLaunchpads({ isActive: 0 }));
                  history.push("/launchpad");
                }),
                {
                  loading: "Please wait up to 10s for the data to be updated! ",
                  success:
                    "Thank you for submitting. Your Project has been created successfully. It will need enabling by our team. We will get in touch with you within the next 48 hours. In the meantime, you can navigate to My Project page to check status of your project.",
                  error: "Could not fetch data!!!",
                }
              );
            },
            project_info_ipfs.path,
            launchpadData?.token?.tokenAddress,
            parseUnits(
              launchpadData?.totalSupply.toString(),
              parseInt(launchpadData?.token.decimals)
            ),
            launchpadData?.phase?.map((e) => e?.name),
            launchpadData?.phase?.map((e) => e?.startDate?.getTime()),
            launchpadData?.phase?.map((e) => e?.endDate?.getTime()),
            launchpadData?.phase?.map((e) => {
              return parseInt(
                (parseFloat(e?.immediateReleaseRate) * 100).toFixed()
              ).toString();
            }),
            launchpadData?.phase?.map((e) => {
              if (parseFloat(e?.immediateReleaseRate) == 100) return 0;
              else return dayToMilisecond(parseFloat(e?.vestingLength));
            }),
            launchpadData?.phase?.map((e) => {
              if (parseFloat(e?.immediateReleaseRate) == 100) return 1;
              else return dayToMilisecond(parseFloat(e?.vestingUnit));
            }),
            launchpadData?.phase?.map((e) => e?.allowPublicSale),
            launchpadData?.phase?.map((e) => {
              return e?.allowPublicSale
                ? parseUnits(
                    e?.phasePublicAmount.toString(),
                    parseInt(launchpadData?.token.decimals)
                  )
                : 0;
            }),
            launchpadData?.phase?.map((e) => {
              return e?.allowPublicSale
                ? parseUnits(e?.phasePublicPrice.toString(), 12)
                : 0;
            })
          );
          if (!result) {
            setIsError(true);
            return;
          }
        } catch (error) {
          setIsError(true);
          console.log(error);
        }
      },
    },
    {
      label: "Setup whitelist",
      callback: async () => {
        // try {
        //   if (activeStep != 3 || !newLpAddress) return;
        //   toast("Please wait for adding whitelist...");
        //   await delay(100);
        // } catch (error) {
        //   setIsError(true);
        //   console.log(error);
        // }
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
