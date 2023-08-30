import {
  getPolkadotWallets,
  NightlyConnectAdapter,
} from "@nightlylabs/wallet-selector-polkadot";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutMyPools } from "redux/slices/myPoolsSlice";
import { disconnectCurrentAccount } from "redux/slices/walletSlice";
import { updateAccountsList } from "redux/slices/walletSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const { currentAccount, allAccounts } = useSelector((state) => state.wallet);
  const [api, setApi] = useState(null);
  const [walletAdapter, setWalletAdapter] = useState(null);
  const dispatch = useDispatch();

  const initiaWallet = async () => {
    try {
      const adapter = NightlyConnectAdapter.buildLazy(
        {
          appMetadata: {
            name: process.env.REACT_APP_NAME,
            description:
              "InkWhale.net - Staking and Yield Farming Platform on Aleph Zero",
            // icon: <InkwhaleLogo />,
            icon: "https://www.gitbook.com/cdn-cgi/image/width=32,dpr=2,format=auto/https%3A%2F%2F2364279095-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FL14My8oggxJwLrmNGe9e%252Fuploads%252Fivh2OZ03tsNoZMvCOtCO%252FInk%2520Whale%2520Logo.jpg%3Falt%3Dmedia%26token%3D533db80c-516e-4fa4-8f38-37b6cec2e574",
            additionalInfo:
              "InkWhale.net - Staking and Yield Farming Platform on Aleph Zero",
          },
          network: "AlephZero",
        },
        true // should session be persisted
      );
      await setWalletAdapter(adapter);
    } catch (error) {
      console.log(error);
      walletDisconnectHandler();
    }
  };
  useEffect(() => {
    if (!walletAdapter) initiaWallet();
  }, []);
  const loadAccounts = async () => {
    try {
      if (walletAdapter) {
        await walletAdapter?.connect();
        const accounts = await walletAdapter?.accounts.get();
        dispatch(updateAccountsList(accounts));
        window.nightlySigner = walletAdapter?.signer;
      }
    } catch (error) {
      walletDisconnectHandler();
      console.log(error);
    }
  };
  const walletConnectHandler = async () => {
    try {
      await walletAdapter?.disconnect();
      await delay(100);
      await walletAdapter?.connect();
      const accounts = await walletAdapter?.accounts.get();
      dispatch(updateAccountsList(accounts));
      return accounts;
    } catch (error) {
      walletDisconnectHandler();
      console.log(error);
    }
  };
  const walletDisconnectHandler = async () => {
    try {
      await walletAdapter?.disconnect();
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
    if (currentAccount && walletAdapter) loadAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, currentAccount, walletAdapter]);
  return (
    <AppContext.Provider
      value={{
        api,
        setCurrentApi: setApi,
        walletAdapter,
        walletConnectHandler,
        walletDisconnectHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
