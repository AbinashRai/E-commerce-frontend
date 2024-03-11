import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./API/ProductApi";
import { userAPI } from "./API/UserApi";
import { userReducer } from "./Reducer/UserReducer";
import { cartReducer } from "./Reducer/CartReducer";
import { orderApi } from "./API/OrderApi";
import { dashboardApi } from "./API/DashboardApi";

export const server = "http://localhost:4000";

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [userReducer.name]: userReducer.reducer,
    [cartReducer.name]: cartReducer.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      userAPI.middleware,
      productAPI.middleware,
      orderApi.middleware,
      dashboardApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
