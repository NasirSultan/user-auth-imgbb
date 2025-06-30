
# User Auth with Imgbb Upload

This package provides a ready-to-use user authentication system in Node.js. It supports user registration, login, and profile access, along with profile image upload to Imgbb.

---

## Features

* Register a user with name, email, password, and a profile image
* Upload images to Imgbb during registration
* Secure password storage using bcrypt
* Generate and verify JWT tokens on login
* Access protected profile route using token

---

## Setup Instructions

1. **Install the package**
   Add the package to your Node.js project using GitHub Packages or npm.

2. **Environment Variables**
   Create a `.env` file in your root directory and add the following:

   * `IMGBB_API_KEY`: Your Imgbb API key (you can get it from imgbb.com)
   * `JWT_SECRET`: A secret string to sign JWT tokens
   * `MONGODB_URI`: The full connection string to your MongoDB database (e.g., from MongoDB Atlas)

3. **MongoDB**
   You must have MongoDB running locally or on the cloud. Set your `MONGODB_URI` like this:

   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/your-db-name
   ```

   Replace with your actual MongoDB credentials and database name.

4. **Run the server**
   After connecting the router in your Express app, you can start handling register, login, and profile routes.

---

## API Endpoints

* `POST /api/auth/register`: Register a new user with name, email, password, and profile image
* `POST /api/auth/login`: Log in a user with email and password, returns JWT and user info
* `GET /api/auth/me`: Get the profile of the logged-in user (requires token in header)

---

## NPM Package Link

You can access this package on NPM:

**[NPM PACKAGE]([https://github.com/nasirsultan/user-auth-imgbb](https://www.npmjs.com/package/user-auth-imgbb?activeTab=readme))**

