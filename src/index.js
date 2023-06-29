import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import 'rc-steps/assets/index.css';
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import DefaultLayout from "layouts/default";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { toast, Toaster } from "react-hot-toast";
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import store from "./redux/store";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatChainStringToNumber } from "utils";
import { toastMessages } from "constants";

import FaucetPage from "pages/faucet";
import PoolsPage from "pages/pools";
import PoolDetailPage from "pages/pools/detail";
import FarmsPage from "pages/farms";
import FarmDetailPage from "pages/farms/detail";
import TokensPage from "pages/tokens";
import CreateTokenPage from "pages/create/token";
import CreateStakePoolPage from "pages/create/stake-pool";
import MyBalancePage from "pages/account/my-balance";
import TokensTransactionPage from "pages/tokens/transactions";
import jsonrpc from "@polkadot/types/interfaces/jsonrpc";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { initialApi } from "utils/contracts";
import CreateNFTLPPage from "pages/create/nft-lp-pool";
import CreateTokenLPPage from "pages/create/token-lp-pool";
import MyPoolsPage from "pages/account/my-pools";
import MyPoolDetailPage from "pages/account/my-pools/detail";
import { delay } from "utils";
import { fetchMyStakingPools } from "redux/slices/myPoolsSlice";
import { fetchMyTokenPools } from "redux/slices/myPoolsSlice";
import { fetchMyNFTPools } from "redux/slices/myPoolsSlice";
import { fetchAllTokensList } from "redux/slices/allPoolsSlice";
import { fetchAllStakingPools } from "redux/slices/allPoolsSlice";
import { fetchAllNFTPools } from "redux/slices/allPoolsSlice";
import { fetchAllTokenPools } from "redux/slices/allPoolsSlice";
import { web3Enable } from "@polkadot/extension-dapp";
import AdminPage from "pages/admin";
import CreateLaunchpadPage from "pages/create-launchpad";
import { AppContextProvider } from "contexts/AppContext";
import { useAppContext } from "contexts/AppContext";

const providerUrl = process.env.REACT_APP_PROVIDER_URL;

const App = () => {
  const dispatch = useDispatch();

  const { currentAccount } = useSelector((s) => s.wallet);
  const { myStakingPoolsList, myNFTPoolsList, myTokenPoolsList } = useSelector(
    (s) => s.myPools
  );
  const {
    allTokensList,
    allStakingPoolsList,
    allNFTPoolsList,
    allTokenPoolsList,
  } = useSelector((s) => s.allPools);
  const { setCurrentApi } = useAppContext();

  const [api, setApi] = useState(null);
  // const [, setLastChainBlock] = useState(null);
  // const [, setLastBlockParent] = useState(null);

  const uiColorMode = localStorage.getItem("chakra-ui-color-mode");

  if (!uiColorMode || uiColorMode === "dark") {
    localStorage.setItem("chakra-ui-color-mode", "light");
  }

  useEffect(() => {
    const setupProvider = async () => {
      toast(`Connecting to ${providerUrl}...`);
      const provider = new WsProvider(providerUrl);

      const wsApi = await ApiPromise.create({
        provider,
        rpc: jsonrpc,
        throwOnConnect: true,
      });

      if (!wsApi) return;

      console.log(`Successfully connected to: ${providerUrl}`);
      toast.success(`Successfully connected !`);

      setApi(wsApi);

      initialApi(wsApi);

      setCurrentApi(wsApi);

      await wsApi.rpc.chain.subscribeNewHeads((lastHeader) => {
        // eslint-disable-next-line no-unused-vars
        const lastBlock = formatChainStringToNumber(
          JSON.stringify(lastHeader.number.toHuman())
        );

        // setLastChainBlock(lastBlock);
        // setLastBlockParent(lastHeader.parentHash.toRawType);
      });

      await web3Enable(process.env.REACT_APP_NAME);
    };

    setupProvider().catch((error) => {
      toast.error(toastMessages.ERR_API_CONN);
      console.error("@_@ setupProvider error", error);
    });
  }, [dispatch]);

  useEffect(() => {
    delay(100);

    if (!allNFTPoolsList) {
      dispatch(fetchAllNFTPools({ currentAccount }));
    }

    if (!allTokensList) {
      dispatch(fetchAllTokensList({}));
    }

    if (!allStakingPoolsList) {
      dispatch(fetchAllStakingPools({ currentAccount }));
    }

    if (!allTokenPoolsList) {
      dispatch(fetchAllTokenPools({ currentAccount }));
    }

    if (!currentAccount?.address) return;

    if (!myNFTPoolsList) {
      dispatch(fetchMyNFTPools({ currentAccount }));
    }

    if (!myStakingPoolsList) {
      dispatch(fetchMyStakingPools({ currentAccount }));
    }

    if (!myTokenPoolsList) {
      dispatch(fetchMyTokenPools({ currentAccount }));
    }

    if (!currentAccount?.balance) {
      dispatch(fetchUserBalance({ currentAccount, api }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, currentAccount?.address]);

  return (
    <HashRouter>
      <DefaultLayout>
        <Switch>
          <Redirect exact from="/" to="/acquire-inw" />
          <Route exact path={`/acquire-inw`}>
            <FaucetPage api={api} />
          </Route>
          <Route exact path={`/pools/:contractAddress`}>
            <PoolDetailPage api={api} />
          </Route>
          <Route exact path={`/pools`}>
            <PoolsPage api={api} />
          </Route>
          <Route
            exact
            path={`/farms/:contractAddress`}
            component={FarmDetailPage}
          />
          <Route exact path={`/farms`} component={FarmsPage} />{" "}
          <Route exact path={`/tokens/interaction`} component={TokensPage} />
          <Route exact path={`/tokens/transaction`} component={TokensTransactionPage} />
          <Route exact path={`/create/token`} component={CreateTokenPage} />
          <Route
            exact
            path={`/create/stake-pool`}
            component={CreateStakePoolPage}
          />
          <Route exact path={`/create/nft-lp`} component={CreateNFTLPPage} />
          <Route exact path={`/create/launchpad`} component={CreateLaunchpadPage} />
          <Route
            exact
            path={`/create/token-lp`}
            component={CreateTokenLPPage}
          />
          <Route exact path={`/account`} component={MyBalancePage} />
          <Route exact path={`/account/my-balance`} component={MyBalancePage} />
          <Route exact path={`/my-pools`} component={MyPoolsPage} />
          <Route
            exact
            path={`/my-pools/:contractAddress`}
            component={MyPoolDetailPage}
          />{" "}
          <Route exact path={`/admin`} component={AdminPage} />
          <Route>
            <FaucetPage api={api} />
          </Route>
        </Switch>
      </DefaultLayout>
    </HashRouter>
  );
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <AppContextProvider>
        <ReduxProvider store={store}>
          <Toaster
            position="bottom-right"
            reverseOrder={true}
            toastOptions={{
              style: {
                padding: "8px",
                fontSize: "16px",
                color: "#57527E",
                borderRadius: "5px",
                background: "#E8FDFF",
              },
            }}
          />

          <App />
        </ReduxProvider>
      </AppContextProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
