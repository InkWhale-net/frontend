import { formatNumToBN } from "utils";
import { formatQueryResultToNumber } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import my_azero_staking from "utils/contracts/my_azero_staking";

export async function getMinStakingAmount(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getMinStakingAmount"
  );

  return formatQueryResultToNumber(queryResult);
}

export async function getMaxTotalStakingAmount(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getMaxTotalStakingAmount"
  );

  return formatQueryResultToNumber(queryResult);
}

export async function getTotalStakers(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getTotalStakers"
  );

  return formatQueryResultToNumber(queryResult, 0);
}

export async function getTotalAzeroStaked(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getTotalAzeroStaked"
  );

  return formatQueryResultToNumber(queryResult);
}

export async function getApy(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getApy"
  );

  return formatQueryResultToNumber(queryResult, 4);
}

export async function getStakeInfo(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getStakeInfo",
    currentAccount?.address
  );

  return queryResult.toHuman().Ok.Ok;
}

export async function getWithdrawalRequestCount(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWithdrawalRequestCount"
  );

  return formatQueryResultToNumber(queryResult, 0);
}

export async function getWithdrawalRequestListByUser(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWithdrawalRequestListByUser",
    currentAccount?.address
  );

  return queryResult.toHuman().Ok;
}

// Execute tx

export async function doStakeAzero(api, currentAccount, amount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    formatNumToBN(amount),
    "azeroStakingTrait::stake",
    formatNumToBN(amount)
  );
}

export async function doWithdrawRequest(api, currentAccount, amount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::withdrawRequest",
    formatNumToBN(amount)
  );
}
