export interface Position {
  x: number;
  y: number;
}

export interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: Record<string, any>;
}

export interface View {
  id: string;
  name: string;
  backgroundColor?: string;
  components: Component[];
}

export interface CanvasProps {
  width?: number;
  height?: number;
}

export interface DraggableComponentProps {
  component: Component;
  onMove: (id: string, x: number, y: number) => void;
}
