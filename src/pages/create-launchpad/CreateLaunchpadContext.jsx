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

const CreateLaunchpadContextProvider = ({ children }) => {
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

  const nextStep = () => {
    const nextStep = Math.min(current + 1, itemStep?.length - 1);
    setItemStep((prevState) => {
      prevState[current] = { ...prevState[current], icon: <CheckedIcon /> };
      return prevState;
    });
    setCurrent(nextStep);
  };

  const prevStep = () => {
    console.log(current, "currentcurrent");
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
      {children}
    </CreateLaunchpadContext.Provider>
  );
};

export default CreateLaunchpadContextProvider;
