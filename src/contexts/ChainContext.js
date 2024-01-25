import { supportedChain } from "constants";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ChainSwitchContext = createContext();
export const ChainSwitchProvider = ({ children }) => {
  const [currentChainkey, switchChain] = useState(null);
  const currentChain = useMemo(() => {
    if (currentChainkey) {
      const data = supportedChain.find((e) => e?.key == currentChainkey);
      localStorage.setItem("currentChain", data?.key);
      localStorage.setItem("currencyDecimal", data?.decimal);
      localStorage.setItem("currencyUnit", data?.unit);
      return data;
    }
  }, [currentChainkey]);
  const unitDecimal = useMemo(() => currentChain?.decimal || 0, [currentChain]);
  useEffect(() => {
    switchChain(process.env.REACT_APP_CHAIN);
  }, []);
  return (
    <ChainSwitchContext.Provider
      value={{ currentChain, switchChain, unitDecimal }}
    >
      {children}
    </ChainSwitchContext.Provider>
  );
};
export const useChainContext = () => useContext(ChainSwitchContext);
