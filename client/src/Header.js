import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>
          EBOOKSTORE
        </Link>
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({getCartCount()})</Link>
        {user && <Link to="/orders">Order History</Link>}/Link>} {/* Add this link */}

        {user ? (
          <>
            {user.isAdmin && <Link to="/admin/books">Admin</Link>}
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
