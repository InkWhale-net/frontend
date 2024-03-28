import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { formatBalance } from "@polkadot/util";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastMessages } from "constants";
import toast from "react-hot-toast";
import { formatNumDynDecimal, formatQueryResultToNumber } from "utils";
import {
  execContractQuery,
  getAzeroBalanceOfAddress,
  readOnlyGasLimit,
} from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_fire from "utils/contracts/psp22_contract_fire";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const localCurrentAccount = window?.localStorage?.getItem(
  "localCurrentAccount"
);

const initialState = {
  api: null,
  allAccounts: [],
  currentAccount: JSON.parse(localCurrentAccount) || null,
  adapter: null,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },

    setCurrentApi: (state, action) => {
      state.api = action.payload;
    },

    disconnectCurrentAccount: (state) => {
      state.currentAccount = null;
    },

    updateAccountsList: (state, action) => {
      state.allAccounts = action.payload;

      // if (!action.payload.includes(current(state).currentAccount)) {
      //   state.currentAccount = null;
      // }
    },
    updateAdapter: (state, action) => {
      state.adapter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserBalance.fulfilled, (state, action) => {
      state.currentAccount = {
        ...state.currentAccount,
        balance: action.payload,
      };
    });
  },
});

export const {
  setCurrentApi,
  setCurrentAccount,
  updateAccountsList,
  disconnectCurrentAccount,
  updateAdapter,
} = walletSlice.actions;

export default walletSlice.reducer;

export const fetchUserBalance = createAsyncThunk(
  "wallet/fetchUserBalance",
  async ({ currentAccount, api }, thunkAPI) => {
    // TODO: check can fix warning about storing api on redux?
    const inwBalance = await execContractQuery(
      currentAccount?.address,
      //thunkAPI.getState().wallet.api,
      api,
      psp22_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const inw = formatQueryResultToNumber(inwBalance);
    const inw2Balance = await execContractQuery(
      currentAccount?.address,
      //thunkAPI.getState().wallet.api,
      api,
      psp22_contract_v2.CONTRACT_ABI,
      psp22_contract_v2.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      currentAccount?.address
    );

    const inw2 = formatQueryResultToNumber(inw2Balance);

    const azeroBalance = await getAzeroBalanceOfAddress({
      api,
      address: currentAccount?.address,
    });

    const azero = formatNumDynDecimal(azeroBalance);

    const fireBalance = await get5ireBalanceOfAddress({
      address: currentAccount?.address,
    });

    return { inw, inw2, azero, ...fireBalance };
  }
);

// ========================5ire chain balance=====================================

const provider = new WsProvider("wss://wss-testnet.5ire.network");

const wsApi = await ApiPromise.create({
  provider,
  throwOnConnect: true,
});

export async function get5ireBalanceOfAddress({ address }) {
  if (!address || !wsApi) return console.log("acct , wsApi invalid!");

  if (!wsApi) {
    toast.error(toastMessages.ERR_API_CONN);
    return;
  }

  if (!address) {
    toast.error(toastMessages.NO_WALLET);
    return;
  }

  let fire;
  let inwFire;

  try {
    const contract = new ContractPromise(
      wsApi,
      psp22_contract_fire.CONTRACT_ABI,
      "5FNhUSS5qvxDnQm61qtmufoozyhuc15ae5He791ydSi9sJcS"
    );

    const gasLimit = readOnlyGasLimit(wsApi);

    const { result, output } = await contract.query["psp22::balanceOf"](
      address,
      { gasLimit, storageDepositLimit: null, value: 0 },
      address
    );

    if (result.isOk) {
      inwFire = formatQueryResultToNumber(output, 18);
    }

    const {
      data: { free: balance, frozen },
    } = await wsApi.query.system.account(address);

    const [chainDecimals] = await wsApi.registry.chainDecimals;

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

    return { fire, inwFire };
  } catch (error) {
    console.log("@_@ ", "psp22::balanceOf", " error >>", error.message);
  }
}
