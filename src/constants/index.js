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
  },
  {
    name: "Polkadot JS",
    title: "polkadot",
    extensionName: "polkadot-js",
  },
];

// {
//   "name": "subwallet-js",
//   "version": "0.7.7-0",
//   "accounts": {},
//   "metadata": {},
//   "provider": {
//       "isClonable": true
//   },
//   "signer": {}
// }

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
