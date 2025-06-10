import { useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import type { ComponentProperties } from "../../../features/rooms/store/types";
import { ExportButton } from "../../../components/ExportButton";
import { ImportButton } from "../../../components/ImportButton";
import ExportFlutterButton from "../../../components/ExportFlutterButton";
interface ComponentTemplate {
  type: string;
  label: string;
  width: number;
  height: number;
  defaultProperties: ComponentProperties;
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    type: "text",
    label: "Text",
    width: 200,
    height: 40,
    defaultProperties: {
      text: "Text Block  2",
      color: "#000000",
      backgroundColor: "transparent",
      fontSize: 16,
    },
  },
  {
    type: "button",
    label: "Button",
    width: 120,
    height: 40,
    defaultProperties: {
      text: "Button",
      color: "#ffffff",
      backgroundColor: "#4F46E5",
      padding: "8px 16px",
    },
  },
  {
    type: "image",
    label: "Image",
    width: 200,
    height: 200,
    defaultProperties: {
      backgroundColor: "#f3f4f6",
    },
  },
  {
    type: "container",
    label: "Container",
    width: 300,
    height: 200,
    defaultProperties: {
      backgroundColor: "transparent",
      padding: "16px",
    },
  },
  {
    type: "table",
    label: "Table",
    width: 250,
    height: 1,
    defaultProperties: {
      rows: 3,
      columns: 3,
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      textColor: "#000000",
      fontSize: 8,
    },
  },
  {
    type: "checkbox",
    label: "Checkbox",
    width: 120,
    height: 24,
    defaultProperties: {
      text: "Check option",
      color: "#4F46E5",
      backgroundColor: "transparent",
      fontSize: 14,
      checked: false,
    },
  },
  {
    type: "listbox",
    label: "List Box",
    width: 100,
    height: 33,
    defaultProperties: {
      items: ["Item 1", "Item 2", "Item 3"],
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      textColor: "#000000",
      fontSize: 14,
    },
  },
  {
    type: "edittext",
    label: "Edit Text",
    width: 200,
    height: 40,
    defaultProperties: {
      placeholder: "Enter text...",
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      textColor: "#000000",
      fontSize: 12,
    },
  },
  {
    type: "ellipse",
    label: "Ellipse",
    width: 100,
    height: 100,
    defaultProperties: {
      backgroundColor: "#4F46E5",
      borderColor: "#3730A3",
      borderWidth: 2,
      textColor: "#FFFFFF",
      fontSize: 14,
      aspectRatio: "1/1",
    },
  },
];

const DraggableComponentTemplate = ({
  template,
}: {
  template: ComponentTemplate;
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "component",
      item: {
        ...template,
        properties: template.defaultProperties,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [template]
  );

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  return (
    <div
      ref={dragRef}
      className={`
        p-3 mb-2 rounded-lg cursor-move
        ${isDragging ? "opacity-50" : "opacity-100"}
        bg-white hover:bg-gray-50
        border border-gray-200 hover:border-indigo-300
        transition-all duration-200
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{
            backgroundColor:
              template.defaultProperties.backgroundColor || "#f3f4f6",
            color: template.defaultProperties.color || "#000",
          }}
        >
          {template.type === "text" && "T"}
          {template.type === "button" && "⬚"}
          {template.type === "image" && "🖼"}
          {template.type === "container" && "⬒"}
          {template.type === "table" && "⊞"}
          {template.type === "checkbox" && "☐"}
          {template.type === "listbox" && "▤"}
          {template.type === "edittext" && "✎"}
          {template.type === "ellipse" && "⬭"}
        </div>
        <span className="font-medium">{template.label}</span>
      </div>
    </div>
  );
};

export const ComponentSidebar = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Components</h2>

      <div className="space-y-2">
        {COMPONENT_TEMPLATES.map((template) => (
          <DraggableComponentTemplate key={template.type} template={template} />
        ))}
      </div>
      <h2 className="text-lg font-semibold mb-4">Exportaciones</h2>
      <ExportButton />
      <ImportButton />
      <ExportFlutterButton />
    </div>
  );
};
