const Spinner = ({ fullScreen = false }) => {
 const spinnerStyle = {
   position: 'relative',
   width: '24px',
   height: '24px',
   display: 'inline-block',
  //  padding: '10px',
   borderRadius: '10px'
 };

 const overlayStyle = {
   position: 'fixed',
   top: -15,
   left: 0,
   right: 0,
   bottom: 0,
   backgroundColor: 'white',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   zIndex: 9999,
   height: '100dvh',
   width: '100vw'
 };

 const barBaseStyle = {
   willChange: 'opacity, transform',
   width: '6%',
   height: '16%',
   background: 'gray',
   position: 'absolute',
   left: '50%',
   top: '50%',
   opacity: 0,
   borderRadius: '50px',
   boxShadow: '0 0 3px rgba(0, 0, 0, 0.2)',
   animation: 'fade 1s linear infinite'
 };

 const bars = [
   { rotation: 0, delay: '0s' },
   { rotation: 30, delay: '-0.9167s' },
   { rotation: 60, delay: '-0.833s' },
   { rotation: 90, delay: '-0.7497s' },
   { rotation: 120, delay: '-0.667s' },
   { rotation: 150, delay: '-0.5837s' },
   { rotation: 180, delay: '-0.5s' },
   { rotation: 210, delay: '-0.4167s' },
   { rotation: 240, delay: '-0.333s' },
   { rotation: 270, delay: '-0.2497s' },
   { rotation: 300, delay: '-0.167s' },
   { rotation: 330, delay: '-0.0833s' }
 ];

 const spinnerElement = (
   <div style={spinnerStyle}>
     {bars.map((bar, index) => (
       <div
         key={index}
         style={{
           ...barBaseStyle,
           transform: `rotate(${bar.rotation}deg) translate(0, -130%)`,
           animationDelay: bar.delay
         }}
       />
     ))}
   </div>
 );

 return (
   <>
     <style>{`
       @keyframes fade {
         from { opacity: 1; }
         to { opacity: 0.25; }
       }
     `}</style>
     {fullScreen ? (
       <div style={overlayStyle}>
         {spinnerElement}
       </div>
     ) : (
       spinnerElement
     )}
   </>
 );
};

export default Spinner;