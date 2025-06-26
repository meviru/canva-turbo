import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  _id: string;
  authId: string;
  name: string;
  email: string;
  image?: string;
}

// Declare explicitly that state can be IUserState OR null
type UserSliceState = IUserState | null | any;

const initialState: UserSliceState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<IUserState>): UserSliceState => {
      return action.payload;
    },
    clearUser: (): UserSliceState => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
