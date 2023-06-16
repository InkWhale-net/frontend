import { combineReducers, configureStore } from "@reduxjs/toolkit";

import walletReducer from "./slices/walletSlice";
import myPoolsReducer from "./slices/myPoolsSlice";
import allPoolsReducer from "./slices/allPoolsSlice";
import bulkStakeReducer from "./slices/bulkStakeSlide";

const rootReducer = combineReducers({
  wallet: walletReducer,
  myPools: myPoolsReducer,
  allPools: allPoolsReducer,
  bulkStake: bulkStakeReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
