import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= COD ORDER =================
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ FIXED
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      status: "Processing",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    // clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.log("COD Order Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================= STRIPE ORDER =================
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ FIXED
    const { items, amount, address } = req.body;
    const origin = req.headers.origin;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Processing",
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name || "Product",
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // shipping
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 10 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log("Stripe Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================= RAZORPAY (OPTIONAL) =================
const placeOrderRazorpay = async (req, res) => {
  res.json({
    success: false,
    message: "Razorpay not implemented yet",
  });
};

// ================= USER ORDERS =================
const displayOrders = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ FIXED

    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 });

    res.json({ success: true, orders });

  } catch (error) {
    console.log("User Orders Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================= ADMIN ORDERS =================
const displayOrdersAdmin = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ date: -1 })
      .populate("userId", "name email")
      .populate({
        path: "items._id",
        select: "name price image",
      });

    res.json({ success: true, orders });

  } catch (error) {
    console.log("Admin Orders Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ================= UPDATE STATUS =================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status required",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order updated",
      order,
    });

  } catch (error) {
    console.log("Update Status Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  displayOrders,
  displayOrdersAdmin,
  updateStatus,
};