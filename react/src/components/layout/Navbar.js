import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ФотоОценка
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/profile" className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                Профиль
              </Link>
              <Button variant="danger" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}>
                Вход
              </Link>
              <Link to="/register" className={`navbar-link ${location.pathname === '/register' ? 'active' : ''}`}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
