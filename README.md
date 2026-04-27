<div align="center">

# 🛍️ Forever  
### *Full-Stack E-Commerce Platform*

🚀 **A Scalable MERN Stack Shopping Solution**

</div>

---

## 🚀 Overview

**Forever** is a production-ready e-commerce platform built with the MERN stack, designed to deliver a seamless shopping experience along with a powerful admin dashboard.

It focuses on **scalability, performance, and clean architecture**, making it suitable for real-world deployment and enterprise-level applications.

---

## ✨ Key Features

### 🛒 Customer Experience
- 🔍 Advanced product search & filtering  
- 🛍️ Dynamic product catalog with categories  
- 🛒 Real-time cart management  
- 💳 Secure checkout (Stripe & Razorpay)  
- 🔐 JWT-based authentication  
- 📦 Order tracking & history  
- 📱 Fully responsive (mobile-first UI)  

---

### ⚙️ Admin Capabilities
- ➕ Add / Edit / Delete products  
- 📦 Manage and update order status  
- 👥 Monitor user data  
- 📊 Sales insights & analytics  
- ☁️ Cloudinary image management  

---

### 🔧 Technical Highlights
- ⚡ RESTful API architecture  
- 🔐 Role-based authentication (JWT)  
- 🔒 Password encryption (bcrypt)  
- 🚀 Optimized MongoDB queries  
- 📁 Scalable folder structure  
- 🎨 Reusable UI components (React + Tailwind)  

---

## 🛠️ Tech Stack

### 🎨 Frontend
- React.js  
- Tailwind CSS  
- Axios  
- React Router  

### ⚙️ Backend
- Node.js  
- Express.js  
- MongoDB + Mongoose  

### ☁️ Tools & Services
- Cloudinary (Image storage)  
- Stripe / Razorpay (Payments)  
- Vercel (Deployment)  
- Git & GitHub  

---

## 🏗️ Architecture

```text
Client (React)
     ↓
API Layer (Express)
     ↓
Business Logic (Controllers)
     ↓
Database (MongoDB)
     ↓
External Services (Stripe, Cloudinary)
📂 Project Structure
client/        # User frontend
admin/         # Admin dashboard
backend/       # API & server

backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── config/
🔐 Environment Setup
Backend .env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_SECRET_KEY=xxx

STRIPE_SECRET_KEY=xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=yourpassword
▶️ Run Locally
# Backend
cd backend
npm install
npm run dev

# Frontend
cd client
npm install
npm start

# Admin
cd admin
npm install
npm start
💳 Payment Integration
Stripe Checkout Session
Razorpay Integration (optional)
Secure payment verification flow
Success & cancel redirect handling
🔒 Security
🔐 JWT Authentication
🛡️ Role-based authorization
🔑 Bcrypt password hashing
🚫 Input validation & sanitization
🔒 Protected API routes
📈 Future Enhancements
❤️ Wishlist system
🎁 Coupons & discounts
🔔 Real-time notifications
🤖 AI-based recommendations
🏪 Multi-vendor marketplace
👨‍💻 Author

Sai Harini
Full Stack Developer

🔗 GitHub: https://github.com/harini-honey7

📧 Email: saiharinikona@gmail.com

⭐ Support

If this project helped you, consider giving it a ⭐ on GitHub!

📄 License

Licensed under the MIT License
-------------****----------------------
