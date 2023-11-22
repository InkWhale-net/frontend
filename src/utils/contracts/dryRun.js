import { BN } from "@polkadot/util";
import { convertWeight } from "@polkadot/api-contract/base/util";
import { formatChainStringToNumber } from "utils";

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

export const getGasLimit = async (
  api,
  userAddress,
  message,
  contract,
  options = {},
  args = [],
  gasMul = 2
  // temporarily type is Weight instead of WeightV2 until polkadot-js type `ContractExecResult` will be changed to WeightV2
) => {
  const abiMessage = toContractAbiMessage(contract, message);
  if (!abiMessage.ok) return abiMessage;

  const { value, gasLimit, storageDepositLimit } = options;

  const result = await api.call.contractsApi.call(
    userAddress,
    contract.address,
    value ?? new BN(0),
    gasLimit ?? null,
    storageDepositLimit ?? null,
    abiMessage.value.toU8a(args)
  );

  const { v2Weight } = convertWeight(result.gasRequired);
  const gasRequired = api.registry.createType("WeightV2", {
    refTime:
      gasMul == 1.05
        ? v2Weight.refTime.mul(new BN(100)).div(new BN(100))
        : v2Weight.refTime.mul(new BN(gasMul)),
    proofSize: v2Weight.proofSize,
  });

  // const rs =
  //   formatChainStringToNumber(gasRequired.toHuman()?.refTime) /
  //   Math.pow(10, 12);

  // console.log(message, "getGasLimit NORMAL ", gasMul, "x refTime", rs);

  return { ok: true, value: gasRequired };
};

export const getSwapGasLimit = async (
  api,
  userAddress,
  message,
  contract,
  options = {},
  args = []
) => {
  try {
    const abiMessage = toContractAbiMessage(contract, message);
    if (!abiMessage.ok) return abiMessage;

    const { value, gasLimit, storageDepositLimit } = options;

    const result = await api.call.contractsApi.call(
      userAddress,
      contract.address,
      value ?? new BN(0),
      gasLimit ?? null,
      storageDepositLimit ?? null,
      abiMessage.value.toU8a(args)
    );

    const { v2Weight } = convertWeight(result.gasRequired);

    const gasRequired = api.registry.createType("WeightV2", {
      refTime: v2Weight.refTime.mul(new BN(1)),
      proofSize: v2Weight.proofSize.mul(new BN(1)),
    });

    const rs =
      formatChainStringToNumber(gasRequired.toHuman()?.refTime) /
      Math.pow(10, 12);

    // console.log(message, "getSwapGasLimit ESTIMATED 1x refTime", rs);

    return rs;
  } catch (error) {
    console.log("error", error);
  }
};
