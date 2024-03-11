import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../Types/reducer-types";
import { CartItem, ShippingInfo } from "../../Types/Types";

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    deliveryMode: "",
  },
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      state.loading = false;
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
    },

    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      const now = new Date();
      const cutoffHour = 12;
      if (
        state.shippingInfo.deliveryMode === "sameDay" &&
        now.getHours() >= cutoffHour
      ) {
        // If it's past 12pm, reset delivery mode and don't allow same day delivery
        state.shippingInfo.deliveryMode = ""; // Reminder to show an alert in UI
        state.shippingCharges = 0;
      } else {
        switch (state.shippingInfo.deliveryMode) {
          case "normal":
            state.shippingCharges = 100;
            break;
          case "express":
            state.shippingCharges = 200;
            break;
          case "sameDay":
            state.shippingCharges = 300;
            break;
          default:
            state.shippingCharges = 0; // Default or free shipping scenario
        }
      }
      state.tax = Math.round(state.subtotal * 0.18);
      state.total =
        state.subtotal + state.tax + state.shippingCharges - state.discount;
    },

    updateDeliveryMode: (state, action: PayloadAction<string>) => {
      state.shippingInfo.deliveryMode = action.payload;
      cartReducer.caseReducers.calculatePrice(state);
    },

    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
  updateDeliveryMode,
} = cartReducer.actions;
