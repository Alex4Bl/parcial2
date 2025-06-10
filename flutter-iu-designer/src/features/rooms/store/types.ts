export interface Position {
  x: number;
  y: number;
}

export interface ComponentProperties {
  text?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  padding?: string;
  src?: string;
  rows?: number;
  columns?: number;
  borderColor?: string;
  textColor?: string;
  checked?: boolean;
  items?: string[];
  placeholder?: string;
  borderWidth?: number;
  borderRadius?: number;
  aspectRatio?: string;
  objectFit?: "fill" | "cover" | "contain"; //image
}

export interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: ComponentProperties;
}

export interface View {
  id: string;
  name: string;
  backgroundColor?: string;
  components: Component[];
}

export interface Room {
  _id: string;   // Added _id property multisala
  id: string;
  name: string;
  views: View[]; 
  // ... other room properties
}

export interface RoomState {
  views: View[];
  activeViewId: string | null;
  selectedComponentId: string | null;
  room: Room | null; // Changed from activeRoom to room
}

export interface RoomActions {
  setRoom: (room: Room | null) => void;
  setViews: (views: View[]) => void;
  setActiveViewId: (id: string | null) => void;

  setActiveView: (id: string) => void;
  setSelectedComponent: (id: string | null) => void;
  addView: (name?: string) => void;
  removeView: (id: string) => void;
  updateViewName: (id: string, name: string) => void;
  addComponent: (viewId: string, component: Component) => void;
  removeComponent: (viewId: string, componentId: string) => void;
  updateComponent: (
    viewId: string,
    componentId: string,
    updates: Partial<Component>
  ) => void;
  updateComponentPosition: (
    viewId: string,
    componentId: string,
    position: Position
  ) => void;
  updateComponentProperties: (
    viewId: string,
    componentId: string,
    properties: Partial<ComponentProperties>
  ) => void;
}

export interface RoomStore {
  views: View[];
  activeViewId: string | null;
  selectedComponentId: string | null;
  room: Room | null; // Changed from activeRoom to room
  updateViewBackground: (viewId: string, backgroundColor: string) => void;

  setRoom: (room: Room | null) => void;
  setViews: (views: View[]) => void;
  setActiveViewId: (id: string | null) => void;
}
