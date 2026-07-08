import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { baseApi } from "./api/baseApi";
import authReducer from "./features/authSlice";
import callReducer from "./features/callSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  call: callReducer,
});

const persistConfig = {
  key: "frontend-root",
  storage: storageSession,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];