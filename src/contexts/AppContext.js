import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [api, setApi] = useState(null);
  return (
    <AppContext.Provider value={{ api, setCurrentApi: setApi }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
