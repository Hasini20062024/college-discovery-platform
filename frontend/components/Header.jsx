import { useAuthStore } from '../store/index.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    useAuthStore.persist?.rehydrate();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between py-2">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary">CollegeSphere</h1>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary">
            Home
          </Link>
          <Link href="/colleges" className="text-gray-700 hover:text-primary">
            Colleges
          </Link>
          <Link href="/compare" className="text-gray-700 hover:text-primary">
            Compare
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/saved" className="text-gray-700 hover:text-primary">
                Saved
              </Link>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-primary">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
