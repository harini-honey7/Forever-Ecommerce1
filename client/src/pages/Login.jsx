/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, api } = useContext(ShopContext); // ✅ get api

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || (currentState === "Sign Up" && !name)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      let response;

      if (currentState === "Sign Up") {
        response = await api.post("/api/user/register", {
          name: name.trim(),
          email: email.trim(),
          password,
        });
      } else {
        response = await api.post("/api/user/login", {
          email: email.trim(),
          password,
        });
      }

      if (response.data.success) {
        const token = response.data.token;

        localStorage.setItem("token", token);
        setToken(token);

        toast.success(
          currentState === "Login"
            ? "Logged in successfully"
            : "Account created successfully"
        );

        setName("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 bg-white p-6 rounded-xl shadow-md"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-2">
        <p className="text-3xl">{currentState}</p>
        <hr className="h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter Name"
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border rounded-md"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Enter Email"
      />

      <input
        type="password"
        className="w-full px-3 py-2 border rounded-md"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Enter Password"
      />

      <div className="w-full flex justify-between text-sm">
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")} className="cursor-pointer">
            Create Account
          </p>
        ) : (
          <p onClick={() => setCurrentState("Login")} className="cursor-pointer">
            Login here
          </p>
        )}
      </div>

      <button
        disabled={loading}
        className={`w-full py-2 rounded-md ${
          loading ? "bg-gray-400" : "bg-black text-white"
        }`}
      >
        {loading ? "Please wait..." : currentState}
      </button>
    </form>
  );
};

export default Login;