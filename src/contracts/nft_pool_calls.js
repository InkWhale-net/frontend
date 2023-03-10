import BN from "bn.js";
import toast from "react-hot-toast";
import { web3FromSource } from "../wallets/extension-dapp";

import {
  isValidAddressPolkadotAddress,
} from "../utils";
import { ContractPromise } from "@polkadot/api-contract";

let contract;

export const setNFTPoolContract = (api, data) => {
  contract = new ContractPromise(
    api,
    data?.CONTRACT_ABI,
    data?.CONTRACT_ADDRESS
  );
};


async function topupRewardPool(caller_account,source,amount) {
    if (!contract || !caller_account) {
      console.log("invalid",contract,caller_account);
      return null;
    }

    let unsubscribe ;

    const gasLimit = -1;
    const tokenAmount = new BN(amount * 10 ** 6).mul(new BN(10 ** 6)).toString();

    const injector = await web3FromSource(source);
    await contract.tx["genericPoolContractTrait::topupRewardPool"]({ gasLimit, value: 0 },tokenAmount)
      .signAndSend(
        caller_account,
        { signer: injector.signer },
        async ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              toast.error(`There is some error with your request`);
            } else {
              console.log("dispatchError", dispatchError.toString());
            }
          }

          if (status) {
            const statusText = Object.keys(status.toHuman())[0];
            if (statusText === "0")
              toast.success(
                `Topup Reward Pool ...`
              );
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((e) => console.log("e", e));
    return unsubscribe;
}

async function stake(caller_account,source,tokenID) {
    if (!contract || !caller_account) {
      console.log("invalid",contract,caller_account);
      return null;
    }

    let unsubscribe ;

    const gasLimit = -1;

    const injector = await web3FromSource(source);
    await contract.tx
      .stake({ gasLimit, value: 0 },tokenID)
      .signAndSend(
        caller_account,
        { signer: injector.signer },
        async ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              toast.error(`There is some error with your request`);
            } else {
              console.log("dispatchError", dispatchError.toString());
            }
          }

          if (status) {
            const statusText = Object.keys(status.toHuman())[0];
            if (statusText === "0")
              toast.success(
                `Stake ...`
              );
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((e) => console.log("e", e));
    return unsubscribe;
}

async function unstake(caller_account,source,tokenID) {
    if (!contract || !caller_account) {
      console.log("invalid",contract,caller_account);
      return null;
    }

    let unsubscribe ;

    const gasLimit = -1;

    const injector = await web3FromSource(source);
    await contract.tx
      .unstake({ gasLimit, value: 0 },tokenID)
      .signAndSend(
        caller_account,
        { signer: injector.signer },
        async ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              toast.error(`There is some error with your request`);
            } else {
              console.log("dispatchError", dispatchError.toString());
            }
          }

          if (status) {
            const statusText = Object.keys(status.toHuman())[0];
            if (statusText === "0")
              toast.success(
                `Unstake ...`
              );
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((e) => console.log("e", e));
    return unsubscribe;
}

async function claimReward(caller_account,source) {
    if (!contract || !caller_account) {
      console.log("invalid",contract,caller_account);
      return null;
    }

    let unsubscribe ;
    const gasLimit = -1;

    const injector = await web3FromSource(source);
    await contract.tx
      .claimReward({ gasLimit, value: 0 })
      .signAndSend(
        caller_account,
        { signer: injector.signer },
        async ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              toast.error(`There is some error with your request`);
            } else {
              console.log("dispatchError", dispatchError.toString());
            }
          }

          if (status) {
            const statusText = Object.keys(status.toHuman())[0];
            if (statusText === "0")
              toast.success(
                `Claim Reward Pool ...`
              );
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((e) => console.log("e", e));
    return unsubscribe;
}

async function getTotalStakedByAccount(caller_account, account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["nftStakingListTrait::getTotalStakedByAccount"](
      caller_account,
      { value: azero_value, gasLimit },
      account
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a/1;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function getStakedId(caller_account, account, id) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["nftStakingListTrait::getStakedId"](
      caller_account,
      { value: azero_value, gasLimit },
      account,
      id
    );
    if (result.isOk) {
      return output.toHuman();
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}


async function unstakeFee(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::unstakeFee"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a / 10 ** 12;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function withdrawRewardPool(caller_account,source,amount) {
    if (!contract || !caller_account) {
      console.log("invalid",contract,caller_account);
      return null;
    }

    let unsubscribe ;

    const gasLimit = -1;
    const tokenAmount = new BN(amount * 10 ** 6).mul(new BN(10 ** 6)).toString();

    const injector = await web3FromSource(source);
    await contract.tx["genericPoolContractTrait::withdrawRewardPool"]({ gasLimit, value: 0 },tokenAmount)
      .signAndSend(
        caller_account,
        { signer: injector.signer },
        async ({ status, dispatchError }) => {
          if (dispatchError) {
            if (dispatchError.isModule) {
              toast.error(`There is some error with your request`);
            } else {
              console.log("dispatchError", dispatchError.toString());
            }
          }

          if (status) {
            const statusText = Object.keys(status.toHuman())[0];
            if (statusText === "0")
              toast.success(
                `Removing Reward Pool ...`
              );
          }
        }
      )
      .then((unsub) => (unsubscribe = unsub))
      .catch((e) => console.log("e", e));
    return unsubscribe;
}

async function duration(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::duration"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a/1000;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function startTime(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::startTime"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function multiplier(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::multiplier"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function rewardPool(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::rewardPool"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a / 10 ** 12;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function totalStaked(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::totalStaked"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      const a = output.toHuman().replace(/\,/g, "");
      return a / 1;
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

async function getStakeInfo(caller_account, staker) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::getStakeInfo"](
      caller_account,
      { value: azero_value, gasLimit },
      staker
    );
    if (result.isOk) {
      // console.log(output.toHuman());
      //const a = output.toHuman().replace(/\,/g, "");
      return output.toHuman();
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}


async function psp22ContractAddress(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query["genericPoolContractTrait::psp22ContractAddress"](
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      return output.toHuman();
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}
async function psp34ContractAddress(caller_account) {
  if (!contract) {
    console.log("invalid",contract);
    return null;
  }
  if (!caller_account) {
    caller_account = "5CGUvruJMqB1VMkq14FC8QgR9t4qzjBGbY82tKVp2D6g9LQc";
  }

  const gasLimit = -1;
  const azero_value = 0;
  try {
    const { result, output } = await contract.query.psp34ContractAddress(
      caller_account,
      { value: azero_value, gasLimit }
    );
    if (result.isOk) {
      return output.toHuman();
    }
  } catch (e) {
    console.log(e);
    return null;
  }

  return null;
}

const contract_calls = {
  multiplier,
  unstakeFee,
  getTotalStakedByAccount,
  getStakedId,
  rewardPool,
  totalStaked,
  psp34ContractAddress,
  psp22ContractAddress,
  setNFTPoolContract,
  topupRewardPool,
  withdrawRewardPool,
  startTime,
  duration,
  stake,
  unstake,
  claimReward,
  getStakeInfo
};

export default contract_calls;
