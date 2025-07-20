import React from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout>
      <Card title="Добро пожаловать на ФотоОценка">
        <div className="home-content">
          <p>Оценивайте фотографии и делитесь своими впечатлениями!</p>
          {user ? (
            <Button variant="primary" onClick={() => navigate('/profile')}>
              Перейти в профиль
            </Button>
          ) : (
            <div className="home-buttons">
              <Button variant="primary" onClick={() => navigate('/login')}>
                Войти
              </Button>
              <Button variant="secondary" onClick={() => navigate('/register')}>
                Зарегистрироваться
              </Button>
            </div>
          )}
        </div>
      </Card>
    </Layout>
  );
};

export default HomePage;
