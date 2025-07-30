import { useEffect, useRef } from 'react';

const AnimatedSVG = ({ 
 svgContent, 
 duration = 1, 
 strokeColor = 'black', 
 strokeWidth = 1,
 className = '',
 startAnimation = true,
 delay = 0
}) => {
 const svgRef = useRef(null);

 useEffect(() => {
   const svg = svgRef.current;
   if (!svg) return;

   const paths = svg.querySelectorAll('path');

   // Always set initial state first to hide paths
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

   if (!startAnimation) return;

   // Start animation after delay
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
 }, [startAnimation, svgContent, duration, strokeColor, strokeWidth, delay]);

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
       className={`${className} will-change-transform`}
       style={{ transform: 'translateZ(0)' }}
       ref={svgRef}
       dangerouslySetInnerHTML={{ __html: svgContent }}
     />
   </>
 );
};

export default AnimatedSVG;