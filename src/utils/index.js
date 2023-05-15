import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { formatBalance } from "@polkadot/util";
import axios from "axios";
import BN from "bn.js";
import numeral from "numeral";

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
  let numberMul = 6
  if(number > 10 ** 6) {
    numberMul = 0
  }
  return new BN(+number * 10 ** numberMul).mul(new BN(10 ** (decimal - 6))).toString();
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
    process.env.REACT_APP_IPFS_BASE_URL
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

export function roundUp(v, n = 4) {
  return Math.ceil(v * Math.pow(10, n)) / Math.pow(10, n);
}

export function roundDown(number, decimals = 4) {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
