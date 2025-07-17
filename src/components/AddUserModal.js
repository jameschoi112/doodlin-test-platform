import React, { useState } from 'react';
import { X, User, Mail, Key } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AddUserModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else if (error.code === 'auth/weak-password') {
        setError('비밀번호는 6자 이상이어야 합니다.');
      } else {
        setError('계정 생성 중 오류가 발생했습니다.');
      }
      console.error("Error creating user:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-cool-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">새 계정 추가</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            <p className="font-bold">성공</p>
            <p>새로운 사용자가 성공적으로 추가되었습니다.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">오류</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-6">
          <div className="relative">
            <User className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-cool-gray-700 border border-gray-200 dark:border-cool-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-cool-gray-700 border border-gray-200 dark:border-cool-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="relative">
            <Key className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-cool-gray-700 border border-gray-200 dark:border-cool-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-base font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-cool-gray-800 transition"
          >
            사용자 생성
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;