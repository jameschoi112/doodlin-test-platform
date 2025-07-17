import React from 'react';
import { User, Mail, Phone, MapPin, Car, Download, UserX } from 'lucide-react';
import { translations } from '../data';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start">
    <Icon className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-white break-words">{value}</p>
    </div>
  </div>
);

const UserDetails = ({ user }) => {
  const t = translations.ko;

  if (!user) {
    return (
      <div className="w-96 bg-cool-gray-50 dark:bg-cool-gray-900 border-l border-cool-gray-200 dark:border-cool-gray-700 h-full p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-cool-gray-500">
            <User className="w-12 h-12 mx-auto mb-4" />
            <p>Select a user to see details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white dark:bg-cool-gray-800 border-l border-cool-gray-200 dark:border-cool-gray-700 h-full p-6 flex flex-col transition-colors duration-200">
      <div className="flex-1">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.userName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.userId}</p>
        </div>

        <div className="bg-cool-gray-50 dark:bg-cool-gray-900/50 rounded-xl p-4 space-y-3 text-sm mb-8">
          <InfoItem icon={Mail} label={t.email} value={user.email} />
          <InfoItem icon={Phone} label={t.phone} value={user.phone} />
          <InfoItem icon={MapPin} label={t.region} value={user.region} />
          <InfoItem icon={Car} label={t.carModel} value={user.carModel} />
          <InfoItem icon={Car} label={t.carNumber} value={user.carNumber} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center mb-8">
          <div className="bg-cool-gray-50 dark:bg-cool-gray-900/50 rounded-xl p-3">
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{user.totalChats}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.totalChats}</p>
          </div>
          <div className="bg-cool-gray-50 dark:bg-cool-gray-900/50 rounded-xl p-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.lastChatDate}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.lastChat}</p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">{t.quickActions}</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium rounded-lg border border-cool-gray-200 dark:border-cool-gray-700 text-gray-700 dark:text-gray-300 hover:bg-cool-gray-100 dark:hover:bg-cool-gray-700/50 transition-colors">
              <Download className="w-4 h-4 mr-2" /> {t.exportChat}
            </button>
            <button className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/80 transition-colors">
              <UserX className="w-4 h-4 mr-2" /> {t.addBlacklist}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;