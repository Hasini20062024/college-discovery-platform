import '../styles/globals.css';
import Header from '../components/Header';
import { useAuthStore } from '../store/index.js';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
