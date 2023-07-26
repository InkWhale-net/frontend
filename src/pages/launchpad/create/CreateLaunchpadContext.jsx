import { CheckIcon } from "@chakra-ui/icons";
import { Circle } from "@chakra-ui/react";
import { ipfsClient } from "api/client";
import { useAppContext } from "contexts/AppContext";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { delay, formatNumToBN, formatQueryResultToNumber } from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import launchpad_generator from "utils/contracts/launchpad_generator";
import psp22_contract from "utils/contracts/psp22_contract";
import Phase from "./components/Phase";
import ProjectInfor from "./components/ProjectInfor";
import ProjectRoadmap from "./components/ProjectRoadmap";
import Team from "./components/Team";
import VerifyToken from "./components/VerifyToken";
import {
  validateProjectInfor,
  validateRoadmap,
  validateTeam,
  verifyProjectInfo,
  verifyTeam,
  verifyTokenValid,
} from "./utils";
import { APICall } from "api/client";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";
import { useHistory } from "react-router-dom";

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
    if (value) updateLaunchpadData({ ...launchpadData, totalSupply: value });
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
        return true
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
      console.log(fee);
      setCreateTokenFee(fee);
    };

    fetchCreateTokenFee();
  }, [currentAccount]);
  const handleAddNewLaunchpad = async () => {
    try {
      let step = 1;
      const minReward = launchpadData?.phase?.reduce(
        (acc, e) => acc + (e?.phasePublicAmount || 0),
        0
      );
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
      console.log(project_info_ipfs);

      // const { signer } = await web3FromSource(currentAccount?.meta?.source);

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
        toast.success(`Step ${step}: Approving INW token...`);
        step++;
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
        toast.success(
          `Step ${step}: Approving ${launchpadData?.token?.symbol} token...`
        );
        step++;
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
      toast.success(`Step 1: Process...`);
      await execContractTx(
        currentAccount,
        "api",
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0, //-> value
        "newLaunchpad",
        project_info_ipfs.path,
        launchpadData?.token?.tokenAddress,
        launchpadData?.totalSupply,
        launchpadData?.phase?.map((e) => e?.name),
        launchpadData?.phase?.map((e) => e?.startDate?.getTime()),
        launchpadData?.phase?.map((e) => e?.endDate?.getTime()),
        launchpadData?.phase?.map((e) => e?.immediateReleaseRate),
        launchpadData?.phase?.map((e) => e?.vestingLength),
        launchpadData?.phase?.map((e) => e?.vestingUnit),
        launchpadData?.phase?.map((e) => e?.allowPublicSale),
        launchpadData?.phase?.map((e) => e?.phasePublicAmount),
        launchpadData?.phase?.map((e) => formatNumToBN(e?.phasePublicPrice, 12))
      );
      await APICall.askBEupdate({ type: "launchpad", poolContract: "new" });
      updateLaunchpadData(null);
      setCurrent(0);
      toast.promise(
        delay(10000).then(() => {
          if (currentAccount) {
            dispatch(fetchUserBalance({ currentAccount, api }));
            history.push("/create/launchpad");
            // dispatch(fetchMyStakingPools({ currentAccount }));
          }
        }),
        {
          loading: "Please wait 10s for the data to be updated! ",
          success: "Done !",
          error: "Could not fetch data!!!",
        }
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
