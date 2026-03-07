// src/components/Editor/groups/QuestionsGroup.js
import React from 'react';
import {
  List, Cloud, MessageSquare, TrendingUp, Sliders, ImagePlus,
  Lightbulb, FileQuestion, Target, Award, Eye, EyeOff, Users,
  Timer, RotateCcw, Download, Settings
} from 'lucide-react';

const QuestionsGroup = () => {
  const groups = [
    {
      id: 'basic-polls',
      label: 'Basic Polls',
      type: 'polls-basic'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      type: 'polls-advanced'
    },
    {
      id: 'gaming',
      label: 'Gaming',
      type: 'polls-gaming'
    },
    {
      id: 'privacy',
      label: 'Privacy',
      type: 'polls-privacy'
    },
    {
      id: 'config',
      label: 'Config',
      type: 'polls-config'
    }
  ];

  const renderGroup = (group) => {
    switch(group.type) {
      case 'polls-basic':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <List size={28} color="#f59e0b" />
                <span>Multiple Choice</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide">
                  <Cloud size={14} color="#3b82f6" /> Word Cloud
                </button>
                <button className="btn-mini-wide">
                  <MessageSquare size={14} color="#10b981" /> Open Ended
                </button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-advanced':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <button className="btn-icon-s">
                  <TrendingUp size={16} color="#8b5cf6" /> Ranking
                </button>
                <button className="btn-icon-s">
                  <Sliders size={16} color="#06b6d4" /> Scales
                </button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s">
                  <ImagePlus size={16} color="#db2777" /> Images
                </button>
                <button className="btn-icon-s">
                  <Lightbulb size={16} color="#fbbf24" /> Ideas
                </button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-gaming':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <FileQuestion size={28} color="#ef4444" />
                <span>Quiz Mode</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide">
                  <Target size={14} color="#f97316" /> True / False
                </button>
                <button className="btn-mini-wide">
                  <Award size={14} color="#eab308" /> Leaderboard
                </button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-privacy':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide active-tool">
                <Eye size={14} color="#10b981" /> Public Results
              </button>
              <button className="btn-mini-wide">
                <EyeOff size={14} color="#64748b" /> Private View
              </button>
              <button className="btn-mini-wide">
                <Users size={14} color="#6366f1" /> Count: On
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-config':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <select className="ribbon-select" style={{ width: '65px' }}>
                  <option>30s</option>
                  <option>60s</option>
                </select>
              </div>
              <div className="tool-row" style={{ marginTop: '5px' }}>
                <button className="btn-icon-s" title="Reset">
                  <RotateCcw size={16} />
                </button>
                <button className="btn-icon-s" title="Report">
                  <Download size={16} />
                </button>
                <button className="btn-icon-s" title="Settings">
                  <Settings size={16} />
                </button>
              </div>
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

export default QuestionsGroup;