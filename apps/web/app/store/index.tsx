"use client";

import { designService } from "@/services/design.service";
import { photosService } from "@/services/photos.service";
import { uploadService } from "@/services/upload.service";
import { userService } from "@/services/user.service";
import userSlice from "@/store/slices/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

export const store = configureStore({
  reducer: {
    user: userSlice,
    [designService.reducerPath]: designService.reducer,
    [userService.reducerPath]: userService.reducer,
    [photosService.reducerPath]: photosService.reducer,
    [uploadService.reducerPath]: uploadService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      designService.middleware,
      userService.middleware,
      photosService.middleware,
      uploadService.middleware
    ),
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
