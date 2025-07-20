import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/authService';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      setError('');
      setLoading(true);
      try {
        const data = await getProfile();
        setProfile(data.user);
      } catch (err) {
        setError(err.error || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Загрузка...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card title="Профиль пользователя">
        <ErrorMessage message={error} />
        {profile && (
          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Имя пользователя:</strong> {profile.username}</p>
          </div>
        )}
        <div className="profile-actions">
          <Button variant="primary" onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default ProfilePage;
