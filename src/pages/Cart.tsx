import axios from "axios";
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/Cart-Item";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
  updateDeliveryMode,
} from "../Redux/Reducer/CartReducer";
import { RootState } from "../Redux/store";
import { CartItem } from "../Types/Types";
import toast from "react-hot-toast";

const server = "http://localhost:4000";

const cutoffHour = 12;

const now = new Date();

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cartItems,
    subtotal,
    tax,
    total,
    discount,
    shippingCharges,
    shippingInfo,
  } = useSelector((state: RootState) => state.cartReducer);
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  const [deliveryModeError, setDeliveryModeError] = useState<string>("");

  useEffect(() => {
    dispatch(calculatePrice());
  }, [dispatch, cartItems, shippingInfo.deliveryMode]);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "sameDay" && now.getHours() >= cutoffHour) {
      setDeliveryModeError("Same Day Delivery is only available before 12 PM.");
      return;
    } else {
      setDeliveryModeError("");
    }

    dispatch(updateDeliveryMode(e.target.value));
  };

  const checkoutHandler = () => {
    if (!shippingInfo.deliveryMode) {
      setDeliveryModeError(
        "Please select a delivery mode before proceeding to checkout."
      );
      return;
    }

    // Check if the user is logged in by verifying if the _id field is not empty
    if (!user._id) {
      // User is not logged in, show error message and redirect to login page
      toast.error("You must be logged in to proceed to checkout.");
      navigate("/login"); // Ensure this route leads to your login page
      return;
    }

    // User is logged in, proceed to shipping page
    navigate("/shipping", {
      state: { deliveryMode: shippingInfo.deliveryMode },
    });
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    if (couponCode.trim()) {
      const timeOutID = setTimeout(() => {
        axios
          .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
            cancelToken,
          })
          .then((res) => {
            dispatch(discountApplied(res.data.discount));
            setIsValidCouponCode(true);
          })
          .catch(() => {
            dispatch(discountApplied(0));
            setIsValidCouponCode(false);
          });
      }, 1000);

      return () => {
        clearTimeout(timeOutID);
        cancel();
      };
    }
  }, [couponCode, dispatch]);

  const isSameDayAvailable = now.getHours() < cutoffHour;

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <select
          className="delivery-mode"
          name="deliveryMode"
          required
          value={shippingInfo.deliveryMode}
          onChange={changeHandler}>
          <option value="" disabled>
            Select Delivery Mode
          </option>
          {isSameDayAvailable && (
            <option value="sameDay">Same Day Delivery</option>
          )}
          <option value="express">Express Delivery (2-3 days)</option>
          <option value="normal">Normal Delivery (5-6 days)</option>
        </select>
        {deliveryModeError && <p className="red">{deliveryModeError}</p>}
        <p>Tax: ₹{tax}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Total: ₹{total}</p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}
        {cartItems.length > 0 && (
          <button onClick={checkoutHandler} className="checkout-button">
            Checkout
          </button>
        )}
      </aside>
    </div>
  );
};

export default Cart;
