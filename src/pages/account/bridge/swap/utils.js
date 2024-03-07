import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import { toastMessages } from "constants";
import toast from "react-hot-toast";
import { txResponseErrorHandler } from "utils/contracts";
import { getAzeroBalanceOfAddress } from "utils/contracts";
import { getGasLimit } from "utils/contracts/dryRun";

export async function execContractTx(
  caller, // -> currentAccount Object
  api,
  contractAbi,
  contractAddress,
  value = 0,
  queryName,
  gasMul,
  ...args
) {
  // console.log("execContractTx queryName", queryName);
  // console.log("execContractTx args", args);

  const azeroBalance = await getAzeroBalanceOfAddress({
    api,
    address: caller?.address,
  });

  if (azeroBalance < 0.005) {
    toast.error("You don’t have enough azero for transaction fee!");
    return;
  }

  const contract = new ContractPromise(api, contractAbi, contractAddress);

  let unsubscribe;
  const { signer } = await web3FromSource(caller?.meta?.source);
  const gasLimitResult = await getGasLimit(
    api,
    caller?.address,
    queryName,
    contract,
    { value },
    args,
    gasMul
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;

  const txNotSign = contract.tx[queryName]({ gasLimit, value }, ...args);

  await txNotSign
    .signAndSend(
      caller.address,
      { signer },
      ({ events = [], status, dispatchError }) => {
        txResponseErrorHandler({
          status,
          dispatchError,
          txType: queryName,
          api: api,
        });
        if (Object.keys(status.toHuman())[0] === "0") {
          toast(`Processing ...`);
        }

        events.forEach(({ event: { method } }) => {
          if (method === "ExtrinsicSuccess" && status.type === "Finalized") {
            toast.success("Successful!");
          } else if (method === "ExtrinsicFailed") {
            toast.error(`${toastMessages.CUSTOM} ${method}.`);
          }
        });
      }
    )
    .then((unsub) => (unsubscribe = unsub))
    .catch((error) => {
      console.log("error", error);
      toast.error(`${toastMessages.CUSTOM} ${error}.`);
    });

  return unsubscribe;
}
