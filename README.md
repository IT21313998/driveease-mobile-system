# DriveEase — Mobile Vehicle Rental System
### SE2020 Web & Mobile Technologies Assignment

A full-stack mobile application for vehicle rental management built with React Native (Expo), Node.js/Express.js, and MongoDB Atlas.

---

## Tech Stack
- **Frontend:** React Native (Expo), React Navigation, Axios, AsyncStorage
- **Backend:** Node.js, Express.js, JWT Authentication, Multer (Image Upload)
- **Database:** MongoDB Atlas (Mongoose ODM)

---

## Project Structure
```
driveease-mobile-system/
├── backend/          # Node.js + Express REST API
└── frontend/         # React Native (Expo) Mobile App
```

---

## Setup Instructions

### Backend
```bash
cd backend
cp .env.example .env
# Fill in your MongoDB Atlas URI and JWT secret in .env
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npx expo start
```

> **Note:** When running on Android Emulator use `http://10.0.2.2:5000` as the API base URL.  
> When running on a physical device use your computer's local Wi-Fi IP (e.g. `http://192.168.x.x:5000`).

---

## Environment Variables (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/driveease
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/driveease
JWT_SECRET=your_secret_key
NODE_ENV=development
```

---

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/vehicles` | Public | List all vehicles |
| POST | `/api/vehicles` | Admin | Add vehicle + image |
| PUT | `/api/vehicles/:id` | Admin | Update vehicle |
| DELETE | `/api/vehicles/:id` | Admin | Delete vehicle |
| POST | `/api/rentals` | Auth | Create booking |
| GET | `/api/rentals/my-rentals` | Auth | My bookings |
| PUT | `/api/rentals/:id/status` | Auth | Update booking status |
| DELETE | `/api/rentals/:id` | Auth | Delete booking |
