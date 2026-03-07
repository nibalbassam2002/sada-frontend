// src/components/Editor/Elements/TableLayer.js
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const TableComponent = ({ table, onUpdate, onSelect, isSelected, onCellSelect, onDelete, activeCell }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [startSize, setStartSize] = useState({ width: table.width, height: table.height });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // ========== DRAG HANDLERS ==========
  const handleDragStart = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    if (editingCell || e.target.tagName === 'TD' || e.target.closest('td')) return; 
    setIsDragging(true); 
    setDragOffset({ x: e.clientX - table.x, y: e.clientY - table.y }); 
    onSelect(table.id); 
  };

  const handleDragMove = (e) => { 
    if (!isDragging) return; 
    e.preventDefault(); 
    const newX = e.clientX - dragOffset.x; 
    const newY = e.clientY - dragOffset.y; 
    const canvas = document.querySelector('.slide-canvas-container'); 
    if (canvas) { 
      const rect = canvas.getBoundingClientRect(); 
      const maxX = Math.max(0, rect.width - table.width); 
      const maxY = Math.max(0, rect.height - table.height); 
      onUpdate({ 
        ...table, 
        x: Math.max(0, Math.min(newX, maxX)), 
        y: Math.max(0, Math.min(newY, maxY)) 
      }); 
    } 
  };

  const handleDragEnd = () => setIsDragging(false);

  // ========== RESIZE HANDLERS ==========
  const handleResizeStart = (e, direction) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsResizing(true); 
    setResizeDirection(direction); 
    setStartSize({ width: table.width, height: table.height }); 
    setStartPos({ x: e.clientX, y: e.clientY }); 
    onSelect(table.id); 
  };

  const handleResizeMove = (e) => { 
    if (!isResizing) return; 
    e.preventDefault(); 
    const deltaX = e.clientX - startPos.x; 
    const deltaY = e.clientY - startPos.y; 
    let newWidth = startSize.width; 
    let newHeight = startSize.height; 
    let newX = table.x; 
    let newY = table.y; 
    const minWidth = 100; 
    const minHeight = 60; 
    
    switch (resizeDirection) { 
      case 'se': 
        newWidth = Math.max(minWidth, startSize.width + deltaX); 
        newHeight = Math.max(minHeight, startSize.height + deltaY); 
        break; 
      case 'sw': 
        newWidth = Math.max(minWidth, startSize.width - deltaX); 
        newHeight = Math.max(minHeight, startSize.height + deltaY); 
        newX = table.x + (startSize.width - newWidth); 
        break; 
      case 'ne': 
        newWidth = Math.max(minWidth, startSize.width + deltaX); 
        newHeight = Math.max(minHeight, startSize.height - deltaY); 
        newY = table.y + (startSize.height - newHeight); 
        break; 
      case 'nw': 
        newWidth = Math.max(minWidth, startSize.width - deltaX); 
        newHeight = Math.max(minHeight, startSize.height - deltaY); 
        newX = table.x + (startSize.width - newWidth); 
        newY = table.y + (startSize.height - newHeight); 
        break; 
      default: break;
    } 
    onUpdate({ ...table, x: newX, y: newY, width: newWidth, height: newHeight }); 
  };

  const handleResizeEnd = () => { 
    setIsResizing(false); 
    setResizeDirection(null); 
  };

  // ========== EVENT LISTENERS ==========
  useEffect(() => { 
    if (isDragging) { 
      window.addEventListener('mousemove', handleDragMove); 
      window.addEventListener('mouseup', handleDragEnd); 
    } else if (isResizing) { 
      window.addEventListener('mousemove', handleResizeMove); 
      window.addEventListener('mouseup', handleResizeEnd); 
    } 
    return () => { 
      window.removeEventListener('mousemove', handleDragMove); 
      window.removeEventListener('mouseup', handleDragEnd); 
      window.removeEventListener('mousemove', handleResizeMove); 
      window.removeEventListener('mouseup', handleResizeEnd); 
    }; 
  }, [isDragging, isResizing]);

  // ========== TABLE MANIPULATION FUNCTIONS ==========
  const updateCell = (rowIndex, colIndex, value) => { 
    const newData = { ...table.data }; 
    if (!newData[rowIndex]) newData[rowIndex] = {}; 
    newData[rowIndex][colIndex] = value; 
    onUpdate({ ...table, data: newData }); 
  };

  const insertRow = (position) => { 
    const newRows = table.rows + 1; 
    const newData = { ...table.data }; 
    
    if (position === 'above' && hoverRow !== null) { 
      for (let r = newRows - 1; r > hoverRow; r--) {
        newData[r] = newData[r - 1] ? { ...newData[r - 1] } : {}; 
      }
      newData[hoverRow] = {}; 
    } else if (position === 'below' && hoverRow !== null) { 
      for (let r = newRows - 1; r > hoverRow + 1; r--) {
        newData[r] = newData[r - 1] ? { ...newData[r - 1] } : {}; 
      }
      newData[hoverRow + 1] = {}; 
    } else {
      newData[table.rows] = {}; 
    }
    
    onUpdate({ ...table, rows: newRows, data: newData }); 
  };

  const insertColumn = (position) => { 
    const newCols = table.cols + 1; 
    const newData = { ...table.data }; 
    
    for (let r = 0; r < table.rows; r++) { 
      if (!newData[r]) newData[r] = {}; 
      const rowData = { ...newData[r] }; 
      
      if (position === 'left' && hoverCol !== null) { 
        for (let c = newCols - 1; c > hoverCol; c--) {
          rowData[c] = rowData[c - 1] || ''; 
        }
        rowData[hoverCol] = ''; 
      } else if (position === 'right' && hoverCol !== null) { 
        for (let c = newCols - 1; c > hoverCol + 1; c--) {
          rowData[c] = rowData[c - 1] || ''; 
        }
        rowData[hoverCol + 1] = ''; 
      } else {
        rowData[table.cols] = ''; 
      }
      
      newData[r] = rowData; 
    } 
    onUpdate({ ...table, cols: newCols, data: newData }); 
  };

  const deleteRow = (index) => { 
    if (table.rows <= 1) return; 
    const newRows = table.rows - 1; 
    const newData = { ...table.data }; 
    delete newData[index]; 
    
    for (let r = index; r < newRows; r++) {
      newData[r] = newData[r + 1] ? { ...newData[r + 1] } : {}; 
    }
    delete newData[newRows]; 
    
    onUpdate({ ...table, rows: newRows, data: newData }); 
  };

  const deleteColumn = (index) => { 
    if (table.cols <= 1) return; 
    const newCols = table.cols - 1; 
    const newData = { ...table.data }; 
    
    for (let r = 0; r < table.rows; r++) { 
      if (newData[r]) { 
        const rowData = { ...newData[r] }; 
        delete rowData[index]; 
        
        for (let c = index; c < newCols; c++) {
          rowData[c] = rowData[c + 1] || ''; 
        }
        delete rowData[newCols]; 
        newData[r] = rowData; 
      } 
    } 
    onUpdate({ ...table, cols: newCols, data: newData }); 
  };

  return (
    <div 
      className={`table-container ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`} 
      onClick={() => onSelect(table.id)} 
      onMouseDown={handleDragStart} 
      style={{ 
        position: 'absolute', 
        left: table.x, 
        top: table.y, 
        width: table.width, 
        height: table.height, 
        zIndex: isSelected ? 100 : 1, 
        cursor: isSelected ? 'grab' : 'default', 
        userSelect: 'none' 
      }}
    >
      {/* شريط أدوات الجدول */}
      {isSelected && (
        <div className="table-toolbar">
          <button onClick={() => insertRow('above')} title="Insert Row Above">
            <Plus size={12} /> Row Above
          </button>
          <button onClick={() => insertRow('below')} title="Insert Row Below">
            <Plus size={12} /> Row Below
          </button>
          <button onClick={() => insertColumn('left')} title="Insert Column Left">
            <Plus size={12} /> Col Left
          </button>
          <button onClick={() => insertColumn('right')} title="Insert Column Right">
            <Plus size={12} /> Col Right
          </button>
          {table.rows > 1 && (
            <button onClick={() => deleteRow(hoverRow ?? table.rows - 1)} className="danger">
              <Trash2 size={12} /> Delete Row
            </button>
          )}
          {table.cols > 1 && (
            <button onClick={() => deleteColumn(hoverCol ?? table.cols - 1)} className="danger">
              <Trash2 size={12} /> Delete Col
            </button>
          )}
          <button onClick={() => onDelete(table.id)} className="danger">
            <Trash2 size={12} /> Delete Table
          </button>
        </div>
      )}
      
      {/* الجدول نفسه */}
      <table 
        className="powerpoint-table" 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderCollapse: 'collapse', 
          background: table.style?.fill || 'white' 
        }}
      >
        <tbody>
          {Array.from({ length: table.rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: table.cols }).map((_, colIndex) => {
                const isActive = activeCell?.tableId === table.id && 
                                 activeCell?.row === rowIndex && 
                                 activeCell?.col === colIndex;
                const isHover = hoverRow === rowIndex && hoverCol === colIndex;
                const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                const cellValue = table.data[rowIndex]?.[colIndex] || '';
                
                return (
                  <td 
                    key={colIndex} 
                    className={`table-cell ${isActive ? 'active' : ''}`} 
                    onMouseEnter={() => { 
                      setHoverRow(rowIndex); 
                      setHoverCol(colIndex); 
                    }} 
                    onMouseLeave={() => { 
                      setHoverRow(null); 
                      setHoverCol(null); 
                    }} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onCellSelect(table.id, rowIndex, colIndex); 
                    }} 
                    onDoubleClick={() => setEditingCell({ row: rowIndex, col: colIndex })}
                    style={{ 
                      border: `1px solid ${table.style?.borderColor || '#e2e8f0'}`, 
                      padding: '8px', 
                      textAlign: table.style?.align || 'left', 
                      fontWeight: table.style?.bold ? 'bold' : 'normal', 
                      fontStyle: table.style?.italic ? 'italic' : 'normal', 
                      backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 
                                      isHover ? 'rgba(245, 158, 11, 0.05)' : 'transparent' 
                    }} 
                  >
                    {isEditing ? (
                      <div 
                        contentEditable 
                        suppressContentEditableWarning 
                        onBlur={(e) => { 
                          updateCell(rowIndex, colIndex, e.target.innerHTML); 
                          setEditingCell(null); 
                        }} 
                        onKeyDown={(e) => { 
                          if (e.key === 'Enter' && !e.shiftKey) { 
                            e.preventDefault(); 
                            e.target.blur(); 
                          } 
                        }} 
                        style={{ outline: 'none', minHeight: '20px', width: '100%' }} 
                        dangerouslySetInnerHTML={{ __html: cellValue }} 
                        autoFocus 
                      />
                    ) : (
                      <div 
                        style={{ minHeight: '20px' }} 
                        dangerouslySetInnerHTML={{ __html: cellValue || '&nbsp;' }} 
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* مقابض تغيير الحجم */}
      {isSelected && (
        <>
          <div 
            className="resize-handle resize-handle-se" 
            onMouseDown={(e) => handleResizeStart(e, 'se')} 
            title="تغيير الحجم" 
          />
          <div 
            className="resize-handle resize-handle-sw" 
            onMouseDown={(e) => handleResizeStart(e, 'sw')} 
            title="تغيير الحجم" 
          />
          <div 
            className="resize-handle resize-handle-ne" 
            onMouseDown={(e) => handleResizeStart(e, 'ne')} 
            title="تغيير الحجم" 
          />
          <div 
            className="resize-handle resize-handle-nw" 
            onMouseDown={(e) => handleResizeStart(e, 'nw')} 
            title="تغيير الحجم" 
          />
        </>
      )}
    </div>
  );
};

// المكون الرئيسي للطبقة
const TableLayer = ({ tables, onUpdate, onSelect, selectedTable, onCellSelect, onDelete, activeCell }) => {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="tables-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
      {tables.map(table => (
        <TableComponent 
          key={table.id} 
          table={table} 
          onUpdate={onUpdate} 
          onSelect={onSelect} 
          isSelected={selectedTable === table.id} 
          onCellSelect={onCellSelect} 
          onDelete={onDelete} 
          activeCell={activeCell} 
        />
      ))}
    </div>
  );
};

export default TableLayer;