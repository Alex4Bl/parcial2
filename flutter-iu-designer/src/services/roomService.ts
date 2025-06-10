import api from './api';

interface Room {
  _id: string;
  name: string;
  owner: string | {
    _id: string;
    name: string;
    email: string;
  };
  collaborators: string[] | {
    _id: string;
    name: string;
    email: string;
  }[];
  accessCode: string;
  views: any[];
  createdAt: string;
  updatedAt: string;
}

const roomService = {
  getRooms: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getRoomById: async (id: string): Promise<Room> => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (name: string): Promise<Room> => {
    const response = await api.post('/rooms', { name });
    console.log(response.data);
    
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<Room>): Promise<Room> => {
    const response = await api.put(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },

  shareRoom: async (id: string, email: string): Promise<any> => {
    const response = await api.post(`/rooms/${id}/share`, { email });
    return response.data;
  },

  joinRoom: async (accessCode: string): Promise<Room> => {
    const response = await api.post('/rooms/join', { accessCode });
    return response.data;
  }
};

export default roomService;