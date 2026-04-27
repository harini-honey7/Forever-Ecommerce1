import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { setCartItems } = useContext(ShopContext);

useEffect(() => {
  if (success === "true") {
    setCartItems({}); // 🔥 CLEAR CART

    alert("Payment successful 🎉");
    navigate("/orders");
  } else {
    alert("Payment failed ❌");
    navigate("/cart");
  }
}, []);

  return (
    <div className="text-center mt-20 text-lg">
      Verifying payment...
    </div>
  );
};

export default Verify;