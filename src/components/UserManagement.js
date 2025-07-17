import React, { useState } from 'react';
import { translations, mockChats } from '../data';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical, PlusCircle, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = ({ language, darkMode }) => {
  const t = translations[language];
  const [users, setUsers] = useState(mockChats.map(chat => ({ ...chat, role: 'Member', status: chat.isOnline ? 'Active' : 'Inactive' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex-1 p-6 md:p-8 bg-cool-gray-50 dark:bg-cool-gray-900 overflow-y-auto">
      <motion.header
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            {t.userManagement}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{t.userManagementDesc}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg shadow-sm hover:bg-sky-700 transition-colors">
          <PlusCircle size={20} />
          <span>{t.addUser}</span>
        </motion.button>
      </motion.header>

      <motion.div 
        className="bg-white dark:bg-cool-gray-800 p-6 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-cool-gray-200 dark:border-cool-gray-600 rounded-lg bg-cool-gray-50 dark:bg-cool-gray-700 text-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-cool-gray-50 dark:bg-cool-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">{t.user}</th>
                <th scope="col" className="px-6 py-3">{t.status}</th>
                <th scope="col" className="px-6 py-3">{t.role}</th>
                <th scope="col" className="px-6 py-3">{t.lastLogin}</th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="bg-white border-b dark:bg-cool-gray-800 dark:border-cool-gray-700 hover:bg-cool-gray-50 dark:hover:bg-cool-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id={`checkbox-table-${user.id}`} type="checkbox" className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor={`checkbox-table-${user.id}`} className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="w-10 h-10 bg-cool-gray-300 dark:bg-cool-gray-600 rounded-full flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-cool-gray-600 dark:text-cool-gray-300" />
                    </div>
                    <div className="pl-3">
                      <div className="text-base font-semibold">{user.userName}</div>
                      <div className="font-normal text-gray-500">{user.email}</div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div> {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{user.lastChatDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="flex items-center justify-between pt-4" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstUser + 1}-{indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span></span>
          <ul className="inline-flex items-center -space-x-px">
            <li>
              <button onClick={() => paginate(1)} disabled={currentPage === 1} className="px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-cool-gray-800 dark:border-cool-gray-700 dark:text-gray-400 dark:hover:bg-cool-gray-700 dark:hover:text-white disabled:opacity-50">
                <ChevronsLeft size={16} />
              </button>
            </li>
            <li>
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-cool-gray-800 dark:border-cool-gray-700 dark:text-gray-400 dark:hover:bg-cool-gray-700 dark:hover:text-white disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
            </li>
            <li>
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-cool-gray-800 dark:border-cool-gray-700 dark:text-gray-400 dark:hover:bg-cool-gray-700 dark:hover:text-white disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </li>
            <li>
              <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-cool-gray-800 dark:border-cool-gray-700 dark:text-gray-400 dark:hover:bg-cool-gray-700 dark:hover:text-white disabled:opacity-50">
                <ChevronsRight size={16} />
              </button>
            </li>
          </ul>
        </nav>
      </motion.div>
    </div>
  );
};

export default UserManagement;