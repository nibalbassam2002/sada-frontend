// src/components/Editor/groups/SessionGroup.js
import React from 'react';
import { Zap, QrCode, Trash2, MessageSquare, Music, Palette } from 'lucide-react';

const SessionGroup = () => {
  const groups = [
    {
      id: 'live-access',
      label: 'Live Access',
      type: 'session-live'
    },
    {
      id: 'audience-control',
      label: 'Audience Control',
      type: 'session-audience'
    },
    {
      id: 'atmosphere',
      label: 'Atmosphere',
      type: 'session-atmosphere'
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'session-live':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" style={{ border: '1px solid #f59e0b' }}>
                <Zap size={28} color="#f59e0b" />
                <span>Live Now</span>
              </button>
              <button className="btn-mega">
                <QrCode size={28} />
                <span>Show QR</span>
              </button>
              <button className="btn-mega">
                <Trash2 size={24} color="#ef4444" />
                <span>End Session</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'session-audience':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <label className="btn-mini-wide">
                <input type="checkbox" defaultChecked /> Names Required
              </label>
              <label className="btn-mini-wide">
                <input type="checkbox" defaultChecked /> Show Leaderboard
              </label>
              <button className="btn-mini-wide">
                <MessageSquare size={14} /> Chat: Enabled
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'session-atmosphere':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide">
                <Music size={14} color="#6366f1" /> BG Music
              </button>
              <button className="btn-mini-wide">
                <Palette size={14} color="#f59e0b" /> Theme for All
              </button>
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

export default SessionGroup;