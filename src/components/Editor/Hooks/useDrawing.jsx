// src/components/Editor/Hooks/useDrawing.js
import { useState, useCallback } from 'react';

export const useDrawing = (showToast) => {
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [shapeType, setShapeType] = useState('rectangle');
  const [shapeFill, setShapeFill] = useState('#f59e0b');
  const [shapeOutline, setShapeOutline] = useState('#1e293b');
  const [outlineWidth, setOutlineWidth] = useState(2);
  const [shapeOpacity, setShapeOpacity] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [shapeEffects, setShapeEffects] = useState({
    shadow: false,
    glow: false,
    reflection: false,
    softEdges: false
  });
  const [arrangeMode, setArrangeMode] = useState(null);

  // ========== SHAPE FUNCTIONS ==========
  const addShape = useCallback((type) => {
    const newShape = { 
      id: Date.now(), 
      type, 
      x: 100, 
      y: 100, 
      width: type === 'circle' ? 150 : 150, 
      height: type === 'circle' ? 150 : 100, 
      fill: shapeFill, 
      outline: shapeOutline, 
      outlineWidth, 
      opacity: shapeOpacity, 
      rotation: 0, 
      effects: { ...shapeEffects } 
    };
    setShapes(prev => [...prev, newShape]);
    setSelectedShape(newShape.id);
    showToast(`${type} shape added`);
  }, [shapeFill, shapeOutline, outlineWidth, shapeOpacity, shapeEffects, showToast]);

  const updateShapeStyle = useCallback((property, value) => { 
    if (selectedShape) {
      setShapes(prev => prev.map(shape => 
        shape.id === selectedShape ? { ...shape, [property]: value } : shape
      )); 
    }
  }, [selectedShape]);

  const handleShapeFill = useCallback((color) => { 
    setShapeFill(color); 
    if (selectedShape) updateShapeStyle('fill', color); 
  }, [selectedShape, updateShapeStyle]);

  const handleShapeOutline = useCallback((color) => { 
    setShapeOutline(color); 
    if (selectedShape) updateShapeStyle('outline', color); 
  }, [selectedShape, updateShapeStyle]);

  const handleOutlineWidth = useCallback((width) => { 
    setOutlineWidth(width); 
    if (selectedShape) updateShapeStyle('outlineWidth', width); 
  }, [selectedShape, updateShapeStyle]);

  const handleShapeOpacity = useCallback((opacity) => { 
    setShapeOpacity(opacity); 
    if (selectedShape) updateShapeStyle('opacity', opacity); 
  }, [selectedShape, updateShapeStyle]);

  const handleRotation = useCallback((angle) => { 
    setRotation(angle); 
    if (selectedShape) updateShapeStyle('rotation', angle); 
  }, [selectedShape, updateShapeStyle]);

  const handleEffect = useCallback((effect, value) => { 
    setShapeEffects(prev => ({ ...prev, [effect]: value })); 
    if (selectedShape) {
      setShapes(prev => prev.map(shape => 
        shape.id === selectedShape ? { 
          ...shape, 
          effects: { ...shape.effects, [effect]: value } 
        } : shape
      )); 
    }
  }, [selectedShape]);

  // ========== ARRANGE FUNCTIONS ==========
  const bringToFront = useCallback(() => { 
    if (selectedShape) { 
      setShapes(prev => { 
        const index = prev.findIndex(s => s.id === selectedShape); 
        if (index < prev.length - 1) { 
          const newShapes = [...prev]; 
          const [shape] = newShapes.splice(index, 1); 
          newShapes.push(shape); 
          return newShapes; 
        } 
        return prev; 
      }); 
      showToast("Brought to front"); 
    } 
  }, [selectedShape, showToast]);

  const sendToBack = useCallback(() => { 
    if (selectedShape) { 
      setShapes(prev => { 
        const index = prev.findIndex(s => s.id === selectedShape); 
        if (index > 0) { 
          const newShapes = [...prev]; 
          const [shape] = newShapes.splice(index, 1); 
          newShapes.unshift(shape); 
          return newShapes; 
        } 
        return prev; 
      }); 
      showToast("Sent to back"); 
    } 
  }, [selectedShape, showToast]);

  const bringForward = useCallback(() => { 
    if (selectedShape) { 
      setShapes(prev => { 
        const index = prev.findIndex(s => s.id === selectedShape); 
        if (index < prev.length - 1) { 
          const newShapes = [...prev];
          [newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]]; 
          return newShapes; 
        } 
        return prev; 
      }); 
      showToast("Brought forward"); 
    } 
  }, [selectedShape, showToast]);

  const sendBackward = useCallback(() => { 
    if (selectedShape) { 
      setShapes(prev => { 
        const index = prev.findIndex(s => s.id === selectedShape); 
        if (index > 0) { 
          const newShapes = [...prev];
          [newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]]; 
          return newShapes; 
        } 
        return prev; 
      }); 
      showToast("Sent backward"); 
    } 
  }, [selectedShape, showToast]);

  const deleteShape = useCallback(() => { 
    if (selectedShape) { 
      setShapes(prev => prev.filter(s => s.id !== selectedShape)); 
      setSelectedShape(null); 
      showToast("Shape deleted"); 
    } 
  }, [selectedShape, showToast]);

  const duplicateShape = useCallback(() => { 
    if (selectedShape) { 
      const shape = shapes.find(s => s.id === selectedShape); 
      const newShape = { 
        ...shape, 
        id: Date.now(), 
        x: shape.x + 20, 
        y: shape.y + 20 
      }; 
      setShapes(prev => [...prev, newShape]); 
      setSelectedShape(newShape.id); 
      showToast("Shape duplicated"); 
    } 
  }, [selectedShape, shapes, showToast]);

  return {
    // States
    shapes,
    setShapes,
    selectedShape,
    setSelectedShape,
    shapeType,
    setShapeType,
    shapeFill,
    setShapeFill,
    shapeOutline,
    setShapeOutline,
    outlineWidth,
    setOutlineWidth,
    shapeOpacity,
    setShapeOpacity,
    rotation,
    setRotation,
    shapeEffects,
    setShapeEffects,
    arrangeMode,
    setArrangeMode,

    // Functions
    addShape,
    updateShapeStyle,
    handleShapeFill,
    handleShapeOutline,
    handleOutlineWidth,
    handleShapeOpacity,
    handleRotation,
    handleEffect,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    deleteShape,
    duplicateShape
  };
};