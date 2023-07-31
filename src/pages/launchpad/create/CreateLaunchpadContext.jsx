import { CheckIcon } from "@chakra-ui/icons";
import { Circle } from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import { APICall, ipfsClient } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchUserBalance } from "redux/slices/walletSlice";
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
import Phase from "./components/Phase";
import ProjectInfor from "./components/ProjectInfor";
import ProjectRoadmap from "./components/ProjectRoadmap";
import Team from "./components/Team";
import VerifyToken from "./components/VerifyToken";
import {
  processStringToArray,
  validatePhase,
  validateProjectInfor,
  validateRoadmap,
  validateTeam,
  validateTotalSupply,
  verifyProjectInfo,
  verifyTeam,
  verifyTokenValid,
  verifyWhitelist,
} from "./utils";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";

export const CreateLaunchpadContext = createContext();

const CheckedIcon = () => {
  return (
    <Circle size="40px" bg="#E8FDFF" border={"1px solid #93F0F5"} color="white">
      <CheckIcon color={"#93F0F5"} />
    </Circle>
  );
};

const CreateLaunchpadContextProvider = (props) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const history = useHistory();

  const [current, setCurrent] = useState(0);
  const [itemStep, setItemStep] = useState([
    {
      title: "Verify Token",
      description: "Enter the token address and verify",
      content: <VerifyToken />,
    },
    {
      title: "Project Info",
      description: "Enter the project information ",
      content: <ProjectInfor />,
    },
    {
      title: "Project Roadmap",
      description: "Enter the project roadmap",
      content: <ProjectRoadmap />,
    },
    {
      title: "Team",
      description: "Enter the project phase",
      content: <Team />,
    },
    {
      title: "Phase",
      description: "Phase information",
      content: <Phase />,
    },
    // {
    //   title: "Finish",
    //   description: "Review your information",
    //   content: <Phase />,
    // },
  ]);
  const [createTokenFee, setCreateTokenFee] = useState(0);

  const [launchpadData, updateLaunchpadData] = useState({
    token: null,
    projectInfor: null,
    roadmap: null,
    team: null,
    phase: null,
    totalSupply: null,
  });
  const updateToken = (value) => {
    if (value)
      updateLaunchpadData((prevState) => ({ ...prevState, token: value }));
  };

  const updateProjectInfor = (value) => {
    if (value) updateLaunchpadData({ ...launchpadData, projectInfor: value });
  };

  const updateRoadmap = (value) => {
    if (value) updateLaunchpadData({ ...launchpadData, roadmap: value });
  };
  const updateMember = (value) => {
    if (value) updateLaunchpadData({ ...launchpadData, team: value });
  };
  const updatePhase = (value) => {
    if (value) updateLaunchpadData({ ...launchpadData, phase: value });
  };
  const updateTotalSupply = (value) => {
    updateLaunchpadData({ ...launchpadData, totalSupply: value });
  };

  const verifyStep = async () => {
    switch (current) {
      case 0:
        return verifyTokenValid(launchpadData, currentAccount);
      case 1:
        return verifyProjectInfo(launchpadData);
      case 3:
        return verifyTeam(launchpadData);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const nextStep = Math.min(current + 1, itemStep?.length - 1);
    if (await verifyStep()) {
      setItemStep((prevState) => {
        prevState[current] = { ...prevState[current], icon: <CheckedIcon /> };
        return prevState;
      });
      setCurrent(nextStep);
    }
  };

  const prevStep = async () => {
    const prefStep = Math.max(current - 1, 0);
    setItemStep((prevState) => {
      const { icon, ...step } = prevState[prefStep];
      prevState[prefStep] = step;
      const { icon: icon2, ...stepCur } = prevState[current];
      prevState[current] = stepCur;
      return prevState;
    });
    setCurrent(prefStep);
  };
  const isNextButtonActive = useMemo(() => {
    switch (current) {
      case 0:
        return !!launchpadData?.token;
      case 1:
        return validateProjectInfor(launchpadData);
      case 2:
        return validateRoadmap(launchpadData);
      case 3:
        return validateTeam(launchpadData);
      case 4:
        return validatePhase(launchpadData);
      default:
        return true;
    }
  }, [current, launchpadData]);

  useEffect(() => {
    const fetchCreateTokenFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "launchpadGeneratorTrait::getCreationFee"
      );

      const fee = formatQueryResultToNumber(result);
      // console.log(fee);
      setCreateTokenFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);

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
      const whitelist = launchpadData?.phase?.map((e) =>
        processStringToArray(e?.whiteList)
      );

      // DO batch add whitelist
      let addWhitelistTxAll;
      const value = 0;
      const launchpadContract = new ContractPromise(
        api,
        launchpad.CONTRACT_ABI,
        launchpadContractAddress
      );
      const { signer } = await web3FromSource(currentAccount?.meta?.source);
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
                      whitelist?.length === 1
                        ? "Added whitelist successfully"
                        : "All whitelist have been Added successfully"
                    );
                  }
                }
              );

              // eslint-disable-next-line no-extra-boolean-cast
              if (!!totalSuccessTxCount) {
                toast.error(
                  whitelist?.length === 1
                    ? "Adding whitelist not successfully!                "
                    : `Bulk adding are not fully successful! ${totalSuccessTxCount} adding completed successfully.`
                );
              }
              // updateData();
            }
          }
        )
        .then((unsub) => resolve(unsub))
        .catch((error) => {
          toast.error("The staking fail", error?.message);
          reject(error);
        });
    });
  };

  const handleAddNewLaunchpad = async () => {
    try {
      const minReward = launchpadData?.phase?.reduce(
        (acc, e) => acc + (e?.phasePublicAmount || 0),
        0
      );
      if (
        !validateTotalSupply(launchpadData?.phase, launchpadData?.totalSupply)
      )
        return;

      // check wallet connect?
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      // ADD MODE CHECKING
      // if (!values.isEditMode) {
      //   // check Total Mint Amount của Phase vs total Supply (FE)
      //   const totalSupply = parseInt(values.totalSupply);
      //   const phases = values.phases;

      //   const allPhasesMintAmount = phases.reduce((acc, cur) => {
      //     return cur?.isPublic
      //       ? acc + parseInt(cur?.publicAmount)
      //       : acc;
      //   }, 0);

      //   if (totalSupply < allPhasesMintAmount) {
      //     return toast.error(
      //       "Total mint of phases must less than Total supply!"
      //     );
      //   }
      // }

      // check all image uploaded?

      // if (!values.isEditMode) {
      //   // check prj time-frame is picked?
      //   const prjStartTime = values?.startTime;
      //   const prjEndTime = values?.endTime;
      //   if (!values.isEditMode && (!prjStartTime || !prjEndTime)) {
      //     return toast.error("Please pick time frame for project!");
      //   }

      //   // check all phase time-frame is picked?
      //   const phasesArray = values?.phases;

      //   const startPhasesAr = phasesArray?.map((i) => i.start);

      //   const isPhaseTimePicked = startPhasesAr?.every((e) => e);

      //   if (phasesArray && !isPhaseTimePicked) {
      //     return toast.error("Please pick time frame for all phases!");
      //   }

      //   // check time is overlap?
      //   const allPhaseTime = [...values.phases];

      //   const isOverlap = isPhaseTimeOverlap(allPhaseTime);

      //   if (isOverlap) {
      //     return toast.error("Sub phase time is not valid or overlap.");
      //   }
      // }

      // //check low balance?
      // if (userBalance < 1) {
      //   return toast.error(`Your balance too low!`);
      // }

      const project_info_ipfs = await ipfsClient.add(
        JSON.stringify(launchpadData)
      );

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
      const allowanceINW = formatQueryResultToNumber(allowanceINWQr).replaceAll(
        ",",
        ""
      );
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

      //Approve
      if (allowanceINW < createTokenFee.replaceAll(",", "")) {
        toast.success(`Approving INW token...`);
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
        if (!approve) return;
      }
      if (allowanceToken < minReward.replaceAll(",", "")) {
        toast.success(`${launchpadData?.token?.symbol} token...`);
        let approve = await execContractTx(
          currentAccount,
          "api",
          psp22_contract.CONTRACT_ABI,
          launchpadData?.token?.tokenAddress,
          0, //-> value
          "psp22::approve",
          launchpad_generator.CONTRACT_ADDRESS,
          formatNumToBN(Number.MAX_SAFE_INTEGER)
        );
        if (!approve) return;
      }
      await delay(3000);
      toast.success(`Process creating...`);

      await execContractTxAndCallAPI(
        currentAccount,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0, //-> value
        "newLaunchpad",
        async (newContractAddress) => {
          toast.success("Please wait for adding whitelist...");
          await delay(100);
          await new Promise(async (resolve) => {
            resolve(bulkAddingWhitelist(newContractAddress));
          });
          await APICall.askBEupdate({ type: "launchpad", poolContract: "new" });
          toast.promise(
            delay(10000).then(() => {
              dispatch(fetchLaunchpads({}));
              history.push("/launchpad");
              toast.success("good");
            }),
            {
              loading: "Please wait up to 10s for the data to be updated! ",
              success: "Done !",
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
        launchpadData?.phase?.map((e) =>
          (parseFloat(e?.immediateReleaseRate) * 100).toFixed()
        ),
        launchpadData?.phase?.map((e) =>
          dayToMilisecond(parseFloat(e?.vestingLength))
        ),
        launchpadData?.phase?.map((e) =>
          dayToMilisecond(parseFloat(e?.vestingUnit))
        ),
        launchpadData?.phase?.map((e) => e?.allowPublicSale),
        launchpadData?.phase?.map((e) => {
          return e?.allowPublicSale
            ? parseUnits(
                e?.phasePublicAmount.toString(),
                parseInt(launchpadData?.token.decimals)
              )
            : "";
        }),
        launchpadData?.phase?.map((e) => {
          return e?.allowPublicSale
            ? parseUnits(e?.phasePublicPrice.toString(), 12)
            : "";
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <CreateLaunchpadContext.Provider
      value={{
        nextStep,
        prevStep,
        itemStep,
        current,
        updateToken,
        updateProjectInfor,
        updateRoadmap,
        updateMember,
        updatePhase,
        updateTotalSupply,
        launchpadData,
        updateLaunchpadData,
        isNextButtonActive,
        handleAddNewLaunchpad,
      }}
    >
      {props.children}
    </CreateLaunchpadContext.Provider>
  );
};
export const useCreateLaunchpad = () => useContext(CreateLaunchpadContext);

export default CreateLaunchpadContextProvider;
