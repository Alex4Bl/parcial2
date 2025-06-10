import { create } from 'zustand';
import roomService from '../../../services/roomService';
import { 
  sendComponentUpdate, 
  sendComponentPosition, 
  sendComponentProperties,
  sendViewBackground,
  sendComponentAdd,
  sendComponentRemove
} from '../../../services/socketService';
import { devtools } from "zustand/middleware";
import type { RoomState, RoomActions } from "./types";

export interface RoomStore extends RoomState, RoomActions {
  updateComponentSize: (
    viewId: string,
    componentId: string,
    size: { width: number; height: number }
  ) => void;
  updateViewBackground: (viewId: string, backgroundColor: string) => void;
  loadRoom: (roomId: string) => Promise<void>;
  saveRoom: () => Promise<void>;
  roomId?: string;
  roomName?: string;
  isLoading?: boolean;
  error?: string | null;
  roomCache: Record<string, any>;
}

export const useRoomStore = create<RoomStore>()(
  devtools((set, get) => ({
    views: [{ id: "main", name: "Main View", components: [] }],
    activeViewId: "main",
    selectedComponentId: null,
    room: null,
    isLoading: false,
    error: null,
    roomCache: {}, // Caché para almacenar datos de cada sala

    setRoom: (room) => set((state) => ({
      ...state,
      room,
      views: room?.views || state.views,
      activeViewId: room?.views?.[0]?.id || state.activeViewId
    })),
    
    setViews: (views) => set({ views }),
    
    setActiveViewId: (id: string | null) =>
      set((state) => ({
        ...state,
        activeViewId: id,
      })),

    setActiveView: (id) => set({ activeViewId: id }),

    setSelectedComponent: (id) => set({ selectedComponentId: id }),

    addView: (name) => {
      const id = `view-${Date.now()}`;
      set((state) => ({
        views: [
          ...state.views,
          {
            id,
            name: name || `View ${state.views.length + 1}`,
            components: [],
          },
        ],
        activeViewId: id,
      }));
    },

    removeView: (id) =>
      set((state) => ({
        views: state.views.filter((v) => v.id !== id),
        activeViewId: state.activeViewId === id ? "main" : state.activeViewId,
        selectedComponentId: null,
      })),

    updateViewName: (id, name) =>
      set((state) => ({
        views: state.views.map((view) =>
          view.id === id ? { ...view, name } : view
        ),
      })),

    updateViewBackground: (viewId: string, backgroundColor: string) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId ? { ...view, backgroundColor } : view
        ),
      }));
      
      if (roomId) {
        sendViewBackground(roomId, viewId, backgroundColor);
      }
    },

    addComponent: (viewId, component) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? { ...view, components: [...view.components, component] }
            : view
        ),
        selectedComponentId: component.id,
      }));
      
      if (roomId) {
        sendComponentAdd(roomId, viewId, component);
      }
    },

    removeComponent: (viewId, componentId) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? {
                ...view,
                components: view.components.filter((c) => c.id !== componentId),
              }
            : view
        ),
        selectedComponentId:
          state.selectedComponentId === componentId
            ? null
            : state.selectedComponentId,
      }));
      
      if (roomId) {
        sendComponentRemove(roomId, viewId, componentId);
      }
    },

    updateComponent: (viewId, componentId, updates) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? {
                ...view,
                components: view.components.map((comp) =>
                  comp.id === componentId ? { ...comp, ...updates } : comp
                ),
              }
            : view
        ),
      }));
      
      if (roomId) {
        sendComponentUpdate(roomId, viewId, componentId, updates);
      }
    },

    updateComponentPosition: (viewId, componentId, position) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? {
                ...view,
                components: view.components.map((comp) =>
                  comp.id === componentId
                    ? { ...comp, x: position.x, y: position.y }
                    : comp
                ),
              }
            : view
        ),
      }));
      
      if (roomId) {
        sendComponentPosition(roomId, viewId, componentId, position);
      }
    },

    updateComponentProperties: (viewId, componentId, properties) => {
      const { roomId } = get();
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? {
                ...view,
                components: view.components.map((comp) =>
                  comp.id === componentId
                    ? {
                        ...comp,
                        properties: { ...comp.properties, ...properties },
                      }
                    : comp
                ),
              }
            : view
        ),
      }));
      
      if (roomId) {
        sendComponentProperties(roomId, viewId, componentId, properties);
      }
    },

    updateComponentSize: (viewId, componentId, size) =>
      set((state) => ({
        views: state.views.map((view) =>
          view.id === viewId
            ? {
                ...view,
                components: view.components.map((comp) =>
                  comp.id === componentId ? { ...comp, ...size } : comp
                ),
              }
            : view
        ),
      })),
      
    // Cargar sala desde el backend con caché
    loadRoom: async (roomId) => {
      set({ isLoading: true, error: null });
      
      try {
        // Verificar si la sala ya está en caché
        const cachedRoom = get().roomCache[roomId];
        
        if (cachedRoom) {
          // Usar datos de caché
          set({
            roomId: cachedRoom._id,
            roomName: cachedRoom.name,
            views: cachedRoom.views,
            activeViewId: cachedRoom.views[0]?.id || null,
            selectedComponentId: null,
            isLoading: false,
            error: null,
            room: {
              ...cachedRoom,
              id: cachedRoom._id
            }
          });
        } else {
          // Cargar desde el servidor
          const room = await roomService.getRoomById(roomId);
          
          // Guardar en caché
          set(state => ({
            roomId: room._id,
            roomName: room.name,
            views: room.views,
            activeViewId: room.views[0]?.id || null,
            selectedComponentId: null,
            isLoading: false,
            error: null,
            room: {
              ...room,
              id: room._id
            },
            roomCache: {
              ...state.roomCache,
              [roomId]: room
            }
          }));
        }
      } catch (error) {
        set({
          isLoading: false,
          error: 'Error al cargar la sala'
        });
      }
    },
    
    // Guardar cambios en la sala y actualizar caché
    saveRoom: async () => {
      const { roomId, roomName, views } = get();
      
      if (!roomId) return;
      
      try {
        const updatedRoom = await roomService.updateRoom(roomId, {
          name: roomName,
          views
        });
        
        // Actualizar caché
        set(state => ({
          roomCache: {
            ...state.roomCache,
            [roomId]: updatedRoom
          }
        }));
      } catch (error) {
        set({
          error: 'Error al guardar la sala'
        });
      }
    }
  }))
);

export default useRoomStore;
