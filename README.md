# Mobile-Device-Tax-Compliance-Verification-System
## Overview
The Mobile-Device-Tax-Compliance-Verification-System is a web application designed to streamline the process of phone IMEI verification and declaration for retailers. The system provides retailers a platform to register, declare phone details, and u verify IMEIs making sure they are staying compliant with tax laws by verifying device authenticity. This system aims to provide a reliable and convenient way to verify the tax status of mobile devices, safeguarding both consumers and government interests. It also includes an admin dashboard to oversee retailer activities, manage accounts, and ensure compliance.

## Features
## Retailer Features
1. User Registration & Login: Secure authentication for retailers with password hashing.
2. Phone Declaration: Add, edit, and delete phone details like IMEI, model, serial number, warranty, etc.
3. IMEI Verification: Automatically update verification status after declaration.
4. Profile Management: Update retailer profile details.
5. Dashboard: View a summary of declarations and activities.

## Admin Features
1. Manage Retailers: View, edit, and delete retailer accounts.
2. Monitor Declarations: View all phone declarations by retailers.
3. System Overview: Dashboard showing key metrics and activities.
4. Security: Ensure compliance with platform policies.

## Technologies Used
### Backend
1. Node.js: JavaScript runtime for server-side scripting.
2. Express.js: Web framework for building APIs.
3. MySQL: Relational database for storing retailer and declaration data.

### Frontend
1. HTML5, CSS3: For structuring and styling the user interface.
2. JavaScript: Frontend interactivity.
   
## Authentication
* Session-based Authentication: Retailer login and role-based access control.
* bcrypt.js: Secure password hashing.

## Installation
### Prerequisites
## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
### Install

```bash
$ npm install
```
  
### Development

```bash
$ npm run dev
```
