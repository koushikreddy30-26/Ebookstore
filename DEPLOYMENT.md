# Deployment Guide for eBook Store

This guide covers deploying the eBook Store application to various platforms.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [Deploy Server (Backend)](#deploy-server-backend)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [DigitalOcean](#digitalocean)
- [Deploy Client (Frontend)](#deploy-client-frontend)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
- [Full Stack Deployment](#full-stack-deployment)
- [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- [x] Working local development setup
- [x] MongoDB Atlas account (for production database)
- [x] Razorpay LIVE credentials (for production payments)
- [x] Git repository (GitHub, GitLab, or Bitbucket)
- [x] Domain name (optional but recommended)

---

## Environment Configuration

### Production Environment Variables

Create production environment variables (do NOT commit to Git):

**Server (.env):**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ebookstore_prod?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_production_jwt_secret_key_minimum_32_chars
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_live_razorpay_secret
CLIENT_URL=https://yourdomain.com
```

**Important:**
- Use LIVE Razorpay keys (not test keys)
- Generate a new, secure JWT_SECRET
- Use production MongoDB Atlas connection
- Set CLIENT_URL to your actual frontend domain

---

## MongoDB Atlas Setup

1. **Create Production Cluster**
   - Log in to MongoDB Atlas
   - Create a new cluster (M0 Free tier or paid)
   - Name it: `ebookstore-production`

2. **Configure Database Access**
   - Create a production database user
   - Use a strong, unique password
   - Save credentials securely

3. **Configure Network Access**
   - Add your server's IP address
   - Or add `0.0.0.0/0` (allow from anywhere) - less secure

4. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` and `<dbname>` with your values

5. **Seed Production Database**
   ```bash
   # Update .env with production MONGO_URI
   node seedBooks.js
   ```

---

## Deploy Server (Backend)

### Option 1: Heroku

#### Step 1: Install Heroku CLI
```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
cd server
heroku create ebook-store-api
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set RAZORPAY_KEY_ID="rzp_live_XXXXXXXXXXXX"
heroku config:set RAZORPAY_KEY_SECRET="your_razorpay_secret"
heroku config:set CLIENT_URL="https://yourfrontend.vercel.app"
```

#### Step 5: Create Procfile
Create `server/Procfile`:
```
web: node server.js
```

#### Step 6: Deploy
```bash
git init  # if not already a git repo
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a ebook-store-api
git push heroku main
```

#### Step 7: Verify
```bash
heroku logs --tail
heroku open
```

Your API will be at: `https://ebook-store-api.herokuapp.com`

---

### Option 2: Railway

#### Step 1: Create Railway Account
- Go to https://railway.app/
- Sign up with GitHub

#### Step 2: New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select your repository
- Choose `server` directory

#### Step 3: Add Environment Variables
In Railway dashboard:
- Go to "Variables" tab
- Add all environment variables from above

#### Step 4: Deploy
- Railway auto-deploys on push to main branch
- Get your deployment URL from dashboard

---

### Option 3: DigitalOcean App Platform

#### Step 1: Create App
- Go to DigitalOcean
- Click "Create" → "Apps"
- Connect your GitHub repository

#### Step 2: Configure Build
- Source Directory: `server`
- Build Command: `npm install`
- Run Command: `npm start`

#### Step 3: Add Environment Variables
Add all environment variables in the "Environment Variables" section

#### Step 4: Deploy
- Click "Next" and review
- Click "Create Resources"

---

## Deploy Client (Frontend)

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy from Client Directory
```bash
cd client
vercel
```

#### Step 4: Configure Project
- Select "client" directory
- Framework preset: Create React App
- Build command: `npm run build`
- Output directory: `build`

#### Step 5: Set Environment Variables
Create `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-api.herokuapp.com
REACT_APP_RAZORPAY_KEY=rzp_live_XXXXXXXXXXXX
```

Update `CheckoutPage.js`:
```javascript
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_default';
// Use RAZORPAY_KEY instead of hardcoded key
```

#### Step 6: Update API Calls
Update `axios` base URL in all components:
```javascript
// Instead of relative URLs:
axios.get('/api/books')

// Use full URL:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.get(`${API_URL}/api/books`)
```

Or create an axios instance:

Create `client/src/api/axios.js`:
```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

export default instance;
```

Then import in components:
```javascript
import axios from './api/axios';
```

#### Step 7: Deploy to Production
```bash
vercel --prod
```

Your site will be at: `https://your-project.vercel.app`

---

### Option 2: Netlify

#### Step 1: Build Client
```bash
cd client
npm run build
```

#### Step 2: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 3: Login
```bash
netlify login
```

#### Step 4: Deploy
```bash
netlify deploy --prod
```

#### Step 5: Configure
- Publish directory: `build`
- Add environment variables in Netlify dashboard

#### Step 6: Add Redirects
Create `client/public/_redirects`:
```
/*    /index.html   200
```

This ensures React Router works correctly.

---

## Full Stack Deployment

### Deploy Both on Same Platform

#### Heroku Full Stack

1. **Prepare Project Structure**
   ```bash
   # Add to server/package.json scripts:
   "heroku-postbuild": "cd ../client && npm install && npm run build"
   ```

2. **Serve Static Files**
   Update `server/server.js`:
   ```javascript
   const path = require('path');

   // After all API routes
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../client/build/index.html'));
     });
   }
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Full stack deployment"
   git push heroku main
   ```

---

## Post-Deployment

### 1. Update CORS Settings

Update `server/server.js`:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
```

### 2. Enable HTTPS

- Most platforms provide HTTPS by default
- For custom domains, configure SSL certificates

### 3. Configure Custom Domain

#### Vercel
- Project Settings → Domains
- Add your domain
- Update DNS records

#### Heroku
- Dashboard → Settings → Domains
- Add custom domain
- Update DNS CNAME record

### 4. Test Everything

- [ ] User registration works
- [ ] Login works
- [ ] Browse books works
- [ ] Search works
- [ ] Add to cart works
- [ ] Checkout with Razorpay LIVE works
- [ ] Order history displays
- [ ] Admin features work

### 5. Monitor Logs

**Heroku:**
```bash
heroku logs --tail
```

**Vercel:**
- Dashboard → Deployments → View logs

**Railway:**
- Dashboard → Deployments → Logs

### 6. Set Up Error Monitoring

Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - Usage analytics

### 7. Performance Optimization

- Enable Gzip compression
- Add CDN for static assets
- Optimize images
- Implement caching
- Use lazy loading

### 8. Security Checklist

- [ ] Environment variables are secure
- [ ] CORS is restricted to your domain
- [ ] Rate limiting is enabled
- [ ] Helmet.js is configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection

### 9. Backup Strategy

- [ ] MongoDB Atlas automated backups enabled
- [ ] Regular database exports
- [ ] Code versioned in Git
- [ ] Environment variables documented securely

### 10. Update Documentation

Update README.md with:
- Production URL
- Live demo link
- Deployment instructions
- Contact information

---

## Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-server:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "ebook-store-api"
          heroku_email: "your-email@example.com"
          appdir: "server"

  deploy-client:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./client
```

---

## Rollback Strategy

If deployment fails:

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Vercel/Netlify
- Go to deployments dashboard
- Select previous working deployment
- Click "Promote to Production"

---

## Cost Estimation

### Free Tier (Development)
- MongoDB Atlas: Free (512MB)
- Heroku/Railway: Free with limitations
- Vercel/Netlify: Free (personal projects)
- **Total: $0/month**

### Production (Small Scale)
- MongoDB Atlas M10: $57/month
- Heroku Hobby: $7/month
- Vercel Pro: $20/month
- **Total: ~$84/month**

### Production (Medium Scale)
- MongoDB Atlas M20: $114/month
- Heroku Standard: $25/month
- Vercel Pro: $20/month
- CDN: $10/month
- **Total: ~$169/month**

---

## Support & Troubleshooting

### Common Deployment Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check build logs for errors

2. **Database Connection Fails**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure credentials are correct

3. **Environment Variables Not Working**
   - Verify they're set in platform dashboard
   - Restart application after setting
   - Check variable names match exactly

4. **CORS Errors in Production**
   - Update CORS origin to production URL
   - Ensure credentials are enabled
   - Check preflight requests

5. **Payment Integration Issues**
   - Verify using LIVE Razorpay keys
   - Test with small amount first
   - Check webhook configuration

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check error logs
- Monitor performance metrics
- Review security alerts

**Monthly:**
- Update dependencies
- Review and optimize database
- Check backup integrity
- Review analytics

**Quarterly:**
- Security audit
- Performance optimization
- User feedback review
- Feature planning

---

## Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Railway Documentation](https://docs.railway.app/)
- [DigitalOcean Documentation](https://docs.digitalocean.com/)

---

**Congratulations on deploying your eBook Store! 🚀**
