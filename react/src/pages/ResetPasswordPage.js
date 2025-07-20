import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { resetPassword } from '../services/authService';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
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
      await resetPassword(token, newPassword);
      setSuccessMessage('Пароль успешно изменен. Теперь вы можете войти с новым паролем.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.error || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Card title="Сброс пароля">
        <form onSubmit={handleSubmit}>
          <ErrorMessage message={error} />
          {successMessage && <div className="success-message">{successMessage}</div>}
          {!successMessage && (
            <>
              <Input
                type="password"
                name="newPassword"
                label="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
                required
              />
              <Button type="submit" variant="primary" disabled={loading} fullWidth>
                {loading ? 'Загрузка...' : 'Сбросить пароль'}
              </Button>
            </>
          )}
        </form>
        <div className="reset-footer">
          <Button variant="secondary" onClick={() => navigate('/login')}>
            Вернуться ко входу
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default ResetPasswordPage;
