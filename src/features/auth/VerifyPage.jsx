import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth.store';
import { verifyMagicToken } from './auth.api';
import Spinner from '../../components/ui/Spinner';

const VerifyPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);

  useEffect(() => {
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get('token');

    const hash = window.location.hash; // "#/auth/verify?token=abc123"
    const queryString = hash.split('?')[1];
    const params = new URLSearchParams(queryString);
    const token = params.get('token');

    if (!token) {
      setError('Invalid token');
      return;
    }

    verifyMagicToken(token)
      .then((res) => {
        login(res.user, res.token); // save user + token
        navigate('/app/'); // redirect to homepage
      })
      .catch((err) => {
        setError(err?.error || 'Verification failed, request a new link!');
      });
  }, []);

  return (
    <div className="p-2 flex justify-center items-center h-screen">
      {error ? (
        <div className='text-center space-y-5'>
          <img width="150" src="./useBrain.webp" alt="meme picture" />
          <p className="text-red">{error}</p>
        </div>
      ) : (
        <div className='flex items-center space-x-1 text-muted'>
          <Spinner />
          <p className='pt-1'>Verifying magic link...</p>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
