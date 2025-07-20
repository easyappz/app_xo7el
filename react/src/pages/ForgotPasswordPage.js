import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { forgotPassword } from '../services/authService';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setSuccessMessage('Письмо с инструкцией по восстановлению пароля отправлено на ваш email.');
      // В реальном приложении здесь бы не показывали токен, но для простоты отображаем его в консоли
      console.log('Reset Token:', data.resetToken);
    } catch (err) {
      setError(err.error || 'Ошибка при отправке запроса на восстановление пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Card title="Восстановление пароля">
        <form onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          {successMessage && <div className="success-message">{successMessage}</div>}
          {!successMessage && (
            <>
              <Input
                type="email"
                name="email"
                label="Электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                required
              />
              <Button type="submit" variant="primary" disabled={loading} fullWidth>
                {loading ? 'Загрузка...' : 'Отправить'}
              </Button>
            </>
          )}
        </form>
        <div className="forgot-footer">
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Вернуться ко входу
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default ForgotPasswordPage;
