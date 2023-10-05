import { CheckIcon } from "@chakra-ui/icons";
import { Circle } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  formatNumDynDecimal,
  formatQueryResultToNumber,
  formatTokenAmount,
} from "utils";
import { execContractQuery } from "utils/contracts";
import launchpad_generator from "utils/contracts/launchpad_generator";
import FinishModal from "./FinishModal";
import Phase from "./components/Phase";
import ProjectInfor from "./components/ProjectInfor";
import ProjectRoadmap from "./components/ProjectRoadmap";
import Team from "./components/Team";
import VerifyToken from "./components/VerifyToken";
import {
  validatePhase,
  validatePhaseData,
  validateProjectInfor,
  validateRoadmap,
  validateTeam,
  validateTotalSupply,
  verifyProjectInfo,
  verifyTeam,
  verifyTokenValid,
} from "./utils";

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

  const [finishModalVisible, setFinishModalVisible] = useState(false);
  const [itemStep, setItemStep] = useState([
    {
      title: "Verify Token",
      description: "Fill the token address you want to fundraise",
      content: <VerifyToken />,
    },
    {
      title: "Project Info",
      description: "What your project is about?",
      content: <ProjectInfor />,
    },
    {
      title: "Project Roadmap",
      description:
        "Provide high-level goals and deliverables on your project's timeline",
      content: <ProjectRoadmap />,
    },
    {
      title: "Team",
      description: "What are your team members?",
      content: <Team />,
    },
    {
      title: "Phase",
      description: "Create phases with price & other details",
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

  const updateKycUrl = (value) => {
    updateLaunchpadData({ ...launchpadData, kycUrl: value });
  };

  const updateRequireKyc = (value) => {
    updateLaunchpadData({ ...launchpadData, requireKyc: value });
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

  const handleAddNewLaunchpad = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      const minReward = +launchpadData?.phase?.reduce(
        (acc, e) => acc + (e?.phasePublicAmount || 0),
        0
      );

      if (
        !(launchpadData?.phase?.length > 0) ||
        !validateTotalSupply(
          launchpadData?.phase,
          parseFloat(launchpadData?.totalSupply),
          parseFloat(launchpadData.token.balance.replaceAll(",", ""))
        )
      )
        return;

      const result = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "launchpadGeneratorTrait::getCreationFee"
      );
      const fee = result.toHuman().Ok;

      if (
        !(
          parseFloat(currentAccount?.balance?.inw.replaceAll(",", "")) >
          parseFloat(formatTokenAmount(fee, 12))
        )
      ) {
        toast.error(
          `Your INW balance must higher than ${formatNumDynDecimal(
            formatTokenAmount(fee, 12)
          )}`
        );
        return;
      }
      // check wallet connect?

      if (!validatePhaseData(launchpadData?.phase, launchpadData?.totalSupply))
        return;

      setFinishModalVisible(true);
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
        finishModalVisible,
        setFinishModalVisible,
        createTokenFee,
        updateKycUrl,
        updateRequireKyc,
      }}
    >
      <FinishModal />
      {props.children}
    </CreateLaunchpadContext.Provider>
  );
};
export const useCreateLaunchpad = () => useContext(CreateLaunchpadContext);

export default CreateLaunchpadContextProvider;
