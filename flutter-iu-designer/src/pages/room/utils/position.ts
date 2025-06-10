import type { Position } from "../../../features/rooms/store/types";

const GRID_SIZE = 8; // 8px grid

export const snapToGrid = (value: number): number => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const constrainPosition = (
  x: number,
  y: number,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number
): Position => {
  return {
    x: Math.max(0, Math.min(x, canvasWidth - (width || 0))),
    y: Math.max(0, Math.min(y, canvasHeight - (height || 0))),
  };
};

export const calculateDropPosition = (
  clientOffset: { x: number; y: number },
  canvasRect: DOMRect,
  itemWidth: number,
  itemHeight: number
): Position => {
  // Calcula la posición relativa al canvas
  const x = clientOffset.x - canvasRect.left;
  const y = clientOffset.y - canvasRect.top;

  // Asegura que el componente se mantenga dentro de los límites del canvas
  return constrainPosition(
    x,
    y,
    itemWidth,
    itemHeight,
    canvasRect.width,
    canvasRect.height
  );
};

export const isWithinBounds = (
  position: Position,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number
): boolean => {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x + width <= canvasWidth &&
    position.y + height <= canvasHeight
  );
};

// Helper to calculate the center position of a component within the canvas
export const calculateCenterPosition = (
  canvasWidth: number,
  canvasHeight: number,
  componentWidth: number,
  componentHeight: number
): Position => {
  return {
    x: Math.max(0, (canvasWidth - componentWidth) / 2),
    y: Math.max(0, (canvasHeight - componentHeight) / 2),
  };
};
