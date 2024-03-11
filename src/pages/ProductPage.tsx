import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/Reducer/CartReducer";
import { CartItem } from "../Types/Types";

const server = "http://localhost:4000";
const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<CartItem | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/v1/product/${productId}`
        );
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        navigate("/error"); // Redirect or handle error
      }
    };

    if (productId) fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-page">
      <img
        src={`${server}/${product.photo}`}
        alt={product.name}
        style={{ width: "100%", maxWidth: "400px" }}
      />
      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <h3>Description:</h3>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
        impedit provident ad est laboriosam iusto dolor reprehenderit aliquam
        officia minima repellendus sint distinctio dignissimos optio nihil,
        eaque odit. Voluptates, quo. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Qui in sint nobis inventore facere obcaecati et
        architecto possimus exercitationem sapiente quam eum, animi nemo earum,
        cumque pariatur sunt eaque quaerat?
      </p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductPage;
