import FaucetPage from "pages/faucet";
import PoolsPage from "pages/pools";
import FarmsPage from "pages/farms";
import TokensPage from "pages/tokens";
import TokensTransactionPage from "pages/tokens/transactions";
import CreateTokenPage from "pages/create/token";
import CreateStakePoolPage from "pages/create/stake-pool";
import MyBalancePage from "pages/account/my-balance";
import CreateNFTLPPage from "pages/create/nft-lp-pool";
import CreateTokenLPPage from "pages/create/token-lp-pool";
import TokensSwapHistoryPage from "pages/tokens/swap/history";
import TokensSwapPage from "pages/tokens/swap";

const routes = [
  {
    layout: "/default",
    path: "/faucet",
    component: FaucetPage,
  },
  {
    layout: "/default",
    path: "/pools",
    component: PoolsPage,
  },
  {
    layout: "/default",
    path: "/farms",
    component: FarmsPage,
  },
  {
    layout: "/default",
    path: "/tokens/interaction",
    component: TokensPage,
  },
  {
    layout: "/default",
    path: "/tokens/transaction",
    component: TokensTransactionPage,
  },
  {
    layout: "/default",
    path: "/tokens/swap/history",
    component: TokensSwapHistoryPage,
  },
  {
    layout: "/default",
    path: "/tokens/swap",
    component: TokensSwapPage,
  },
  {
    layout: "/default",
    path: "/create/token",
    component: CreateTokenPage,
  },
  {
    layout: "/default",
    path: "/create/stake-pool",
    component: CreateStakePoolPage,
  },
  {
    layout: "/default",
    path: "/create/nft-lp",
    component: CreateNFTLPPage,
  },
  {
    layout: "/default",
    path: "/create/tokens-lp",
    component: CreateTokenLPPage,
  },
  {
    layout: "/default",
    path: "/create",
    component: CreateTokenPage,
  },
  {
    layout: "/default",
    path: "/account/my-balance",
    component: MyBalancePage,
  },
  {
    layout: "/default",
    path: "/account/my-pools",
    component: MyBalancePage,
  },
];

export default routes;
