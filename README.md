# KitchenPulse 🍽️

KitchenPulse – A full-stack food delivery application with real-time order tracking, built using the MERN stack and Socket.IO.

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, Socket.io  
**Frontend:** React, Redux Toolkit, Tailwind CSS, React Router  
**Auth:** JWT (cookie-based), Google OAuth (Firebase), OTP-based password reset  
**Payments:** Razorpay (online + COD)  
**Media:** Cloudinary (signed uploads)  
**Maps:** Leaflet + OpenStreetMap, Geoapify (geocoding)  
**Real-time:** Socket.io (live order updates, delivery tracking)

---

## Features

### Customer
- Browse shops and food items by city
- Search items by name or category
- Add to cart, checkout with delivery location (map pin or search)
- Pay via Cash on Delivery or Razorpay (UPI/Card)
- Real-time order status updates
- Live delivery partner tracking on map
- Rate ordered items after delivery

### Vendor
- Create and manage restaurant shop
- Add, edit, delete menu items (with Cloudinary image upload)
- Receive new order notifications in real-time
- Update order status (Confirm → Preparing → Ready for Pickup)
- View assigned delivery partner details

### Delivery Partner
- View available delivery assignments in nearby area
- Accept assignments (first come, first served)
- Live location tracking shared with customer
- Send OTP to customer at delivery, verify to mark delivered
- View daily/weekly/all-time earnings

---

## Project Structure

```
kitchenpulse/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── socket/
│   ├── utils/
│   ├── app.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── config/
    │   ├── data/
    │   ├── hooks/
    │   ├── pages/
    │   ├── redux/
    │   ├── services/
    │   └── utils/
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Razorpay account
- Cloudinary account
- Geoapify API key
- Firebase project (for Google OAuth)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
EMAIL=your_gmail
EMAIL_PASSWORD=your_gmail_app_password
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
RAZORPAY_API_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_BASE_URL=http://localhost:8080
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_GEOAPIKEY=your_geoapify_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_EMAIL_ID=guest_demo_email
```

```bash
npm run dev
```

---

## Environment Variables Summary

| Variable | Used In |
|---|---|
| `MONGODB_URI` | MongoDB connection |
| `JWT_SECRET_KEY` | JWT signing |
| `RAZORPAY_API_KEY_ID / RAZORPAY_KEY_SECRET` | Razorpay payments (backend) |
| `CLOUD_NAME / CLOUD_API_KEY / CLOUD_API_SECRET` | Cloudinary image uploads |
| `EMAIL / EMAIL_PASSWORD` | OTP emails via Nodemailer |
| `VITE_FIREBASE_APIKEY` | Google OAuth |
| `VITE_GEOAPIKEY` | Geocoding (Geoapify) |
| `VITE_RAZORPAY_KEY_ID` | Razorpay payments (frontend) |
| `VITE_EMAIL_ID` | Guest demo login |

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/google-auth` | Google OAuth |
| GET | `/api/v1/shop/city/:city` | Get shops by city |
| GET | `/api/v1/item/city/:city` | Get items by city |
| POST | `/api/v1/order` | Create order |
| POST | `/api/v1/order/verify-payment` | Verify Razorpay payment |
| PATCH | `/api/v1/order/:orderId/shop/:shopId/status` | Update order status |
| GET | `/api/v1/order/assignments` | Get delivery assignments |
| PATCH | `/api/v1/order/assignments/:id/accept` | Accept delivery |

---

## Author

**Ranjan Kumar**  
[GitHub](https://github.com/ripuranjan-143) · [LinkedIn](https://www.linkedin.com/in/ranjan-kumar-642a061ba/)
