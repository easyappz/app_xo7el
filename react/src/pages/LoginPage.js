import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      authLogin(data.user, data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Card title="Вход">
        <form onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          <Input
            type="email"
            name="email"
            label="Электронная почта"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            required
          />
          <Input
            type="password"
            name="password"
            label="Пароль"
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            required
          />
          <Button type="submit" variant="primary" disabled={loading} fullWidth>
            {loading ? 'Загрузка...' : 'Войти'}
          </Button>
        </form>
        <div className="login-footer">
          <Button variant="secondary" onClick={() => navigate('/forgot-password')}>
            Забыли пароль?
          </Button>
          <span>Нет аккаунта?</span>
          <Button variant="secondary" onClick={() => navigate('/register')}>
            Зарегистрироваться
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default LoginPage;
