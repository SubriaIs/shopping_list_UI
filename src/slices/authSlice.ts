import { createSlice, createAsyncThunk, PayloadAction, createAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


type LoginUser = {
  email: string;
  password: string;
};

type AuthInstance = {
  xToken: string;
};

type AuthApiState = {
  authentication?: AuthInstance | null;
  status: string | null;
};

const authInitialState: AuthApiState = {

  authentication: localStorage.getItem("xToken")
  ? JSON.parse(localStorage.getItem("xToken") as string)
  : null,
  status: null
};


export const login = createAsyncThunk("login", async (data: LoginUser) => {
  const response = await axiosInstance.post("/user/login", data);
  const resData = response.data;
  localStorage.setItem("xToken", JSON.stringify(resData));

  return resData;
});

export const logout = createAction('auth/logout');


const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthInstance>) => {
          state.status = "running";
          state.authentication = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
      })
      .addCase(logout, (state, action) => {
        state.status = "logout";
        localStorage.removeItem("xToken")
        localStorage.removeItem("shoppingLists")
        localStorage.removeItem("loggedUser")
        state.authentication = null;
      });
  }
});

export default authSlice.reducer;