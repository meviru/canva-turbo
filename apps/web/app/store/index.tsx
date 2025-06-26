"use client";

import { designService } from "@/services/design.service";
import { userService } from "@/services/user.service";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userSlice from "@/store/slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    [designService.reducerPath]: designService.reducer,
    [userService.reducerPath]: userService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      designService.middleware,
      userService.middleware
    ),
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
