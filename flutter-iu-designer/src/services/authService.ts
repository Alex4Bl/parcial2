import api from './api';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

// Configurar interceptor para incluir el token en todas las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    
    // Guardar el token y la información del usuario en localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<any> => {
    try {
      // Primero intentamos obtener del localStorage
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        return JSON.parse(userFromStorage);
      }
      
      // Si no está en localStorage, lo obtenemos del servidor
      const response = await api.get('/auth/me');
      
      // Actualizamos el localStorage con la información más reciente
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return response.data;
    } catch (error: any) {
      // Si hay un error 401, limpiamos el localStorage y redirigimos al login
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  updateUserProfile: async (userData: UserUpdateData): Promise<any> => {
    const response = await api.put('/auth/profile', userData);
    
    // Actualizamos la información del usuario en localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.delete('/auth/account', { data: { password } });
    // Limpiamos el localStorage después de eliminar la cuenta
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
  
  getStoredUser: (): any => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

export default authService;