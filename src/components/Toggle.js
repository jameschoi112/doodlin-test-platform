import React from 'react';

const Toggle = ({ enabled, onChange, leftLabel, rightLabel }) => {
  return (
    <div className="flex items-center space-x-2">
      {leftLabel && <span className={`text-sm font-medium ${!enabled ? 'text-sky-600' : 'text-gray-500'}`}>{leftLabel}</span>}
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
          enabled ? 'bg-sky-600' : 'bg-gray-300 dark:bg-cool-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {rightLabel && <span className={`text-sm font-medium ${enabled ? 'text-sky-600' : 'text-gray-500'}`}>{rightLabel}</span>}
    </div>
  );
};

export default Toggle;