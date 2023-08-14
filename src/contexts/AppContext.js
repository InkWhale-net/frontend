import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { currentAccount } = useSelector((state) => state.wallet);
  const [api, setApi] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!currentAccount?.balance && api) {
      dispatch(fetchUserBalance({ currentAccount, api }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, currentAccount]);
  return (
    <AppContext.Provider value={{ api, setCurrentApi: setApi }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
