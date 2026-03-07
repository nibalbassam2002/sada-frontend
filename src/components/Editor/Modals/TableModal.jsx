// src/components/Editor/Modals/TableModal.jsx
import React, { useState } from 'react';
import { useEditor } from '../EditorContext';

const TableModal = ({ onClose, onInsert }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [hoverRow, setHoverRow] = useState(3);
  const [hoverCol, setHoverCol] = useState(3);

  const handleMouseEnter = (r, c) => { 
    setHoverRow(r); 
    setHoverCol(c); 
  };

  const handleMouseLeave = () => { 
    setHoverRow(rows); 
    setHoverCol(cols); 
  };

  const handleClick = (r, c) => { 
    setRows(r); 
    setCols(c); 
  };

  const handleInsert = () => {
    onInsert(rows, cols);
    onClose();
  };

  return (
    <div className="table-modal-overlay" onClick={onClose}>
      <div className="table-modal" onClick={(e) => e.stopPropagation()}>
        <div className="table-modal-header">
          <h4>Insert Table</h4>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="table-modal-content">
          <div className="table-size-selector">
            <div 
              className="table-grid" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(10, 24px)', 
                gap: '4px', 
                padding: '15px', 
                background: '#f8fafc', 
                borderRadius: '8px', 
                justifyContent: 'center' 
              }}
            >
              {Array.from({ length: 100 }).map((_, index) => {
                const r = Math.floor(index / 10) + 1;
                const c = (index % 10) + 1;
                const isActive = r <= hoverRow && c <= hoverCol;
                
                return (
                  <div 
                    key={index} 
                    className={`grid-cell ${isActive ? 'active' : ''}`} 
                    onMouseEnter={() => handleMouseEnter(r, c)} 
                    onMouseLeave={handleMouseLeave} 
                    onClick={() => handleClick(r, c)} 
                    style={{ 
                      width: '24px', 
                      height: '24px', 
                      background: isActive ? '#f59e0b' : '#e2e8f0', 
                      border: `1px solid ${isActive ? '#d97706' : '#cbd5e1'}`, 
                      borderRadius: '3px', 
                      cursor: 'pointer', 
                      transition: 'all 0.1s ease' 
                    }} 
                    title={`${r} rows, ${c} columns`} 
                  />
                );
              })}
            </div>
            <div className="table-size-info">{hoverRow} x {hoverCol} table</div>
          </div>
          
          <div className="table-size-inputs">
            <div className="input-group">
              <label>Rows:</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={rows} 
                onChange={(e) => setRows(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} 
              />
            </div>
            <div className="input-group">
              <label>Columns:</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                value={cols} 
                onChange={(e) => setCols(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))} 
              />
            </div>
          </div>
        </div>
        
        <div className="table-modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="insert-btn" onClick={handleInsert}>Insert Table</button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;