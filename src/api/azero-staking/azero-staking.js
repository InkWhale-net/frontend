import { BN, formatBalance } from "@polkadot/util";
import { formatChainStringToNumber } from "utils";
import { formatNumToBN } from "utils";
import { formatQueryResultToNumber } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import my_azero_staking from "utils/contracts/my_azero_staking";
import my_interest_distribution from "utils/contracts/my_interest_distribution";
import psp22_contract from "utils/contracts/psp22_contract";
// import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

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
  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
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

export async function getAzeroBalanceOfStakingContract(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getAzeroBalance"
  );

  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
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

  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
}

export async function getWithdrawableAzeroToStakeToValidator(
  expirationDuration,
  api,
  currentAccount
) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWithdrawableAzeroToStakeToValidator",
    expirationDuration
  );

  const rs = queryResult?.toHuman()?.Ok.Ok;

  return formatChainStringToNumber(rs) / Math.pow(10, 12);
}

export async function getAzeroStakeBalance(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getAzeroStakeAccount"
  );

  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
}

export async function getAzeroInterestBalance(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getAzeroInterestAccount"
  );

  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
}

export async function getInwInterestBalance(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getInwInterestAccount"
  );

  const rs = queryResult?.toHuman()?.Ok;
  return formatChainStringToNumber(rs) / Math.pow(10, 12);
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

  const rs =
    formatChainStringToNumber(queryResult?.toHuman()?.Ok) / Math.pow(10, 12);

  // 5 ~ 5% // 500 ~500%
  return rs / Math.pow(10, 2);
}

export async function getInwMultiplier(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getInwMultiplier"
  );
  const rs =
    formatChainStringToNumber(queryResult?.toHuman()?.Ok) / Math.pow(10, 12);

  // 10 ~ 10 INW/day
  // 0.1 ~ 0.1 INW/day
  return rs / Math.pow(10, 4);
}

export async function getStakeList(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getStakerList"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getStakeInfo(api, currentAccount, address) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getStakeInfo",
    address ?? currentAccount?.address
  );

  return queryResult?.toHuman()?.Ok.Ok;
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

  return queryResult?.toHuman()?.Ok;
}

export async function getWithdrawalRequestList(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWithdrawalRequestList"
  );

  return queryResult?.toHuman()?.Ok;
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
    "azeroStakingTrait::withdrawalRequest",
    formatNumToBN(amount)
  );
}

export async function doClaimPrincipal(api, currentAccount, index) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::claim",
    { u128: index }
  );
}

export async function doCancelRequest(api, currentAccount, index) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::cancel",
    { u128: index }
  );
}

export async function doClaimRewards(api, currentAccount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::claimRewards"
  );
}

export async function doWithdrawAzeroToStake(
  api,
  currentAccount,
  expirationDuration,
  receiver,
  amount
) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::withdrawAzeroToStake",
    expirationDuration,
    receiver,
    formatNumToBN(amount)
  );
}

export async function doWithdrawAzeroEmergency(
  api,
  currentAccount,
  receiver,
  amount
) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::withdrawAzeroEmergency",
    receiver,
    formatNumToBN(amount)
  );
}

export async function doTopupAzeroStakeAccount(api, currentAccount, amount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    formatNumToBN(amount),
    "azeroStakingTrait::topupAzeroStakeAccount",
    formatNumToBN(amount)
  );
}

export async function doUpdateLockedStatus(api, currentAccount, status) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::setIsLocked",
    status
  );
}

// Get staking info Dashboard

export async function getMaxWaitingTime(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getMaxWaitingTime"
  );

  return formatChainStringToNumber(queryResult?.toHuman()?.Ok);
}

export async function getRewardsClaimWaitingTime(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getRewardsClaimWaitingDuration"
  );

  return formatChainStringToNumber(queryResult?.toHuman()?.Ok);
}

export async function getLastAzeroInterestTopup(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getLastAzeroInterestTopup"
  );

  return formatChainStringToNumber(queryResult?.toHuman()?.Ok);
}

export async function getSortedWaitingListWithinExpirationDuration(
  expirationDuration,
  api,
  currentAccount
) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWaitingListWithinExpirationDuration",
    expirationDuration
  );

  return queryResult?.toHuman()?.Ok?.Ok;
}

export async function getPayableAzero(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getPayableAzero"
  );

  const ret = queryResult?.toHuman()?.Ok?.Ok?.replaceAll(",", "");

  const formattedStrBal = formatBalance(ret, {
    withSi: false,
    forceUnit: "-",
    decimals: 12,
  });

  return formattedStrBal;
}

export async function getWithdrawableInw(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getWithdrawableInw"
  );

  const ret = queryResult?.toHuman()?.Ok?.Ok?.replaceAll(",", "");

  const formattedStrBal = formatBalance(ret, {
    withSi: false,
    forceUnit: "-",
    decimals: 12,
  });

  return formattedStrBal;
}

export async function getIsLocked(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getIsLocked"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getInterestDistributionContract(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::getInterestDistributionContract"
  );

  return queryResult?.toHuman()?.Ok;
}

// Execute tx

export async function doUpdateAzeroApy(api, currentAccount, amount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::setApy",
    new BN(amount * 10 ** 0)
  );
}

export async function doUpdateInwMultiplier(api, currentAccount, amount) {
  return await execContractTx(
    currentAccount,
    api,
    my_azero_staking.CONTRACT_ABI,
    my_azero_staking.CONTRACT_ADDRESS,
    0,
    "azeroStakingTrait::setInwMultiplier",
    new BN(amount * 10 ** 0)
  );
}
// ++++++++++++++++++++

// export async function getInw2BalanceOfAddress({
//   address,
//   api,
//   currentAccount,
// }) {
//   const inw2Balance = await execContractQuery(
//     currentAccount?.address,
//     api,
//     // psp22_contract_v2.CONTRACT_ABI,
//     // psp22_contract_v2.CONTRACT_ADDRESS,
//     0,
//     "psp22::balanceOf",
//     address
//   );

//   return formatQueryResultToNumber(inw2Balance);
// }

export async function getInwBalanceOfAddress({ address, api, currentAccount }) {
  const inwBalance = await execContractQuery(
    currentAccount?.address,
    api,
    psp22_contract.CONTRACT_ABI,
    psp22_contract.CONTRACT_ADDRESS,
    0,
    "psp22::balanceOf",
    address
  );

  return formatChainStringToNumber(inwBalance.toHuman().Ok) / Math.pow(10, 12);
}

// ADMIN AZERO STAKING - MY INTEREST DISTRIBUTION
export async function getAzeroStakingContract(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getAzeroStakingContract"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getInwContract(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getInwContract"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getMasterAccount(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getMasterAccount"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getTotalRate(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getTotalRate"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getInterestAccountRate(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getInterestAccountRate"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getAzeroBalanceOfInterestContract(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getAzeroBalance"
  );

  return queryResult?.toHuman()?.Ok;
}

export async function getAzeroMinimumBalance(api, currentAccount) {
  const queryResult = await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::getAzeroMinimumBalance"
  );

  return queryResult?.toHuman()?.Ok;
}

// Execute tx MY INTEREST DISTRIBUTION

export async function doDistributeAzero(api, currentAccount) {
  return await execContractQuery(
    currentAccount?.address,
    api,
    my_interest_distribution.CONTRACT_ABI,
    my_interest_distribution.CONTRACT_ADDRESS,
    0,
    "interestDistributionTrait::distributeAzero"
  );
}
