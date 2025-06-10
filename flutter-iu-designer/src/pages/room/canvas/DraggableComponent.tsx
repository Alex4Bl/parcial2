import { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { useRoomStore } from "../../../features/rooms/store/useRoomStore";
import type { Component } from "../../../features/rooms/store/types";
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import '../../../styles/resizable.css';

interface DraggableComponentProps {
  component: Component;
  onMove: (id: string, x: number, y: number) => void;
}

export const DraggableComponent = ({
  component,
  onMove,
}: DraggableComponentProps) => {
  const { 
    setSelectedComponent, 
    activeViewId,
    updateComponentProperties,
    updateComponentSize 
  } = useRoomStore();
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "canvas-item",
      item: {
        id: component.id,
        type: component.type,
        width: component.width || 100,
        height: component.height || 50,
        x: component.x,
        y: component.y,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: true,
      end: (_, monitor) => {
        const dropResult = monitor.getDropResult() as {
          x: number;
          y: number;
        } | null;
        if (monitor.didDrop() && dropResult) {
          onMove(component.id, dropResult.x, dropResult.y);
        }
      },
    }),
    [component, onMove]
  );

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  const defaultStyle = {
    position: "absolute" as const,
    left: `${component.x}px`,
    top: `${component.y}px`,
    width: component.width ? `${component.width}px` : undefined,
    height: component.height ? `${component.height}px` : undefined,
    color: component.properties?.color,
    backgroundColor: (() => {
      switch (component.type) {
        case "ellipse":
        case "button":
        case "container":
          return "transparent";
        case "table":
          return "#ffffff";
        default:
          return component.properties?.backgroundColor;
      }
    })(),

    fontSize: component.properties?.fontSize
      ? `${component.properties.fontSize}px`
      : undefined,
    padding: component.properties?.padding,
    border: isDragging ? "2px dashed #60a5fa" : "none",
    opacity: isDragging ? 0.7 : 1,
    transition: isDragging ? "none" : "all 0.2s ease",
    touchAction: "none" as const,
    cursor: "move",
    zIndex: isDragging ? 1000 : 1,
    transform: "translate(0, 0)", // Esto ayuda con el posicionamiento preciso
    userSelect: "none" as const,
  };

  return (
    <ResizableBox
      width={component.width || 100}
      height={component.height || 50}
      onResize={(_, { size }) => {
        if (activeViewId && component.id) {
          updateComponentSize(activeViewId, component.id, {
            width: size.width,
            height: size.height
          });
        }
      }}
      minConstraints={[50, 30]}
      maxConstraints={[800, 600]}
      resizeHandles={['se', 'sw', 'ne', 'nw', 'e', 'w', 's', 'n']}
      handle={<div className="custom-handle" />}
    >
      <div
        ref={dragRef}
        className="absolute rounded"
        // className="rounded"
        style={{
          ...defaultStyle,
          width: '100%',
          height: '100%',
          outline: isDragging ? "2px dashed #60a5fa" : "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component.id);
        }}
      >
        {component.type === "text" && (
          <p className="p-2">{component.properties?.text || "Text"}</p>
        )}
        {component.type === "button" && (
          <button
            className="px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: component.properties?.backgroundColor || "#4F46E5",
              color: component.properties?.color || "white",
              fontSize: `${component.properties?.fontSize || 14}px`,
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
              border: "none",
              transform: "translateY(0)",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {component.properties?.text || "Button"}
          </button>
        )}
        {component.type === "image" && (
          <div 
            className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded relative overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {component.properties?.src ? (
              <img
                src={component.properties.src}
                alt={component.properties.text || "Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                <span className="text-gray-400 text-sm mb-2">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && activeViewId && component.id) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateComponentProperties(activeViewId, component.id, {
                          ...component.properties,
                          src: event.target?.result as string
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        )}
        {component.type === "container" && (
          <div
            className="border-2 border-dashed rounded-lg"
            style={{
              borderColor: component.properties?.color || "#E5E7EB",
              backgroundColor:
                component.properties?.backgroundColor || "transparent",
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {component.type === "table" && (
          <table className="w-full border-collapse bg-white shadow-sm text-[10px]">
            <thead>
              {Array(1)
                .fill(0)
                .map((_, rowIndex) => (
                  <tr key={`header-${rowIndex}`}>
                    {Array(component.properties?.columns || 3)
                      .fill(0)
                      .map((_, colIndex) => (
                        <th
                          key={`header-${colIndex}`}
                          className="border p-0.5 transition-colors"
                          style={{
                            borderColor:
                              component.properties?.borderColor || "#e5e7eb",
                            color: component.properties?.textColor || "#111827",
                            fontSize: `${component.properties?.fontSize || 8}px`,
                            backgroundColor: "#f8fafc",
                            fontWeight: 600,
                            height: "16px",
                          }}
                        >
                          H{colIndex + 1}
                        </th>
                      ))}
                  </tr>
                ))}
            </thead>
            <tbody>
              {Array(component.properties?.rows || 2)
                .fill(0)
                .map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array(component.properties?.columns || 3)
                      .fill(0)
                      .map((_, colIndex) => (
                        <td
                          key={colIndex}
                          className="border p-0.5"
                          style={{
                            borderColor:
                              component.properties?.borderColor || "#e5e7eb",
                            color: component.properties?.textColor || "#374151",
                            fontSize: `${component.properties?.fontSize || 8}px`,
                            backgroundColor: "#ffffff",
                            height: "16px",
                            minWidth: "30px",
                          }}
                        >
                          {rowIndex + 1}-{colIndex + 1}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {component.type === "checkbox" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded text-indigo-600"
              defaultChecked={component.properties?.checked}
            />
            <span
              style={{
                color: component.properties?.textColor,
                fontSize: `${component.properties?.fontSize}px`,
              }}
            >
              {component.properties?.text}
            </span>
          </label>
        )}
        {component.type === "listbox" && (
          <select
            className="w-full border rounded"
            style={{
              borderColor: component.properties?.borderColor,
              backgroundColor: component.properties?.backgroundColor,
              color: component.properties?.textColor,
              fontSize: `${component.properties?.fontSize}px`,
            }}
          >
            {component.properties?.items?.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        )}
        {component.type === "edittext" && (
          <input
            type="text"
            placeholder={component.properties?.placeholder}
            className="w-full px-3 py-2 border rounded"
            style={{
              borderColor: component.properties?.borderColor,
              backgroundColor: component.properties?.backgroundColor,
              color: component.properties?.textColor,
              fontSize: `${component.properties?.fontSize}px`,
            }}
          />
        )}
        {component.type === "ellipse" && (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              backgroundColor: "transparent", // Contenedor transparente
            }}
          >
            <div
              className="absolute inset-0 transition-all duration-200"
              style={{
                backgroundColor:
                  component.properties?.backgroundColor || "#4F46E5",
                borderRadius: "50%", // Hace el círculo perfecto
                border: `${component.properties?.borderWidth || 2}px solid ${
                  component.properties?.borderColor || "#3730A3"
                }`,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {component.properties?.text && (
                <span
                  style={{
                    color: component.properties?.textColor || "#FFFFFF",
                    fontSize: `${component.properties?.fontSize || 14}px`,
                    fontWeight: 500,
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  {component.properties.text}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </ResizableBox>
  );
};
