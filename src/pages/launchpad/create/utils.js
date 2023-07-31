import { toast } from "react-hot-toast";

export const verifyTokenValid = async (launchpadData, currentAccount) => {
  const owner = launchpadData?.token?.owner;
  if (owner == currentAccount?.address) return true;
  else {
    toast.error("You must be the token owner");
  }
};

export const validateProjectInfor = (launchpadData) => {
  if (!launchpadData?.projectInfor) return false;
  else {
    const infor = launchpadData?.projectInfor;
    if (!infor?.avatarImage || !infor?.featureImage || !infor?.headerImage)
      return false;
    if (
      !infor?.name ||
      !infor?.description ||
      !infor?.startTime ||
      !infor?.endTime
    )
      return false;
    if (
      !infor?.website ||
      !infor?.twitter ||
      !infor?.discord ||
      !infor?.telegram
    )
      return false;
  }
  return true;
};

export const validateRoadmap = (launchpadData) => {
  const roadmapData = launchpadData?.roadmap;
  if (
    roadmapData?.filter((e) => e?.name?.length > 0)?.length !=
    roadmapData?.length
  )
    return false;
  if (
    roadmapData?.filter((e) => e?.description?.length > 0)?.length !=
    roadmapData?.length
  )
    return false;
  return true;
};

export const validatePhase = (launchpadData) => {
  const phaseData = launchpadData?.phase;
  if (!(parseFloat(launchpadData?.totalSupply || 0) > 0)) return false;
  if (
    phaseData?.filter((e) => e?.name?.length > 0)?.length != phaseData?.length
  )
    return false;
  if (phaseData?.filter((e) => e?.startDate > 0)?.length != phaseData?.length)
    return false;
  if (phaseData?.filter((e) => e?.endDate > 0)?.length != phaseData?.length)
    return false;
  if (
    phaseData?.filter((e) => e?.immediateReleaseRate?.length > 0)?.length !=
    phaseData?.length
  )
    return false;
  if (
    phaseData?.filter((e) => e?.vestingLength?.length > 0)?.length !=
    phaseData?.length
  )
    return false;
  if (
    phaseData?.filter((e) => e?.vestingUnit?.length > 0)?.length !=
    phaseData?.length
  )
    return false;
  return true;
};

export const validateTeam = (launchpadData) => {
  const teamData = launchpadData?.team;
  if (
    teamData?.filter((e) => e?.iconIPFSUrl?.length > 0)?.length !=
    teamData?.length
  )
    return false;
  if (teamData?.filter((e) => e?.name?.length > 0)?.length != teamData?.length)
    return false;
  if (teamData?.filter((e) => e?.title?.length > 0)?.length != teamData?.length)
    return false;
  if (
    teamData?.filter((e) => e?.socialLink?.length > 0)?.length !=
    teamData?.length
  )
    return false;
  return true;
};

export const isWebsite = (text) => {
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return urlRegex.test(text);
};

export const verifyProjectInfo = (launchpadData) => {
  const infor = launchpadData?.projectInfor;
  if (!isWebsite(infor?.website)) {
    toast.error("Website url is invalid");
    return false;
  }
  if (!isWebsite(infor?.twitter)) {
    toast.error("twitter url is invalid");
    return false;
  }
  if (!isWebsite(infor?.discord)) {
    toast.error("discord url is invalid");
    return false;
  }
  if (!isWebsite(infor?.telegram)) {
    toast.error("telegram url is invalid");
    return false;
  }
  return true;
};

export const verifyTeam = (launchpadData) => {
  const teamData = launchpadData?.team;

  if (
    teamData?.filter((e) => isWebsite(e?.socialLink))?.length !=
    teamData?.length
  ) {
    toast.error("Team social link is invalid");
    return false;
  }

  return true;
};

export const processStringToArray = (input) => {
  try {
    const lines = input.trim().split("\n");
    const result = [];

    lines.forEach((line) => {
      const [address, amount, price] = line.trim().split(", ");
      result.push({ address, amount: Number(amount), price: Number(price) });
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const regexTestNum = /^-?\d+(\.\d+(e\d+)?)?$/;

export const verifyWhitelist = (wlArray) => {
  const arrayVerify = wlArray.map((wlobj) => {
    const whitelistphase = processStringToArray(wlobj);
    if (
      whitelistphase?.filter((e) => e?.address?.length > 0)?.length !=
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
  });
  return arrayVerify?.filter((e) => e == true)?.length == arrayVerify?.length;
};
