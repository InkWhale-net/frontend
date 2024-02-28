import {
  SupportedChainId,
  resolveAddressToDomain,
  resolveDomainToAddress,
} from "@azns/resolver-core";
import Keyring, { decodeAddress, encodeAddress } from "@polkadot/keyring";
import {
  BN,
  BN_BILLION,
  BN_MILLION,
  formatBalance,
  hexToU8a,
  isHex,
} from "@polkadot/util";
import axios from "axios";
import { formatUnits, parseUnits } from "ethers";
import moment from "moment";
import numeral from "numeral";
import { toast } from "react-hot-toast";
import { execContractQuery } from "./contracts";
import psp22_contract from "./contracts/psp22_contract";
import psp22_contract_v2 from "./contracts/psp22_contract_V2";
import psp22_contract_old from "./contracts/psp22_contract_old";
import { appChain } from "constants";
export const chainDecimals = {
  alephzero: 12,
  "alephzero-testnet": 12,
  firechain: 18,
  "firechain-testnet": 18,
  astar: 12,
};

export const chainDenom = {
  alephzero: "AZERO",
  "alephzero-testnet": "TZERO",
  firechain: "5IRE",
  "firechain-testnet": "5IRE",
  astar: 12,
};

// "12,345" (string) or 12,345 (string) -> 12345 (number)
export const formatChainStringToNumber = (str) => {
  if (typeof str !== "string") return str;

  return str.replace(/,/g, "").replace(/"/g, "");
};
export const formatQueryResultToNumber = (result, decimal) => {
  const localDecimal = decimal || chainDecimals[process.env.REACT_APP_CHAIN];

  const ret = result?.toHuman()?.Ok?.replaceAll(",", "");

  const formattedStrBal = formatBalance(ret, {
    withSi: false,
    forceUnit: "-",
    decimals: localDecimal,
  });

  return formattedStrBal;
};

export const formatQueryResultToNumberEthers = (result, decimal) => {
  const localDecimal = decimal || chainDecimals[process.env.REACT_APP_CHAIN];

  const ret = formatTextAmount(result?.toHuman()?.Ok);

  return formatTokenAmount(ret, localDecimal);
};

export const addressShortener = (addr = "", digits = 5) => {
  digits = 2 * digits >= addr.length ? addr.length : digits;
  return `${addr.substring(0, digits)}...${addr.slice(-digits)}`;
};

export function isAddressValid(address) {
  try {
    const formattedAddress = isHex(address)
      ? hexToU8a(address)
      : decodeAddress(address);

    encodeAddress(formattedAddress);

    return true;
  } catch (error) {
    // console.log(error);
    return false;
  }
}

export function delay(sec) {
  return new Promise((res) => setTimeout(res, sec));
}

export const formatNumToBN = (number = 0, decimal) => {
  try {
    const localDecimal = decimal || chainDecimals[process.env.REACT_APP_CHAIN];

    let numberMul = 0;

    if (number > 10 ** 6 || localDecimal >= 12) {
      numberMul = 6;
    }

    return new BN(number * 10 ** 4)
      .mul(new BN(10 ** numberMul))
      .mul(new BN(10 ** (localDecimal - numberMul)))
      .div(new BN(10 ** 4))
      .toString();
  } catch (error) {
    console.log("error message", error.message);
    toast.error("error format number");
  }
};

export const formatNumToBNEther = (number = 0, decimal) => {
  try {
    const localDecimal = decimal || chainDecimals[process.env.REACT_APP_CHAIN];

    return parseUnits(number?.toString(), +localDecimal).toString();
  } catch (error) {
    console.log("error message", error.message);
    toast.error("error format number");
  }
};

export const formatNumDynDecimal = (num = 0, dec = 4) => {
  // const number = parseInt(num * 10 ** dec) / 10 ** dec;
  // const numStr = number.toString();
  // const dotIdx = numStr.indexOf(".");

  // if (dotIdx === -1) {
  //   return numeral(numStr).format("0,0");
  // }

  // const intPart = numeral(numStr.slice(0, dotIdx)).format("0,0");
  // const decPart = numStr.slice(dotIdx + 1, numStr.length);

  // return intPart + `${dotIdx === -1 ? "" : `.${decPart}`}`;
  try {
    const raw = formatTextAmount(num?.toString());
    let parts = raw?.split(".");
    if (parts?.length > 1 && +parts?.[1] > 0) {
      parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      parts[1] = roundDown(+`0.${parts[1]}`).toString().split(".")[1];
      return parts?.join(".");
    } else return parts?.[0]?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch (error) {
    console.log(error);
    return num?.toString();
  }
};

// new func to getImage source from CloudFlare
export async function getCloudFlareImage(imageHash = "", size = 500) {
  const fallbackURL = `${
    process.env.REACT_APP_IPFS_PUBLIC_URL
  }/${imageHash.replace("ipfs://", "")}`;

  const ret = `${process.env.REACT_APP_ARTZERO_API_BASE_URL}/getImage?input=${imageHash}&size=${size}&url=${fallbackURL}`;

  let result;

  try {
    const response = await axios.get(ret);
    result = response?.data || fallbackURL;
  } catch (error) {
    console.error("getCloudFlareImage error", error.message);
    result = fallbackURL;
  }

  return result;
}

export const calcUnclaimedReward = ({
  lastRewardUpdate = 0,
  stakedValue = 0,
  unclaimedReward = 0,
  apy = 0,
  tokenDecimal = 12,
  startTime,
  duration,
}) => {
  const getTime =
    startTime + duration * 1000 > Date.now()
      ? new Date().getTime()
      : startTime + duration * 1000;
  const accumSecondTillNow = (getTime - lastRewardUpdate) / 1000;

  const apyPerSecond = apy / 10000 / 365 / 24 / 60 / 60;

  const accumRewardTillNow = accumSecondTillNow * apyPerSecond * stakedValue;

  const result =
    unclaimedReward / 10 ** tokenDecimal +
    accumRewardTillNow / 10 ** tokenDecimal;
  return result?.toFixed(tokenDecimal);
};

export const calcUnclaimedRewardNftLP = ({
  lastRewardUpdate = 0,
  stakedValue = 0,
  unclaimedReward = 0,
  multiplier = 1,
  tokenDecimal = 12,
  startTime,
  duration,
}) => {
  const getTime =
    startTime + duration * 1000 > Date.now()
      ? new Date().getTime()
      : startTime + duration * 1000;
  const accumSecondTillNow = (getTime - lastRewardUpdate) / 1000;

  const multiplierPerSecond = multiplier / 24 / 60 / 60;

  const accumRewardTillNow =
    accumSecondTillNow * multiplierPerSecond * stakedValue;

  const result =
    unclaimedReward / 10 ** tokenDecimal +
    accumRewardTillNow / 10 ** tokenDecimal;

  return result?.toFixed(tokenDecimal);
};

export const calcUnclaimedRewardTokenLP = ({
  lastRewardUpdate = 0,
  stakedValue = 0,
  unclaimedReward = 0,
  multiplier = 1,
  tokenDecimal = 12,
  lptokenDecimal = 12,
  startTime,
  duration,
}) => {
  const getTime =
    startTime + duration * 1000 > Date.now()
      ? new Date().getTime()
      : startTime + duration * 1000;
  const accumSecondTillNow = (getTime - lastRewardUpdate) / 1000;
  const multiplierPerSecond = multiplier / 24 / 60 / 60;

  const accumRewardTillNow =
    (accumSecondTillNow * multiplierPerSecond * stakedValue) /
    10 ** (lptokenDecimal - tokenDecimal);

  const result =
    unclaimedReward / 10 ** tokenDecimal +
    accumRewardTillNow / 10 ** tokenDecimal;
  return result?.toFixed(tokenDecimal);
};

export function isPoolEnded(startTime = 0, duration = 0) {
  const nowTime = Date.now();

  if (nowTime >= startTime + duration * 1000) {
    return true;
  }

  return false;
}

export function isPoolNotStart(startTime = 0, duration = 0) {
  const nowTime = Date.now();

  if (nowTime < startTime) {
    return true;
  }

  return false;
}

export function roundUp(v, n = 4) {
  return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
}

export function roundDown(number, decimals = 4) {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export const getPublicCurrentAccount = () => {
  const keyring = new Keyring();
  const PHRASE =
    "entire material egg meadow latin bargain dutch coral blood melt acoustic thought";

  keyring.addFromUri(PHRASE, { name: "Nobody" });

  const keyringOptions = keyring
    .getPairs()
    .map(({ address, meta: { name } }) => ({
      key: address,
      address,
      name,
    }));

  return keyringOptions[0];
};

export const moveINWToBegin = (tokensList) => {
  const INW2Index = tokensList.findIndex(
    (element) => element?.contractAddress === psp22_contract_v2.CONTRACT_ADDRESS
  );
  if (INW2Index > -1) {
    const element = tokensList.splice(INW2Index, 1)[0];
    tokensList.unshift(element);
  }
  const INWIndex = tokensList.findIndex(
    (element) => element?.contractAddress === psp22_contract.CONTRACT_ADDRESS
  );
  if (INWIndex > -1) {
    const element = tokensList.splice(INWIndex, 1)[0];
    tokensList.unshift(element);
  }
  return tokensList.filter(
    (e) => !!e?.contractAddress && e?.contractAddress !== "undefined"
  );
};

export const excludeNFT = (tokensList) =>
  tokensList.filter(
    (element) =>
      element?.nftContractAddress !==
      process.env.REACT_APP_EXCLUDE_TOKEN_ADDRESS
  );

const toContractAbiMessage = (contractPromise, message) => {
  const value = contractPromise.abi.messages.find((m) => m.method === message);

  if (!value) {
    const messages = contractPromise?.abi.messages
      .map((m) => m.method)
      .join(", ");

    const error = `"${message}" not found in metadata.spec.messages: [${messages}]`;
    console.error(error);

    return { ok: false, error };
  }

  return { ok: true, value };
};

export async function getGasLimitBulkAction(
  api,
  userAddress,
  message,
  contract,
  options = {},
  args = []
) {
  const abiMessage = toContractAbiMessage(contract, message);

  if (!abiMessage.ok) return abiMessage;

  const { value, gasLimit, storageDepositLimit } = options;

  const { gasRequired } = await api.call.contractsApi.call(
    userAddress,
    contract.address,
    value ?? new BN(0),
    gasLimit ?? null,
    storageDepositLimit ?? null,
    abiMessage.value.toU8a(args)
  );
  console.log("gasRequired", message, gasRequired.toHuman());

  const refTime = gasRequired.refTime.toHuman().replaceAll(",", "");
  const proofSize = gasRequired.proofSize.toHuman().replaceAll(",", "");

  const gasRequiredAdjust = api.registry.createType("WeightV2", {
    refTime: new BN(refTime * 10 ** 0).mul(new BN(1)),
    proofSize: new BN(proofSize * 10 ** 0).mul(new BN(1)),
  });
  console.log("gasRequiredAdjust", message, gasRequiredAdjust.toHuman());

  return { ok: true, value: gasRequiredAdjust };
}

export async function getEstimatedGasBatchTx(
  address,
  contract,
  value,
  queryName,
  ...args
) {
  let ret;
  // getEstimatedGasBatchTx
  try {
    const gasLimitResult = await getGasLimitBulkAction(
      contract?.api,
      address,
      queryName,
      contract,
      { value },
      args
    );

    if (!gasLimitResult.ok) {
      console.log(queryName, "getEstimatedGas err ", gasLimitResult.error);
      return;
    }

    ret = gasLimitResult?.value;
  } catch (error) {
    toast.error("Error fetch gas:", error.message);
    console.log("error fetchGas xx>>", error.message);
  }

  return ret;
}

const chainId =
  appChain?.key === "alephzero-testnet"
    ? SupportedChainId.AlephZeroTestnet
    : appChain?.key === "alephzero"
    ? SupportedChainId.AlephZero
    : null;

export const resolveDomain = async (address) => {
  if (!chainId) return address;

  try {
    const { primaryDomain, error } = await resolveAddressToDomain(address, {
      chainId,
    });
    
    if (error) throw Error(error?.message || "Resolve failed");

    return primaryDomain;
  } catch (error) {
    console.log("resolveDomain error", error);
  }
};

export const resolveAZDomainToAddress = async (domain) => {
  if (!chainId) return domain;

  if (appChain?.haveAzeroID) {
    try {
      const { address, error } = await resolveDomainToAddress(domain, {
        chainId,
      });

      if (error) throw Error(error?.message || "Resolve failed");

      return address;
    } catch (error) {
      console.log(error);
    }
  }
};

export const formatTokenAmount = (value, decimal = 12) => {
  try {
    const ret = formatChainStringToNumber(value) / Math.pow(10, decimal);

    // const ret2 = formatUnits(
    //   value?.toString()?.replace(/\./g, "")?.replace(/,/g, ""),
    //   decimal
    // );

    // console.log("ret", ret);
    // console.log("ret2", ret2);

    return ret;
  } catch (error) {
    // console.log(error);
    return;
  }
};

export const getTimestamp = async (api, blockNumber) => {
  const blockHash = await api.rpc.chain.getBlockHash(blockNumber);

  let ret = null;

  const signedBlock = await api.rpc.chain.getBlock(blockHash);

  signedBlock?.block?.extrinsics?.forEach(
    ({ method: { args, section, method: extrinsicsMethod } }) => {
      if (section === "timestamp" && extrinsicsMethod === "set") {
        ret = args[0].toString();
      }
    }
  );

  return moment(parseInt(ret)).format("DD/MM/YY, H:mm");
};

export const getIPFSData = async (uri) => {
  const ret = `${process.env.REACT_APP_IPFS_PUBLIC_URL}/${uri}`;

  try {
    const response = await axios.get(ret);
    return response?.data;
  } catch (error) {
    console.error("get ipfs data error", error.message);
  }
};

export const dayToMilisecond = (amount) => {
  try {
    return (amount * 24 * 60 * 60 * 1000).toFixed();
  } catch (error) {
    console.log(error);
  }
};

export const millisecondsInADay = 24 * 60 * 60 * 1000;

export const getTokenOwner = async (tokenContract) => {
  const queryOwnerOld = await execContractQuery(
    process.env.REACT_APP_PUBLIC_ADDRESS,
    "api",
    psp22_contract_old.CONTRACT_ABI,
    tokenContract,
    0,
    "ownable::owner"
  );
  const queryOwnerNew = await execContractQuery(
    process.env.REACT_APP_PUBLIC_ADDRESS,
    "api",
    psp22_contract.CONTRACT_ABI,
    tokenContract,
    0,
    "ownable::owner"
  );

  return {
    address: queryOwnerOld?.toHuman()?.Ok || queryOwnerNew?.toHuman()?.Ok,
    isNew: queryOwnerNew?.toHuman()?.Ok
      ? true
      : queryOwnerOld?.toHuman()?.Ok
      ? false
      : null,
  };
};

export const handleCopy = (label, text) => {
  toast.success(`${label} copied!`);
  navigator.clipboard.writeText(text);
};

export const formatTextAmount = (value) => value?.replaceAll(",", "");
export const multipleFloat = (value1, value2, decimal = 3) => {
  try {
    return (
      (new BN(+value1 * 10 ** decimal) * new BN(+value2 * BN_MILLION)) /
      new BN(BN_BILLION)
    );
  } catch (error) {
    console.log(error);
    return 0;
  }
};

// Only use for batch transaction
export const batchTxResponseErrorHandler = async ({
  status,
  dispatchError,
  dispatch,
  txType,
  type,
  api,
  caller_account,
  isApprovalTx = false,
}) => {
  const url = `https://test.azero.dev/#/explorer/query/`;
  const statusToHuman = Object.entries(status.toHuman());

  if (dispatchError) {
    if (dispatchError.isModule) {
      toast.error(`There is some error with your request... ..`);
      // return toast.error(`${section}.${name}: ${docs.join(" ")}`);

      // FOR DEV ONLY FALSE CASE
      // if (process.env.NODE_ENV === "development") {
      if (statusToHuman[0][0] === "Finalized") {
        // const decoded = api.registry.findMetaError(dispatchError.asModule);
        // const { docs, name, section } = decoded;

        // console.table({
        //   txType,
        //   Event: "dispatchError",
        //   section,
        //   name,
        //   docs: docs.join(" "),
        // });

        const apiAt = await api.at(statusToHuman[0][1]);
        const allEventsRecords = await apiAt.query.system.events();

        const data = {
          ContractCall: txType,
          Reserved: 0,
          ReserveRepatriated: 0,
          FeePaid: 0,
          TotalCharge: 0,
          TxHash: "",
        };

        // Transfer Event
        allEventsRecords.forEach(({ event }, index) => {
          // if (api.events.balances?.Transfer.is(event)) {
          //   console.table({
          //     Event: "balances.Transfer (-)",
          //     From: event.data[0].toHuman(),
          //     To: event.data[1].toHuman(),
          //     Amount: event.data[2].toHuman(),
          //   });
          // }

          if (api.events.transactionPayment?.TransactionFeePaid.is(event)) {
            data.FeePaid = -event.data[1]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "transactionPayment?.TransactionFeePaid (-)",
            //   Amount: event.data[1]?.toHuman(),
            // });
          }

          if (api.events.balances?.Reserved.is(event)) {
            data.Reserved = -event.data[1]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "balances?.Reserved (-)",
            //   Amount: event.data[1]?.toHuman(),
            // });
          }

          if (api.events.balances?.ReserveRepatriated.is(event)) {
            data.ReserveRepatriated = event.data[2]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "balances?.ReserveRepatriated (+)",
            //   Amount: event.data[2].toHuman(),
            // });
          }
        });

        // const { data: balance } = await api.query.system.account(
        //   caller_account?.address
        // );

        // console.table({
        //   "Balance END":
        //     balance.free.toHuman().slice(0, -16) +
        //     "." +
        //     balance.free.toHuman().slice(-15, -8),
        // });
        data.TxHash = statusToHuman[0][1];

        data.TotalCharge =
          data.FeePaid + data.Reserved + data.ReserveRepatriated;

        console.log("Err tx fee: ", data);

        console.log("Err Tx finalized at ", `${url}${statusToHuman[0][1]}`);
      }
      // }
    } else {
      console.log("dispatchError.toString()", dispatchError.toString());
      return toast.error(dispatchError.toString());
    }
  }

  if (!dispatchError && status) {
    if (Object.keys(status.toHuman())[0] === "0") {
    } else {
      // FOR DEV ONLY SUCCESS CASE
      // if (process.env.NODE_ENV === "development") {
      if (statusToHuman[0][0] === "Finalized") {
        const apiAt = await api.at(statusToHuman[0][1]);
        const allEventsRecords = await apiAt.query.system.events();

        const data = {
          ContractCall: txType,
          Reserved: 0,
          ReserveRepatriated: 0,
          FeePaid: 0,
          TotalCharge: 0,
          TxHash: "",
        };

        // Transfer Event
        allEventsRecords.forEach(({ event }, index) => {
          // if (api.events.balances?.Transfer.is(event)) {
          //   console.table({
          //     Event: "balances.Transfer (-)",
          //     From: event.data[0].toHuman(),
          //     To: event.data[1].toHuman(),
          //     Amount: event.data[2].toHuman(),
          //   });
          // }
          if (api.events.transactionPayment?.TransactionFeePaid.is(event)) {
            data.FeePaid = -event.data[1]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "transactionPayment?.TransactionFeePaid (-)",
            //   Amount: event.data[1]?.toHuman(),
            // });
          }

          if (api.events.balances?.Reserved.is(event)) {
            data.Reserved = -event.data[1]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "balances?.Reserved (-)",
            //   Amount: event.data[1]?.toHuman(),
            // });
          }

          if (api.events.balances?.ReserveRepatriated.is(event)) {
            data.ReserveRepatriated = event.data[2]?.toString() / 10 ** 12;

            // console.table({
            //   Event: "balances?.ReserveRepatriated (+)",
            //   Amount: event.data[2].toHuman(),
            // });
          }
        });

        // const { data: balance } = await api.query.system.account(
        //   caller_account?.address
        // );

        // console.table({
        //   "Balance END":
        //     balance.free.toHuman().slice(0, -16) +
        //     "." +
        //     balance.free.toHuman().slice(-15, -8),
        // });

        data.TxHash = statusToHuman[0][1];

        data.TotalCharge =
          data.FeePaid + data.Reserved + data.ReserveRepatriated;

        console.log("Success tx fee: ", data);

        console.log("Tx finalized at ", `${url}${statusToHuman[0][1]}`);
      }
      // }
    }
  }
};
