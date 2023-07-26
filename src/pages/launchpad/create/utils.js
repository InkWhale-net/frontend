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
