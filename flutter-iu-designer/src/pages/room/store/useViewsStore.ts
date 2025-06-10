import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
}

interface View {
  id: string;
  name: string;
  components: Component[];
  backgroundColor?: string;
}

interface ViewsStore {
  views: View[];
  activeViewId: string;
  setActiveView: (id: string) => void;
  addView: () => void;
  removeView: (id: string) => void;
  addComponent: (viewId: string, component: Component) => void;
  updateComponentPosition: (viewId: string, componentId: string, x: number, y: number) => void;
}

export const useViewsStore = create<ViewsStore>()(
  devtools(
    (set) => ({
      views: [{ id: 'main', name: 'Main View', components: [] }],
      activeViewId: 'main',
      
      setActiveView: (id) => set({ activeViewId: id }),
      
      addView: () => {
        const id = `view-${Date.now()}`;
        set((state) => ({
          views: [...state.views, { id, name: `View ${id}`, components: [] }],
          activeViewId: id,
        }));
      },
      
      removeView: (id) => 
        set((state) => ({
          views: state.views.filter((v) => v.id !== id),
          activeViewId: state.activeViewId === id ? 'main' : state.activeViewId,
        })),
      
      addComponent: (viewId, component) =>
        set((state) => ({
          views: state.views.map((view) =>
            view.id === viewId
              ? { ...view, components: [...view.components, component] }
              : view
          ),
        })),

      updateComponentPosition: (viewId, componentId, x, y) => 
        set((state) => ({
          views: state.views.map((view) =>
            view.id === viewId
              ? {
                  ...view,
                  components: view.components.map((comp) =>
                    comp.id === componentId
                      ? { ...comp, x, y }
                      : comp
                  ),
                }
              : view
          ),
        })),
    })
  )
);