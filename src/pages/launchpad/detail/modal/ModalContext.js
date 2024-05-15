import { createContext, useContext, useState } from "react";
import EditInfor from "./EditInfor";
import EditPhase from "./EditPhase";
import EditTotalSupply from "./EditTotalSupply";
import EditWL from "./EditWL";
import WithdrawAzero from "./withdraw/withdrawAzero";

export const ModalDetailContext = createContext();

const ModalDetailContextProvider = ({ children, ...rest }) => {
  const [wlVisible, setWLVisible] = useState(false);
  const [phaseVisible, setPhaseVisible] = useState(false);
  const [inforVisible, setInforVisible] = useState(false);
  const [withdrawAzeroVisible, setWithdrawAzeroVisible] = useState(false);
  const [totalsupplyVisible, setTotalSupplyVisible] = useState(false);

  const [ownerBalance, updateOwnerBalance] = useState(0);
  const [unsoldToken, updateUnsoldToken] = useState(0);
  const contextValue = {
    showWLModal: () => setWLVisible(true),
    showPhaseModal: () => setPhaseVisible(true),
    showEditInforModal: () => setInforVisible(true),
    showEditTotalSupply: () => setTotalSupplyVisible(true),
    showWithdrawAzeroVisible: () => setWithdrawAzeroVisible(true),
    withdrawAzeroVisible,
    updateOwnerBalance,
    updateUnsoldToken,
    ownerBalance,
    unsoldToken,
  };
  return (
    <ModalDetailContext.Provider value={contextValue}>
      <EditWL {...rest} visible={wlVisible} setVisible={setWLVisible} />
      <EditPhase
        {...rest}
        {...contextValue}
        visible={phaseVisible}
        setVisible={setPhaseVisible}
      />
      <EditInfor
        {...rest}
        {...contextValue}
        visible={inforVisible}
        setVisible={setInforVisible}
      />
      <EditTotalSupply
        {...rest}
        {...contextValue}
        visible={totalsupplyVisible}
        setVisible={setTotalSupplyVisible}
      />
      <WithdrawAzero
        {...rest}
        {...contextValue}
        visible={withdrawAzeroVisible}
        setVisible={setWithdrawAzeroVisible}
      />
      {children}
    </ModalDetailContext.Provider>
  );
};
export const useModalLPDetail = () => useContext(ModalDetailContext);
export default ModalDetailContextProvider;
