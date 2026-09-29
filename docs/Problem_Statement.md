# Problem Statement: DriveEase Vehicle Rental Management System

## 1. Introduction & Background
In modern urban transit and tourism environments, flexible personal transportation is in high demand. However, traditional vehicle rental services often suffer from inefficient operational bottlenecks: manual paperwork, delayed confirmation cycles, poor visibility into real-time fleet availability, and lack of transparent pricing. These inefficiencies result in customer friction, accidental double-booking of vehicles, and administrative overhead for fleet operators.

To address these challenges, **DriveEase** is designed as a streamlined, end-to-end full-stack mobile application that bridges vehicle owners/fleet managers and end-users. The system provides a centralized digital platform to manage fleet inventory, process rental bookings, and enforce automated business rules without relying on manual intervention.

---

## 2. Problem Description
Vehicle rental operations face three primary technical and operational problems:

1. **Inventory Discrepancy & Double-Booking:**
   Without strict synchronization between rental states and vehicle availability, customers frequently reserve vehicles that are already checked out or undergoing routine maintenance, leading to booking conflicts.

2. **Inconsistent Price Calculation & Verification:**
   Calculating rental costs manually or relying on client-side math introduces errors, vulnerabilities, and disputes regarding duration calculations, daily rates, and security deposit totals.

3. **Absence of Unified Mobile Workflows:**
   Users expect self-service mobile accessibility: browsing vehicles with high-resolution imagery, checking availability on the fly, tracking rental reservation statuses (Pending, Confirmed, Completed, Cancelled), and managing their reservations seamlessly from their smartphones.

---

## 3. Proposed Solution
**DriveEase** is an individual full-stack mobile application solution built with the following core architectural components:

* **Mobile Frontend (React Native):**
  Provides a clean, responsive user interface featuring user authentication, an interactive vehicle catalog with high-quality uploaded imagery, rental duration pickers, and real-time reservation status updates.

* **Backend REST API (Node.js & Express.js):**
  Acts as the business logic engine. It handles secure JWT-based authentication with bcrypt password encryption, manages CRUD lifecycles for vehicles and bookings, validates inputs, and processes multipart image uploads via Multer.

* **Cloud Database (MongoDB Atlas):**
  A managed NoSQL database implementing relational document referencing (`ObjectId` linking between Users, Vehicles, and Rental Bookings).

* **Cloud Deployment:**
  The backend API is deployed on a cloud host (Render/Railway) with environment variable protection, ensuring 24/7 internet accessibility directly from the mobile client.

---

## 4. Key Entities & Relationships

* **Entity 1: User (System Auth)**
  * Attributes: `name`, `email`, `password` (bcrypt hashed), `role` (`customer`, `admin`).
* **Entity 2: Vehicle (Primary Entity)**
  * Attributes: `model`, `category` (Sedan, SUV, Hatchback, Motorbike), `plateNumber`, `dailyRate`, `seatingCapacity`, `fuelType`, `image` (Multer uploaded file URL), `isAvailable` (boolean), `description`.
  * Operations: Full CRUD + Image Upload.
* **Entity 3: RentalBooking (Related Entity)**
  * Attributes: `vehicleId` (Mongoose Ref $\rightarrow$ Vehicle), `userId` (Mongoose Ref $\rightarrow$ User), `startDate`, `endDate`, `totalDays`, `totalCost`, `status` (`Pending`, `Confirmed`, `Completed`, `Cancelled`), `notes`.
  * Operations: Full CRUD + State Transitions.

---

## 5. Core Enforced Business Logic
1. **Fleet Availability Gatekeeper:**
   When a user initiates a booking, the backend controller performs a real-time availability check. If `isAvailable === false`, the booking request is blocked immediately with an HTTP 400 Bad Request response.
2. **Server-Side Financial & Duration Verification:**
   The backend independently calculates the total days (`ceil((endDate - startDate) / 1 day)`) and computes `totalCost = totalDays * dailyRate`. Client-submitted totals are ignored to prevent tampering.
3. **Automated Status Synchronization:**
   * Transitioning a booking to `Confirmed` automatically updates the referenced vehicle's `isAvailable` flag to `false`.
   * Transitioning a booking to `Completed` or `Cancelled` immediately resets the vehicle's `isAvailable` flag to `true`, instantly replenishing the catalog for other customers.
