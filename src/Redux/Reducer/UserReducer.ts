import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../Types/reducer-types";
import { User } from "../../Types/Types";
const localData: any = localStorage.getItem("userData");
let parsedData;
try {
  parsedData = localData ? JSON.parse(localData) : null;
} catch (error) {
  console.error("Error parsing data from localStorage:", error);
  parsedData = null;
}
const initialState: UserReducerInitialState = {
  user: parsedData || {
    name: "",
    email: "",
    photo: "",
    gender: "",
    role: "",
    dob: "",
    _id: "",
  },
  loading: false,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = {
        name: "",
        email: "",
        photo: "",
        gender: "",
        role: "",
        dob: "",
        _id: "",
      };
    },
  },
});

export const { userExist, userNotExist } = userReducer.actions;
