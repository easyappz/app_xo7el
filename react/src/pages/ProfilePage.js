import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/authService';
import './ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: ''
  });
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
        if (data.profile) {
          setFormData({
            firstName: data.profile.firstName || '',
            lastName: data.profile.lastName || '',
            bio: data.profile.bio || '',
            location: data.profile.location || ''
          });
        }
      } catch (err) {
        setError(err.error || 'Ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updatedProfile = await updateProfile(formData);
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
      setProfile((prev) => ({ ...prev, ...updatedProfile.profile }));
    } catch (err) {
      setError(err.error || 'Ошибка при обновлении профиля');
    }
  };

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
        {success && <div className="success-message">{success}</div>}
        {profile && (
          <div className="profile-info">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Имя пользователя:</strong> {profile.username}</p>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Имя:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Введите имя"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Фамилия:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Введите фамилию"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>О себе:</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Расскажите о себе"
                    className="form-textarea"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Местоположение:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Введите местоположение"
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <Button type="submit" variant="primary">Сохранить</Button>
                  <Button type="button" variant="secondary" onClick={handleEditToggle}>
                    Отмена
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <p><strong>Имя:</strong> {formData.firstName || 'Не указано'}</p>
                <p><strong>Фамилия:</strong> {formData.lastName || 'Не указано'}</p>
                <p><strong>О себе:</strong> {formData.bio || 'Не указано'}</p>
                <p><strong>Местоположение:</strong> {formData.location || 'Не указано'}</p>
                <Button variant="primary" onClick={handleEditToggle}>
                  Редактировать профиль
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="profile-actions">
          <Button variant="secondary" onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </Card>
    </Layout>
  );
};

export default ProfilePage;
