import { useDisclosure } from "@chakra-ui/react";
import { useContext } from "react";
import { createContext } from "react";
import EditWL from "./EditWL";
import { useState } from "react";
import EditPhase from "./EditPhase";
import EditInfor from "./EditInfor";

export const ModalDetailContext = createContext();

const ModalDetailContextProvider = ({ children, ...rest }) => {
  const [wlVisible, setWLVisible] = useState(false);
  const [phaseVisible, setPhaseVisible] = useState(false);
  const [inforVisible, setInforVisible] = useState(false);

  return (
    <ModalDetailContext.Provider
      value={{
        showWLModal: () => setWLVisible(true),
        showPhaseModal: () => setPhaseVisible(true),
        showEditInforModal: () => setInforVisible(true),
      }}
    >
      <EditWL {...rest} visible={wlVisible} setVisible={setWLVisible} />
      <EditPhase
        {...rest}
        visible={phaseVisible}
        setVisible={setPhaseVisible}
      />
      <EditInfor
        {...rest}
        visible={inforVisible}
        setVisible={setInforVisible}
      />
      {children}
    </ModalDetailContext.Provider>
  );
};
export const useModalLPDetail = () => useContext(ModalDetailContext);
export default ModalDetailContextProvider;
