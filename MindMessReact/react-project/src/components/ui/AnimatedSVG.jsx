import React, { useEffect, useRef } from 'react';

const AnimatedSVG = ({ 
  svgContent, 
  duration = 1, 
  strokeColor = '#00ff88', 
  strokeWidth = 1,
  className = ''
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Find all paths in the SVG
    const paths = svg.querySelectorAll('path');
    
    // Set up all paths initially
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.stroke = strokeColor;
      path.style.strokeWidth = strokeWidth;
      path.style.fill = 'none';
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';
    });

    // Animate paths sequentially
    const animatePath = (index) => {
      if (index >= paths.length) return;
      
      const path = paths[index];
      path.style.animation = `drawPath ${duration}s ease-in-out forwards`;
      
      // Listen for animation end
      const handleAnimationEnd = () => {
        path.removeEventListener('animationend', handleAnimationEnd);
        animatePath(index + 1); // Start next path
      };
      
      path.addEventListener('animationend', handleAnimationEnd);
    };

    // Start with first path
    animatePath(0);
  }, [svgContent, duration, strokeColor, strokeWidth]);

  return (
    <>
      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <div 
        className={className}
        ref={svgRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </>
  );
};

export default AnimatedSVG;