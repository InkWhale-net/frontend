import { combineReducers, configureStore } from "@reduxjs/toolkit";

import walletReducer from "./slices/walletSlice";
import myPoolsReducer from "./slices/myPoolsSlice";
import allPoolsReducer from "./slices/allPoolsSlice";
import bulkStakeReducer from "./slices/bulkStakeSlide";
import launchpadReducer from "./slices/launchpadSlice";

const rootReducer = combineReducers({
  wallet: walletReducer,
  myPools: myPoolsReducer,
  allPools: allPoolsReducer,
  bulkStake: bulkStakeReducer,
  launchpad: launchpadReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
