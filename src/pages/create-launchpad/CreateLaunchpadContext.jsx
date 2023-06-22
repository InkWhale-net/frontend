import { CheckIcon } from "@chakra-ui/icons";
import { Box, Circle } from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import VerifyToken from "./components/VerifyToken";
import ProjectInfor from "./components/ProjectInfor";
import ProjectRoadmap from "./components/ProjectRoadmap";
import Team from "./components/Team";
import Phase from "./components/Phase";

export const CreateLaunchpadContext = createContext({});

const CheckedIcon = () => {
  return (
    <Circle size="40px" bg="#E8FDFF" border={"1px solid #93F0F5"} color="white">
      <CheckIcon color={"#93F0F5"} />
    </Circle>
  );
};

const CreateLaunchpadContextProvider = (props) => {
  const [current, setCurrent] = useState(0);
  const [itemStep, setItemStep] = useState([
    {
      title: "Verify Token",
      description: "Enter the token address and verify",
      content: <VerifyToken {...props} />,
    },
    {
      title: "Project Info",
      description: "Enter the project information ",
      content: <ProjectInfor {...props} />,
    },
    {
      title: "Project Roadmap",
      description: "Enter the project roadmap",
      content: <ProjectRoadmap {...props} />,
    },
    {
      title: "Team",
      description: "Enter the project phase",
      content: <Team {...props} />,
    },
    {
      title: "Phase",
      description: "Phase information",
      content: <Phase {...props} />,
    },
    // {
    //   title: "Finish",
    //   description: "Review your information",
    //   content: <Phase />,
    // },
  ]);

  const nextStep = () => {
    const nextStep = Math.min(current + 1, itemStep?.length - 1);
    setItemStep((prevState) => {
      prevState[current] = { ...prevState[current], icon: <CheckedIcon /> };
      return prevState;
    });
    setCurrent(nextStep);
  };

  const prevStep = () => {
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
  return (
    <CreateLaunchpadContext.Provider
      value={{
        nextStep,
        prevStep,
        itemStep,
        current,
      }}
    >
      {props.children}
    </CreateLaunchpadContext.Provider>
  );
};

export default CreateLaunchpadContextProvider;
