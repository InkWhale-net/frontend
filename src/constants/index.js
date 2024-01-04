import AzeroSignerLogo from "assets/img/wallet/AzeroSigner.jpg";
import NightlyLogo from "assets/img/wallet/Nightly.jpg";
import PolkadotjsLogo from "assets/img/wallet/PolkadotjsLogo.svg";
import SubWalletLogo from "assets/img/wallet/SubWalletLogo.svg";
import NovaLogo from "assets/img/wallet/nova.jpg";
import Icon5Ire from "assets/img/chains/5irechain.png";
import IconAlephzero from "assets/img/chains/alephzero.png";

export const toastMessages = {
  NO_EXTENSION: "Your browser does NOT HAVE the required plugin.",
  NO_WALLET: "You haven't connected your wallet.",

  ERR_FETCHING_DATA: "Error during fetching data.",
  ERR_API_CONN: "Error occurred with API connection.",
  ERR_CONTRACT_DATA: "Error occurred when setting up a contract.",

  INVALID_ADDRESS: "Invalid contract address. Please try again.",
  NO_TOKEN_SELECTED: "You have not selected token yet!",
  CUSTOM: "An error occurred: ",
};

export const supportWallets = [
  {
    name: "SubWallet",
    title: "subwallet",
    extensionName: "subwallet-js",
    icon: SubWalletLogo,
    downloadUrl: `https://www.subwallet.app/download.html`,
  },
  {
    name: "Polkadot JS",
    title: "polkadot",
    extensionName: "polkadot-js",
    icon: PolkadotjsLogo,
    downloadUrl: `https://polkadot.js.org/`,
  },
  {
    name: "Azero Signer",
    title: "Azero Signer",
    extensionName: "aleph-zero-signer",
    icon: AzeroSignerLogo,
    downloadUrl: `https://alephzero.org/signer`,
  },
  {
    name: "Nova Wallet",
    title: "nova",
    isMobile: true,
    extensionName: "polkadot-js",
    icon: NovaLogo,
    downloadUrl: `https://novawallet.io/`,
  },
  {
    name: "Nightly Wallet",
    title: "Nightly",
    extensionName: "Nightly",
    icon: NightlyLogo,
    downloadUrl: `https://wallet.nightly.app/download`,
  },
];

export const SCROLLBAR = {
  "&::-webkit-scrollbar": {
    width: "4px",
    height: "4px",
    borderRadius: "0px",
    backgroundColor: `transparent`,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: `#7ae7ff`,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: `#7ae7ff`,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: `transparent`,
  },
};

export const MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935;

export const ADDRESSES_INW = {
  INW_TREASURY: "5FKbmp1Fe6tBzUU8wvfgkiuvRTRb15rt6R4K7vkLaWG7AGFh",
  INT_GROWTH: "5DJdkQWR22B9cqEijAx3ELaJHwwcxAEkVeDUpiVkB3LATAbz",
  INW_REWARD_POOL: "5CZcZB1CqWLc1PKNScrd8RX38Y1Pe4Mv9BuzqVhrHcxzHDZe",
  INW_TEAM: "5DtKc7qBE3fmGLHWGbqtYdvhBxkWpTfPfvGABsoqTVyesLsQ",
};

// export const IPFS_BASE_URL = 'https://artzeronft.infura-ipfs.io/ipfs';

// export const SUPPORTED_WALLET_LIST = [
//   {
//     extensionName: 'subwallet-js',
//     title: 'SubWallet',
//     logo: 'SubWalletLogo.svg',
//     noExtensionMessage:
//       'You can use any Polkadot compatible wallet but we recommend using Subwallet',
//     installUrlChrome:
//       'https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn',
//     installUrlEdge:
//       'https://chrome.google.com/webstore/detail/subwallet-polkadot-extens/onhogfjeacnfoofkfgppdlbmlmnplgbn',
//     installUrlFirefox: 'https://addons.mozilla.org/vi/firefox/addon/subwallet/',
//   },
//   {
//     extensionName: 'polkadot-js',
//     title: 'Polkadot{.js}',
//     logo: 'PolkadotjsLogo.svg',
//     noExtensionMessage:
//       'You can use any Polkadot compatible wallet but we recommend using Polkadot{.js}',
//     installUrlChrome:
//       'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related',
//     installUrlEdge:
//       'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd/related',
//     installUrlFirefox:
//       'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
//   },
// ];

export const supportedChain = [
  {
    name: "Alephzero",
    key: "alephzero",
    icon: IconAlephzero,
    decimal: 12,
    providerURL: "wss://ws.test.azero.dev",
    unit: "AZERO",
    url: "https://a0.inkwhale.net"
  },
  {
    name: "Alephzero Testnet",
    key: "alephzero-testnet",
    icon: IconAlephzero,
    decimal: 12,
    providerURL: "wss://ws.test.azero.dev",
    allowSwap: true,
    allowBuy: true,
    haveINW2: true,
    unit: "AZERO",
    url: "https://testnet.inkwhale.net/"
  },
  {
    name: "5ireChain Testnet",
    key: "firechain-testnet",
    icon: Icon5Ire,
    decimal: 18,
    providerURL: "wss://wss-testnet.5ire.network",
    unit: "5IRE",
  },
];
