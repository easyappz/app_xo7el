import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(formData);
      login(data.user, data.token);
      navigate('/profile');
    } catch (err) {
      setError(err.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Card title="Регистрация">
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
            type="text"
            name="username"
            label="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
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
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </Button>
        </form>
        <div className="register-footer">
          <span>Уже есть аккаунт?</span>
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Войти
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
