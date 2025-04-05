import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KeyboardShortcuts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Sound effects removed

  useEffect(() => {
    // Check if user has seen the tutorial before
    const tutorialSeen = localStorage.getItem('tutorialSeen');

    if (!tutorialSeen) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Sound effect removed
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setHasSeenTutorial(true);
    }
  }, []);

  const closeModal = () => {
    // Sound effect removed

    setIsVisible(false);

    // Mark tutorial as seen
    localStorage.setItem('tutorialSeen', 'true');
    setHasSeenTutorial(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when modal is not visible
      if (isVisible) return;

      switch (e.key) {
        case 'h':
          // Scroll to home
          document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'm':
          // Scroll to models
          document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'd':
          // Scroll to developer
          document.getElementById('developer')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'c':
          // Scroll to CLI
          document.getElementById('cli')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'g':
          // Scroll to config
          document.getElementById('config')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'o':
          // Scroll to docs
          document.getElementById('docs')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'u':
          // Scroll to course
          document.getElementById('course')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 't':
          // Scroll to tech stack
          document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'r':
          // Scroll to DevRel
          document.getElementById('founder')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 's':
          // Scroll to connect
          document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' });
          break;
        case '?':
          // Show keyboard shortcuts
          setIsVisible(true);
          try {
            openSound.play();
          } catch (error) {
            console.error('Error playing sound:', error);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Don't render anything if user has seen tutorial and modal is not visible
  if (hasSeenTutorial && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Blurry overlay */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/80 z-[9999]"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={closeModal}
          />

          {/* Modal Container - for perfect centering */}
          <div className="fixed inset-0 flex items-center justify-center z-[10000]">
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
              className="w-[95%] max-w-2xl bg-[#0a0a0a] border border-[#00DC82]/30 rounded-xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,220,130,0.3)] max-h-[85vh] overflow-auto backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#36E4DA]">Keyboard Shortcuts</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#00DC82] mb-4">Navigation</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Home</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">h</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Models</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">m</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Developer</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">d</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">CLI</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">c</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Config</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">g</kbd>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#00DC82] mb-4">More Sections</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Docs</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">o</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Course</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">u</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Tech Stack</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">t</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">DevRel</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">r</kbd>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-300">Connect</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">s</kbd>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show this help</span>
                  <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">?</kbd>
                </div>

                <p className="text-gray-500 text-sm mt-4">
                  Press <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-xs shadow-[0_0_5px_rgba(0,220,130,0.1)]">Esc</kbd> or click outside to close
                </p>
              </div>

              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <div className="bg-[#00DC82] h-1.5 w-16 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts;
