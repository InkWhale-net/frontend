import { CheckIcon } from "@chakra-ui/icons";
import { createContext, useContext, useState } from "react";

export const CreateLaunchpadContext = createContext({});

const CreateLaunchpadContextProvider = ({ children }) => {
    const [current, setCurrent] = useState(0);
    const [itemStep, setItemStep] = useState([
      {
        title: "Verify Token",
        description: "Enter the token address and verify",
      },
      {
        title: "Project Info",
        description: "Enter the launchpad information that you want to raise",
      },
      {
        title: "Project Roadmap & Team",
      },
      {
        title: "Phase",
      },
      {
        title: "Finish",
        description: "Review your information",
      },
    ]);
  
    const nextStep = () => {
      const nextStep = Math.min(current + 1, 4)
      setItemStep(prevState => {
        prevState[current] = {...prevState[current], icon: <CheckIcon />}
        return prevState
      })
      setCurrent(nextStep);
    };
  
    const prevStep = () => {
      const prefStep = Math.max(current - 1, 0)
      setItemStep(prevState => {
        const {icon, ...step} = prevState[prefStep] 
        prevState[prefStep] = step
        return prevState
      })
      setCurrent(prefStep);
    };
    return (
        <CreateLaunchpadContext.Provider
          value={{
            nextStep,
            prevStep,
            itemStep,
            current
          }}
        >
          {children}
        </CreateLaunchpadContext.Provider>
      );
}

export default CreateLaunchpadContextProvider;