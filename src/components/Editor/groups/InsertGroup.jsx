// src/components/Editor/groups/InsertGroup.jsx
import React from 'react';
import { useEditor } from '../EditorContext';
import {
  Table, Image, Search, Copy, Square, Smile, Layers, BarChart2,
  Link, MessageSquare, Type, PenTool, Hash, Sigma, Video, Music,
  ChevronDown
} from 'lucide-react';

const InsertGroup = () => {
  const { setShowTableModal } = useEditor();

  const groups = [
    {
      id: 'tables',
      label: 'Tables',
      type: 'simple-mega',
      icon: Table,
      text: 'Table',
      hasDropdown: true,
          onClick: () => {
      console.log(' Table button clicked'); // للتأكد
      setShowTableModal(true);
    }
    },
    {
      id: 'images',
      label: 'Images',
      type: 'mega-with-stack',
      megaIcon: Image,
      megaColor: '#059669',
      megaText: ['Pictures'],
      onClick: () => document.getElementById('global-image-upload')?.click(),
      stackButtons: [
        { icon: Search, text: 'Stock Images' },
        { icon: Copy, text: 'Screenshot' }
      ]
    },
    {
      id: 'illustrations',
      label: 'Illustrations',
      type: 'illustrations-grid'
    },
    {
      id: 'links-comments',
      label: 'Links & Comments',
      type: 'vertical-buttons',
      buttons: [
        { icon: Link, text: 'Link', color: '#2563eb' },
        { icon: MessageSquare, text: 'Comment', color: '#f59e0b' }
      ]
    },
    {
      id: 'text',
      label: 'Text',
      type: 'mega-with-stack',
      megaIcon: Type,
      megaColor: '#2563eb',
      megaText: 'Text Box',
      stackButtons: [
        { icon: PenTool, text: 'WordArt', color: '#db2777' },
        { icon: Hash, text: 'Slide Number' }
      ]
    },
    {
      id: 'symbols',
      label: 'Symbols',
      type: 'vertical-buttons',
      buttons: [
        { icon: Sigma, text: 'Equation', color: '#475569' },
        { icon: Smile, text: 'Symbol' }
      ]
    },
    {
      id: 'media',
      label: 'Media',
      type: 'vertical-buttons',
      buttons: [
        { icon: Video, text: 'Video', color: '#ef4444' },
        { icon: Music, text: 'Audio', color: '#3b82f6' }
      ]
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'simple-mega':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={group.onClick}>
                <group.icon size={28} color="#475569" />
                <div className="btn-label-stack">
                  <span>{group.text}</span>
                  {group.hasDropdown && <ChevronDown size={10} />}
                </div>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'mega-with-stack':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={group.onClick}>
                <group.megaIcon size={28} color={group.megaColor || "#475569"} />
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
                    <button key={i} className="btn-mini-wide">
                      <btn.icon size={14} color={btn.color} /> {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'illustrations-grid':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <button className="btn-icon-s"><Square size={16} /> Shapes</button>
                <button className="btn-icon-s"><Smile size={16} /> Icons</button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s"><Layers size={16} /> SmartArt</button>
                <button className="btn-icon-s"><BarChart2 size={16} /> Chart</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'vertical-buttons':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              {group.buttons.map((btn, i) => (
                <button key={i} className="btn-mini-wide">
                  <btn.icon size={16} color={btn.color} /> {btn.text}
                </button>
              ))}
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {groups.map((group, index) => (
        <React.Fragment key={group.id}>
          {renderGroup(group)}
          {index < groups.length - 1 && <div className="v-divider-slim"></div>}
        </React.Fragment>
      ))}
    </>
  );
};

export default InsertGroup;