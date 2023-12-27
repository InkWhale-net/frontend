import { useMemo } from "react";
import { createContext, useContext, useState } from "react";
import Icon5Ire from "assets/img/chains/5irechain.png";
import IconAlephzero from "assets/img/chains/alephzero.png";
import { useAppContext } from "./AppContext";
import { useEffect } from "react";

export const supportedChain = [
  {
    name: "Alephzero",
    key: "alephzero",
    icon: IconAlephzero,
    decimal: 12,
    providerURL: "wss://ws.test.azero.dev",
  },
  {
    name: "5ire",
    key: "5irechain",
    icon: Icon5Ire,
    decimal: 18,
    providerURL: "wss://wss-testnet.5ire.network",
  },
];
export const ChainSwitchContext = createContext();
export const ChainSwitchProvider = ({ children }) => {
  const { api } = useAppContext();
  const [currentChainkey, switchChain] = useState(null);
  const currentChain = useMemo(() => {
    if (currentChainkey) {
      const data = supportedChain.find((e) => e?.key == currentChainkey);
      localStorage.setItem("currentChain", data?.key);
      localStorage.setItem("currencyDecimal", data?.decimal);
      return data;
    }
  }, [currentChainkey]);
  const unitDecimal = useMemo(() => currentChain?.decimal || 0, [currentChain]);
  useEffect(() => {
    const data = localStorage.getItem("currentChain");

    if (data) {
      switchChain(data);
    } else {
      switchChain("alephzero");
    }
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
