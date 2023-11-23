import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { toast } from "react-hot-toast";

export const verifyTokenValid = async (launchpadData, currentAccount) => {
  const owner = launchpadData?.token?.owner;
  if (owner === currentAccount?.address) return true;
  else {
    toast.error("You must be the token owner");
  }
};

export const validatePhase = (launchpadData) => {
  if (!launchpadData?.phase || !launchpadData?.totalSupply) return;

  const phaseCapAmountList = launchpadData?.phase?.map((p) => p.capAmount);

  if (phaseCapAmountList?.some((i) => i - launchpadData?.totalSupply > 0)) {
    // toast.error(`Phase Cap Amount can not greater than Total Supply`);
    return false;
  }

  const phaseData = launchpadData?.phase;
  if (!(parseFloat(launchpadData?.totalSupply || 0) > 0)) {
    //  toast.error(`Total Supply must greater than Zero`);

    return false;
  }

  if (
    phaseData?.filter((e) => e?.name?.length > 0)?.length != phaseData?.length
  ) {
    // toast.error(`Phase name is not valid!`);
    return false;
  }

  if (phaseData?.filter((e) => e?.startDate > 0)?.length != phaseData?.length) {
    // toast.error(`Total Phase is not valid!`);
    return false;
  }

  if (phaseData?.filter((e) => e?.endDate > 0)?.length != phaseData?.length) {
    // toast.error(`Total Phase is not valid!`);
    return false;
  }

  if (
    phaseData?.filter(
      (e) =>
        parseFloat(e?.immediateReleaseRate) > 0 &&
        parseFloat(e?.immediateReleaseRate) <= 100
    )?.length != phaseData?.length
  ) {
    // toast.error(
    //   `Immediate ReleaseRate must greater than Zero and less than 100`
    // );
    return false;
  }

  if (
    phaseData?.filter((e) => {
      if (parseFloat(e?.immediateReleaseRate) == 100) return true;
      else {
        return parseFloat(e?.vestingLength) > 0;
      }
    })?.length != phaseData?.length
  ) {
    // toast.error(`Vesting Length must greater than Zero`);
    return false;
  }

  if (
    phaseData?.filter((e) => {
      if (parseFloat(e?.immediateReleaseRate) == 100) return true;
      else {
        return parseFloat(e?.vestingUnit) > 0;
      }
    })?.length != phaseData?.length
  ) {
    // toast.error(`Vesting Unit must greater than Zero`);

    return false;
  }
  return true;
};

export const processStringToArray = (input) => {
  try {
    const lines = input?.trim().split("\n");
    const result = [];

    lines.forEach((line) => {
      const [address, amount, price] = line?.trim().split(",");
      result.push({ address, amount: Number(amount), price: Number(price) });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const regexTestNum = /^-?\d+(\.\d+(e\d+)?)?$/;

export const isValidAddress = (address) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyWhitelist = (wlString) => {
  const whitelistphase = processStringToArray(wlString);
  if (
    whitelistphase?.filter((e) => isValidAddress(e?.address))?.length !=
    whitelistphase?.length
  )
    return false;
  if (
    whitelistphase?.filter((e) => e?.amount > 0)?.length !=
    whitelistphase?.length
  )
    return false;
  if (
    whitelistphase?.filter((e) => e?.price > 0 && regexTestNum.test(e?.price))
      ?.length != whitelistphase?.length
  )
    return false;
  return true;
};

const checkDuplicatedWL = (wlString) => {
  const whitelistphase = processStringToArray(wlString);
  const addressSet = new Set();

  for (const obj of whitelistphase) {
    if (addressSet.has(obj.address)) {
      return true;
    }
    addressSet.add(obj.address);
  }

  return false;
};
export const validateTotalSupply = (phaseData, totalSupply, tokenBalance) => {
  try {
    if (totalSupply > tokenBalance) {
      toast.error("Total for sale is not higher you balance");
      return false;
    }
    if (!(totalSupply > 0)) {
      toast.error("Total for sale must higher than 0");
      return false;
    }
    if (
      phaseData?.filter((e) => {
        if (e?.allowPublicSale === false) return true;
        else {
          return (
            e?.phasePublicAmount > 0 && regexTestNum.test(e?.phasePublicPrice)
          );
        }
      })?.length != phaseData?.length
    ) {
      toast.error("Invalid Public Amount or Public Price");
      return false;
    }
    if (
      phaseData.filter((e) => {
        return e?.whiteList?.length > 0 ? verifyWhitelist(e?.whiteList) : true;
      })?.length !== phaseData?.length
    ) {
      toast.error("Invalid whitelist format");
      return false;
    }
    if (
      phaseData.filter((e) => {
        return e?.whiteList?.length > 0
          ? !checkDuplicatedWL(e?.whiteList)
          : true;
      })?.length !== phaseData?.length
    ) {
      toast.error("Duplicated Whitelist Address");
      return false;
    }
    const totalValue = phaseData.reduce((accumulator, currentValue) => {
      const totalPublicAmount =
        currentValue?.allowPublicSale == true
          ? parseFloat(currentValue?.phasePublicAmount || 0)
          : 0;
      const whitelistparse = currentValue?.whiteList
        ? processStringToArray(currentValue?.whiteList)
        : [];
      const totalWhiteListAmount = whitelistparse.reduce(
        (accumulatorWL, currentValueWL) => {
          return accumulatorWL + (currentValueWL?.amount || 0);
        },
        0
      );
      return accumulator + totalPublicAmount + totalWhiteListAmount;
    }, 0);
    if (parseFloat(totalSupply) < totalValue) {
      toast.error(
        "Launchpad total supply must not lower than total whitelist amount and public sale"
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

const checkTimeRangeOverlap = (arr) => {
  const isOverlap = (range1, range2) => {
    return (
      range1.startDate < range2.endDate && range2.startDate < range1.endDate
    );
  };

  for (let i = 0; i < arr.length; i++) {
    const obj1 = arr[i];
    const start1 = obj1.startDate.getTime();
    const end1 = obj1.endDate.getTime();

    for (let j = i + 1; j < arr.length; j++) {
      const obj2 = arr[j];
      const start2 = obj2.startDate.getTime();
      const end2 = obj2.endDate.getTime();
      if (
        isOverlap(
          { startDate: start1, endDate: end1 },
          { startDate: start2, endDate: end2 }
        )
      ) {
        toast.error("Phase Time Range is Overlap");
        return true;
      }
    }
  }

  return false;
};

export const validatePhaseData = (phaseData, errorMsg) => {
  const allPhases = [
    ...phaseData.map((e) => ({ startDate: e.startDate, endDate: e.endDate })),
  ];
  allPhases.sort((a, b) => a.startDate - b.startDate);
  if (checkTimeRangeOverlap(allPhases)) {
    toast.error(
      errorMsg?.overlapseErrorMsgL || "Phase time range can not overlapse"
    );
    return false;
  }
  return true;
};
