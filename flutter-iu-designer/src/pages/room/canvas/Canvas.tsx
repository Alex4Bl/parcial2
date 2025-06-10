import { useRoomStore } from "../../../features/rooms/store/useRoomStore";
import { DraggableComponent } from "./DraggableComponent";
import { useCanvasPosition } from "../hooks/useCanvasPosition";
import { constrainPosition } from "../utils/position";
import type { CanvasProps } from "../types";

export const Canvas = ({ width = 375, height = 667 }: CanvasProps) => {
  const { views, activeViewId, updateComponentPosition } = useRoomStore();
  const { canvasRef, drop } = useCanvasPosition();
  const activeView = views.find((view) => view.id === activeViewId);

  return (
    <div
    
      ref={(el) => {
        canvasRef.current = el;
        drop(el);
      }}
      className="relative bg-white overflow-hidden rounded-[40px]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: "0 0 40px rgba(0,0,0,0.1)",
        border: "1px solid #e5e7eb",
        backgroundColor: activeView?.backgroundColor || "#ffffff",
      }}
    >
      
      {activeView?.components.map((comp) => (
        <DraggableComponent
          key={comp.id}
          component={comp}
          onMove={(id, x, y) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const { x: constrainedX, y: constrainedY } = constrainPosition(
              x,
              y,
              comp.width || 100,
              comp.height || 50,
              canvas.clientWidth,
              canvas.clientHeight
            );

            if (activeViewId) {
              updateComponentPosition(activeViewId, id, {
                x: constrainedX,
                y: constrainedY,
              });
            }
          }}
        />
      ))}
    </div>
  );
};
