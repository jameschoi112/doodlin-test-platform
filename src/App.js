import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AdminHeader from './components/AdminHeader';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TestList from './components/TestList';
import TestDetail from './components/TestDetail';
import TemplateManagement from './components/TemplateManagement';
import TestSchedule from './components/TestSchedule';
import Login from './components/Login';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // 다크 모드 초기화
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // 다크 모드 토글
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // 사용자 상태 체크
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.displayName) {
        localStorage.setItem('userName', currentUser.displayName);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // 로그인이 안 된 경우 로그인 페이지로
  if (!user) {
    return <Login />;
  }

  // 로그인이 된 경우 메인 앱 렌더링
  return (
    <Router>
      <div className="flex h-screen bg-cool-gray-50 dark:bg-cool-gray-900 transition-colors duration-300">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />

          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/tests" element={<TestList darkMode={darkMode} />} />
              <Route path="/tests/:testId" element={<TestDetail darkMode={darkMode} />} />
              <Route path="/templates" element={<TemplateManagement />} />
              <Route path="/schedule" element={<TestSchedule darkMode={darkMode} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;