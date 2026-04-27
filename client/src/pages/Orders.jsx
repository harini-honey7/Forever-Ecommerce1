/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { currency, token, products, api } = useContext(ShopContext); // ✅ use api

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.post("/api/order/userorders"); // ✅ clean

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="border-t pt-12 px-6 lg:px-24 bg-gray-50 min-h-screen">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">
          Loading your orders...
        </p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          You have not placed any orders yet 📦
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) =>
            order.items.map((item, idx) => {
              const product = products.find((p) => p._id === item._id);
              if (!product) return null;

              return (
                <div
                  key={`${order._id}-${idx}`}
                  className="flex flex-col sm:flex-row justify-between bg-white p-5 border rounded-md shadow-sm"
                >
                  <div className="flex gap-5">
                    <img
                      src={product.image[0]}
                      alt=""
                      className="w-20 h-24 object-cover"
                    />

                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm">
                        {currency}
                        {product.price} | Qty: {item.quantity} | Size: {item.size}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.date).toDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <p>{order.status || "Processing"}</p>
                  </div>

                  <button className="border px-4 py-2 mt-3 sm:mt-0">
                    Track Order
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;