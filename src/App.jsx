import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes';
import { useEffect, useState } from 'react';
import Spinner from './components/ui/Spinner';
import { useAuth } from "./features/auth/auth.store";

function App() {

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { token } = useAuth();

  // to finish loading when fonts are loaded
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('WinkyRough', 'url(./fonts/WinkyRough-Regular.woff2)');
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

  // to change bg based on auth level
  useEffect(() => {
    if (token) {
      document.body.className = 'bg-gradient';
    } else {
      document.body.className = '';
    }

    return () => {
      document.body.className = '';
    };
  }, [token]);

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