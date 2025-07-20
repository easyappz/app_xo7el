import { instance } from '../api/axios';

// Регистрация нового пользователя
export const register = async (data) => {
  try {
    const response = await instance.post('/api/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};

// Вход пользователя
export const login = async (data) => {
  try {
    const response = await instance.post('/api/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};

// Выход пользователя (на клиенте удаляем токен)
export const logout = async () => {
  try {
    await instance.post('/api/logout');
    return { message: 'Выход успешен' };
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};

// Запрос на восстановление пароля
export const forgotPassword = async (email) => {
  try {
    const response = await instance.post('/api/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};

// Сброс пароля с токеном
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await instance.post('/api/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};

// Получение профиля пользователя
export const getProfile = async () => {
  try {
    const response = await instance.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Ошибка сервера' };
  }
};
