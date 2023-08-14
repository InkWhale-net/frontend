import { useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { createContext } from "react";
import EditWL from "./EditWL";
import { useState } from "react";
import EditPhase from "./EditPhase";

export const ModalDetailContext = createContext();

const ModalDetailContextProvider = ({ children, ...rest }) => {
  const [wlVisible, setWLVisible] = useState(false);
  const [phaseVisible, setPhaseVisible] = useState(false);

  return (
    <ModalDetailContext.Provider
      value={{
        showWLModal: () => setWLVisible(true),
        showPhaseModal: () => setPhaseVisible(true),
      }}
    >
      <EditWL {...rest} visible={wlVisible} setVisible={setWLVisible} />
      <EditPhase
        {...rest}
        visible={phaseVisible}
        setVisible={setPhaseVisible}
      />
      {children}
    </ModalDetailContext.Provider>
  );
};
export const useModalLPDetail = () => useContext(ModalDetailContext);
export default ModalDetailContextProvider;
