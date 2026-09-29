# DriveEase Vehicle Rental System — API Endpoint Table

| HTTP Method | Route Endpoint | Access Level | Description | Request Body / Params | Expected Response Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user | `{ name, email, password, role }` | `201 Created` |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue JWT | `{ email, password }` | `200 OK` |
| **GET** | `/api/auth/profile` | Protected (User) | Get current user profile | Header: `Bearer <token>` | `200 OK` |
| **GET** | `/api/vehicles` | Public | List all vehicles with optional filters | Query: `?category=&isAvailable=&search=` | `200 OK` |
| **GET** | `/api/vehicles/:id` | Public | Get single vehicle details | Param: `id` | `200 OK` (or `404`) |
| **POST** | `/api/vehicles` | Protected (Admin) | Add vehicle with image upload | `multipart/form-data` (specs + image) | `201 Created` |
| **PUT** | `/api/vehicles/:id` | Protected (Admin) | Update vehicle details or photo | `multipart/form-data` or JSON | `200 OK` |
| **DELETE** | `/api/vehicles/:id` | Protected (Admin) | Delete vehicle (checks active rentals) | Param: `id` | `200 OK` (or `400`) |
| **POST** | `/api/rentals` | Protected (User) | Create rental booking (runs logic) | `{ vehicleId, startDate, endDate, notes }` | `201 Created` (or `400`) |
| **GET** | `/api/rentals/my-rentals` | Protected (User) | Fetch logged-in user's bookings | Header: `Bearer <token>` | `200 OK` |
| **GET** | `/api/rentals` | Protected (Admin) | View all system rental bookings | Header: `Bearer <token>` | `200 OK` |
| **GET** | `/api/rentals/:id` | Protected (User/Admin) | Fetch single rental reservation | Param: `id` | `200 OK` (or `403`/`404`) |
| **PUT** | `/api/rentals/:id/status` | Protected (User/Admin) | Update status & sync vehicle state | `{ status: "Confirmed" \| "Completed" \| "Cancelled" }` | `200 OK` |
| **DELETE** | `/api/rentals/:id` | Protected (User/Admin) | Delete rental record | Param: `id` | `200 OK` |
