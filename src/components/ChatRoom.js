import React, { useState } from 'react';
import { User, MoreVertical, MessageCircle, Send } from 'lucide-react';
import { translations, mockMessages } from '../data';
import Toggle from './Toggle';

const ChatRoom = ({ chat }) => {
  const t = translations.ko;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [mode, setMode] = useState(chat?.mode || 'ai');

  const sendMessage = () => {
    if (message.trim() && mode === 'manual') {
      const newMessage = {
        id: messages.length + 1,
        sender: 'admin',
        message: message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-cool-gray-50 dark:bg-cool-gray-900">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-cool-gray-300 dark:text-cool-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-cool-gray-600 dark:text-cool-gray-400 mb-2">{t.selectConversation}</h3>
          <p className="text-cool-gray-500 dark:text-cool-gray-500">{t.selectConversationDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-cool-gray-800 transition-colors duration-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-cool-gray-200 dark:border-cool-gray-700 bg-white dark:bg-cool-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={chat.avatar} alt={chat.userName} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{chat.userName}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{chat.userId}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Toggle
              enabled={mode === 'manual'}
              onChange={(enabled) => setMode(enabled ? 'manual' : 'ai')}
              leftLabel={t.aiMode}
              rightLabel={t.manualMode}
            />
            <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
          >
            {msg.sender === 'user' && (
              <img src={chat.avatar} alt="User" className="w-8 h-8 rounded-full" />
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-cool-gray-100 dark:bg-cool-gray-700 text-gray-800 dark:text-white'
                  : msg.sender === 'admin'
                  ? 'bg-sky-500 text-white'
                  : 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
            </div>
            {msg.sender !== 'user' && (
              <img src="/images/user-avatar4.png" alt="Admin" className="w-8 h-8 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cool-gray-200 dark:border-cool-gray-700 bg-white dark:bg-cool-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={mode === 'manual' ? t.typeMessage : 'AI 모드에서는 입력할 수 없습니다'}
            disabled={mode !== 'manual'}
            className="flex-1 px-4 py-2 border border-cool-gray-200 dark:border-cool-gray-600 rounded-lg bg-cool-gray-50 dark:bg-cool-gray-700 text-gray-800 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={mode !== 'manual'}
            className="p-2 bg-sky-500 text-white rounded-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;