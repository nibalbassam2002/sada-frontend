// src/components/Editor/PropertiesPanel.jsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useEditor } from './EditorContext';

const PropertiesPanel = () => {
  const { 
    selectedField,
    selectedShape,
    shapeFill,
    handleShapeFill,
    shapeOutline,
    handleShapeOutline,
    outlineWidth,
    handleOutlineWidth,
    shapeOpacity,
    handleShapeOpacity,
    rotation,
    handleRotation
  } = useEditor();

  // إذا كان العنصر المحدد صورة أو شكل
  const isShapeSelected = selectedField?.startsWith('img-') || selectedShape;

  return (
    <aside className="properties-panel-sidebar">
      <div className="sidebar-label">PROPERTIES</div>
      {!selectedField && !selectedShape ? (
        <div className="empty-properties">
          <Sparkles size={32} color="#e2e8f0" />
          <p>Select an element to edit</p>
        </div>
      ) : (
        <div className="properties-content">
          {isShapeSelected && (
            <>
              <div className="property-group">
                <label>Fill Color</label>
                <div className="color-input-row">
                  <input 
                    type="color" 
                    value={shapeFill} 
                    onChange={(e) => handleShapeFill(e.target.value)} 
                  />
                  <input 
                    type="text" 
                    value={shapeFill} 
                    onChange={(e) => handleShapeFill(e.target.value)} 
                  />
                </div>
              </div>

              <div className="property-group">
                <label>Outline Color</label>
                <div className="color-input-row">
                  <input 
                    type="color" 
                    value={shapeOutline} 
                    onChange={(e) => handleShapeOutline(e.target.value)} 
                  />
                  <input 
                    type="text" 
                    value={shapeOutline} 
                    onChange={(e) => handleShapeOutline(e.target.value)} 
                  />
                </div>
              </div>

              <div className="property-group">
                <label>Outline Width: {outlineWidth}px</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={outlineWidth} 
                  onChange={(e) => handleOutlineWidth(parseInt(e.target.value))} 
                />
              </div>

              <div className="property-group">
                <label>Opacity: {shapeOpacity}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={shapeOpacity} 
                  onChange={(e) => handleShapeOpacity(parseInt(e.target.value))} 
                />
              </div>

              <div className="property-group">
                <label>Rotation: {rotation}°</label>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  value={rotation} 
                  onChange={(e) => handleRotation(parseInt(e.target.value))} 
                />
              </div>
            </>
          )}

          {selectedField && !selectedField.startsWith('img-') && (
            <div className="property-group">
              <label>Text Properties</label>
              <p>Editing: {selectedField}</p>
              {/* يمكن إضافة المزيد من خصائص النص هنا */}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default PropertiesPanel;