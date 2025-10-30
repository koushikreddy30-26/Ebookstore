# Deployment to Render - TODO List

## Step 1: Prepare GitHub Repository
- [x] Commit and push latest changes to GitHub (done)

## Step 2: Deploy Backend (Web Service)
- [ ] Create a new Web Service on Render.com
- [ ] Connect your GitHub repository: https://github.com/koushikreddy30-26/Ebookstore.git
- [ ] Set Root Directory: `server`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add Environment Variables:
  - NODE_ENV: production
  - MONGO_URI: your_mongodb_atlas_connection_string
  - JWT_SECRET: your_secure_jwt_secret
  - CLIENT_URL: https://your-frontend-render-url.onrender.com (update after frontend deploy)
- [ ] Deploy the service

## Step 3: Deploy Frontend (Static Site)
- [ ] Create a new Static Site on Render.com
- [ ] Connect the same GitHub repository
- [ ] Set Root Directory: `client`
- [ ] Set Build Command: `npm run build`
- [ ] Set Publish Directory: `build`
- [ ] Add Environment Variables:
  - REACT_APP_API_URL: https://your-backend-render-url.onrender.com
  - [x] REACT_APP_MERCHANT_UPI_ID: your_upi_id@upi (replace with your actual UPI ID)
- [ ] Deploy the site

## Step 4: Update Backend CLIENT_URL
- [ ] After frontend deploys, update CLIENT_URL in backend environment variables with the actual frontend URL

## Step 5: Test Deployment
- [ ] Verify backend API endpoints work (e.g., https://your-backend-url.onrender.com/api/books)
- [ ] Verify frontend loads and connects to backend
- [ ] Test user registration, login, book browsing, cart, checkout with UPI QR code, and COD

## Notes
- Ensure MongoDB Atlas allows connections from Render IPs (0.0.0.0/0)
- Use your actual UPI ID for REACT_APP_MERCHANT_UPI_ID
- Monitor logs in Render dashboard for any errors
- Razorpay has been removed; only UPI and COD payments are available
