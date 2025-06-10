import type { RoomState, View, Component } from "../features/rooms/store/types";

interface ImportedDesign {
  version: string;
  timestamp: string;
  room: {
    id: string;
    name: string;
    views: Array<{
      id: string;
      name: string;
      backgroundColor?: string;
      components: Array<{
        id: string;
        type: string;
        x: number;
        y: number;
        width: number;
        height: number;
        properties?: Record<string, any>;
      }>;
    }>;
  };
}

const validateComponent = (component: any): component is Component => {
  return (
    typeof component.id === 'string' &&
    typeof component.type === 'string' &&
    typeof component.x === 'number' &&
    typeof component.y === 'number' &&
    typeof component.width === 'number' &&
    typeof component.height === 'number'
  );
};

const validateView = (view: any): view is View => {
  return (
    typeof view.id === 'string' &&
    typeof view.name === 'string' &&
    Array.isArray(view.components) &&
    view.components.every(validateComponent)
  );
};

export const importDesign = async (file: File): Promise<RoomState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string) as ImportedDesign;
        
        // Basic validation
        if (!jsonData.version || !jsonData.room) {
          throw new Error('Invalid design file format');
        }

        // Version check
        if (jsonData.version !== '1.0') {
          throw new Error('Unsupported design file version');
        }

        // Validate views
        if (!jsonData.room.views.every(validateView)) {
          throw new Error('Invalid view structure');
        }

        // Transform the imported data
        const transformedViews = jsonData.room.views.map(view => ({
          ...view,
          components: view.components.map(comp => ({
            ...comp,
            x: Number(comp.x),
            y: Number(comp.y),
            width: Number(comp.width),
            height: Number(comp.height),
            properties: {
              ...comp.properties,
              backgroundColor: comp.properties?.backgroundColor || 'transparent',
              color: comp.properties?.color,
              fontSize: comp.properties?.fontSize,
              padding: comp.properties?.padding,
              borderColor: comp.properties?.borderColor,
              borderWidth: comp.properties?.borderWidth,
              text: comp.properties?.text,
              items: comp.properties?.items || [],
              checked: comp.properties?.checked || false,
              placeholder: comp.properties?.placeholder,
              textColor: comp.properties?.textColor,
              aspectRatio: comp.properties?.aspectRatio
            }
          }))
        }));

        resolve({
          room: {
            id: jsonData.room.id || '',
            name: jsonData.room.name || 'Untitled Design',
            views: transformedViews // Include views in the room object
          },
          views: transformedViews,
          activeViewId: transformedViews[0]?.id || null,
          selectedComponentId: null
        });
      } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'An unknown error occurred';
        reject(new Error(`Failed to import design: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};