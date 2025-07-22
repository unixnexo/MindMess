import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';
import { useEffect, useState } from 'react';
import Spinner from './components/ui/Spinner';


function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('WinkyRough', 'url(/fonts/WinkyRough-Regular.woff2)');
        await font.load();
        document.fonts.add(font);
        setFontsLoaded(true);
      } catch (error) {
        console.error('Font loading failed:', error);
        setFontsLoaded(true);
      }
    };

    loadFont();
  }, []);

  if (!fontsLoaded) {
    return <Spinner fullScreen="true" />;
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;