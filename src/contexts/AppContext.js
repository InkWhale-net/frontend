import { Link, Text } from "@chakra-ui/react";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { toastMessages } from "constants";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logOutMyPools } from "redux/slices/myPoolsSlice";
import {
  disconnectCurrentAccount,
  fetchUserBalance,
  updateAccountsList,
} from "redux/slices/walletSlice";
import { SwapV2TokenProvider } from "./SwapV2TokenModalContext";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { currentAccount } = useSelector((state) => state.wallet);
  const [api, setApi] = useState(null);
  const dispatch = useDispatch();

  const loadAccounts = async () => {
    try {
      await web3Enable(process.env.REACT_APP_NAME);
      const currentExt = currentAccount?.meta?.source;
      const accounts = await web3Accounts();
      const connectedAccount = accounts?.filter(
        (e) => e?.meta?.source == currentExt
      );
      dispatch(updateAccountsList(connectedAccount));
    } catch (error) {
      walletDisconnectHandler();
      console.log(error);
    }
  };
  const walletConnectHandler = async (selectedExt) => {
    try {
      const extentions = await web3Enable(process.env.REACT_APP_NAME);
      const extData = extentions.find(
        (e) => e?.name == selectedExt.extensionName
      );
      if (extData) {
        const accounts = await web3Accounts();
        const connectedAccount = accounts?.filter(
          (e) => e?.meta?.source == selectedExt.extensionName
        );
        return connectedAccount?.length > 0 ? connectedAccount : [];
      } else {
        toast.error(
          <Text>
            {toastMessages.NO_EXTENSION} You may download {selectedExt?.name}{" "}
            &nbsp;
            <Link
              isExternal
              rel="noreferrer"
              target="_blank"
              href={selectedExt?.downloadUrl}
            >
              Here
            </Link>
          </Text>
        );
        return [];
      }
    } catch (error) {
      walletDisconnectHandler();
      console.log(error);
    }
  };
  const walletDisconnectHandler = async () => {
    try {
      dispatch(disconnectCurrentAccount());
      dispatch(logOutMyPools());
      localStorage.removeItem("localCurrentAccount");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!currentAccount?.balance && api && currentAccount) {
      dispatch(fetchUserBalance({ currentAccount, api }));
    }
    if (currentAccount && api) loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, currentAccount]);
  return (
    <AppContext.Provider
      value={{
        api,
        setCurrentApi: setApi,
        walletConnectHandler,
        walletDisconnectHandler,
      }}
    >
      <SwapV2TokenProvider>{children}</SwapV2TokenProvider>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
