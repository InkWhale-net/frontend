import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { formatBalance } from "@polkadot/util";
import axios from "axios";
import BN from "bn.js";
import numeral from "numeral";
import Keyring from "@polkadot/keyring";
import { toast } from "react-hot-toast";
import { SupportedChainId, resolveAddressToDomain } from "@azns/resolver-core";
import { formatUnits } from "ethers";
import moment from "moment";

// "12,345" (string) or 12,345 (string) -> 12345 (number)
export const formatChainStringToNumber = (str) => {
  if (typeof str !== "string") return str;

  return parseFloat(str.replace(/,/g, "").replace(/"/g, ""));
};
export const formatQueryResultToNumber = (result, chainDecimals = 12) => {
  const ret = result?.toHuman()?.Ok?.replaceAll(",", "");

  const formattedStrBal = formatBalance(ret, {
    withSi: false,
    forceUnit: "-",
    decimals: chainDecimals,
  });

  return formattedStrBal;
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

export const formatNumToBN = (number = 0, decimal = 12) => {
  let numberMul = 6;
  if (number > 10 ** 6) {
    numberMul = 0;
  }
  return new BN(+number * 10 ** numberMul)
    .mul(new BN(10 ** (decimal - numberMul)))
    .toString();
};

export const formatNumDynDecimal = (num = 0, dec = 4) => {
  const number = parseInt(num * 10 ** dec) / 10 ** dec;
  const numStr = number.toString();
  const dotIdx = numStr.indexOf(".");

  if (dotIdx === -1) {
    return numeral(numStr).format("0,0");
  }

  const intPart = numeral(numStr.slice(0, dotIdx)).format("0,0");
  const decPart = numStr.slice(dotIdx + 1, numStr.length);

  return intPart + `${dotIdx === -1 ? "" : `.${decPart}`}`;
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
  startTime,
  duration,
}) => {
  const getTime =
    startTime + duration * 1000 > Date.now()
      ? new Date().getTime()
      : startTime + duration * 1000;
  const accumSecondTillNow = (getTime - lastRewardUpdate) / 1000;
  // WHY? / 1000000
  const multiplierPerSecond = multiplier / 24 / 60 / 60 / 1000000;

  const accumRewardTillNow =
    accumSecondTillNow * multiplierPerSecond * stakedValue;

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
  const INWIndex = tokensList.findIndex((element) => element?.contractAddress === process.env.REACT_APP_INW_TOKEN_ADDRESS);
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
      element?.nftContractAddress !== process.env.REACT_APP_EXCLUDE_TOKEN_ADDRESS
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

  const refTime = gasRequired.refTime.toHuman().replaceAll(",", "");
  const proofSize = gasRequired.proofSize.toHuman().replaceAll(",", "");

  const gasRequiredAdjust = api.registry.createType("WeightV2", {
    refTime: new BN(refTime * 10 ** 0).mul(new BN(2)),
    proofSize: new BN(proofSize * 10 ** 0).mul(new BN(2)),
  });

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

export const resolveDomain = async (address) => {
  try {
    if (process.env.REACT_APP_NETWORK === "inkwhale-testnet") {
      const domains = await resolveAddressToDomain(address, {
        chainId: SupportedChainId.AlephZeroTestnet,
      });
      return domains[0];
    }
  } catch (error) {
    console.log("resolveDomain error", error);
  }
};

export const formatTokenAmount = (value, decimal = 12) => {
  try {
    return formatUnits(
      (typeof value == "string" ? value : value.toLocaleString())
        ?.toString()
        ?.replace(/\./g, "")
        ?.replace(/,/g, ""),
      decimal
    );
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