# Team / Individual Responsibility Matrix
## SE2020 — Web and Mobile Technologies

**Project Title:** DriveEase — Full Stack Mobile Vehicle Rental Management System  
**Academic Year:** Year 2 Semester 2 (2026)  
**Module:** SE2020 — Web and Mobile Technologies  

---

### Student Details & Role Distribution

| Student ID | Student Name | Role / Assigned Module Components | Contribution % |
| :--- | :--- | :--- | :--- |
| **IT21313998** | Kavindu Rasara | Full Stack Developer (End-to-End Implementation) | 100% |

---

### Detailed Component Breakdown

#### 1. System Design & Database Modeling
* Designed NoSQL database schema on MongoDB Atlas with Mongoose ODM.
* Defined relational references (`ObjectId` linking `User` $\rightarrow$ `Vehicle` $\rightarrow$ `RentalBooking`).
* Designed RESTful API architecture following MVC (Model-View-Controller) design pattern.

#### 2. Authentication & Authorization Module
* Implemented secure user registration and login workflows.
* Integrated `bcryptjs` password hashing (salt rounds: 10).
* Implemented JSON Web Token (JWT) issuance and token verification middleware (`authMiddleware.js`).
* Implemented protected routes on the backend and protected screen stacks on mobile.

#### 3. Primary Entity Module (`Vehicle`)
* Implemented full CRUD operations (`GET /api/vehicles`, `GET /api/vehicles/:id`, `POST /api/vehicles`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`).
* Built `Multer` image upload pipeline for vehicle photos with MIME-type and 5MB size validation.
* Added filter and search capabilities by vehicle category and real-time availability.

#### 4. Related Entity Module & Core Business Logic (`RentalBooking`)
* Implemented full CRUD operations for rental reservations (`POST /api/rentals`, `GET /api/rentals/my-rentals`, `PUT /api/rentals/:id/status`, `DELETE /api/rentals/:id`).
* **Enforced Server-Side Business Logic:**
  1. *Availability Verification:* Prevents booking if `vehicle.isAvailable === false`.
  2. *Server-Side Pricing Engine:* Validates date order and calculates `totalDays` and `totalCost` on the backend to avoid client-side tampering.
  3. *State Synchronization:* Auto-updates `vehicle.isAvailable = false` upon booking confirmation, and releases `vehicle.isAvailable = true` upon booking cancellation or completion.

#### 5. Mobile Application Development (React Native & Expo)
* Built modular navigation system using `@react-navigation/stack` and `@react-navigation/bottom-tabs`.
* Implemented controlled input forms with real-time validation and visible error banners.
* Implemented dynamic loading spinners (`ActivityIndicator`) and empty state placeholders.
* Integrated `expo-image-picker` for capturing/uploading vehicle photos directly from the mobile device.
* Integrated `AsyncStorage` for persistent JWT authentication and dynamic API server configuration.

#### 6. Deployment & Quality Assurance
* Configured MongoDB Atlas cloud database with IP whitelist and user role access.
* Prepared backend production configuration for cloud deployment (Render/Railway).
* Conducted end-to-end testing against emulator and physical mobile devices over local network and live endpoints.
