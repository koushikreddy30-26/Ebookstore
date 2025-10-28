# eBook Store - Full Stack MERN Application

A comprehensive eBook store built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, shopping cart, payment integration, and admin panel.

## Features

### User Features
- 📚 Browse 100+ books across multiple genres
- 🔍 Search and filter books by title, author, or genre
- 🛒 Shopping cart functionality
- 💳 Secure payment processing with Razorpay
- 📱 UPI QR code payment option
- 📋 Order history tracking
- 🔐 User authentication (register/login)

### Admin Features
- ➕ Add new books to the inventory
- ✏️ Edit existing book details
- 🗑️ Delete books from the catalog
- 📊 Manage book stock and pricing

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Razorpay** - Payment gateway integration

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **QRCode** - UPI QR code generation

## Project Structure
```
ebookstore/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html     # HTML template with Razorpay script
│   └── src/
│       ├── App.js         # Main app component with routing
│       ├── AuthContext.js # Authentication context
│       ├── CartContext.js # Shopping cart context
│       ├── Header.js      # Navigation header
│       ├── HomePage.js    # Book listing page
│       ├── BookCard.js    # Individual book card component
│       ├── BookPage.js    # Book details page
│       ├── CartPage.js    # Shopping cart page
│       ├── CheckoutPage.js # Checkout with Razorpay
│       ├── OrderHistoryPage.js # User order history
│       ├── LoginPage.js   # Login page
│       ├── RegisterPage.js # Registration page
│       ├── BookListPage.js # Admin book management
│       ├── BookEditPage.js # Admin book editor
│       ├── SearchBox.js   # Search component
│       └── index.css      # Global styles
└── server/                # Node.js backend
    ├── models/
    │   ├── User.js        # User model
    │   ├── Book.js        # Book model
    │   └── Order.js       # Order model
    ├── controllers/
    │   ├── userController.js    # User logic
    │   ├── bookController.js    # Book logic
    │   ├── orderController.js   # Order logic
    │   └── paymentController.js # Payment logic
    ├── routes/
    │   ├── userRoutes.js   # User endpoints
    │   ├── bookRoutes.js   # Book endpoints
    │   ├── orderRoutes.js  # Order endpoints
    │   └── paymentRoutes.js # Payment endpoints
    ├── middleware/
    │   └── authMiddleware.js # JWT authentication
    ├── seedBooks.js        # Database seeding script
    ├── server.js           # Express server setup
    └── .env                # Environment variables
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payment integration)

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd ebookstore
```

### Step 2: Server Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ebookstore
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ebookstore

JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Seed the database with 100 books:
```bash
node seedBooks.js
```

5. Start the server:
```bash
npm start
# Or for development with auto-restart:
npm run dev
```

Server will run on `http://localhost:5000`

### Step 3: Client Setup

1. Navigate to client directory (from root):
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Update Razorpay key in `CheckoutPage.js`:
   - Open `src/CheckoutPage.js`
   - Replace `'rzp_test_your_key_id'` with your actual Razorpay test key
   - Update UPI ID in `merchant@upi` with your actual UPI ID

4. Start the React development server:
```bash
npm start
```

Client will run on `http://localhost:3000`

## Usage Guide

### For Users

1. **Browse Books**
   - Visit the homepage to see all available books
   - Use the search box to find specific books
   - Click on any book to view details

2. **Add to Cart**
   - Click "Add to Cart" on any book
   - Adjust quantities in the cart page
   - View cart total

3. **Checkout**
   - Click "Checkout" in the cart
   - Login if not already authenticated
   - Choose payment method:
     - Pay with Razorpay (card, UPI, netbanking)
     - Scan UPI QR code with any UPI app

4. **View Orders**
   - Click "Order History" in the header
   - View all past orders with details

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to "Admin Books" in the header

2. **Manage Books**
   - View all books with stock information
   - Click "Edit" to modify book details
   - Click "Delete" to remove books
   - Click "Add New Book" to create new entries

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Books
- `GET /api/books` - Get all books (with search/filter)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create order (protected)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment signature

## Environment Variables

### Server (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  createdAt: Date
}
```

### Book Model
```javascript
{
  title: String (required),
  author: String (required),
  description: String,
  price: Number (required),
  genre: String (required),
  imageUrl: String,
  stock: Number (default: 0),
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    book: ObjectId (ref: Book),
    title: String,
    author: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: Number (required),
  paymentId: String,
  status: String (enum: pending, completed, failed),
  createdAt: Date
}
```

## Testing Razorpay Integration

1. Use Razorpay test mode credentials
2. Test card number: `4111 1111 1111 1111`
3. Any future CVV and expiry date
4. Test UPI ID: `success@razorpay`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check if IP is whitelisted in MongoDB Atlas
- Verify credentials in connection string

### Razorpay Payment Issues
- Verify Razorpay keys are correct (test vs live mode)
- Check if Razorpay script is loaded in index.html
- Ensure webhook signature verification is working

### CORS Issues
- Server should have CORS enabled (already configured)
- Client proxy is set to `http://localhost:5000`

### Port Already in Use
```bash
# Kill process on port 5000 (server)
npx kill-port 5000

# Kill process on port 3000 (client)
npx kill-port 3000
```

## Future Enhancements

- [ ] Book reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced filtering (price range, publication date)
- [ ] Book recommendations
- [ ] Email notifications for orders
- [ ] PDF/eBook file downloads
- [ ] Admin analytics dashboard
- [ ] Multi-currency support
- [ ] Guest checkout option

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue in the repository
- Email: support@ebookstore.com

## Acknowledgments

- Book data sourced from various public domain collections
- Images from Unsplash
- Payment integration powered by Razorpay
- Icons and UI inspiration from modern eCommerce platforms

---

**Happy Reading! 📚**
