import React, { useEffect, useRef } from 'react';

const AnimatedSVG = ({
  svgContent,
  duration = 1,
  strokeColor = 'black',
  strokeWidth = 1,
  className = '',
  startAnimation = true,
  delay = 0
}) => {
  const pathsRef = useRef([]);

  useEffect(() => {
    const paths = pathsRef.current;

    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.stroke = strokeColor;
      path.style.strokeWidth = strokeWidth;
      path.style.fill = 'none';
      path.style.strokeLinecap = 'round';
      path.style.strokeLinejoin = 'round';
      path.style.animation = 'none'; // reset
    });

    if (!startAnimation) return;

    const timer = setTimeout(() => {
      const animatePath = (index) => {
        if (index >= paths.length) return;
        const path = paths[index];
        path.style.animation = `drawPath ${duration}s ease-in-out forwards`;

        const handleAnimationEnd = () => {
          path.removeEventListener('animationend', handleAnimationEnd);
          animatePath(index + 1);
        };

        path.addEventListener('animationend', handleAnimationEnd);
      };

      animatePath(0);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [startAnimation, duration, strokeColor, strokeWidth, delay]);

  return (
    <>
      <style>{`
        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <div className={className}>
        {React.cloneElement(svgContent, {}, 
          React.Children.map(svgContent.props.children, (child, i) => {
            if (child.type === 'path') {
              return React.cloneElement(child, {
                ref: el => pathsRef.current[i] = el
              });
            }
            return child;
          })
        )}
      </div>
    </>
  );
};

export default AnimatedSVG;
