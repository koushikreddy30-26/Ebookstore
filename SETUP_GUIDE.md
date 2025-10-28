# Complete Setup Guide for eBook Store

This guide will walk you through setting up the eBook Store application from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [MongoDB Setup](#mongodb-setup)
3. [Razorpay Setup](#razorpay-setup)
4. [Server Configuration](#server-configuration)
5. [Client Configuration](#client-configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v14.x or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
  
- **MongoDB** (v4.4 or higher)
  - Option 1: MongoDB Community Server (Local)
    - Download from: https://www.mongodb.com/try/download/community
  - Option 2: MongoDB Atlas (Cloud - Recommended for beginners)
    - Sign up at: https://www.mongodb.com/cloud/atlas

- **Git** (optional, for cloning)
  - Download from: https://git-scm.com/

---

## MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and create an account

2. **Create a Cluster**
   - Choose the FREE tier (M0)
   - Select a cloud provider and region closest to you
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Configure Database Access**
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set user privileges to "Atlas admin"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ebookstore`
   - Replace `<username>` and `<password>` with your credentials

### Option B: Local MongoDB

1. **Install MongoDB Community Server**
   - Download from: https://www.mongodb.com/try/download/community
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB as a service (recommended)

2. **Verify Installation**
   ```bash
   mongod --version
   ```

3. **Start MongoDB Service**
   - Windows: Usually starts automatically as a service
   - Mac/Linux: 
     ```bash
     sudo systemctl start mongod
     ```

4. **Connection String**
   - Local: `mongodb://localhost:27017/ebookstore`

---

## Razorpay Setup

1. **Create Razorpay Account**
   - Go to https://razorpay.com/
   - Click "Sign Up" and create an account
   - Verify your email

2. **Get Test Keys**
   - Log in to Razorpay Dashboard
   - Go to Settings → API Keys
   - Under "Test Mode", click "Generate Test Key"
   - Copy both:
     - Key ID (starts with `rzp_test_`)
     - Key Secret (keep this secret!)

3. **Important Notes**
   - Use TEST keys for development
   - Never commit keys to version control
   - Switch to LIVE keys only for production

---

## Server Configuration

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- cors (cross-origin requests)
- dotenv (environment variables)
- razorpay (payment gateway)

### Step 3: Create Environment File

Create a file named `.env` in the `server` directory:

```bash
# Windows Command Prompt
type nul > .env

# Windows PowerShell
New-Item -Path .env -ItemType File

# Mac/Linux
touch .env
```

### Step 4: Configure Environment Variables

Open `.env` and add the following:

```env
# Server Port
PORT=5000

# MongoDB Connection
# For MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ebookstore?retryWrites=true&w=majority

# For Local MongoDB:
# MONGO_URI=mongodb://localhost:27017/ebookstore

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Razorpay Credentials (use your test keys)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYYYYYY
```

**Important:**
- Replace `username` and `password` in MONGO_URI with your MongoDB credentials
- Generate a secure JWT_SECRET (random string, 32+ characters)
- Add your actual Razorpay test keys

### Step 5: Seed the Database

Run the seed script to populate the database with 100 books:

```bash
node seedBooks.js
```

You should see:
```
Connected to MongoDB
Cleared existing books
100 sample books added successfully
```

### Step 6: Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

---

## Client Configuration

### Step 1: Navigate to Client Directory
```bash
cd ../client
# or from root: cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- react (UI library)
- react-router-dom (routing)
- axios (HTTP client)
- razorpay (payment SDK)
- qrcode (QR code generation)

### Step 3: Configure Razorpay in CheckoutPage

1. Open `src/CheckoutPage.js`
2. Find line with `key: 'rzp_test_your_key_id'`
3. Replace with your actual Razorpay Key ID:
   ```javascript
   key: 'rzp_test_XXXXXXXXXXXX', // Your actual key
   ```

### Step 4: Configure UPI ID (Optional)

In `CheckoutPage.js`, find:
```javascript
const upiId = 'merchant@upi';
```

Replace with your actual UPI ID if you want to accept UPI payments.

### Step 5: Start the Client

```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

---

## Running the Application

### Complete Startup Process

1. **Start MongoDB** (if using local installation)
   ```bash
   # Windows: Usually running as service
   # Mac/Linux:
   sudo systemctl start mongod
   ```

2. **Start the Server** (Terminal 1)
   ```bash
   cd server
   npm start
   ```
   
   Wait for: "Server running on port 5000" and "MongoDB connected successfully"

3. **Start the Client** (Terminal 2 - new terminal)
   ```bash
   cd client
   npm start
   ```
   
   Browser should open automatically at http://localhost:3000

### Verify Everything is Working

1. **Homepage loads** with books displayed
2. **Search functionality** works
3. **Click on a book** to view details
4. **Add to cart** works
5. **Register/Login** works
6. **Checkout** opens Razorpay popup (in test mode)

---

## Testing

### Create Test User

1. Go to http://localhost:3000/register
2. Create an account:
   - Username: testuser
   - Email: test@example.com
   - Password: password123

### Test Book Browsing

1. Browse books on homepage
2. Use search to find specific books
3. Filter by genre (if implemented)
4. Click on a book to view details

### Test Cart Functionality

1. Add multiple books to cart
2. Adjust quantities
3. Remove items
4. View cart total

### Test Checkout & Payment

1. Proceed to checkout
2. Use Razorpay test credentials:
   - **Test Card**: 4111 1111 1111 1111
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **Test UPI**: success@razorpay

3. Complete payment
4. Verify order appears in Order History

### Test Admin Features

1. Create admin user in MongoDB or update existing user:
   ```javascript
   // In MongoDB Compass or Shell:
   db.users.updateOne(
     { email: "test@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

2. Login with admin account
3. Go to "Admin Books"
4. Test CRUD operations:
   - Create new book
   - Edit existing book
   - Delete book

---

## Common Issues

### Issue: Port 5000 or 3000 already in use

**Solution:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Issue: MongoDB connection failed

**Symptoms:**
- "MongoDB connection error" in console
- "MONGO_URI not set" message

**Solutions:**
1. Verify MONGO_URI in `.env` file
2. Check MongoDB is running (for local)
3. For Atlas:
   - Verify IP is whitelisted
   - Check username/password
   - Ensure cluster is active

### Issue: JWT authentication not working

**Symptoms:**
- "Invalid token" errors
- Can't access protected routes

**Solutions:**
1. Verify JWT_SECRET is set in `.env`
2. Clear browser localStorage
3. Re-login

### Issue: Razorpay not loading

**Symptoms:**
- "Razorpay is not defined" error
- Payment popup doesn't open

**Solutions:**
1. Check Razorpay script in `public/index.html`
2. Verify Razorpay key in `CheckoutPage.js`
3. Clear browser cache

### Issue: Books not displaying

**Symptoms:**
- Empty homepage
- "Loading..." forever

**Solutions:**
1. Verify server is running
2. Check MongoDB has data: run `node seedBooks.js`
3. Check browser console for errors
4. Verify proxy in `client/package.json` is `"proxy": "http://localhost:5000"`

### Issue: CORS errors

**Symptoms:**
- "CORS policy" errors in browser console

**Solutions:**
1. Verify `cors()` is enabled in `server.js`
2. Restart both server and client
3. Check server is running on port 5000

### Issue: Payment verification failed

**Symptoms:**
- Payment completes but order not saved

**Solutions:**
1. Check Razorpay secret key in `.env`
2. Verify signature verification logic
3. Check server logs for errors

---

## Production Deployment Notes

Before deploying to production:

1. **Environment Variables**
   - Use production MongoDB URI
   - Switch to Razorpay LIVE keys
   - Generate new secure JWT_SECRET
   - Set NODE_ENV=production

2. **Security**
   - Enable HTTPS
   - Restrict CORS origins
   - Implement rate limiting
   - Add helmet.js for security headers

3. **Database**
   - Set up MongoDB backups
   - Create indexes for performance
   - Enable authentication

4. **Client Build**
   ```bash
   cd client
   npm run build
   ```

5. **Hosting Options**
   - Server: Heroku, DigitalOcean, AWS
   - Client: Netlify, Vercel, GitHub Pages
   - Database: MongoDB Atlas

---

## Additional Resources

- **React Documentation**: https://react.dev/
- **Express Documentation**: https://expressjs.com/
- **MongoDB Documentation**: https://docs.mongodb.com/
- **Razorpay Documentation**: https://razorpay.com/docs/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

---

## Getting Help

If you encounter issues not covered here:

1. Check browser console for errors
2. Check server terminal for errors
3. Review logs in MongoDB
4. Search for error messages online
5. Create an issue in the repository

---

**Congratulations! Your eBook Store is now set up and running! 🎉📚**
