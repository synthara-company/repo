import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GitFork, Key, BookOpen, Code2, ExternalLink, Terminal, Brain, Layers, Home, Bot, Laptop, Settings, MoreHorizontal, GraduationCap, Wrench, User, Link2 } from 'lucide-react';
import CursorEffect from './components/CursorEffect';
import AIAssistant from './components/AIAssistant';
import GenAI from './components/GenAI';
import ThemeController from './components/ThemeController';
import RegisterModal from './components/RegisterModal';
import TechStackChart from './components/TechStackChart';
import AIPartnersChart from './components/AIPartnersChart';
import ExpandableContentModal from './components/ExpandableContentModal';
import ExpandedTechStackView from './components/ExpandedTechStackView';
import ExpandedAIPartnersView from './components/ExpandedAIPartnersView';
import ImageRecognition from './components/ImageRecognition';
import ImageGeneration from './components/ImageGeneration';
import PremiumDocs from './components/PremiumDocs';

const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

// Modal component for legal policies
const PolicyModal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#111111] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-[#36E4DA]">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#00DC82] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00DC82]/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState('hero');

  // Modal states
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [licensingModalOpen, setLicensingModalOpen] = useState(false);

  // Model modal states
  const [llamaModalOpen, setLlamaModalOpen] = useState(false);
  const [geminiModalOpen, setGeminiModalOpen] = useState(false);
  const [grokModalOpen, setGrokModalOpen] = useState(false);

  // Registration modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Expanded content modal states
  const [techStackModalOpen, setTechStackModalOpen] = useState(false);
  const [aiPartnersModalOpen, setAIPartnersModalOpen] = useState(false);

  // Modal states for keyboard shortcuts
  const [keyboardShortcutsOpen, setKeyboardShortcutsOpen] = useState(false);
  const [showKeyboardShortcut, setShowKeyboardShortcut] = useState(true);

  // Show keyboard shortcut only when in hero section and on desktop/Mac
  useEffect(() => {
    // Check if device is mobile
    const isMobileDevice = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             window.innerWidth < 1024;
    };

    const isDesktopAndHero = activeSection === 'hero' && !isMobileDevice();

    // Update visibility based on active section and device type
    setShowKeyboardShortcut(isDesktopAndHero);

    // Add resize listener to hide on window resize to mobile dimensions
    const handleResize = () => {
      const isVisible = activeSection === 'hero' && !isMobileDevice();
      setShowKeyboardShortcut(isVisible);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection]);
  const [hasSeenKeyboardShortcuts, setHasSeenKeyboardShortcuts] = useState(() => {
    return localStorage.getItem('keyboardShortcutsSeen') === 'true';
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);

  useEffect(() => {
    // Create an IntersectionObserver for each section
    const sections = ['hero', 'models', 'developer', 'cli', 'config', 'docs', 'course', 'tech', 'founder', 'connect'];

    const observerOptions = {
      root: null, // viewport
      rootMargin: '-100px 0px', // Adjust the margin to trigger a bit earlier
      threshold: [0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better detection
    };

    const handleScroll = () => {
      // Scroll event handler (keeping for potential future use)
    };

    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      const visibleEntries = entries.filter(entry => entry.isIntersecting);

      if (visibleEntries.length > 0) {
        // Sort by intersection ratio (highest first)
        const mostVisibleEntry = visibleEntries.reduce((prev, current) => {
          return (prev.intersectionRatio > current.intersectionRatio) ? prev : current;
        });

        setActiveSection(mostVisibleEntry.target.id);
      }
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    // Add scroll event listener just for the scrolling animation effect
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key, 'Shift:', e.shiftKey); // Debug logging

      // Handle Escape key to close modals
      if (e.key === 'Escape') {
        if (keyboardShortcutsOpen) {
          setKeyboardShortcutsOpen(false);
          return;
        }
      }

      // Special case for Shift + / (question mark) - handle this BEFORE checking for focused inputs
      if (e.shiftKey && (e.key === '/' || e.key === '?')) {
        console.log('Shift + / detected, opening shortcuts'); // Debug logging
        e.preventDefault(); // Prevent typing '?' in inputs
        setKeyboardShortcutsOpen(true);
        return;
      }



      // Check if an input element is focused (for AI Assistant or other inputs)
      const isInputFocused = document.activeElement?.tagName === 'INPUT' ||
                            document.activeElement?.tagName === 'TEXTAREA' ||
                            document.activeElement?.getAttribute('contenteditable') === 'true';

      // Don't handle other shortcuts if input is focused or modals are open
      if (isInputFocused || keyboardShortcutsOpen) {
        return;
      }

      // Only handle single key shortcuts (no other modifiers)
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

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
        // Note: Shift + / is handled separately above
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardShortcutsOpen]);

  // Sound effects removed

  // Show keyboard shortcuts on first visit
  useEffect(() => {
    if (!hasSeenKeyboardShortcuts) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => {
        setKeyboardShortcutsOpen(true);
        // Sound effect removed
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasSeenKeyboardShortcuts]);

  // Handle keyboard shortcuts modal open/close
  useEffect(() => {
    // Mark as seen when closed
    if (!keyboardShortcutsOpen && !hasSeenKeyboardShortcuts) {
      localStorage.setItem('keyboardShortcutsSeen', 'true');
      setHasSeenKeyboardShortcuts(true);
    }
  }, [keyboardShortcutsOpen, hasSeenKeyboardShortcuts]);

  // Listen for custom events from AIAssistant
  useEffect(() => {
    // Event listener for opening keyboard shortcuts
    const handleOpenKeyboardShortcuts = () => {
      setKeyboardShortcutsOpen(true);
    };

    // Event listener for opening model modals
    const handleOpenModelModal = (event: CustomEvent) => {
      const { model } = event.detail;
      if (model === 'llama') {
        setLlamaModalOpen(true);
      } else if (model === 'gemini') {
        setGeminiModalOpen(true);
      } else if (model === 'grok') {
        setGrokModalOpen(true);
      }
    };

    // Event listener for opening GenAI
    const handleOpenGenAI = () => {
      // Find the GenAI button and simulate a click
      const genAIButton = document.querySelector('.genai-button');
      if (genAIButton) {
        (genAIButton as HTMLElement).click();
      }
    };

    // Add event listeners
    window.addEventListener('openKeyboardShortcuts', handleOpenKeyboardShortcuts);
    window.addEventListener('openModelModal', handleOpenModelModal as EventListener);
    window.addEventListener('openGenAI', handleOpenGenAI);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('openKeyboardShortcuts', handleOpenKeyboardShortcuts);
      window.removeEventListener('openModelModal', handleOpenModelModal as EventListener);
      window.removeEventListener('openGenAI', handleOpenGenAI);
    };
  }, []);

  const navigationDots = [
    { id: 'hero', label: 'Home' },
    { id: 'models', label: 'Models' },
    { id: 'developer', label: 'Developer' },
    { id: 'cli', label: 'CLI' },
    { id: 'config', label: 'Config' },
    { id: 'docs', label: 'Docs' },
    { id: 'course', label: 'Course' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'founder', label: 'Founder' },
    { id: 'connect', label: 'Connect' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Custom Cursor Effect */}
      <CursorEffect />

      {/* Keyboard shortcut hint */}
      {/* Keyboard shortcut button - Desktop/Mac only */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{
          opacity: showKeyboardShortcut ? 1 : 0,
          y: showKeyboardShortcut ? 0 : 20,
        }}
        transition={{
          duration: 0.8,
          ease: [0.19, 1, 0.22, 1] // Soft easing function (cubic bezier)
        }}
        style={{
          pointerEvents: showKeyboardShortcut ? 'auto' : 'none',
          display: 'flex' // Always keep in DOM for smooth transitions
        }}
        className="fixed bottom-6 left-2/3 -translate-x-1/2 z-50 hidden lg:flex items-center gap-2 bg-black/80 border border-[#00DC82]/30 shadow-[0_0_10px_rgba(0,220,130,0.3)] rounded-full px-4 py-2 text-sm text-gray-300 backdrop-blur-sm cursor-pointer hover:bg-black/90 hover:border-[#00DC82]/50 transition-colors max-[1024px]:!hidden"
        onClick={() => setKeyboardShortcutsOpen(true)}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-xs shadow-[0_0_5px_rgba(0,220,130,0.1)]">Shift</kbd>
            <span className="text-gray-500">+</span>
            <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-xs shadow-[0_0_5px_rgba(0,220,130,0.1)]">/</kbd>
          </div>
          <span>Press for keyboard shortcuts</span>
        </div>
      </motion.button>

      {/* Keyboard shortcut button is not shown on mobile devices */}

      {/* Image Generation Component */}
      <ImageGeneration />

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {keyboardShortcutsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/80 z-[9999]"
              style={{ backdropFilter: 'blur(8px)' }}
              onClick={() => setKeyboardShortcutsOpen(false)}
            />

            {/* Modal Container - for perfect centering */}
            <div className="fixed inset-0 flex items-center justify-center z-[10000] px-1" onClick={() => setKeyboardShortcutsOpen(false)}>
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
                className="w-[98%] max-w-3xl bg-[#0a0a0a] border border-[#00DC82]/30 rounded-xl p-3 md:p-6 z-[10000] shadow-[0_0_30px_rgba(0,220,130,0.2)] max-h-[85vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00DC82]/20 flex items-center justify-center">
                      <Key className="w-4 h-4 text-[#00DC82]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#00DC82]">Keyboard Shortcuts</h2>
                  </div>
                  <button
                    onClick={() => setKeyboardShortcutsOpen(false)}
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
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">Shift</kbd>
                      <span className="text-gray-500">+</span>
                      <kbd className="bg-black/80 px-2 py-1 rounded border border-[#00DC82]/20 text-[#00DC82] text-sm shadow-[0_0_5px_rgba(0,220,130,0.1)]">/</kbd>
                    </div>
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
      {/* Navigation Dots - Hidden on Mobile */}
      <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="space-y-4">
          {navigationDots.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-4"
            >
              <span className={`text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                activeSection === id ? 'text-[#00DC82]' : 'text-gray-400'
              }`}>
                {label}
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  activeSection === id
                    ? 'bg-[#00DC82] border-[#00DC82]'
                    : 'border-gray-400 group-hover:border-[#00DC82]'
                }`}
              />
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation - Only visible on small screens */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-gray-800 z-50 md:hidden safe-area-bottom w-full">
        <div className="flex justify-evenly items-center py-2 px-1 w-full">
          {navigationDots.slice(0, 2).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className={`flex flex-col items-center justify-center p-1 flex-1 ${activeSection === id ? 'text-[#00DC82]' : 'text-gray-400'}`}
              aria-label={`Scroll to ${label}`}
            >
              <div className="mb-1">
                {id === 'hero' && <Home className="w-4 h-4" />}
                {id === 'models' && <Bot className="w-4 h-4" />}
                {id === 'developer' && <Laptop className="w-4 h-4" />}
                {id === 'cli' && <Terminal className="w-4 h-4" />}
                {id === 'config' && <Settings className="w-4 h-4" />}
              </div>
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const moreMenu = document.getElementById('mobile-more-menu');
              if (moreMenu) {
                moreMenu.classList.toggle('hidden');
              }
            }}
            className="flex flex-col items-center justify-center p-1 flex-1 text-gray-400"
            aria-label="More sections"
          >
            <div className="mb-1"><MoreHorizontal className="w-4 h-4" /></div>
            <span className="text-[10px]">More</span>
          </button>
        </div>

        {/* Mobile More Menu */}
        <div id="mobile-more-menu" className="hidden absolute bottom-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 py-2 w-full">
          <div className="grid grid-cols-3 gap-2 px-2">
            {navigationDots.slice(2).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  document.getElementById('mobile-more-menu')?.classList.add('hidden');
                }}
                className={`flex flex-col items-center justify-center p-1 ${activeSection === id ? 'text-[#00DC82]' : 'text-gray-400'}`}
                aria-label={`Scroll to ${label}`}
              >
                <div className="mb-1">
                  {id === 'developer' && <Laptop className="w-4 h-4" />}
                  {id === 'cli' && <Terminal className="w-4 h-4" />}
                  {id === 'config' && <Settings className="w-4 h-4" />}
                  {id === 'docs' && <BookOpen className="w-4 h-4" />}
                  {id === 'course' && <GraduationCap className="w-4 h-4" />}
                  {id === 'tech' && <Wrench className="w-4 h-4" />}
                  {id === 'founder' && <User className="w-4 h-4" />}
                  {id === 'connect' && <Link2 className="w-4 h-4" />}
                </div>
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="container mx-auto px-4 py-24 md:py-40">
        <motion.div
          style={{ scale: scaleProgress, opacity: opacityProgress }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <img
              src="https://avatars.githubusercontent.com/u/203538727?s=200&v=4"
              alt="Synthara Logo"
              className="w-16 h-16 rounded-lg"
            />
            <h2 className="text-3xl font-bold">Synthara</h2>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-8xl font-bold mb-12 leading-tight gradient-text"
          >
            Multimodal ML Software <br />for Everyone
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            ML in Production? Here’s What Actually Works
          </motion.p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        {/* Models Section */}
        <section id="models" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <Brain className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Supported Models</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl cursor-pointer"
                  onClick={() => setLlamaModalOpen(true)}
                >
                  <div className="mb-6">
                    <img
                      src="/llama.jpeg"
                      alt="Meta Llama 2"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-[#36E4DA]">Meta Llama 2</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Optimize and deploy Meta's state-of-the-art Llama 2 models with enhanced efficiency and performance.
                  </p>
                  <ul className="space-y-4 text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Llama 2 7B/13B/70B
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Code Llama
                    </motion.li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl cursor-pointer"
                  onClick={() => setGeminiModalOpen(true)}
                >
                  <div className="mb-6">
                    <img
                      src="/gemini.jpeg"
                      alt="Google Gemini"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-[#36E4DA]">Google Gemini</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Leverage Google's Gemini models with optimized inference and deployment capabilities.
                  </p>
                  <ul className="space-y-4 text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Gemini Pro
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Gemini Ultra
                    </motion.li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl cursor-pointer"
                  onClick={() => setGrokModalOpen(true)}
                >
                  <div className="mb-6">
                    <img
                      src="/grok.jpg"
                      alt="xAI Grok"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-[#36E4DA]">xAI Grok</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Optimize and deploy xAI's Grok models with our advanced neural network optimization platform.
                  </p>
                  <ul className="space-y-4 text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Grok-1
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Grok-1.5
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* GitHub Section */}
        <section id="developer" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <Terminal className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Developer Integration</h2>
              </div>

              <div className="space-y-16">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Code2 className="w-8 h-8 text-[#36E4DA]" />
                    <h3 className="text-2xl font-semibold">Quick Start</h3>
                  </div>
                  <pre className="bg-[#111111] p-8 rounded-xl overflow-x-auto font-mono text-base">
                    <code>git clone https://github.com/synthara-company/repo.git{'\n'}cd repo{'\n'}npm install</code>
                  </pre>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <GitFork className="w-8 h-8 text-[#36E4DA]" />
                    <h3 className="text-2xl font-semibold">Contribution Guide</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Fork & Clone</h4>
                      <ol className="space-y-4 text-gray-300 text-lg">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">01</span>
                          Fork the repository
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">02</span>
                          Clone your fork locally
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">03</span>
                          Add upstream remote
                        </motion.li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Submit Changes</h4>
                      <ol className="space-y-4 text-gray-300 text-lg">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">01</span>
                          Create feature branch
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">02</span>
                          Make your changes
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex gap-4"
                        >
                          <span className="text-[#36E4DA]">03</span>
                          Submit pull request
                        </motion.li>
                      </ol>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* CLI Section */}
        <section id="cli" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <Terminal className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Command Line Interface</h2>
              </div>

              <div className="bg-[#111111] border border-yellow-600/30 rounded-lg p-6 mb-16">
                <p className="text-yellow-400 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span className="font-medium">Development Notice:</span>
                </p>
                <p className="text-gray-300 mt-2">
                  Our CLI is currently under active development and may not be supported on all operating systems or environments.
                  We're working hard to ensure compatibility across platforms. Please check back regularly for updates.
                </p>
              </div>

              <div className="space-y-16">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Code2 className="w-8 h-8 text-[#36E4DA]" />
                    <h3 className="text-2xl font-semibold">Installation</h3>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Install our CLI tool globally using npm or yarn:
                  </p>
                  <pre className="bg-[#111111] p-8 rounded-xl overflow-x-auto font-mono text-base">
                    <code>npm install -g synthara-cli{"\n"}# or{"\n"}yarn global add synthara-cli</code>
                  </pre>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Code2 className="w-8 h-8 text-[#36E4DA]" />
                    <h3 className="text-2xl font-semibold">Common Commands</h3>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Initialize a Project</h4>
                      <pre className="bg-[#111111] p-6 rounded-xl overflow-x-auto font-mono text-base">
                        <code>synthara init my-ml-project</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Deploy a Model</h4>
                      <pre className="bg-[#111111] p-6 rounded-xl overflow-x-auto font-mono text-base">
                        <code>synthara deploy --model ./models/my-model.pt</code>
                      </pre>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Monitor Performance</h4>
                      <pre className="bg-[#111111] p-6 rounded-xl overflow-x-auto font-mono text-base">
                        <code>synthara monitor --endpoint https://api.example.com/model</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* API & Configuration */}
        <section id="config" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <Key className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Configuration</h2>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-gradient p-10 rounded-2xl"
              >
                <h3 className="text-2xl font-semibold mb-8">Environment Setup</h3>
                <div className="space-y-8">
                  <p className="text-lg text-gray-300">
                    Create a <code className="bg-[#111111] px-3 py-1 rounded text-[#36E4DA]">.env</code> file with the following:
                  </p>
                  <pre className="bg-[#111111] p-8 rounded-xl overflow-x-auto font-mono text-base">
                    <code>SYNTHARA_API_KEY=your_key_here{'\n'}SYNTHARA_ENDPOINT=https://api.synthara.com{'\n'}MODEL_VERSION=latest</code>
                  </pre>
                </div>
              </motion.div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* Documentation */}
        <section id="docs" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <BookOpen className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Documentation</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-16">
                <div className="w-full md:w-1/3">
                  <div className="bg-black/30 border border-gray-800 rounded-xl p-6 shadow-lg h-full">
                    <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                    <p className="text-gray-300 mb-6">
                      Our comprehensive documentation covers everything from installation to advanced usage. Get started with our quick setup guide.
                    </p>
                    <div className="space-y-4 mb-6">
                      <div className="bg-black/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#00DC82]" />
                          Installation Guide
                        </h4>
                        <p className="text-sm text-gray-400">Learn how to install and set up our tools in your environment.</p>
                      </div>
                      <div className="bg-black/50 border border-gray-800 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-[#00DC82]" />
                          API Reference
                        </h4>
                        <p className="text-sm text-gray-400">Detailed API documentation with examples and use cases.</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button className="bg-[#00DC82] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#00DC82]/90 transition-colors shadow-[0_0_15px_rgba(0,220,130,0.3)] hover:shadow-[0_0_20px_rgba(0,220,130,0.4)]">
                        View Documentation
                      </button>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <div className="relative">
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                      PREMIUM
                    </div>
                    <PremiumDocs />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Core Concepts</h3>
                  <ul className="space-y-6 text-lg text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Architecture Overview
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Model Optimization
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Deployment Strategy
                    </motion.li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">API Reference</h3>
                  <ul className="space-y-6 text-lg text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      REST Endpoints
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      WebSocket API
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Authentication
                    </motion.li>
                  </ul>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Resources</h3>
                  <ul className="space-y-6 text-lg text-gray-300">
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Best Practices
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Examples
                    </motion.li>
                    <motion.li
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                      Tutorials
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* Course Section */}
        <section id="course" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <BookOpen className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Performance-Focused PyTorch Course</h2>
              </div>

              <div className="space-y-16">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Course Overview</h3>
                  <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                    Master the art of building high-performance neural networks from scratch using PyTorch.
                    This comprehensive course is designed for ML engineers and data scientists who want to
                    optimize their models for production environments.
                  </p>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-black/30 p-6 rounded-lg border border-[#00DC82]/20">
                      <h4 className="text-xl font-medium mb-4 text-[#00DC82]">What You'll Learn</h4>
                      <ul className="space-y-3 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Custom architecture design
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Model optimization techniques
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Production deployment strategies
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Performance benchmarking
                        </motion.li>
                      </ul>
                    </div>
                    <div className="bg-black/30 p-6 rounded-lg border border-[#00DC82]/20">
                      <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Course Format</h4>
                      <ul className="space-y-3 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          8-week intensive program
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Hands-on projects & exercises
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          1-on-1 mentorship sessions
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Certificate upon completion
                        </motion.li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Course Modules</h3>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <div className="mb-8">
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 1: Foundations</h4>
                        <p className="text-gray-300">Deep dive into PyTorch fundamentals, tensor operations, and autograd mechanics.</p>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 2: Architecture Design</h4>
                        <p className="text-gray-300">Learn to design custom neural network architectures for specific use cases.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 3: Training Optimization</h4>
                        <p className="text-gray-300">Master advanced training techniques, loss functions, and optimization algorithms.</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-8">
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 4: Performance Tuning</h4>
                        <p className="text-gray-300">Techniques for model quantization, pruning, and hardware acceleration.</p>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 5: Deployment</h4>
                        <p className="text-gray-300">Strategies for deploying models to production with TorchServe and ONNX.</p>
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-4 text-[#00DC82]">Module 6: Capstone Project</h4>
                        <p className="text-gray-300">Build and deploy a high-performance model solving a real-world problem.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black font-bold py-4 px-8 rounded-lg text-xl"
                    onClick={() => setRegisterModalOpen(true)}
                  >
                    Register Interest
                  </motion.button>
                  <p className="text-gray-400 mt-4">Registration opening soon - join the waitlist</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* Technology Stack */}
        <section id="tech" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <Layers className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Technology Stack</h2>
              </div>

              <div className="space-y-12">
                {/* Tech Stack Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TechStackChart openExpandedView={() => setTechStackModalOpen(true)} />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-6 md:p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Languages & Frameworks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Languages</h4>
                      <ul className="space-y-4 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Rust
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Python
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          C++
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          JavaScript
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Ruby
                        </motion.li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Frameworks</h4>
                      <ul className="space-y-4 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          React
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Node.js
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Flask
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          FastAPI
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          MongoDB
                        </motion.li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="card-gradient p-6 md:p-10 rounded-2xl"
                >
                  <h3 className="text-2xl font-semibold mb-8 text-[#36E4DA]">Infrastructure</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Containerization & Orchestration</h4>
                      <ul className="space-y-4 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Docker
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Docker Hub for XGBoost API containers
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Kubernetes
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Microservices Architecture
                        </motion.li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Acceleration & Compute</h4>
                      <ul className="space-y-4 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          NVIDIA CUDA® (with permission)
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          GPU Optimization
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Distributed Computing
                        </motion.li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium mb-6 text-[#00DC82]">Deployment & Hosting</h4>
                      <ul className="space-y-4 text-gray-300">
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Vercel
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Google Cloud Platform (GCP)
                        </motion.li>
                        <motion.li
                          whileHover={{ x: 10 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-[#00DC82]"></div>
                          Vertex AI
                        </motion.li>
                      </ul>
                      <p className="text-gray-400 text-sm mt-4">*CI/CD pipelines integrated with our deployment workflow</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="rounded-2xl overflow-hidden"
                >
                  <div className="bg-black/50 p-6 md:p-8 rounded-t-2xl border-b border-gray-800">
                    <h3 className="text-2xl font-semibold text-[#36E4DA]">AI Coding Partners Performance Analysis</h3>
                    <p className="text-gray-400 mt-2">Comparative analysis of efficiency and accuracy metrics across leading AI coding assistants</p>
                  </div>
                  <AIPartnersChart openExpandedView={() => setAIPartnersModalOpen(true)} />
                </motion.div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* Developer Relations Section */}
        <section id="founder" className="py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-[#00DC82]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <h2 className="text-4xl font-bold">Founder & DevRel</h2>
              </div>

              <div className="card-gradient p-6 md:p-10 rounded-2xl">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#00DC82]/30">
                      <img
                        src="/bniladridas.png"
                        alt="Niladri Das"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-0 right-0 text-center">
                      <span className="bg-black/80 text-gray-400 text-xs px-2 py-1 rounded-full">Generated with ChatGPT</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold mb-4 text-[#36E4DA]">Niladri Das</h3>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      Founder and Developer Relations (DevRel) at Synthara, specializing in CUDA optimization with C++.
                      Helping developers leverage GPU acceleration for high-performance computing and
                      machine learning applications through technical content, workshops, and community support.
                    </p>
                    <div className="flex flex-wrap gap-6">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://github.com/bniladridas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-[#00DC82] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                          <path d="M9 18c-4.51 2-5-2-7-2"></path>
                        </svg>
                        <span>@bniladridas</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://linkedin.com/in/bniladridas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-[#00DC82] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                        <span>Niladri Das</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://huggingface.co/bniladridas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-[#00DC82] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M17.5 6.5c.5.5 2.5.5 3 0s.5-2 0-2.5-2.5-.5-3 0-.5 2 0 2.5Z"/>
                          <path d="M10.5 6.5c-.5.5-2.5.5-3 0s-.5-2 0-2.5 2.5-.5 3 0 .5 2 0 2.5Z"/>
                          <path d="M20 9c0 1-1 2-2 2h-1a3 3 0 0 1-3-3V4"/>
                          <path d="M8 9c0 1 1 2 2 2h1a3 3 0 0 0 3-3V4"/>
                          <path d="M8 14v.5"/>
                          <path d="M16 14v.5"/>
                          <path d="M11.5 17.5c.5.5 2.5.5 3 0s.5-2 0-2.5-2.5-.5-3 0-.5 2 0 2.5Z"/>
                        </svg>
                        <span>Hugging Face</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://hub.docker.com/u/bniladridas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-[#00DC82] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M22 13V8a2 2 0 0 0-2-2h-8L9 3H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4"/>
                          <path d="M16 16h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2"/>
                          <path d="M22 13h-4"/>
                        </svg>
                        <span>Docker Hub</span>
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>

        <div className="section-divider"></div>

        {/* Social Links */}
        <section id="connect" className="py-16 md:py-32">
          <FadeInSection>
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center gap-4 mb-8 md:mb-16">
                <ExternalLink className="w-12 h-12 text-[#00DC82]" />
                <h2 className="text-4xl font-bold">Connect</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/synthara-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-gradient flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl hover:bg-[#111111] transition-colors group w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 group-hover:text-[#00DC82] transition-colors">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                  <span className="text-xl">GitHub</span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://linkedin.com/company/synthara-company"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-gradient flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-6 rounded-2xl hover:bg-[#111111] transition-colors group w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 group-hover:text-[#00DC82] transition-colors">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="text-xl">LinkedIn</span>
                </motion.a>


              </div>
            </div>
          </FadeInSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-16">
        <div className="section-divider mb-16"></div>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <img
                src="https://avatars.githubusercontent.com/u/203538727?s=200&v=4"
                alt="Synthara Logo"
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold">Synthara</span>
            </div>
            <p className="text-gray-400 text-lg">
              © 2025 Synthara Company. All rights reserved.
            </p>
          </div>

          {/* Legal Links - Moved higher */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-800">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 md:mb-0">
              <button
                onClick={() => setTermsModalOpen(true)}
                className="text-gray-400 hover:text-[#00DC82] text-sm transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setPrivacyModalOpen(true)}
                className="text-gray-400 hover:text-[#00DC82] text-sm transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setCookieModalOpen(true)}
                className="text-gray-400 hover:text-[#00DC82] text-sm transition-colors"
              >
                Cookie Policy
              </button>
              <button
                onClick={() => setLicensingModalOpen(true)}
                className="text-gray-400 hover:text-[#00DC82] text-sm transition-colors"
              >
                Licensing
              </button>
            </div>
            <div className="text-gray-500 text-xs">
              <p>This site uses cookies for analytics and personalized content.</p>
            </div>
          </div>

          {/* Sponsored Instances */}
          <div className="card-gradient p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-[#36E4DA] mb-4">Dev TS + AI + Node.js = 🔥</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <p className="text-gray-300 mb-2">Our cutting-edge tech stack powers everything:</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></div>
                    TypeScript for type-safe, robust applications
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></div>
                    Node.js for lightning-fast backend services
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></div>
                    AI-powered development workflows
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00DC82]"></div>
                    Out for secure form submissions
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center md:justify-end gap-2">
                <p className="text-xs text-gray-400 mb-1">Built with:</p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png" alt="TypeScript" className="h-8 object-contain" />
                    <span className="text-[10px] text-gray-500 mt-1">TypeScript</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="https://nodejs.org/static/images/logo.svg" alt="Node.js" className="h-8 object-contain" />
                    <span className="text-[10px] text-gray-500 mt-1">Node.js</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="/unnamed.png" alt="Google Gemini" className="h-8 object-contain" />
                    <span className="text-[10px] text-gray-500 mt-1">Google GenAI</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" alt="Vercel" className="h-8 object-contain" />
                    <span className="text-[10px] text-gray-500 mt-1">Vercel Deployment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 flex items-center justify-center bg-gradient-to-r from-[#00DC82] to-[#36E4DA] rounded-full text-black font-bold text-sm">
                      OUT
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">Out Forms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modals */}
      <PolicyModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms of Service"
      >
        <div className="space-y-6 text-gray-300">
          <h4 className="text-lg font-semibold text-white">1. Acceptance of Terms</h4>
          <p>
            By accessing and using Synthara Company's services, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our services.
          </p>

          <h4 className="text-lg font-semibold text-white">2. Use of Services</h4>
          <p>
            Our services are provided for professional and business purposes. You agree to use our services only for lawful purposes
            and in accordance with these Terms of Service.
          </p>

          <h4 className="text-lg font-semibold text-white">3. Intellectual Property</h4>
          <p>
            All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software,
            are the exclusive property of Synthara Company and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h4 className="text-lg font-semibold text-white">4. Limitation of Liability</h4>
          <p>
            Synthara Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your
            access to or use of, or inability to access or use, our services.
          </p>

          <h4 className="text-lg font-semibold text-white">5. Changes to Terms</h4>
          <p>
            We reserve the right to modify these Terms of Service at any time. Your continued use of our services following the posting
            of changes constitutes your acceptance of such changes.
          </p>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
      >
        <div className="space-y-6 text-gray-300">
          <h4 className="text-lg font-semibold text-white">1. Information We Collect</h4>
          <p>
            We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter,
            or contact us for support. We also automatically collect certain information about your device and how you interact with our services.
          </p>

          <h4 className="text-lg font-semibold text-white">2. Use of Information</h4>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to develop new services,
            and to protect Synthara and our users.
          </p>

          <h4 className="text-lg font-semibold text-white">3. Sharing of Information</h4>
          <p>
            We do not share your personal information with third parties except as described in this Privacy Policy,
            such as with service providers who assist us in our operations and legal obligations.
          </p>

          <h4 className="text-lg font-semibold text-white">4. Data Security</h4>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access.
          </p>

          <h4 className="text-lg font-semibold text-white">5. Your Rights</h4>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as the right to access,
            correct, or delete your personal information.
          </p>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={cookieModalOpen}
        onClose={() => setCookieModalOpen(false)}
        title="Cookie Policy"
      >
        <div className="space-y-6 text-gray-300">
          <h4 className="text-lg font-semibold text-white">1. What Are Cookies</h4>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work
            more efficiently and provide information to the website owners.
          </p>

          <h4 className="text-lg font-semibold text-white">2. How We Use Cookies</h4>
          <p>
            We use cookies for various purposes, including to understand how you interact with our services,
            to remember your preferences, and to personalize your experience.
          </p>

          <h4 className="text-lg font-semibold text-white">3. Types of Cookies We Use</h4>
          <p>
            We use both session cookies, which expire when you close your browser, and persistent cookies, which remain on your device until they expire or you delete them.
          </p>

          <h4 className="text-lg font-semibold text-white">4. Managing Cookies</h4>
          <p>
            Most web browsers allow you to control cookies through their settings. However, if you limit the ability of websites to set cookies,
            you may impact your overall user experience.
          </p>

          <h4 className="text-lg font-semibold text-white">5. Changes to This Cookie Policy</h4>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
          </p>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={licensingModalOpen}
        onClose={() => setLicensingModalOpen(false)}
        title="Licensing Information"
      >
        <div className="space-y-6 text-gray-300">
          <h4 className="text-lg font-semibold text-white">1. Software Licensing</h4>
          <p>
            Our software is licensed, not sold. The license grants you certain rights to use the software according to the specific license terms.
          </p>

          <h4 className="text-lg font-semibold text-white">2. Open Source Components</h4>
          <p>
            Our services may include open source software components. Any use of these components by you is governed by the terms of the applicable open source license.
          </p>

          <h4 className="text-lg font-semibold text-white">3. Restrictions</h4>
          <p>
            You may not reverse engineer, decompile, or disassemble our software, except and only to the extent that such activity is expressly permitted by applicable law.
          </p>

          <h4 className="text-lg font-semibold text-white">4. Third-Party Licenses</h4>
          <p>
            We acknowledge the use of third-party libraries and frameworks in our products. All third-party components are used in accordance with their respective licenses.
          </p>

          <h4 className="text-lg font-semibold text-white">5. License Updates</h4>
          <p>
            We reserve the right to update our licensing terms. Continued use of our services after such changes constitutes your consent to the updated terms.
          </p>
        </div>
      </PolicyModal>

      {/* Model Modals */}
      <PolicyModal
        isOpen={llamaModalOpen}
        onClose={() => setLlamaModalOpen(false)}
        title="Meta Llama 2"
      >
        <div className="space-y-6 text-gray-300">
          <img
            src="/llama.jpeg"
            alt="Meta Llama 2"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold text-[#36E4DA] mb-4">The Evolution of Open-Source AI</h4>
            <p className="text-lg leading-relaxed">
              Meta's Llama 2 represents a paradigm shift in the AI landscape—a collection of sophisticated generative text models that democratize access to cutting-edge AI technology. With parameter counts ranging from 7 billion to a massive 70 billion, these models deliver exceptional performance while maintaining the flexibility needed for enterprise-grade applications.
            </p>

            <div className="my-8 p-6 bg-black/30 rounded-xl border border-[#36E4DA]/20 shadow-inner">
              <blockquote className="italic text-gray-300 border-l-4 border-[#36E4DA] pl-4">
                "Llama 2 marks a significant milestone in our journey to advance AI and make these powerful tools more accessible to developers and businesses worldwide."
                <footer className="text-right text-sm text-gray-400 mt-2">— Mark Zuckerberg, CEO of Meta</footer>
              </blockquote>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Premium Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Enterprise-Ready Architecture</h5>
                </div>
                <p className="text-gray-400 pl-6">Open-source foundation with full commercial usage rights, enabling seamless integration into business workflows.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Scalable Performance</h5>
                </div>
                <p className="text-gray-400 pl-6">Multiple model sizes (7B, 13B, and 70B parameters) to balance computational requirements with performance needs.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Comprehensive Training</h5>
                </div>
                <p className="text-gray-400 pl-6">Built on a foundation of 2 trillion tokens from diverse, high-quality sources for robust knowledge and capabilities.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Specialized Variants</h5>
                </div>
                <p className="text-gray-400 pl-6">Fine-tuned versions like Llama 2-Chat deliver exceptional conversational experiences with enhanced safety features.</p>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Performance Excellence</h4>
            <div className="relative overflow-hidden rounded-xl bg-black/30 p-1 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36E4DA]/10 to-transparent"></div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/40">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">Model</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">MMLU</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">HumanEval</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">GSM8K</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">TruthfulQA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Llama 2 (70B)</td>
                      <td className="px-6 py-4">68.9%</td>
                      <td className="px-6 py-4">29.9%</td>
                      <td className="px-6 py-4">56.8%</td>
                      <td className="px-6 py-4">41.4%</td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Llama 2 (13B)</td>
                      <td className="px-6 py-4">54.8%</td>
                      <td className="px-6 py-4">18.3%</td>
                      <td className="px-6 py-4">28.7%</td>
                      <td className="px-6 py-4">38.2%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-400 text-sm italic mb-8">
              Llama 2 demonstrates exceptional performance across key benchmarks. The 70B model achieves results competitive with closed-source alternatives, particularly excelling in reasoning, coding, and knowledge-intensive tasks.
            </p>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-6">Enterprise Applications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070" alt="Conversational AI" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Conversational AI</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Create sophisticated chatbots and virtual assistants with natural, context-aware conversations.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070" alt="Code Generation" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Code Assistance</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Accelerate development with intelligent code generation, completion, and debugging support.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=2036" alt="Content Creation" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Content Creation</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Generate high-quality articles, summaries, and creative content with customizable tone and style.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={geminiModalOpen}
        onClose={() => setGeminiModalOpen(false)}
        title="Google Gemini"
      >
        <div className="space-y-6 text-gray-300">
          <img
            src="/gemini.jpeg"
            alt="Google Gemini"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold text-[#36E4DA] mb-4">The Multimodal AI Revolution</h4>
            <p className="text-lg leading-relaxed">
              Google Gemini represents a breakthrough in multimodal AI technology—a sophisticated family of models designed from the ground up to understand and reason across text, images, audio, video, and code simultaneously. Released in December 2023, Gemini marks Google's most advanced AI system, setting new standards for versatility and performance.
            </p>

            <div className="my-8 p-6 bg-black/30 rounded-xl border border-[#36E4DA]/20 shadow-inner">
              <blockquote className="italic text-gray-300 border-l-4 border-[#36E4DA] pl-4">
                "Gemini represents a significant leap forward in how AI can understand and operate across different types of information, bringing us closer to AI systems that can flexibly understand our world."
                <footer className="text-right text-sm text-gray-400 mt-2">— Demis Hassabis, CEO of Google DeepMind</footer>
              </blockquote>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Premium Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Native Multimodality</h5>
                </div>
                <p className="text-gray-400 pl-6">Built from the ground up to understand multiple modalities, enabling seamless reasoning across text, images, audio, and video.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Tiered Architecture</h5>
                </div>
                <p className="text-gray-400 pl-6">Available in Ultra, Pro, and Nano variants to balance computational requirements with performance needs across different deployment scenarios.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Benchmark Excellence</h5>
                </div>
                <p className="text-gray-400 pl-6">Achieves state-of-the-art results on 30 of 32 academic benchmarks, including human-expert performance on the MMLU benchmark with a 90.0% score.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Responsible Design</h5>
                </div>
                <p className="text-gray-400 pl-6">Engineered with extensive safety evaluations and responsible AI principles to ensure reliable and ethical deployment.</p>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Performance Excellence</h4>
            <div className="relative overflow-hidden rounded-xl bg-black/30 p-1 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36E4DA]/10 to-transparent"></div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/40">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">Model</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">MMLU</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">MATH</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">Multimodal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Gemini Ultra</td>
                      <td className="px-6 py-4">90.0%</td>
                      <td className="px-6 py-4">53.2%</td>
                      <td className="px-6 py-4">A+</td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Gemini Pro</td>
                      <td className="px-6 py-4">71.8%</td>
                      <td className="px-6 py-4">32.6%</td>
                      <td className="px-6 py-4">A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-400 text-sm italic mb-8">
              Gemini demonstrates exceptional performance across key benchmarks, with the Ultra variant achieving unprecedented results in multimodal understanding and complex reasoning tasks.
            </p>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-6">Enterprise Applications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=2070" alt="Multimodal Understanding" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Multimodal AI</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Process and analyze text, images, audio, and video simultaneously for comprehensive understanding.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1581472723648-909f4851d4ae?q=80&w=2070" alt="Advanced Research" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Scientific Research</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Accelerate discovery with advanced reasoning capabilities across complex scientific domains.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070" alt="Enterprise Solutions" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Enterprise Solutions</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Transform business operations with AI that understands and processes multiple data formats seamlessly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PolicyModal>

      <PolicyModal
        isOpen={grokModalOpen}
        onClose={() => setGrokModalOpen(false)}
        title="xAI Grok"
      >
        <div className="space-y-6 text-gray-300">
          <img
            src="/grok.jpg"
            alt="xAI Grok"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />

          <div className="prose prose-invert max-w-none">
            <h4 className="text-2xl font-bold text-[#36E4DA] mb-4">The AI with Personality</h4>
            <p className="text-lg leading-relaxed">
              xAI's Grok represents a fresh approach to large language models—combining advanced intelligence with a distinctive personality and sense of humor. Launched in November 2023, Grok breaks new ground by delivering not just accurate information, but engaging, witty responses that make AI interactions more natural and enjoyable.
            </p>

            <div className="my-8 p-6 bg-black/30 rounded-xl border border-[#36E4DA]/20 shadow-inner">
              <blockquote className="italic text-gray-300 border-l-4 border-[#36E4DA] pl-4">
                "Grok is designed to answer questions with a bit of wit and has a rebellious streak, so please don't use it if you hate humor!"
                <footer className="text-right text-sm text-gray-400 mt-2">— xAI Team</footer>
              </blockquote>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Premium Capabilities</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Massive Scale</h5>
                </div>
                <p className="text-gray-400 pl-6">Built on a transformer architecture with approximately 314 billion parameters (Grok-1), enabling sophisticated reasoning and knowledge representation.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Real-Time Knowledge</h5>
                </div>
                <p className="text-gray-400 pl-6">Equipped with web browsing capabilities to access and process current information, ensuring responses reflect the latest developments.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Distinctive Personality</h5>
                </div>
                <p className="text-gray-400 pl-6">Engineered to deliver responses with wit, humor, and a touch of rebelliousness, creating more engaging and human-like interactions.</p>
              </div>

              <div className="p-4 bg-black/20 rounded-lg border border-gray-800 hover:border-[#36E4DA]/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full bg-[#36E4DA]"></div>
                  <h5 className="font-semibold text-white">Continuous Evolution</h5>
                </div>
                <p className="text-gray-400 pl-6">Rapidly improving through user feedback and reinforcement learning, with Grok-1.5 showing significant advances in reasoning and knowledge tasks.</p>
              </div>
            </div>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-4">Performance Excellence</h4>
            <div className="relative overflow-hidden rounded-xl bg-black/30 p-1 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36E4DA]/10 to-transparent"></div>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-black/40">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">Model</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">MMLU</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">GSM8K</th>
                      <th scope="col" className="px-6 py-3 text-[#36E4DA]">HumanEval</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Grok-1</td>
                      <td className="px-6 py-4">63.2%</td>
                      <td className="px-6 py-4">62.9%</td>
                      <td className="px-6 py-4">63.2%</td>
                    </tr>
                    <tr className="border-b border-gray-800 hover:bg-black/40">
                      <td className="px-6 py-4 font-medium text-white">Grok-1.5</td>
                      <td className="px-6 py-4">73.0%</td>
                      <td className="px-6 py-4">76.3%</td>
                      <td className="px-6 py-4">69.4%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-gray-400 text-sm italic mb-8">
              Grok demonstrates impressive performance across key benchmarks, with particular strength in mathematical reasoning and coding tasks. The newer Grok-1.5 version shows substantial improvements across all metrics.
            </p>

            <h4 className="text-2xl font-bold text-[#36E4DA] mt-10 mb-6">Enterprise Applications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2010" alt="Creative Content" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Creative Content</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Generate engaging, personality-rich content that captures attention and drives engagement.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070" alt="Technical Problem-Solving" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Technical Solutions</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Solve complex technical problems with clear, accessible explanations and practical code examples.</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl aspect-square">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070" alt="Educational Content" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h5 className="text-lg font-bold text-white mb-1 group-hover:text-[#36E4DA] transition-colors">Educational Tools</h5>
                  <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Transform learning experiences with engaging, personalized educational content and interactive explanations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PolicyModal>

      {/* AI Assistant */}
      <AIAssistant />

      {/* GenAI Component */}
      <GenAI />

      {/* Theme Controller */}
      <ThemeController />

      {/* Registration Modal */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        openTermsModal={() => setTermsModalOpen(true)}
        openPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Expanded Tech Stack Modal */}
      <ExpandableContentModal
        isOpen={techStackModalOpen}
        onClose={() => setTechStackModalOpen(false)}
        title="Technology Stack - Detailed Analysis"
      >
        <ExpandedTechStackView />
      </ExpandableContentModal>

      {/* Expanded AI Partners Modal */}
      <ExpandableContentModal
        isOpen={aiPartnersModalOpen}
        onClose={() => setAIPartnersModalOpen(false)}
        title="AI Coding Partners - Detailed Analysis"
      >
        <ExpandedAIPartnersView />
      </ExpandableContentModal>

      {/* Image Recognition Component */}
      <ImageRecognition apiKey={import.meta.env.VITE_GEMINI_API_KEY || ''} />
    </div>
  );
}

export default App;
