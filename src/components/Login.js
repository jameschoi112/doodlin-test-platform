import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      // Redirect is handled by the App component's onAuthStateChanged
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('이메일 또는 비밀번호가 잘못되었습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-cool-gray-50 dark:bg-cool-gray-900">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-dashboard-bg text-white p-12">
        <div className="text-center">
          <div className="mb-6">
            <img
              src="/images/icon.png"
              alt="Testing Platform Icon"
              className="w-16 h-16 mx-auto mb-4"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-wider">
           <span className="text-sky-400">TESTING</span> PLATFORM
          </h1>
          <p className="mt-4 text-lg text-sky-100">
            테스팅 플랫폼
          </p>
        </div>
      </div>

      {/* Right Panel (Login Form) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            로그인
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            계속하려면 로그인해주세요.
          </p>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 mt-1 bg-gray-100 dark:bg-cool-gray-800 border border-gray-200 dark:border-cool-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 mt-1 bg-gray-100 dark:bg-cool-gray-800 border border-gray-200 dark:border-cool-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                아이디 저장
              </label>
            </div>

            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
            
            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-base font-semibold text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-cool-gray-900 transition duration-150 ease-in-out"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;