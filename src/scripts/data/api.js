import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
};

export const register = async (name, email, password) => {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: true, message: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();

    return responseJson;
  } catch (error) {
    console.error('Login error:', error);
    return { error: true, message: 'Terjadi kesalahan jaringan. Coba lagi.' };
  }
};

export const getStories = async (token) => {
  try {
    const response = await fetch(ENDPOINTS.STORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return { error: true, message: error.message };
  }
};

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

    const responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error('Post story error:', error);
    return { error: true, message: error.message };
  }
};
