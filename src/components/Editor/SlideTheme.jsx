import React from 'react';
import { motion } from 'framer-motion';

const SlideTheme = ({ themeData, slideType, children }) => {
    
    
    const primaryColor = themeData?.primary_color || '#f59e0b';

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#ffffff', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="shapes-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                
                <motion.div
                    animate={{
                        width: slideType === 'intro' ? '400px' : '150px',
                        height: slideType === 'intro' ? '400px' : '150px',
                        top: slideType === 'intro' ? '-50px' : '20px',
                        left: slideType === 'intro' ? '-50px' : '20px',
                    }}
                    style={{
                        position: 'absolute',
                        borderRadius: '50%',
                        background: primaryColor,
                        opacity: 0.1,
                    }}
                />

                {slideType === 'final' && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        style={{
                            position: 'absolute',
                            width: '300px',
                            height: '300px',
                            border: `2px solid ${primaryColor}`,
                            borderRadius: '50%',
                            opacity: 0.2
                        }}
                    />
                )}

                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '30%',
                    height: '10px',
                    background: primaryColor,
                    borderRadius: '10px 0 0 0'
                }}></div>
            </div>

            <div style={{ zIndex: 10, width: '80%', textAlign: 'center' }}>
                {children}
            </div>
        </div>
    );
};

export default SlideTheme;