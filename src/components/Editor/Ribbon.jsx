// src/components/Editor/Ribbon.jsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEditor } from './EditorContext';
import HomeGroup from './groups/HomeGroup';
import InsertGroup from './groups/InsertGroup';
import DesignGroup from './groups/DesignGroup';
import TransitionsGroup from './groups/TransitionsGroup';
import AnimationsGroup from './groups/AnimationsGroup';
import SlideShowGroup from './groups/SlideShowGroup';
import QuestionsGroup from './groups/QuestionsGroup';
import SessionGroup from './groups/SessionGroup';
import ReviewGroup from './groups/ReviewGroup';
import ViewGroup from './groups/ViewGroup';

const Ribbon = () => {
  const { activeTab, setActiveTab, isCollapsed, setIsCollapsed } = useEditor();

  const tabs = [
    'Home', 'Insert', 'Design', 'Transitions', 'Animations', 
    'Slide Show', 'Questions', 'Session', 'Review', 'View'
  ];

  const renderTabContent = () => {
    console.log('Rendering tab:', activeTab); // للتأكد
    switch(activeTab) {
      case 'Home': return <HomeGroup />;
      case 'Insert': return <InsertGroup />;
      case 'Design': return <DesignGroup />;
      case 'Transitions': return <TransitionsGroup />;
      case 'Animations': return <AnimationsGroup />;
      case 'Slide Show': return <SlideShowGroup />;
      case 'Questions': return <QuestionsGroup />;
      case 'Session': return <SessionGroup />;
      case 'Review': return <ReviewGroup />;
      case 'View': return <ViewGroup />;
      default: return null;
    }
  };

  return (
    <div className={`ribbon-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="ribbon-tabs">
        <div className="tabs-list">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`tab-link ${activeTab === tab ? 'active' : ''}`} 
              onClick={() => { 
                console.log('Switching to tab:', tab); // للتأكد
                setActiveTab(tab); 
                setIsCollapsed(false); 
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button 
          className="collapse-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="ribbon-content">
          <div className="tab-pane active fade-in">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ribbon;