/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // ✅ FIXED: use find instead of map
  const fetchProductData = () => {
    const item = products.find((p) => p._id === productId);

    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  };

  // ✅ FIXED: depend on products also
  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  // ⛔ Better loading state
  if (!productData) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  return (
    <div>
      <div className="border-t-2 pt-10">
        <div className="flex gap-12 flex-col sm:flex-row">

          {/* IMAGES */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll sm:w-[18%] w-full">
              {productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  onClick={() => setImage(item)}
                  className="w-[24%] sm:w-full cursor-pointer"
                  alt=""
                />
              ))}
            </div>

            <div className="w-full sm:w-[80%]">
              <img src={image} className="w-full" alt="" />
            </div>
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium">{productData.name}</h1>

            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} className="w-3.5" />
              <img src={assets.star_icon} className="w-3.5" />
              <img src={assets.star_icon} className="w-3.5" />
              <img src={assets.star_icon} className="w-3.5" />
              <img src={assets.star_dull_icon} className="w-3.5" />
              <p className="pl-2">(100)</p>
            </div>

            <p className="text-3xl mt-5">
              {currency}
              {productData.price}
            </p>

            <p className="text-gray-500 mt-5">
              {productData.description}
            </p>

            {/* SIZE */}
            <div className="mt-6">
              <p>Select Size</p>
              <div className="flex gap-2 mt-2">
                {productData.sizes.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(item)}
                    className={`px-4 py-2 border ${
                      size === item ? "border-orange-500" : ""
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-6 py-3 mt-6"
            >
              ADD TO CART
            </button>

            <hr className="mt-6" />

            <p className="text-gray-500 mt-2">100% Original Product</p>
            <p className="text-gray-500">Cash on delivery available</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-16">
          <div className="flex">
            <b className="border px-3 py-2">Description</b>
            <p className="border px-5 py-2">Reviews (100)</p>
          </div>

          <div className="border p-5 text-gray-500">
            <p>High quality e-commerce product.</p>
            <p>Best price with reliable delivery.</p>
          </div>
        </div>

        {/* RELATED */}
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;