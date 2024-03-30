import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { web3FromSource } from "@polkadot/extension-dapp";
import { formatBalance } from "@polkadot/util";
import { toastMessages } from "constants";
import toast from "react-hot-toast";
import { formatNumDynDecimal, formatQueryResultToNumber } from "utils";
import fire_psp22_contract from "utils/contracts/firechain/fire_psp22_contract";
import { BN, BN_ONE } from "@polkadot/util";
import { getGasLimitFirechain } from "./dryRun";

// ========================5ire chain balance=====================================
const provider = new WsProvider("wss://wss-testnet.5ire.network");
const fireApi = await ApiPromise.create({
  provider,
  throwOnConnect: true,
});

export async function get5ireBalanceOfAddress({ address }) {
  if (!address || !fireApi) return console.log("acct , fireApi invalid!");

  if (!fireApi) {
    toast.error(toastMessages.ERR_API_CONN);
    return;
  }

  if (!address) {
    toast.error(toastMessages.NO_WALLET);
    return;
  }

  let fire;
  let inw;

  try {
    const contract = new ContractPromise(
      fireApi,
      fire_psp22_contract.CONTRACT_ABI,
      "5FNhUSS5qvxDnQm61qtmufoozyhuc15ae5He791ydSi9sJcS"
    );

    const gasLimit = readOnlyGasLimitFirechain(fireApi);

    const { result, output } = await contract.query["psp22::balanceOf"](
      address,
      { gasLimit, storageDepositLimit: null, value: 0 },
      address
    );

    if (result.isOk) {
      inw = formatQueryResultToNumber(output, 18);
    }

    const {
      data: { free: balance, frozen },
    } = await fireApi.query.system.account(address);

    const [chainDecimals] = await fireApi.registry.chainDecimals;

    const formattedStrBal = formatBalance(balance, {
      withSi: false,
      forceUnit: "-",
      decimals: chainDecimals,
    });

    const formattedStrBalFrozen = formatBalance(frozen, {
      withSi: false,
      forceUnit: "-",
      decimals: chainDecimals,
    });

    const formattedNumBal =
      formattedStrBal.replaceAll(",", "") * 1 -
      formattedStrBalFrozen.replaceAll(",", "") * 1;

    fire = formatNumDynDecimal(formattedNumBal);

    return { fire, inw };
  } catch (error) {
    console.log("@_@ ", "psp22::balanceOf", " error >>", error.message);
  }
}

export function readOnlyGasLimitFirechain(api) {
  return api.registry.createType("WeightV2", {
    refTime: new BN(1_000_000_000_000),
    proofSize: new BN(5_000_000_000_000).isub(BN_ONE),
  });
}

export async function execContractQueryFireChain(
  callerAddress, // -> currentAccount?.address
  contractAbi,
  contractAddress,
  queryName,
  ...args
) {
  const contract = new ContractPromise(fireApi, contractAbi, contractAddress);

  const gasLimit = readOnlyGasLimitFirechain(fireApi);

  try {
    const { result, output } = await contract.query[queryName](
      callerAddress,
      { gasLimit, storageDepositLimit: null, value: 0 },
      ...args
    );

    if (result.isOk) {
      return output;
    }
  } catch (error) {
    console.log("@_@ ", queryName, " error >>", error.message);
  }
}
export function maxGasLimit(api) {
  return api.registry.createType("WeightV2", {
    // refTime: new BN(10_000_000_000),
    // proofSize: new BN(1_000_000),
    refTime: new BN(7854016870),
    proofSize: new BN(203294),
  });
}
export async function execContractTxFireChain(
  caller, // -> currentAccount Object
  contractAbi,
  contractAddress,
  value = 0,
  queryName,
  ...args
) {
  // console.log("contractAddress", contractAddress);
  // console.log("queryName", queryName);
  // console.log("args", args);
  let unsubscribe;
  const maxGas = maxGasLimit(fireApi);

  // console.log("maxGas", maxGas);
  // console.log("maxGas.toHuman()", maxGas.toHuman());
  const contract = new ContractPromise(fireApi, contractAbi, contractAddress);
  const { signer } = await web3FromSource(caller?.meta?.source);

  const gasLimitResult = await getGasLimitFirechain(
    fireApi,
    caller?.address,
    queryName,
    contract,
    { value },
    args
  );
  // console.log("getGasLimitFirechain gasLimitResult", gasLimitResult);
  // if (!gasLimitResult.ok) {
  //   console.log(gasLimitResult.error);
  //   return;
  // }
  // console.log("gasLimitResult", gasLimitResult?.values?.toHuman());

  const txNotSign = contract.tx[queryName](
    { gasLimit: maxGas, value },
    ...args
  );

  await txNotSign
    .signAndSend(
      caller.address,
      { signer },
      ({ events = [], status, dispatchError }) => {
        txResponseErrorHandlerFirechain({
          status,
          dispatchError,
          txType: queryName,
          api: fireApi,
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

export const txResponseErrorHandlerFirechain = async ({
  status,
  dispatchError,
  txType,
  api,
}) => {
  const url = `https://explorer.5ire.network/block/`;
  const statusToHuman = Object.entries(status.toHuman());

  if (dispatchError) {
    if (dispatchError.isModule) {
      toast.error(`There is some error with your request... ..`);

      if (statusToHuman[0][0] === "Finalized") {
        const apiAt = await api?.at(statusToHuman[0][1]);
        const allEventsRecords = await apiAt?.query.system.events();

        const data = {
          ContractCall: txType,
          Reserved: 0,
          ReserveRepatriated: 0,
          FeePaid: 0,
          TotalCharge: 0,
          TxHash: "",
        };

        allEventsRecords.forEach(({ event }, index) => {
          if (api.events.transactionPayment?.TransactionFeePaid.is(event)) {
            data.FeePaid = -event.data[1]?.toString() / 10 ** 18;
          }

          if (api.events.balances?.Reserved.is(event)) {
            data.Reserved = -event.data[1]?.toString() / 10 ** 18;
          }

          if (api.events.balances?.ReserveRepatriated.is(event)) {
            data.ReserveRepatriated = event.data[2]?.toString() / 10 ** 18;
          }
        });

        data.TxHash = statusToHuman[0][1];

        data.TotalCharge =
          data.FeePaid + data.Reserved + data.ReserveRepatriated;

        console.log("Err tx fee: ", data);

        console.log("Err Tx Finalized at ", `${url}${statusToHuman[0][1]}`);
      }
    } else {
      console.log("dispatchError.toString()", dispatchError.toString());
    }
  }

  if (!dispatchError && status) {
    if (statusToHuman[0][0] === "Finalized") {
      const apiAt = await api.at(statusToHuman[0][1]);
      const allEventsRecords = await apiAt?.query?.system.events();

      const data = {
        ContractCall: txType,
        Reserved: 0,
        ReserveRepatriated: 0,
        FeePaid: 0,
        TotalCharge: 0,
        TxHash: "",
      };

      allEventsRecords.forEach(({ event }, index) => {
        if (api.events.transactionPayment?.TransactionFeePaid.is(event)) {
          data.FeePaid = -event.data[1]?.toString() / 10 ** 18;
        }

        if (api.events.balances?.Reserved.is(event)) {
          data.Reserved = -event.data[1]?.toString() / 10 ** 18;
        }

        if (api.events.balances?.ReserveRepatriated.is(event)) {
          data.ReserveRepatriated = event.data[2]?.toString() / 10 ** 18;
        }
      });

      data.TxHash = statusToHuman[0][1];

      data.TotalCharge = data.FeePaid + data.Reserved + data.ReserveRepatriated;

      console.log("Success tx fee: ", data);

      console.log("Tx Finalized at ", `${url}${statusToHuman[0][1]}`);
    }
  }
};
