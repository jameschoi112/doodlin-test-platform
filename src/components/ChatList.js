import React from 'react';
import { User, Search } from 'lucide-react';
import { translations } from '../data';

const ChatList = ({ chats, selectedChat, setSelectedChat }) => {
  const t = translations.ko;

  return (
    <div className="w-80 bg-white dark:bg-cool-gray-800 border-r border-cool-gray-200 dark:border-cool-gray-700 h-full transition-colors duration-200">
      <div className="p-4 border-b border-cool-gray-200 dark:border-cool-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {chats.length}{t.activeChatCount}
          </h2>
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 border border-cool-gray-200 dark:border-cool-gray-600 rounded-lg bg-cool-gray-50 dark:bg-cool-gray-700 text-gray-800 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`p-4 border-b border-cool-gray-100 dark:border-cool-gray-700 cursor-pointer transition-all duration-200 hover:bg-cool-gray-50 dark:hover:bg-cool-gray-700 ${
              selectedChat?.id === chat.id ? 'bg-sky-50 dark:bg-sky-900/20 border-l-4 border-sky-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img src={chat.avatar} alt={chat.userName} className="w-10 h-10 rounded-full" />
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-sky-500 rounded-full border-2 border-white dark:border-cool-gray-800"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800 dark:text-white truncate">{chat.userName}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">
                    {chat.mode === 'ai' ? t.aiMode : t.manualMode}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;