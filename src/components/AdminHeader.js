import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { translations } from '../data';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const AdminHeader = () => {
  const t = translations.ko;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="relative z-10 w-full bg-white dark:bg-cool-gray-800 shadow-md border-b border-gray-200 dark:border-cool-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-sky-600 rounded-lg shadow-lg">
            <img
              src="/images/icon.png"
              alt="Icon"
              className="w-6 h-6"
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">
            TESTING <span className="text-sky-500">PLATFROM</span> 
          </h1>
        </div>

        <div className="flex items-center space-x-6">

          {/* System Status */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{t.systemOnline}</span>
          </div>

          {/* User Profile */}
          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-9 h-9 bg-cool-gray-200 dark:bg-cool-gray-700 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-cool-gray-800">
                <User className="w-5 h-5 text-cool-gray-600 dark:text-cool-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user && user.displayName ? `${user.displayName}님` : t.admin}
              </span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-cool-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-cool-gray-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  마이페이지
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-cool-gray-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
          {/* Notifications */}
          <div className="relative">
            <button className="p-2  rounded-full hover:bg-gray-200 dark:hover:bg-cool-gray-600 transition-colors">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;