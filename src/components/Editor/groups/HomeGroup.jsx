// src/components/Editor/groups/HomeGroup.jsx
import React from 'react';
import { useEditor } from '../EditorContext';
import { LAYOUT_TYPES } from '../EditorConstants';
import { 
  Clipboard, Scissors, Copy, PaintRoller, PlusSquare, ChevronDown, Layout,
  Type, Eraser, List, ListOrdered, Outdent, Indent, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, ArrowUp, ArrowDown, Square, PaintBucket, Baseline,
  Layers, Sparkles, RotateCcw, Trash2, Search, MousePointer2
} from 'lucide-react';

const HomeGroup = () => {
  const {
    // Clipboard
    handlePaste, handleCut, handleCopy, handleFormatPainter,
    // Slides
    addNewSlide, setShowLayoutPicker, setPickerMode,
    // Font
    selectedFont, fontSize, setShowFontPicker, increaseFontSize, decreaseFontSize, handleFontSizeChange,
    toggleBold, toggleItalic, toggleUnderline, clearFormatting,
    isBold, isItalic, isUnderline, isStrikethrough, toggleStrikethrough,
    isSubscript, toggleSubscript, isSuperscript, toggleSuperscript,
    textColor, setShowColorPicker,
    // Paragraph
    handleBulletList, handleNumberList, handleOutdent, handleIndent,
    alignment, handleAlignLeft, handleAlignCenter, handleAlignRight, handleAlignJustify,
    lineSpacing, handleLineSpacing, paragraphSpacing, handleParagraphSpacing,
    listType,  // تأكدي من وجود هذا
    // Drawing
    shapeType, setShapeType, addShape, shapeFill, handleShapeFill,
    shapeOutline, handleShapeOutline, outlineWidth, handleOutlineWidth,
    shapeOpacity, handleShapeOpacity, rotation, handleRotation,
    shapeEffects, handleEffect, bringToFront, sendToBack, bringForward,
    sendBackward, duplicateShape, deleteShape, selectedShape,
    // Editing
    setShowSearchDialog, handleSelectAll, selectedField
  } = useEditor();

  // نسخة مبسطة من renderParagraphControls بدون استخدام listType
  const renderParagraphControls = () => (
    <div className="ribbon-group" key="paragraph">
      <div className="group-content-col">
        <div className="tool-row">
          <button className="btn-icon-s" onClick={handleBulletList}>
            <List size={14} />
          </button>
          <button className="btn-icon-s" onClick={handleNumberList}>
            <ListOrdered size={14} />
          </button>
          <div className="v-sep"></div>
          <button className="btn-icon-s" onClick={handleOutdent}>
            <Outdent size={14} />
          </button>
          <button className="btn-icon-s" onClick={handleIndent}>
            <Indent size={14} />
          </button>
        </div>

        <div className="tool-row">
          <button className={`btn-icon-s ${alignment === 'left' ? 'active' : ''}`} onClick={handleAlignLeft}>
            <AlignLeft size={14} />
          </button>
          <button className={`btn-icon-s ${alignment === 'center' ? 'active' : ''}`} onClick={handleAlignCenter}>
            <AlignCenter size={14} />
          </button>
          <button className={`btn-icon-s ${alignment === 'right' ? 'active' : ''}`} onClick={handleAlignRight}>
            <AlignRight size={14} />
          </button>
          <button className={`btn-icon-s ${alignment === 'justify' ? 'active' : ''}`} onClick={handleAlignJustify}>
            <AlignJustify size={14} />
          </button>
        </div>

        <div className="tool-row" style={{ gap: '4px' }}>
          <select 
            className="ribbon-select" 
            value={lineSpacing} 
            onChange={(e) => handleLineSpacing(e.target.value)}
            style={{ width: '70px' }}
          >
            <option value="1.0">1.0</option>
            <option value="1.15">1.15</option>
            <option value="1.5">1.5</option>
            <option value="2.0">2.0</option>
            <option value="2.5">2.5</option>
            <option value="3.0">3.0</option>
          </select>
          
          <div className="v-sep"></div>
          
          <div className="spacing-controls" style={{ display: 'flex', gap: '2px' }}>
            <button className="btn-icon-s" onClick={() => handleParagraphSpacing('before', Math.max(0, paragraphSpacing.before - 2))}>
              <ArrowUp size={10} />-
            </button>
            <button className="btn-icon-s" onClick={() => handleParagraphSpacing('before', paragraphSpacing.before + 2)}>
              <ArrowUp size={10} />+
            </button>
            <button className="btn-icon-s" onClick={() => handleParagraphSpacing('after', Math.max(0, paragraphSpacing.after - 2))}>
              <ArrowDown size={10} />-
            </button>
            <button className="btn-icon-s" onClick={() => handleParagraphSpacing('after', paragraphSpacing.after + 2)}>
              <ArrowDown size={10} />+
            </button>
          </div>
        </div>
      </div>
      <div className="group-label">Paragraph</div>
    </div>
  );

  const renderMegaWithStack = (group) => (
    <div className="ribbon-group" key={group.id}>
      <div className="group-content-flex">
        <button className="btn-mega" onClick={group.onClick}>
          <group.megaIcon size={28} color="#475569" />
          {Array.isArray(group.megaText) ? (
            <div className="btn-label-stack">
              {group.megaText.map((text, i) => <span key={i}>{text}</span>)}
            </div>
          ) : (
            <span>{group.megaText}</span>
          )}
        </button>
        {group.stackButtons && (
          <div className="mini-tools-stack">
            {group.stackButtons.map((btn, i) => (
              <button key={i} className="btn-mini-wide" onClick={btn.onClick}>
                <btn.icon size={14} /> {btn.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="group-label">{group.label}</div>
    </div>
  );

  const renderFontControls = () => (
    <div className="ribbon-group" key="font">
      <div className="group-content-col">
        <div className="tool-row" style={{ gap: '4px' }}>
          <button 
            className="btn-font-selector" 
            onClick={() => setShowFontPicker(true)}
            style={{ 
              fontFamily: selectedFont, 
              width: '140px', 
              textAlign: 'left', 
              padding: '4px 8px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '4px', 
              background: 'white', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            <span>{selectedFont}</span>
            <ChevronDown size={12} color="#64748b" />
          </button>
          
          <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <button className="btn-icon-s" onClick={decreaseFontSize} style={{ borderRadius: '0' }}>
              <Type size={12} />-
            </button>
            <input 
              type="number" 
              value={fontSize} 
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)} 
              style={{ width: '50px', textAlign: 'center', border: 'none', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', padding: '4px 0' }} 
            />
            <button className="btn-icon-s" onClick={increaseFontSize} style={{ borderRadius: '0' }}>
              <Type size={14} />+
            </button>
          </div>
          
          <button className="btn-icon-s" onClick={clearFormatting}>
            <Eraser size={14} />
          </button>
        </div>

        <div className="tool-row">
          <button className={`btn-icon-s bold ${isBold ? 'active' : ''}`} onClick={toggleBold}>B</button>
          <button className={`btn-icon-s italic ${isItalic ? 'active' : ''}`} onClick={toggleItalic}>I</button>
          <button className={`btn-icon-s underline ${isUnderline ? 'active' : ''}`} onClick={toggleUnderline}>U</button>
          <div className="v-sep"></div>
          <button className={`btn-icon-s ${isStrikethrough ? 'active' : ''}`} onClick={toggleStrikethrough} style={{ textDecoration: 'line-through' }}>S</button>
          <button className={`btn-icon-s ${isSubscript ? 'active' : ''}`} onClick={toggleSubscript}>X<sub>2</sub></button>
          <button className={`btn-icon-s ${isSuperscript ? 'active' : ''}`} onClick={toggleSuperscript}>X<sup>2</sup></button>
          <div className="v-sep"></div>
          <button className="format-btn color-picker-btn" onClick={() => setShowColorPicker(true)}>
            <div className="color-preview" style={{ background: textColor, width: '24px', height: '24px', borderRadius: '4px', border: '2px solid #e2e8f0' }}></div>
            <ChevronDown size={12} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>
      <div className="group-label">Font</div>
    </div>
  );

  const renderDrawingControls = () => (
    <div className="ribbon-group drawing-group" key="drawing">
      <div className="group-content-col">
        <div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}>
          <button className={`btn-icon-s ${shapeType === 'rectangle' ? 'active' : ''}`} onClick={() => { setShapeType('rectangle'); addShape('rectangle'); }}>
            <Square size={16} />
          </button>
          <button className={`btn-icon-s ${shapeType === 'circle' ? 'active' : ''}`} onClick={() => { setShapeType('circle'); addShape('circle'); }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid currentColor' }} />
          </button>
          <button className={`btn-icon-s ${shapeType === 'triangle' ? 'active' : ''}`} onClick={() => { setShapeType('triangle'); addShape('triangle'); }}>
            <div style={{ width: '0', height: '0', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '14px solid currentColor' }} />
          </button>
          <button className={`btn-icon-s ${shapeType === 'line' ? 'active' : ''}`} onClick={() => { setShapeType('line'); addShape('line'); }}>
            <div style={{ width: '16px', height: '2px', background: 'currentColor' }} />
          </button>
          <button className={`btn-icon-s ${shapeType === 'arrow' ? 'active' : ''}`} onClick={() => { setShapeType('arrow'); addShape('arrow'); }}>
            →
          </button>
          
          <div className="v-sep"></div>
          
          <button className="btn-icon-s" onClick={() => document.getElementById('shape-fill-picker')?.click()} style={{ background: shapeFill }}>
            <PaintBucket size={14} color="#fff" />
            <input id="shape-fill-picker" type="color" value={shapeFill} onChange={(e) => handleShapeFill(e.target.value)} style={{ display: 'none' }} />
          </button>
          
          <button className="btn-icon-s" onClick={() => document.getElementById('shape-outline-picker')?.click()} style={{ border: `2px solid ${shapeOutline}` }}>
            <Baseline size={14} />
            <input id="shape-outline-picker" type="color" value={shapeOutline} onChange={(e) => handleShapeOutline(e.target.value)} style={{ display: 'none' }} />
          </button>
        </div>

        <div className="tool-row" style={{ gap: '4px', marginBottom: '4px' }}>
          <button className="btn-mini-wide" onClick={bringToFront} disabled={!selectedShape}>
            <Layers size={14} /> Front
          </button>
          <button className="btn-mini-wide" onClick={sendToBack} disabled={!selectedShape}>
            <Layers size={14} style={{ transform: 'rotate(180deg)' }} /> Back
          </button>
          <button className="btn-mini-wide" onClick={bringForward} disabled={!selectedShape}>
            <ArrowUp size={14} /> Fwd
          </button>
          <button className="btn-mini-wide" onClick={sendBackward} disabled={!selectedShape}>
            <ArrowDown size={14} /> Bwd
          </button>
        </div>

        <div className="tool-row" style={{ gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="ribbon-text-s">Outline:</span>
            <select className="ribbon-select" value={outlineWidth} onChange={(e) => handleOutlineWidth(parseInt(e.target.value))} style={{ width: '60px' }} disabled={!selectedShape}>
              <option value="1">1px</option>
              <option value="2">2px</option>
              <option value="3">3px</option>
              <option value="4">4px</option>
              <option value="5">5px</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="ribbon-text-s">Opacity:</span>
            <input type="range" min="0" max="100" value={shapeOpacity} onChange={(e) => handleShapeOpacity(parseInt(e.target.value))} style={{ width: '60px' }} disabled={!selectedShape} />
            <span className="ribbon-text-s">{shapeOpacity}%</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="ribbon-text-s">Rotate:</span>
            <input type="number" value={rotation} onChange={(e) => handleRotation(parseInt(e.target.value))} style={{ width: '50px' }} min="0" max="360" disabled={!selectedShape} />
            <span>°</span>
          </div>
        </div>

        <div className="tool-row" style={{ gap: '4px', marginTop: '4px' }}>
          <button className={`btn-mini-wide ${shapeEffects.shadow ? 'active' : ''}`} onClick={() => handleEffect('shadow', !shapeEffects.shadow)} disabled={!selectedShape}>
            <div style={{ width: '12px', height: '12px', background: '#f59e0b', boxShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginRight: '4px' }} /> Shadow
          </button>
          <button className={`btn-mini-wide ${shapeEffects.glow ? 'active' : ''}`} onClick={() => handleEffect('glow', !shapeEffects.glow)} disabled={!selectedShape}>
            <Sparkles size={14} /> Glow
          </button>
          <button className={`btn-mini-wide ${shapeEffects.reflection ? 'active' : ''}`} onClick={() => handleEffect('reflection', !shapeEffects.reflection)} disabled={!selectedShape}>
            <RotateCcw size={14} /> Reflect
          </button>
          <button className="btn-mini-wide" onClick={duplicateShape} disabled={!selectedShape}>
            <Copy size={14} /> Duplicate
          </button>
          <button className="btn-mini-wide" onClick={deleteShape} disabled={!selectedShape} style={{ color: '#ef4444' }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
      <div className="group-label">Drawing</div>
    </div>
  );

  const renderEditingControls = () => (
    <div className="ribbon-group" key="editing">
      <div className="group-content-row">
        <button className="btn-find-replace" onClick={() => setShowSearchDialog(true)}>
          <div className="icon-wrapper">
            <Search size={18} color="#475569" />
            <span className="replace-badge">↔</span>
          </div>
          <div className="btn-text">
            <span className="main-text">Find</span>
            <span className="sub-text">Replace</span>
          </div>
        </button>
        
        <button 
          className={`btn-select-all ${!selectedField ? 'disabled' : ''}`} 
          onClick={handleSelectAll}
        >
          <MousePointer2 size={16} color={selectedField ? "#3b82f6" : "#94a3b8"} />
          <span className="select-text">Select All</span>
          <span className="shortcut-hint">Ctrl+A</span>
        </button>
      </div>
      <div className="group-label">Editing</div>
    </div>
  );

  const groups = [
    { 
      id: 'clipboard', 
      label: 'Clipboard', 
      megaIcon: Clipboard, 
      megaText: 'Paste', 
      onClick: handlePaste, 
      stackButtons: [
        { icon: Scissors, text: 'Cut', onClick: handleCut }, 
        { icon: Copy, text: 'Copy', onClick: handleCopy }, 
        { icon: PaintRoller, text: 'Format Painter', onClick: handleFormatPainter }
      ] 
    },
    { 
      id: 'slides', 
      label: 'Slides', 
      megaIcon: PlusSquare, 
      megaText: ['New', 'Slide'], 
      onClick: () => addNewSlide(LAYOUT_TYPES.BLANK), 
      stackButtons: [
        { icon: ChevronDown, text: 'More', onClick: () => { setPickerMode('add'); setShowLayoutPicker(true); } }, 
        { icon: Layout, text: 'Layout', onClick: () => { setPickerMode('change'); setShowLayoutPicker(true); } }
      ] 
    }
  ];

  return (
    <>
      {renderMegaWithStack(groups[0])}
      <div className="v-divider-slim"></div>
      {renderMegaWithStack(groups[1])}
      <div className="v-divider-slim"></div>
      {renderFontControls()}
      <div className="v-divider-slim"></div>
      {renderParagraphControls()}
      <div className="v-divider-slim"></div>
      {renderDrawingControls()}
      <div className="v-divider-slim"></div>
      {renderEditingControls()}
    </>
  );
};

export default HomeGroup;