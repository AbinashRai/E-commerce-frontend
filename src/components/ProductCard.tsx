import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { server } from "../Redux/store";
import { CartItem } from "../Types/Types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleCardClick = () => {
    navigate(`/product/${productId}`); // Navigate to product page
  };

  // Prevent event propagation to stop the card click action when the Add to Cart button is clicked
  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handler({ productId, price, name, photo, stock, quantity: 1 });
  };

  return (
    // Add the onClick handler to the product-card div
    <div className="product-card" onClick={handleCardClick}>
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button onClick={handleAddToCartClick}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
