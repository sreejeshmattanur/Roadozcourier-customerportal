import { configureStore } from "@reduxjs/toolkit";
import trackingReducer from "./trackingSlice";
import authReducer from "./authSlice";
import franchiseReducer from "./franchiseSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
    reducer: {
        tracking: trackingReducer,
        auth: authReducer,
        franchise: franchiseReducer,
        chat: chatReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;