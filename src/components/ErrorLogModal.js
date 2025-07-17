import React, { useState } from 'react';
import { X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ErrorLogModal = ({ isOpen, onClose, errorData }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!isOpen || !errorData) return null;

  const { error, screenshotURL } = errorData;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4"
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-cool-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="p-5 bg-red-600 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <AlertTriangle size={24} className="mr-3" />
                  <h2 className="text-xl font-bold">Error Details</h2>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  className="p-1 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>
              
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Error Message */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex-shrink-0">Error Message</h3>
                    <div className="bg-cool-gray-100 dark:bg-cool-gray-900 p-4 rounded-lg overflow-y-auto flex-grow">
                      <pre className="text-red-500 dark:text-red-400 text-sm whitespace-pre-wrap break-words">
                        {error || 'No error message provided.'}
                      </pre>
                    </div>
                  </div>

                  {/* Right: Screenshot */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center flex-shrink-0">
                      <ImageIcon size={20} className="mr-2" />
                      Screenshot
                    </h3>
                    <div className="border border-cool-gray-200 dark:border-cool-gray-700 rounded-lg overflow-hidden flex-grow flex items-center justify-center">
                      {screenshotURL ? (
                        <img
                          src={screenshotURL}
                          alt="Error Screenshot"
                          className="max-w-full max-h-full object-contain cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setIsZoomed(true)}
                        />
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400">No screenshot available.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lightbox for Zoomed Image */}
          {isZoomed && screenshotURL && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center"
              onClick={() => setIsZoomed(false)}
            >
              <motion.img
                src={screenshotURL}
                alt="Error Screenshot - Zoomed"
                className="max-w-[95vw] max-h-[95vh] object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default ErrorLogModal;