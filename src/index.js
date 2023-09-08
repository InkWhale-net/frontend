import { ChakraProvider } from "@chakra-ui/react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import "assets/css/App.css";
import { toastMessages } from "constants";
import DefaultLayout from "layouts/default";
import "rc-steps/assets/index.css";
import React, { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import ReactDOM from "react-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  Provider as ReduxProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import theme from "theme/theme";
import { formatChainStringToNumber } from "utils";
import store from "./redux/store";

import jsonrpc from "@polkadot/types/interfaces/jsonrpc";
import { AppContextProvider, useAppContext } from "contexts/AppContext";
import MyBalancePage from "pages/account/my-balance";
import MyPoolsPage from "pages/account/my-pools";
import MyPoolDetailPage from "pages/account/my-pools/detail";
import AdminPage from "pages/admin";
import CreateNFTLPPage from "pages/create/nft-lp-pool";
import CreateStakePoolPage from "pages/create/stake-pool";
import CreateTokenPage from "pages/create/token";
import CreateTokenLPPage from "pages/create/token-lp-pool";
import FarmsPage from "pages/farms";
import FarmDetailPage from "pages/farms/detail";
import FaucetPage from "pages/faucet";
import Launchpad from "pages/launchpad";
import CreateLaunchpadPage from "pages/launchpad/create";
import PublicDetailLaunchpad from "pages/launchpad/detail";
import LPPoolsPage from "pages/lpPools";
import PoolsPage from "pages/pools";
import PoolDetailPage from "pages/pools/detail";
import TokensPage from "pages/tokens";
import TokensTransactionPage from "pages/tokens/transactions";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  fetchAllStakingPools,
  fetchAllTokenPools,
  fetchAllTokensList,
} from "redux/slices/allPoolsSlice";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import {
  fetchMyStakingPools,
  fetchMyTokenPools,
} from "redux/slices/myPoolsSlice";
import { fetchTotalValueLocked } from "redux/slices/statSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { initialApi } from "utils/contracts";

const providerUrl = process.env.REACT_APP_PROVIDER_URL;
const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();

  const { currentAccount, allAccounts, currentExt } = useSelector(
    (s) => s.wallet
  );
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
  const { launchpads } = useSelector((s) => s.launchpad);
  const [api, setApi] = useState(null);
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
    };

    setupProvider().catch((error) => {
      toast.error(toastMessages.ERR_API_CONN);
      console.error("@_@ setupProvider error", error);
    });
  }, [dispatch]);

  // useEffect(() => {
  //   if (currentExt?.length > 0 && currentAccount) {
  //     if (!currentExt?.find((e) => e?.name == currentAccount?.meta?.source)) {
  //       dispatch(disconnectCurrentAccount());
  //       dispatch(logOutMyPools());
  //       localStorage.removeItem("localCurrentAccount");
  //     }
  //   }
  // }, [currentExt, currentAccount]);

  useEffect(() => {
    delay(100);

    // if (!allNFTPoolsList) {
    //   dispatch(fetchAllNFTPools({ currentAccount }));
    // }

    if (!allTokensList) {
      dispatch(fetchAllTokensList({}));
    }

    if (!allStakingPoolsList) {
      dispatch(fetchAllStakingPools({ currentAccount }));
    }

    if (!allTokenPoolsList) {
      dispatch(fetchAllTokenPools({ currentAccount }));
    }

    dispatch(fetchTotalValueLocked());

    if (!currentAccount?.address) return;

    // if (!myNFTPoolsList) {
    // dispatch(fetchMyNFTPools({ currentAccount }));
    // }

    if (!myStakingPoolsList) {
      dispatch(fetchMyStakingPools({ currentAccount }));
    }

    if (!myTokenPoolsList) {
      dispatch(fetchMyTokenPools({ currentAccount }));
    }

    if (!currentAccount?.balance) {
      dispatch(fetchUserBalance({ currentAccount, api }));
    }
    // if (!launchpads) {
    //   dispatch(fetchLaunchpads({}));
    // }

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
          <Route exact path={`/farms`} component={FarmsPage} />
          <Route exact path={`/tokens/interaction`} component={TokensPage} />
          <Route
            exact
            path={`/tokens/transaction`}
            component={TokensTransactionPage}
          />
          <Route exact path={`/create/token`} component={CreateTokenPage} />
          <Route
            exact
            path={`/create/stake-pool`}
            component={CreateStakePoolPage}
          />
          <Route exact path={`/create/nft-lp`} component={CreateNFTLPPage} />
          <Route
            exact
            path={`/launchpad/create`}
            component={CreateLaunchpadPage}
          />
          <Route exact path={`/launchpad`} component={Launchpad} />
          <Route
            exact
            path={`/launchpad/:launchpadContract`}
            component={PublicDetailLaunchpad}
          />
          <Route
            exact
            path={`/create/token-lp`}
            component={CreateTokenLPPage}
          />
          <Route exact path={`/token-lp`} component={LPPoolsPage} />
          <Route
            exact
            path={`/token-lp/:contractAddress`}
            component={FarmDetailPage}
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
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <AppContextProvider>
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
          </AppContextProvider>
        </ReduxProvider>
      </QueryClientProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
