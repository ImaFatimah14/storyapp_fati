import { BASE_URL, VAPID_PUBLIC_KEY } from '../config';

const ENDPOINTS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  STORIES: `${BASE_URL}/stories`,
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/unsubscribe`,
};

// Register
export const register = async (name, email, password) => {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    const result = await response.json();
    if (!result.error && Notification.permission === 'granted') {
      new Notification('Notifikasi Laporan!', {
        body: 'Registrasi berhasil! Silakan login.',
        icon: '/icons/icon-192x192.png',
      });
    }
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!result.error && Notification.permission === 'granted') {
      new Notification('Notifikasi Laporan!', {
        body: 'Login berhasil! Selamat datang kembali.',
        icon: '/icons/icon-192x192.png',
      });
    }
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { error: true, message: 'Terjadi kesalahan jaringan. Coba lagi.' };
  }
};

// Get stories
export const getStories = async (token) => {
  try {
    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { error: true, message: error.message };
  }
};

// Post a story
export const postStory = async (token, { file, description, lat, lon }) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(ENDPOINTS.STORIES, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (!result.error && Notification.permission === 'granted') {
      new Notification('Notifikasi Laporan!', {
        body: 'Cerita berhasil ditambahkan!',
        icon: '/icons/icon-192x192.png',
      });
    }
    return result;
  } catch (error) {
    console.error('Post story error:', error);
    return { error: true, message: error.message };
  }
};

// Push Notification Subscription
export async function subscribePushNotification({ endpoint, keys }) {
  try {
    const response = await fetch(ENDPOINTS.SUBSCRIBE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint, keys }),
    });

    return await response.json();
  } catch (error) {
    console.error('subscribePushNotification error:', error);
    return { ok: false, message: error.message };
  }
}

// Push Notification Unsubscription
export async function unsubscribePushNotification({ endpoint }) {
  try {
    const response = await fetch(ENDPOINTS.UNSUBSCRIBE, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint }),
    });

    return await response.json();
  } catch (error) {
    console.error('unsubscribePushNotification error:', error);
    return { ok: false, message: error.message };
  }
}

export default {
  async addStory(formData) {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    return response.json();
  },
};
