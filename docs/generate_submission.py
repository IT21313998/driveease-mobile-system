import os
import subprocess
import shutil
import zipfile

BASE_DIR = r"C:\Users\user\Downloads\New folder (3)"
DOCS_DIR = os.path.join(BASE_DIR, "docs")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Target Submission Directory
SUBMISSION_DIR_NAME = "SE2020_Group_IT21313998_Submission"
SUBMISSION_DIR = os.path.join(BASE_DIR, SUBMISSION_DIR_NAME)
ZIP_FILE_NAME_1 = "WDDS01_Group_IT21313998_Submission.zip"
ZIP_FILE_NAME_2 = "SE2020_Group_IT21313998_Submission.zip"

os.makedirs(SUBMISSION_DIR, exist_ok=True)

COMMON_CSS = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #1e293b;
        line-height: 1.6;
        padding: 40px;
        background: #fff;
        max-width: 850px;
        margin: auto;
    }
    .header-bar {
        border-bottom: 2px solid #2563eb;
        padding-bottom: 12px;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .institute-title {
        font-size: 13px;
        font-weight: 700;
        color: #2563eb;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .doc-date {
        font-size: 12px;
        color: #64748b;
    }
    h1 {
        font-size: 26px;
        font-weight: 800;
        color: #0f172a;
        margin-top: 0;
        margin-bottom: 8px;
    }
    h2 {
        font-size: 18px;
        font-weight: 700;
        color: #1e3a8a;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 6px;
        margin-top: 28px;
        margin-bottom: 14px;
    }
    h3 {
        font-size: 15px;
        font-weight: 600;
        color: #334155;
        margin-top: 18px;
        margin-bottom: 8px;
    }
    p, li {
        font-size: 13.5px;
        color: #334155;
    }
    ul, ol {
        padding-left: 22px;
        margin-top: 6px;
        margin-bottom: 12px;
    }
    li {
        margin-bottom: 4px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 18px 0;
        font-size: 12.5px;
    }
    th, td {
        border: 1px solid #cbd5e1;
        padding: 10px 12px;
        text-align: left;
    }
    th {
        background-color: #f1f5f9;
        color: #0f172a;
        font-weight: 700;
    }
    tr:nth-child(even) {
        background-color: #f8fafc;
    }
    .badge {
        display: inline-block;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 4px;
        text-transform: uppercase;
    }
    .badge-get { background: #dbeafe; color: #1e40af; }
    .badge-post { background: #dcfce7; color: #166534; }
    .badge-put { background: #fef3c7; color: #92400e; }
    .badge-delete { background: #fee2e2; color: #991b1b; }
    .meta-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 24px;
    }
    .meta-item {
        font-size: 13px;
        margin-bottom: 4px;
    }
    .meta-label {
        font-weight: 600;
        color: #475569;
        display: inline-block;
        width: 140px;
    }
    .diagram-box {
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        background: #fafafa;
    }
</style>
"""

def print_pdf(html_content, output_pdf):
    temp_html = output_pdf.replace(".pdf", ".temp.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    args = [
        f'"{EDGE_PATH}"',
        "--headless",
        "--disable-gpu",
        f'--print-to-pdf="{output_pdf}"',
        f'"{temp_html}"'
    ]
    subprocess.run(" ".join(args), shell=True, check=True)
    if os.path.exists(temp_html):
        os.remove(temp_html)
    print(f"Generated PDF: {os.path.basename(output_pdf)}")

# 1. Problem Statement HTML & PDF
problem_statement_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Problem Statement</title>{COMMON_CSS}</head>
<body>
    <div class="header-bar">
        <span class="institute-title">SLIIT — Faculty of Computing | SE2020 Web & Mobile Technologies</span>
        <span class="doc-date">Academic Year 2026</span>
    </div>
    
    <h1>Problem Statement: DriveEase Vehicle Rental System</h1>
    <div class="meta-box">
        <div class="meta-item"><span class="meta-label">Project Title:</span> <strong>DriveEase — Full Stack Mobile Vehicle Rental Management System</strong></div>
        <div class="meta-item"><span class="meta-label">Student ID:</span> <strong>IT21313998</strong> (Kavindu Rasara)</div>
        <div class="meta-item"><span class="meta-label">Primary Entity:</span> <strong>Vehicle</strong> (Full CRUD + Multer Image Upload)</div>
        <div class="meta-item"><span class="meta-label">Related Entity:</span> <strong>RentalBooking</strong> (Full CRUD + State Transitions)</div>
    </div>

    <h2>1. Introduction & Background</h2>
    <p>Personal and short-term transportation needs are rapidly growing in urban and metropolitan centers. However, traditional vehicle hire systems face substantial operational friction: paper-based record keeping, delayed manual verification, lack of real-time inventory visibility, and error-prone rental calculations. These inefficiencies lead to vehicle double-booking, administrative delays, and compromised user experience.</p>
    <p><strong>DriveEase</strong> is designed as a streamlined, modern full-stack mobile application that bridges vehicle fleet operators and end customers through a centralized digital platform.</p>

    <h2>2. Problem Description</h2>
    <p>Existing manual or disjointed rental workflows suffer from three primary flaws:</p>
    <ul>
        <li><strong>Inventory Discrepancy & Double-Booking:</strong> Lack of real-time state synchronization causes customers to reserve vehicles that are already checked out or undergoing routine service.</li>
        <li><strong>Inconsistent Price & Duration Calculation:</strong> Manual calculations or client-side pricing logic introduce vulnerabilities and disputes regarding duration, daily rates, and total rental amounts.</li>
        <li><strong>Absence of Unified Mobile Access:</strong> Modern consumers require instant mobile self-service to browse vehicles with photos, view specs, book dates, and track reservation states from their phones.</li>
    </ul>

    <h2>3. Proposed Solution</h2>
    <p>The DriveEase mobile system implements a cohesive full-stack architecture:</p>
    <ul>
        <li><strong>React Native Mobile Client:</strong> Cross-platform interface built with functional components, hooks, form validation with visible error messages, and image upload capabilities.</li>
        <li><strong>Node.js & Express.js Backend:</strong> Robust REST API enforcing secure JWT authentication (bcrypt hashing), strict validation, and transactional business logic.</li>
        <li><strong>MongoDB Atlas Cloud Database:</strong> Cloud NoSQL database with normalized document references linking Users, Vehicles, and Bookings.</li>
    </ul>

    <h2>4. Core Business Logic (Server-Side Rules)</h2>
    <ol>
        <li><strong>Fleet Availability Gatekeeper:</strong> The backend verifies <code>isAvailable === true</code> before allowing any rental creation; otherwise returns HTTP 400 Bad Request.</li>
        <li><strong>Server-Side Price Calculation:</strong> Rental duration (<code>totalDays</code>) and financial totals (<code>totalCost = totalDays * dailyRate</code>) are strictly calculated on the server to prevent tampering.</li>
        <li><strong>Automated State Synchronization:</strong> Confirming a booking automatically sets <code>isAvailable = false</code> on the vehicle. Marking it Completed or Cancelled instantly restores <code>isAvailable = true</code>.</li>
    </ol>
</body>
</html>"""

# 2. API Endpoint Table HTML & PDF
api_table_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>API Endpoint Table</title>{COMMON_CSS}</head>
<body>
    <div class="header-bar">
        <span class="institute-title">SLIIT — Faculty of Computing | SE2020 Web & Mobile Technologies</span>
        <span class="doc-date">DriveEase REST API Specification</span>
    </div>
    
    <h1>API Endpoint Table</h1>
    <div class="meta-box">
        <div class="meta-item"><span class="meta-label">Base URL (Local):</span> <code>http://10.0.2.2:5000</code> / <code>http://192.168.248.163:5000</code></div>
        <div class="meta-item"><span class="meta-label">Base URL (Hosted):</span> <code>https://driveease-api.onrender.com</code></div>
        <div class="meta-item"><span class="meta-label">Authentication:</span> Bearer Token (JSON Web Token - JWT)</div>
    </div>

    <h2>1. Authentication Endpoints (/api/auth)</h2>
    <table>
        <thead>
            <tr><th>Method</th><th>Endpoint</th><th>Access</th><th>Description</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/register</code></td><td>Public</td><td>Register customer/admin account (hashes password with bcrypt)</td><td>201 Created</td></tr>
            <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/auth/login</code></td><td>Public</td><td>Authenticate user credentials and issue signed JWT</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/auth/profile</code></td><td>Protected</td><td>Retrieve authenticated user profile</td><td>200 OK</td></tr>
        </tbody>
    </table>

    <h2>2. Primary Entity Endpoints: Vehicle (/api/vehicles)</h2>
    <table>
        <thead>
            <tr><th>Method</th><th>Endpoint</th><th>Access</th><th>Description</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/vehicles</code></td><td>Public</td><td>List all vehicles with optional filters (?category, ?search, ?isAvailable)</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/vehicles/:id</code></td><td>Public</td><td>Fetch single vehicle specification and pricing</td><td>200 OK / 404</td></tr>
            <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/vehicles</code></td><td>Admin</td><td>Create vehicle with multipart image upload (Multer)</td><td>201 Created</td></tr>
            <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/vehicles/:id</code></td><td>Admin</td><td>Update vehicle details or replace photo</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-delete">DELETE</span></td><td><code>/api/vehicles/:id</code></td><td>Admin</td><td>Delete vehicle (validated against active reservations)</td><td>200 OK / 400</td></tr>
        </tbody>
    </table>

    <h2>3. Related Entity Endpoints: Rental Booking (/api/rentals)</h2>
    <table>
        <thead>
            <tr><th>Method</th><th>Endpoint</th><th>Access</th><th>Description</th><th>Status</th></tr>
        </thead>
        <tbody>
            <tr><td><span class="badge badge-post">POST</span></td><td><code>/api/rentals</code></td><td>Protected</td><td>Create rental booking with business logic validation and vehicle lock</td><td>201 Created</td></tr>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/rentals/my-rentals</code></td><td>Protected</td><td>Get all bookings placed by logged-in user</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/rentals</code></td><td>Admin</td><td>Get all system rental bookings</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-get">GET</span></td><td><code>/api/rentals/:id</code></td><td>Protected</td><td>Get single rental booking by ID</td><td>200 OK / 403</td></tr>
            <tr><td><span class="badge badge-put">PUT</span></td><td><code>/api/rentals/:id/status</code></td><td>Protected</td><td>Update status (Confirmed, Completed, Cancelled) & sync vehicle state</td><td>200 OK</td></tr>
            <tr><td><span class="badge badge-delete">DELETE</span></td><td><code>/api/rentals/:id</code></td><td>Protected</td><td>Delete rental booking and release vehicle availability</td><td>200 OK</td></tr>
        </tbody>
    </table>
</body>
</html>"""

# 3. Team Responsibility HTML & PDF
team_resp_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Team Responsibility Matrix</title>{COMMON_CSS}</head>
<body>
    <div class="header-bar">
        <span class="institute-title">SLIIT — Faculty of Computing | SE2020 Web & Mobile Technologies</span>
        <span class="doc-date">Responsibility Matrix</span>
    </div>
    
    <h1>Team / Individual Responsibility Matrix</h1>
    <div class="meta-box">
        <div class="meta-item"><span class="meta-label">Module:</span> <strong>SE2020 — Web and Mobile Technologies</strong></div>
        <div class="meta-item"><span class="meta-label">Assignment Type:</span> <strong>Individual Assignment (100% Contribution)</strong></div>
        <div class="meta-item"><span class="meta-label">Student ID:</span> <strong>IT21313998</strong></div>
        <div class="meta-item"><span class="meta-label">Student Name:</span> <strong>Kavindu Rasara</strong></div>
        <div class="meta-item"><span class="meta-label">Project Title:</span> <strong>DriveEase — Full Stack Mobile Vehicle Rental System</strong></div>
    </div>

    <h2>1. Member Contribution Overview</h2>
    <table>
        <thead>
            <tr><th>Student ID</th><th>Student Name</th><th>Assigned Module Area</th><th>Contribution %</th></tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>IT21313998</strong></td>
                <td><strong>Kavindu Rasara</strong></td>
                <td>Full Stack Development (Architecture, Backend REST API, Database, Mobile Application & Deployment)</td>
                <td><strong>100%</strong></td>
            </tr>
        </tbody>
    </table>

    <h2>2. Technical Component Breakdown</h2>
    <h3>A. System Design & Database Architecture</h3>
    <ul>
        <li>Designed relational NoSQL data models in MongoDB Atlas via Mongoose ODM.</li>
        <li>Implemented document references (<code>ObjectId</code>) connecting User, Vehicle, and RentalBooking collections.</li>
        <li>Structured backend following strict MVC (Model-View-Controller) design pattern.</li>
    </ul>

    <h3>B. Backend API & Core Business Logic</h3>
    <ul>
        <li>Engineered user authentication with bcrypt password hashing and JWT issuance/verification.</li>
        <li>Implemented complete CRUD for Primary Entity (<code>Vehicle</code>) and file handling via Multer.</li>
        <li>Implemented complete CRUD for Related Entity (<code>RentalBooking</code>) with server-side duration and cost computation.</li>
        <li>Built real-time entity state synchronization: automatically locks vehicle upon booking confirmation and unlocks it upon cancellation.</li>
    </ul>

    <h3>C. Mobile Client Development (React Native & Expo)</h3>
    <ul>
        <li>Implemented dual navigation stacks (Auth Stack & Bottom Tabs) using React Navigation.</li>
        <li>Engineered form input controls with real-time validation and visible error banners.</li>
        <li>Integrated <code>expo-image-picker</code> for image selection and multipart form uploads.</li>
        <li>Added dynamic API host switcher in the app for testing on Android Emulator, physical Wi-Fi devices, and cloud endpoints.</li>
    </ul>

    <h3>D. Cloud Deployment & Quality Assurance</h3>
    <ul>
        <li>Configured cloud MongoDB Atlas cluster with global IP whitelist (0.0.0.0/0).</li>
        <li>Configured cloud production environments and prepared live deployment pipelines.</li>
        <li>Conducted end-to-end integration testing across physical device and emulator environments.</li>
    </ul>
</body>
</html>"""

# 4. System Architecture Diagram HTML & PDF
architecture_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>System Architecture Diagram</title>{COMMON_CSS}
<style>
    .arch-container {{
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 20px;
    }}
    .arch-layer {{
        border: 2px solid #2563eb;
        border-radius: 10px;
        padding: 16px;
        background: #eff6ff;
    }}
    .layer-title {{
        font-weight: 800;
        font-size: 14px;
        color: #1e40af;
        text-transform: uppercase;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
    }}
    .node-grid {{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
    }}
    .arch-node {{
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }}
    .arch-node h4 {{
        margin: 0 0 4px 0;
        font-size: 13px;
        color: #0f172a;
    }}
    .arch-node p {{
        margin: 0;
        font-size: 11.5px;
        color: #64748b;
    }}
    .flow-arrow {{
        text-align: center;
        font-size: 18px;
        color: #2563eb;
        font-weight: 800;
        margin: -6px 0;
    }}
</style>
</head>
<body>
    <div class="header-bar">
        <span class="institute-title">SLIIT — Faculty of Computing | SE2020 Web & Mobile Technologies</span>
        <span class="doc-date">System Architecture</span>
    </div>
    
    <h1>System Architecture Diagram</h1>
    <div class="meta-box">
        <div class="meta-item"><span class="meta-label">Project:</span> DriveEase Mobile Vehicle Rental System</div>
        <div class="meta-item"><span class="meta-label">Student ID:</span> IT21313998 (Kavindu Rasara)</div>
    </div>

    <div class="arch-container">
        <!-- Client Layer -->
        <div class="arch-layer">
            <div class="layer-title">📱 1. Client Layer — Mobile Application (React Native / Expo)</div>
            <div class="node-grid">
                <div class="arch-node">
                    <h4>React Navigation</h4>
                    <p>Auth Stack (Login/Register) & App Bottom Tabs (Fleet, Bookings, Add, Profile)</p>
                </div>
                <div class="arch-node">
                    <h4>State & Storage</h4>
                    <p>AuthContext + AsyncStorage (JWT Token persistence & dynamic API URL)</p>
                </div>
                <div class="arch-node">
                    <h4>API Client (Axios)</h4>
                    <p>Request/Response interceptors, error handling, multipart FormData</p>
                </div>
                <div class="arch-node">
                    <h4>Expo Image Picker</h4>
                    <p>Camera/gallery photo upload for vehicle catalog</p>
                </div>
            </div>
        </div>

        <div class="flow-arrow">▼ HTTPS / REST API Calls (JSON + Multipart Form-Data) ▼</div>

        <!-- Backend Layer -->
        <div class="arch-layer" style="border-color: #059669; background: #ecfdf5;">
            <div class="layer-title" style="color: #065f46;">⚙️ 2. Application Layer — Node.js & Express.js REST API</div>
            <div class="node-grid">
                <div class="arch-node">
                    <h4>Routers</h4>
                    <p>/api/auth, /api/vehicles, /api/rentals</p>
                </div>
                <div class="arch-node">
                    <h4>Middleware Pipeline</h4>
                    <p>authMiddleware (JWT Verify), uploadMiddleware (Multer), errorHandler</p>
                </div>
                <div class="arch-node">
                    <h4>Controllers & Business Logic</h4>
                    <p>Availability gatekeeping, server-side pricing engine, vehicle state synchronization</p>
                </div>
                <div class="arch-node">
                    <h4>Static Uploads Service</h4>
                    <p>Serves uploaded vehicle images at /uploads</p>
                </div>
            </div>
        </div>

        <div class="flow-arrow">▼ Mongoose ODM (Queries, Schema Validations, References) ▼</div>

        <!-- Database Layer -->
        <div class="arch-layer" style="border-color: #7c3aed; background: #f5f3ff;">
            <div class="layer-title" style="color: #5b21b6;">🗄️ 3. Data Layer — MongoDB Atlas (Cloud NoSQL Database)</div>
            <div class="node-grid">
                <div class="arch-node">
                    <h4>Users Collection</h4>
                    <p>Credentials, bcrypt password hash, roles</p>
                </div>
                <div class="arch-node">
                    <h4>Vehicles Collection</h4>
                    <p>Primary entity: specs, rates, photo URL, availability flag</p>
                </div>
                <div class="arch-node">
                    <h4>RentalBookings Collection</h4>
                    <p>Related entity: dates, duration, cost, status, ObjectId refs</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>"""

# 5. Database Schema Diagram HTML & PDF
schema_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Database Schema Diagram</title>{COMMON_CSS}
<style>
    .schema-grid {{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin-top: 20px;
    }}
    .entity-card {{
        border: 2px solid #3b82f6;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }}
    .entity-header {{
        background: #2563eb;
        color: #fff;
        padding: 10px 14px;
        font-weight: 800;
        font-size: 14px;
    }}
    .entity-fields {{
        padding: 10px 14px;
    }}
    .field-row {{
        font-size: 12px;
        padding: 4px 0;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        justify-content: space-between;
    }}
    .field-name {{
        font-weight: 600;
        color: #1e293b;
    }}
    .field-type {{
        color: #64748b;
        font-family: monospace;
    }}
    .key-pk {{ color: #d97706; font-weight: 700; }}
    .key-fk {{ color: #2563eb; font-weight: 700; }}
    .relation-banner {{
        background: #f1f5f9;
        border: 1px dashed #94a3b8;
        border-radius: 8px;
        padding: 14px;
        margin-top: 20px;
        font-size: 13px;
        color: #334155;
    }}
</style>
</head>
<body>
    <div class="header-bar">
        <span class="institute-title">SLIIT — Faculty of Computing | SE2020 Web & Mobile Technologies</span>
        <span class="doc-date">Database Schema</span>
    </div>
    
    <h1>Database Schema Diagram (Entity-Relationship)</h1>
    <div class="meta-box">
        <div class="meta-item"><span class="meta-label">Database Type:</span> MongoDB Atlas (Document Relational Referencing)</div>
        <div class="meta-item"><span class="meta-label">Primary Entity:</span> Vehicle (Full CRUD + Image Upload)</div>
        <div class="meta-item"><span class="meta-label">Related Entity:</span> RentalBooking (Full CRUD + State Transitions)</div>
    </div>

    <div class="schema-grid">
        <!-- USER -->
        <div class="entity-card">
            <div class="entity-header">USER (Authentication)</div>
            <div class="entity-fields">
                <div class="field-row"><span class="field-name"><span class="key-pk">PK</span> _id</span><span class="field-type">ObjectId</span></div>
                <div class="field-row"><span class="field-name">name</span><span class="field-type">String</span></div>
                <div class="field-row"><span class="field-name">email</span><span class="field-type">String (Unique)</span></div>
                <div class="field-row"><span class="field-name">password</span><span class="field-type">String (bcrypt)</span></div>
                <div class="field-row"><span class="field-name">role</span><span class="field-type">String (enum)</span></div>
                <div class="field-row"><span class="field-name">createdAt</span><span class="field-type">Date</span></div>
                <div class="field-row"><span class="field-name">updatedAt</span><span class="field-type">Date</span></div>
            </div>
        </div>

        <!-- VEHICLE -->
        <div class="entity-card" style="border-color: #059669;">
            <div class="entity-header" style="background: #059669;">VEHICLE (Primary Entity)</div>
            <div class="entity-fields">
                <div class="field-row"><span class="field-name"><span class="key-pk">PK</span> _id</span><span class="field-type">ObjectId</span></div>
                <div class="field-row"><span class="field-name">model</span><span class="field-type">String</span></div>
                <div class="field-row"><span class="field-name">category</span><span class="field-type">String (enum)</span></div>
                <div class="field-row"><span class="field-name">plateNumber</span><span class="field-type">String (Unique)</span></div>
                <div class="field-row"><span class="field-name">dailyRate</span><span class="field-type">Number</span></div>
                <div class="field-row"><span class="field-name">seatingCapacity</span><span class="field-type">Number</span></div>
                <div class="field-row"><span class="field-name">fuelType</span><span class="field-type">String (enum)</span></div>
                <div class="field-row"><span class="field-name">image</span><span class="field-type">String (URL)</span></div>
                <div class="field-row"><span class="field-name">isAvailable</span><span class="field-type">Boolean</span></div>
                <div class="field-row"><span class="field-name">description</span><span class="field-type">String</span></div>
                <div class="field-row"><span class="field-name">createdAt</span><span class="field-type">Date</span></div>
            </div>
        </div>

        <!-- RENTAL_BOOKING -->
        <div class="entity-card" style="border-color: #7c3aed;">
            <div class="entity-header" style="background: #7c3aed;">RENTAL_BOOKING (Related Entity)</div>
            <div class="entity-fields">
                <div class="field-row"><span class="field-name"><span class="key-pk">PK</span> _id</span><span class="field-type">ObjectId</span></div>
                <div class="field-row"><span class="field-name"><span class="key-fk">FK</span> vehicleId</span><span class="field-type">ObjectId (Ref)</span></div>
                <div class="field-row"><span class="field-name"><span class="key-fk">FK</span> userId</span><span class="field-type">ObjectId (Ref)</span></div>
                <div class="field-row"><span class="field-name">startDate</span><span class="field-type">Date</span></div>
                <div class="field-row"><span class="field-name">endDate</span><span class="field-type">Date</span></div>
                <div class="field-row"><span class="field-name">totalDays</span><span class="field-type">Number</span></div>
                <div class="field-row"><span class="field-name">totalCost</span><span class="field-type">Number</span></div>
                <div class="field-row"><span class="field-name">status</span><span class="field-type">String (enum)</span></div>
                <div class="field-row"><span class="field-name">notes</span><span class="field-type">String</span></div>
                <div class="field-row"><span class="field-name">createdAt</span><span class="field-type">Date</span></div>
            </div>
        </div>
    </div>

    <div class="relation-banner">
        <strong>Relationship Dynamics:</strong>
        <ul>
            <li><strong>User $\rightarrow$ RentalBooking (1:N):</strong> One customer can place multiple vehicle reservations. Linked via <code>userId</code>.</li>
            <li><strong>Vehicle $\rightarrow$ RentalBooking (1:N):</strong> One vehicle can have multiple historical booking records. Linked via <code>vehicleId</code>.</li>
            <li><strong>State Synchronization Rule:</strong> When a RentalBooking is <code>Confirmed</code>, the referenced Vehicle's <code>isAvailable</code> flag is set to <code>false</code>. When <code>Cancelled</code> or <code>Completed</code>, <code>isAvailable</code> is restored to <code>true</code>.</li>
        </ul>
    </div>
</body>
</html>"""

# Generate PDFs in the submission directory
print_pdf(problem_statement_html, os.path.join(SUBMISSION_DIR, "Problem_Statement.pdf"))
print_pdf(api_table_html, os.path.join(SUBMISSION_DIR, "API_Endpoint_Table.pdf"))
print_pdf(team_resp_html, os.path.join(SUBMISSION_DIR, "Team_Responsibility.pdf"))
print_pdf(architecture_html, os.path.join(SUBMISSION_DIR, "System_Architecture_Diagram.pdf"))
print_pdf(schema_html, os.path.join(SUBMISSION_DIR, "Database_Schema_Diagram.pdf"))

# Copy README.txt
shutil.copyfile(os.path.join(DOCS_DIR, "README.txt"), os.path.join(SUBMISSION_DIR, "README.txt"))
print("Copied README.txt")

# Create ZIP files
def make_zip(zip_name):
    zip_path = os.path.join(BASE_DIR, zip_name)
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(SUBMISSION_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BASE_DIR)
                zipf.write(file_path, arcname)
    print(f"Created submission ZIP: {zip_path}")

make_zip(ZIP_FILE_NAME_1)
make_zip(ZIP_FILE_NAME_2)
print("All submission assets generated successfully!")
