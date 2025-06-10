import { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useRoomStore } from "../../../features/rooms/store/useRoomStore";
import type { Component } from "../../../features/rooms/store/types";

interface DragItem {
  type: string;
  id?: string;
  width?: number;
  height?: number;
  properties?: Record<string, any>;
  x?: number;
  y?: number;
}

export const useCanvasPosition = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { activeViewId, addComponent, updateComponentPosition } =
    useRoomStore();
  const [initialOffset, setInitialOffset] = useState<{ x: number, y: number } | null>(null);
  const [initialPosition, setInitialPosition] = useState<{ x: number, y: number } | null>(null);

  const [, drop] = useDrop(
    () => ({
      accept: ["component", "canvas-item"],
      drop: (item: DragItem, monitor) => {
        const offset = monitor.getClientOffset();
        const canvas = canvasRef.current;

        if (!offset || !canvas || !activeViewId) return;

        const canvasRect = canvas.getBoundingClientRect();
        const itemWidth = item.width || 100;
        const itemHeight = item.height || 50;

        // Calcula la posición relativa al canvas
        let x = offset.x - canvasRect.left;
        let y = offset.y - canvasRect.top;

        // Si estamos arrastrando un componente existente, ajustamos por el offset inicial
        if (monitor.getItemType() === "canvas-item" && initialOffset && initialPosition) {
          x = initialPosition.x + (offset.x - initialOffset.x);
          y = initialPosition.y + (offset.y - initialOffset.y);
        }

        // Asegura que el componente se mantenga dentro de los límites
        const constrainedX = Math.max(
          0,
          Math.min(x, canvasRect.width - itemWidth)
        );
        const constrainedY = Math.max(
          0,
          Math.min(y, canvasRect.height - itemHeight)
        );

        if (monitor.getItemType() === "component") {
          const component: Component = {
            id: Date.now().toString(),
            type: item.type,
            x: constrainedX,
            y: constrainedY,
            width: itemWidth,
            height: itemHeight,
            properties: item.properties || {},
          };

          addComponent(activeViewId, component);
        } else if (monitor.getItemType() === "canvas-item" && item.id) {
          updateComponentPosition(activeViewId, item.id, {
            x: constrainedX,
            y: constrainedY,
          });
        }

        // Resetear los offsets
        setInitialOffset(null);
        setInitialPosition(null);

        return { x: constrainedX, y: constrainedY };
      },
      hover: (item: DragItem, monitor) => {
        const offset = monitor.getClientOffset();
        const canvas = canvasRef.current;

        if (
          !offset ||
          !canvas ||
          !activeViewId ||
          !monitor.isOver({ shallow: true })
        )
          return;

        const canvasRect = canvas.getBoundingClientRect();
        
        if (monitor.getItemType() === "canvas-item" && item.id) {
          // Guardar la posición inicial del cursor y del componente al comenzar el arrastre
          if (!initialOffset && item.x !== undefined && item.y !== undefined) {
            setInitialOffset({ x: offset.x, y: offset.y });
            setInitialPosition({ x: item.x, y: item.y });
            return;
          }

          // Si tenemos el offset inicial, calculamos la nueva posición basada en el movimiento relativo
          if (initialOffset && initialPosition) {
            const deltaX = offset.x - initialOffset.x;
            const deltaY = offset.y - initialOffset.y;
            
            const newX = initialPosition.x + deltaX;
            const newY = initialPosition.y + deltaY;
            
            // Aseguramos que el componente permanezca dentro del canvas
            const constrainedX = Math.max(
              0,
              Math.min(newX, canvasRect.width - (item.width || 100))
            );
            const constrainedY = Math.max(
              0,
              Math.min(newY, canvasRect.height - (item.height || 50))
            );
            
            updateComponentPosition(activeViewId, item.id, { 
              x: constrainedX, 
              y: constrainedY 
            });
          }
        }
      },
      // Añadir un manejador para cuando comienza el arrastre
      canDrop: (item, monitor) => {
        return true;
      },
    }),
    [activeViewId, addComponent, updateComponentPosition, initialOffset, initialPosition]
  );

  return { canvasRef, drop };
};
