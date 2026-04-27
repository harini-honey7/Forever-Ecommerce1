/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

// ✅ Create axios instance (BEST PRACTICE)
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  // ================== TOKEN → AXIOS ==================
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  // ================== GLOBAL ERROR HANDLING ==================
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          toast.error("Session expired, please login again");
          setToken("");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // ================== ADD TO CART ==================
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItems(cartData);

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/api/cart/add-cart", {
        itemId,
        size,
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cart update failed");
    }
  };

  // ================== UPDATE QUANTITY ==================
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) cartData[itemId] = {};

    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (!token) return;

    try {
      await api.post("/api/cart/update-cart", {
        itemId,
        size,
        quantity,
      });
    } catch (error) {
      toast.error("Failed to sync cart");
    }
  };

  // ================== GET CART COUNT ==================
  const getCartCount = () => {
    let total = 0;
    for (const product of Object.values(cartItems)) {
      for (const qty of Object.values(product)) {
        total += qty;
      }
    }
    return total;
  };

  // ================== GET PRODUCTS ==================
  const getProductsData = async () => {
    try {
      const response = await api.get("/api/product/products");

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  // ================== GET USER CART ==================
  const getUserCart = async () => {
    if (!token) return;

    try {
      const response = await api.get("/api/cart/cart");

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      toast.error("Failed to load cart");
    }
  };

  // ================== INITIAL LOAD ==================
  useEffect(() => {
    getProductsData();
  }, []);

  // ================== LOAD CART ON TOKEN ==================
  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token]);

  // ================== CONTEXT VALUE ==================
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    token,
    setToken,
    navigate,
    api, 
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;