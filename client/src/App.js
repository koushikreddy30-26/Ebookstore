import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import Header from './Header';
import HomePage from './HomePage';
import BookPage from './BookPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderHistoryPage from './OrderHistoryPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import BookListPage from './BookListPage';
import BookEditPage from './BookEditPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<BookPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin/books" element={<BookListPage />} />
                <Route path="/admin/book/:id/edit" element={<BookEditPage />} />
                <Route path="/admin/book/new" element={<BookEditPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
