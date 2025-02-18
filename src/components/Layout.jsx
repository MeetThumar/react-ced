import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';
import { getTheme, setTheme } from '../utils/theme.js';

export default function Layout() {
  const [theme, setCurrentTheme] = React.useState(getTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 flex-grow">
        <nav className="bg-gray-100 dark:bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-400 dark:text-blue-400" />
                <Link to="/" className="ml-2 font-bold text-xl text-gray-800 dark:text-white">
                  MND
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
                <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Contact
                </Link>
                <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  About
                </Link>
                <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p>&copy; 2025 MND, All Rights Reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/privacypolicy" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
            <Link to="/tos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}