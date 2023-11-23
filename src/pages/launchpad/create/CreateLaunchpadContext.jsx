import { CheckIcon } from "@chakra-ui/icons";
import { Circle } from "@chakra-ui/react";
import { useAppContext } from "contexts/AppContext";
import { createContext, useContext, useEffect, useState } from "react";
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
import { validatePhaseData, validateTotalSupply } from "./utils";

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
  const [createTokenFee, setCreateTokenFee] = useState("");

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

  const nextStep = async () => {
    const nextStep = Math.min(current + 1, itemStep?.length - 1);
    setItemStep((prevState) => {
      prevState[current] = { ...prevState[current], icon: <CheckedIcon /> };
      return prevState;
    });
    setCurrent(nextStep);
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

  const handleAddNewLaunchpad = async (phaseData) => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      const minReward = +phaseData?.phase?.reduce(
        (acc, e) => acc + (e?.phasePublicAmount || 0),
        0
      );
      if (
        !(phaseData?.phase?.length > 0) ||
        !validateTotalSupply(
          phaseData?.phase,
          parseFloat(phaseData?.totalSupply),
          parseFloat(phaseData.token.balance.replaceAll(",", ""))
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
          +currentAccount?.balance?.inw2.replaceAll(",", "") >
          +formatTokenAmount(fee, 12)
        )
      ) {
        toast.error(
          `Your INW V2 balance must higher than ${formatNumDynDecimal(
            formatTokenAmount(fee, 12)
          )}`
        );
        return;
      }
      // check wallet connect?

      if (!validatePhaseData(phaseData?.phase, phaseData?.totalSupply)) return;

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
