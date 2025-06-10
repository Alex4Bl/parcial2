const fs = require('fs');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const basePrompt = `Given a wireframe image or a detailed textual description of a user interface, generate a JSON representation of its views and components. The JSON should strictly adhere to the following structure, adapting component properties as needed to reflect the visual design.

**Instructions for Analysis and JSON Generation:**

1.  **Identify Views:**
    * If the input depicts multiple distinct screens or conceptual sections, create a separate "view" object for each.
    * Assign a descriptive name to each view (e.g., "LoginScreen", "Dashboard", "UserProfile").
    * Generate a 'unique_string_id' for each view's 'id'.

2.  **Identify Components within Each View:**
    * For every discernible UI element, create a 'component' object.
    * Generate a 'unique_string_id' for each component's 'id'.
    * Determine the most appropriate 'type' for each component, choosing *only* from this allowed list:
        * 'text'
        * 'button'
        * 'image'
        * 'container'
        * 'table'
        * 'checkbox'
        * 'listbox'
        * 'edittext'
        * 'ellipse'

3.  **Positioning and Dimensions:**
    * For each component, estimate its 'x' and 'y' coordinates (top-left corner) and its 'width' and 'height' in a consistent, relative unit (e.g., conceptual pixels) within its respective view. Assume a top-left origin (0,0).

4.  **Component Properties ('properties' object):**
    * Populate the 'properties' object for each component based on its visual attributes and intended function.
    * **Map observed properties to the following keys (use only keys relevant to the component type and discernible from the sketch):**
        * 'text': For 'text', 'button', 'checkbox', 'listbox' (labels of items).
        * 'placeholder': For 'edittext'.
        * 'color': Text color (e.g., "#000000", "#FFFFFF", "#4F46E5").
        * 'backgroundColor': Background color (e.g., "transparent", "#ffffff", "#f3f4f6", "#4F46E5").
        * 'fontSize': Font size (e.g., 8, 12, 14, 16).
        * 'padding': Inner spacing (e.g., "8px 16px", "16px").
        * 'src': For 'image' components, provide a placeholder URL (e.g., "https://placehold.co/WIDTHxHEIGHT", where WIDTH and HEIGHT are the component's width and height).
        * 'checked': Boolean for 'checkbox'.
        * 'items': Array of strings for 'listbox' (e.g., '["Item 1", "Item 2", "Item 3"]').
        * 'rows': Number of rows for 'table'.
        * 'columns': Number of columns for 'table'.
        * 'borderColor': Border color (e.g., "#e5e7eb", "#3730A3").
        * 'borderWidth': Border thickness (e.g., 1, 2).
        * 'textColor': Text color (specifically for 'table' if different from general 'color').
        * 'aspectRatio': For 'ellipse' if visually constrained (e.g., "1/1").

**JSON Output Structure:**

{
  "version": "1.0",
  "timestamp": "CURRENT_ISO_TIMESTAMP",
  "room": {
    "id": "A_UNIQUE_ROOM_ID",
    "name": "DESIGN_NAME",
    "views": [
      {
        "id": "A_UNIQUE_VIEW_ID_1",
        "name": "VIEW_NAME_1",
        "components": [
          {
            "id": "A_UNIQUE_COMPONENT_ID_1",
            "type": "COMPONENT_TYPE_1",
            "x": X_COORDINATE,
            "y": Y_COORDINATE,
            "width": WIDTH,
            "height": HEIGHT,
            "properties": {
              "PROPERTY_KEY_1": "PROPERTY_VALUE_1",
              "PROPERTY_KEY_2": "PROPERTY_VALUE_2"
              // ... additional properties based on component type
            }
          }
          // ... more components for VIEW_NAME_1
        ]
      },
      {
        "id": "A_UNIQUE_VIEW_ID_2",
        "name": "VIEW_NAME_2",
        "components": [
          // ... components for VIEW_NAME_2
        ]
      }
      // ... more views
    ]
  }
}`;

async function generateUIJsonFromImage(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString('base64');

  const messages = [
    { role: 'system', content: basePrompt },
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${base64}`
          }
        }
      ]
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0
  });

  return completion.choices[0].message.content;
}

module.exports = { generateUIJsonFromImage };
