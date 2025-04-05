import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ExpandableContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ExpandableContentModal: React.FC<ExpandableContentModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[10000]">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 500,
                duration: 0.4
              }}
              className="w-[90%] max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-800 bg-black/50">
                  <h2 className="text-xl font-bold text-[#36E4DA] pr-8">{title}</h2>
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  {children}
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-black/50 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#36E4DA]/10 border border-[#36E4DA]/30 rounded-lg text-[#36E4DA] hover:bg-[#36E4DA]/20 hover:border-[#36E4DA]/50 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExpandableContentModal;
