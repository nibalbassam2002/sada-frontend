import React from 'react';

const SlideTheme = ({ themeId, children }) => {
  const renderShapes = () => {
    switch (themeId) {
      case 1: 
        return (
          <>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: '#f59e0b', clipPath: 'polygon(0 0, 100% 0, 0 100%)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '150px', height: '150px', border: '20px solid #f59e0b', borderRadius: '50%', opacity: 0.05 }}></div>
          </>
        );
      case 2: 
        return (
          <>
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '200px', height: '200px', background: '#3b82f6', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', border: '2px solid #3b82f6', borderRadius: '50%', opacity: 0.2 }}></div>
          </>
        );
      case 3: 
        return (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
        );
      case 4: 
        return (
          <>
            <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at 10% 20%, #fef3c7 0%, transparent 40%), radial-gradient(circle at 90% 80%, #dcfce7 0%, transparent 40%)', opacity: 0.5 }}></div>
          </>
        );
      case 5: 
        return (
          <div style={{ position: 'absolute', left: 0, top: '20%', width: '8px', height: '60%', background: '#f59e0b', borderRadius: '0 10px 10px 0' }}></div>
        );
      case 6: 
        return (
          <>
            <div style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px', border: '4px solid #1e293b', transform: 'rotate(45deg)', opacity: 0.1 }}></div>
            <div style={{ position: 'absolute', bottom: '40px', left: '40px', width: '100px', height: '100px', background: '#1e293b', transform: 'rotate(15deg)', opacity: 0.03 }}></div>
          </>
        );
      case 7: 
        return (
          <svg style={{ position: 'absolute', bottom: 0, width: '100%', opacity: 0.1 }} viewBox="0 0 1440 320"><path fill="#f59e0b" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        );
      case 8: 
        return (
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: '200px', height: '200px', backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)', backgroundSize: '15px 15px', opacity: 0.5 }}></div>
        );
      case 9: 
        return (
          <>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: '#f59e0b', borderRadius: '0 0 0 100%' }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100px', height: '100px', background: '#1e293b', borderRadius: '0 100% 0 0', opacity: 0.1 }}></div>
          </>
        );
      case 10: 
        return (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.03, background: 'repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px)' }}></div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      {renderShapes()}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default SlideTheme;