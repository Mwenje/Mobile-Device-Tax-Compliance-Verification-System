#Mobile-Device-Tax-Compliance-Verification-System
##Overview
The Mobile-Device-Tax-Compliance-Verification-System is a web application designed to streamline the process of phone IMEI verification and declaration for retailers. The system provides retailers a platform to register, declare phone details, and u verify IMEIs making sure they are staying compliant with tax laws by verifying device authenticity. This system aims to provide a reliable and convenient way to verify the tax status of mobile devices, safeguarding both consumers and government interests. It also includes an admin dashboard to oversee retailer activities, manage accounts, and ensure compliance.

##Features
##Retailer Features
User Registration & Login: Secure authentication for retailers with password hashing.
Phone Declaration: Add, edit, and delete phone details like IMEI, model, serial number, warranty, etc.
IMEI Verification: Automatically update verification status after declaration.
Profile Management: Update retailer profile details.
Dashboard: View a summary of declarations and activities.

##Admin Features
Manage Retailers: View, edit, and delete retailer accounts.
Monitor Declarations: View all phone declarations by retailers.
System Overview: Dashboard showing key metrics and activities.
Security: Ensure compliance with platform policies.

##Technologies Used
###Backend
Node.js: JavaScript runtime for server-side scripting.
Express.js: Web framework for building APIs.
MySQL: Relational database for storing retailer and declaration data.

###Frontend
HTML5, CSS3: For structuring and styling the user interface.
JavaScript: Frontend interactivity.
Bootstrap: Responsive and mobile-first design.
Authentication
Session-based Authentication: Retailer login and role-based access control.
bcrypt.js: Secure password hashing.

##Installation
###Prerequisites
Node.js (v16+ recommended)
MySQL
A terminal or command-line interface
Setup Instructions
Clone the repository:

bash
Copy code
git clone https://github.com/Mwenje/Mobile-Device-Tax-Compliance-Verification-System.git
cd retailer-imei-system
Install dependencies:

bash
Copy code
npm install
Configure environment variables:

Create a .env file in the root directory.
Add the following variables:
makefile
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=imei_system
SESSION_SECRET=yourSecretKey
Set up the database:

Create the database schema using the provided SQL scripts.
Run the application:

bash
Copy code
npm start
Access the application:

Retailer portal: http://localhost:3000
Admin dashboard: http://localhost:3000/admin
Contributing
Fork the repository.
Create a feature branch:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add feature description"
Push to the branch:
bash
Copy code
git push origin feature-name
Open a pull request.
