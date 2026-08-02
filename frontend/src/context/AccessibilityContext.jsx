import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large, x-large
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [guideY, setGuideY] = useState(200);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (readingGuide) {
        setGuideY(e.clientY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  return (
    <AccessibilityContext.Provider value={{
      fontSize, setFontSize,
      dyslexicFont, setDyslexicFont,
      highContrast, setHighContrast,
      readingGuide, setReadingGuide
    }}>
      <div className={`min-h-screen ${dyslexicFont ? 'dyslexia-font' : ''} ${highContrast ? 'high-contrast-mode' : ''} font-size-${fontSize}`}>
        {readingGuide && (
          <div 
            className="fixed left-0 w-full h-12 bg-amber-400/20 border-y-2 border-amber-400 pointer-events-none z-50 transition-all duration-75"
            style={{ top: `${guideY - 24}px` }}
          />
        )}
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
