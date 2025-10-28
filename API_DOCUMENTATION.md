# eBook Store API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
- [Authentication](#authentication)
- [Users](#users)
- [Books](#books)
- [Orders](#orders)
- [Payments](#payments)
- [Error Responses](#error-responses)

---

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Users

### Register User
**POST** `/api/users/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "johndoe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - User already exists or validation failed
- `500 Internal Server Error` - Server error

---

### Login User
**POST** `/api/users/login`

Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "johndoe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid email or password
- `500 Internal Server Error` - Server error

---

### Get User Profile
**GET** `/api/users/profile`

Get logged-in user's profile (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "username": "johndoe",
  "email": "john@example.com",
  "isAdmin": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## Books

### Get All Books
**GET** `/api/books`

Get all books with optional search and filter.

**Query Parameters:**
- `search` (optional) - Search by title or author
- `genre` (optional) - Filter by genre
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50)

**Example:**
```
GET /api/books?search=harry&genre=Fantasy&page=1&limit=10
```

**Response:** `200 OK`
```json
{
  "books": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "title": "Harry Potter and the Sorcerer's Stone",
      "author": "J.K. Rowling",
      "description": "A captivating Fantasy book by J.K. Rowling.",
      "price": 15.99,
      "genre": "Fantasy",
      "imageUrl": "https://images.unsplash.com/photo-1544947950...",
      "stock": 50,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

**Error Responses:**
- `500 Internal Server Error` - Server error

---

### Get Single Book
**GET** `/api/books/:id`

Get detailed information about a specific book.

**Parameters:**
- `id` - Book ID

**Example:**
```
GET /api/books/64a1b2c3d4e5f6g7h8i9j0k1
```

**Response:** `200 OK`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Harry Potter and the Sorcerer's Stone",
  "author": "J.K. Rowling",
  "description": "A captivating Fantasy book by J.K. Rowling.",
  "price": 15.99,
  "genre": "Fantasy",
  "imageUrl": "https://images.unsplash.com/photo-1544947950...",
  "stock": 50,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

---

### Create Book (Admin)
**POST** `/api/books`

Create a new book (Admin only, Protected).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "New Book Title",
  "author": "Author Name",
  "description": "Book description here",
  "price": 19.99,
  "genre": "Fiction",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 100
}
```

**Response:** `201 Created`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
  "title": "New Book Title",
  "author": "Author Name",
  "description": "Book description here",
  "price": 19.99,
  "genre": "Fiction",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 100,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated or not admin
- `400 Bad Request` - Validation error
- `500 Internal Server Error` - Server error

---

### Update Book (Admin)
**PUT** `/api/books/:id`

Update an existing book (Admin only, Protected).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` - Book ID

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated description",
  "price": 24.99,
  "genre": "Mystery",
  "imageUrl": "https://example.com/new-image.jpg",
  "stock": 75
}
```

**Response:** `200 OK`
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Updated Title",
  "author": "Updated Author",
  "description": "Updated description",
  "price": 24.99,
  "genre": "Mystery",
  "imageUrl": "https://example.com/new-image.jpg",
  "stock": 75,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated or not admin
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

---

### Delete Book (Admin)
**DELETE** `/api/books/:id`

Delete a book (Admin only, Protected).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Parameters:**
- `id` - Book ID

**Response:** `200 OK`
```json
{
  "message": "Book removed successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated or not admin
- `404 Not Found` - Book not found
- `500 Internal Server Error` - Server error

---

## Orders

### Get User Orders
**GET** `/api/orders`

Get all orders for the logged-in user (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "user": "64a1b2c3d4e5f6g7h8i9j0k1",
    "items": [
      {
        "book": "64a1b2c3d4e5f6g7h8i9j0k2",
        "title": "Harry Potter",
        "author": "J.K. Rowling",
        "price": 15.99,
        "quantity": 2
      }
    ],
    "totalAmount": 31.98,
    "paymentId": "pay_XXXXXXXXXX",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `500 Internal Server Error` - Server error

---

## Payments

### Create Razorpay Order
**POST** `/api/payments/create-order`

Create a Razorpay order for checkout (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 31.98,
  "items": [
    {
      "book": "64a1b2c3d4e5f6g7h8i9j0k2",
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "price": 15.99,
      "quantity": 2
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "id": "order_XXXXXXXXXX",
  "entity": "order",
  "amount": 3198,
  "amount_paid": 0,
  "amount_due": 3198,
  "currency": "INR",
  "receipt": null,
  "status": "created",
  "orderId": "64a1b2c3d4e5f6g7h8i9j0k4"
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Invalid amount or items
- `500 Internal Server Error` - Server or Razorpay error

---

### Verify Payment
**POST** `/api/payments/verify`

Verify Razorpay payment signature (Protected).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_XXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXX",
  "razorpay_signature": "signature_string_here",
  "orderId": "64a1b2c3d4e5f6g7h8i9j0k4"
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment verified successfully",
  "order": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "user": "64a1b2c3d4e5f6g7h8i9j0k1",
    "items": [...],
    "totalAmount": 31.98,
    "paymentId": "pay_XXXXXXXXXX",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `400 Bad Request` - Invalid signature or payment failed
- `404 Not Found` - Order not found
- `500 Internal Server Error` - Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request or validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. For production, restrict to specific domains.

---

## Testing with Postman/cURL

### Example: Register User (cURL)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Example: Get Books with Auth (cURL)
```bash
curl -X GET http://localhost:5000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example: Create Book (cURL)
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "description": "Description here",
    "price": 19.99,
    "genre": "Fiction",
    "stock": 100
  }'
```

---

## Webhooks (Future Enhancement)

Razorpay webhooks can be implemented to handle:
- Payment success notifications
- Payment failure notifications
- Refund notifications

**Webhook Endpoint:** `POST /api/payments/webhook`

---

## API Versioning

Current API version: v1 (implicit)

Future versions may be explicitly versioned: `/api/v2/...`

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Never expose JWT_SECRET or API keys**
3. **Implement rate limiting**
4. **Validate all input data**
5. **Use helmet.js for security headers**
6. **Keep dependencies updated**
7. **Implement proper error logging**

---

## Contact

For API support or questions:
- Create an issue in the repository
- Email: api-support@ebookstore.com

---

**Last Updated:** January 2024
**API Version:** 1.0.0
