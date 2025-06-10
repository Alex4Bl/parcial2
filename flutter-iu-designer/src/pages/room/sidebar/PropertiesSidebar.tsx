import ImportFromSketchButton from "../../../components/JsonExportButton";
import { useRoomStore } from "../../../features/rooms/store/useRoomStore";

export const PropertiesSidebar = () => {
  const {
    views,
    activeViewId,
    selectedComponentId,
    updateComponentProperties,
    removeComponent,
    updateComponentSize,
    updateComponentPosition,
    updateViewBackground
  } = useRoomStore();

  const activeView = views.find((view) => view.id === activeViewId);
  const selectedComponent = activeViewId && selectedComponentId
    ? views
        .find((v) => v.id === activeViewId)
        ?.components.find((c) => c.id === selectedComponentId)
    : null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      <ImportFromSketchButton />
      
      {/* Canvas Properties - Always visible */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Canvas Properties</h3>
        <div className="space-y-2">
          <label className="block text-xs text-gray-600">
            Background Color
          </label>
          <input
            type="color"
            value={activeView?.backgroundColor || "#ffffff"}
            onChange={(e) => {
              if (activeViewId) {
                updateViewBackground(activeViewId, e.target.value);
              }
            }}
            className="w-full h-8 rounded border border-gray-200"
          />
        </div>
      </div>

      {/* Component Properties - Only visible when component is selected */}
      {selectedComponent ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Component Properties</h3>
            <button
              onClick={() => activeViewId && removeComponent(activeViewId, selectedComponent.id)}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="text-sm bg-gray-50 px-3 py-2 rounded">
              {selectedComponent.type}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Size</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Width</label>
                <input
                  type="number"
                  value={selectedComponent.width || 100}
                  onChange={(e) => {
                    if (activeViewId && selectedComponent.id) {
                      updateComponentSize(activeViewId, selectedComponent.id, {
                        width: Number(e.target.value),
                        height: selectedComponent.height || 50
                      });
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Height</label>
                <input
                  type="number"
                  value={selectedComponent.height || 50}
                  onChange={(e) => {
                    if (activeViewId && selectedComponent.id) {
                      updateComponentSize(activeViewId, selectedComponent.id, {
                        width: selectedComponent.width || 100,
                        height: Number(e.target.value)
                      });
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs text-gray-600">Position</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">X</label>
                <input
                  type="number"
                  value={selectedComponent.x || 0}
                  onChange={(e) => {
                    if (activeViewId && selectedComponent.id) {
                      updateComponentPosition(activeViewId, selectedComponent.id, {
                        x: Number(e.target.value),
                        y: selectedComponent.y || 0
                      });
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Y</label>
                <input
                  type="number"
                  value={selectedComponent.y || 0}
                  onChange={(e) => {
                    if (activeViewId && selectedComponent.id) {
                      updateComponentPosition(activeViewId, selectedComponent.id, {
                        x: selectedComponent.x || 0,
                        y: Number(e.target.value)
                      });
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
          </div>

          {selectedComponent.type === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Text Content
              </label>
              <input
                type="text"
                value={selectedComponent.properties?.text || ""}
                onChange={(e) =>
                  updateComponentProperties(activeViewId!, selectedComponent.id, {
                    text: e.target.value,
                  })
                }
                className="w-full px-3 py-1 border rounded text-sm"
              />
            </div>
          )}

          {selectedComponent?.type === "image" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="imageUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && activeViewId && selectedComponent.id) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateComponentProperties(activeViewId, selectedComponent.id, {
                            ...selectedComponent.properties,
                            src: event.target?.result as string
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-600 rounded cursor-pointer hover:bg-indigo-100 transition-colors"
                  >
                    Upload Image
                  </label>
                  {selectedComponent.properties?.src && (
                    <button
                      onClick={() => {
                        if (activeViewId && selectedComponent.id) {
                          updateComponentProperties(activeViewId, selectedComponent.id, {
                            ...selectedComponent.properties,
                            src: undefined
                          });
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-gray-600">Object Fit</label>
                <select
                  value={selectedComponent.properties?.objectFit || "cover"}
                  onChange={(e) => {
                    if (activeViewId && selectedComponent.id) {
                      const objectFit = e.target.value as 'fill' | 'cover' | 'contain';
                      updateComponentProperties(activeViewId, selectedComponent.id, {
                        ...selectedComponent.properties,
                        objectFit
                      });
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Style
            </label>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500">Color</label>
                <input
                  type="color"
                  value={selectedComponent.properties?.color || "#000000"}
                  onChange={(e) =>
                    updateComponentProperties(
                      activeViewId!,
                      selectedComponent.id,
                      { color: e.target.value }
                    )
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Background</label>
                <input
                  type="color"
                  value={
                    selectedComponent.properties?.backgroundColor || "#ffffff"
                  }
                  onChange={(e) =>
                    updateComponentProperties(
                      activeViewId!,
                      selectedComponent.id,
                      { backgroundColor: e.target.value }
                    )
                  }
                  className="w-full h-8 p-1 border rounded"
                />
              </div>
              {selectedComponent.type === "text" && (
                <div>
                  <label className="block text-xs text-gray-500">Font Size</label>
                  <input
                    type="number"
                    value={selectedComponent.properties?.fontSize || 16}
                    onChange={(e) =>
                      updateComponentProperties(
                        activeViewId!,
                        selectedComponent.id,
                        { fontSize: parseInt(e.target.value) || 16 }
                      )
                    }
                    className="w-full px-3 py-1 border rounded text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Select a component to edit its properties
        </p>
      )}
    </div>
  );
};
