import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, ChevronUp, ChevronDown, Sliders, Moon, Sun, Sparkles } from 'lucide-react';

// Define theme types
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
}

interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  icon?: React.ReactNode;
}

const ThemeController: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>('default');
  const [themeCategory, setThemeCategory] = useState<'all' | 'dark' | 'light' | 'colorful'>('all');
  const [customColors, setCustomColors] = useState<ThemeColors>({
    primary: '#00DC82',
    secondary: '#36E4DA',
    accent: '#00DC82',
    background: '#000000',
    cardBackground: '#0a0a0a',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc'
  });

  // Predefined themes inspired by Google Chrome themes
  const themes: Theme[] = [
    {
      id: 'default',
      name: 'Default',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#00DC82',
        secondary: '#36E4DA',
        accent: '#00DC82',
        background: '#000000',
        cardBackground: '#0a0a0a',
        textPrimary: '#ffffff',
        textSecondary: '#cccccc'
      }
    },
    {
      id: 'midnight',
      name: 'Midnight Blue',
      icon: <Moon className="w-4 h-4" />,
      colors: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        accent: '#2563eb',
        background: '#0f172a',
        cardBackground: '#1e293b',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1'
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      icon: <Sun className="w-4 h-4" />,
      colors: {
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#ea580c',
        background: '#18181b',
        cardBackground: '#27272a',
        textPrimary: '#ffffff',
        textSecondary: '#d4d4d8'
      }
    },
    {
      id: 'emerald',
      name: 'Emerald',
      icon: <Palette className="w-4 h-4" />,
      colors: {
        primary: '#10b981',
        secondary: '#34d399',
        accent: '#059669',
        background: '#0f172a',
        cardBackground: '#1e293b',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1'
      }
    },
    {
      id: 'purple',
      name: 'Purple Haze',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#7c3aed',
        background: '#0f1021',
        cardBackground: '#1e1b4b',
        textPrimary: '#ffffff',
        textSecondary: '#c7d2fe'
      }
    },
    {
      id: 'rose',
      name: 'Rose Gold',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#f43f5e',
        secondary: '#fb7185',
        accent: '#e11d48',
        background: '#1c1917',
        cardBackground: '#292524',
        textPrimary: '#ffffff',
        textSecondary: '#fecdd3'
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#0284c7',
        background: '#0c4a6e',
        cardBackground: '#075985',
        textPrimary: '#ffffff',
        textSecondary: '#bae6fd'
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#22c55e',
        secondary: '#4ade80',
        accent: '#16a34a',
        background: '#14532d',
        cardBackground: '#166534',
        textPrimary: '#ffffff',
        textSecondary: '#bbf7d0'
      }
    },
    {
      id: 'amber',
      name: 'Amber',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#f59e0b',
        secondary: '#fbbf24',
        accent: '#d97706',
        background: '#451a03',
        cardBackground: '#78350f',
        textPrimary: '#ffffff',
        textSecondary: '#fde68a'
      }
    },
    {
      id: 'cherry',
      name: 'Cherry',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#b91c1c',
        background: '#450a0a',
        cardBackground: '#7f1d1d',
        textPrimary: '#ffffff',
        textSecondary: '#fecaca'
      }
    },
    {
      id: 'lavender',
      name: 'Lavender',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#a855f7',
        secondary: '#c084fc',
        accent: '#9333ea',
        background: '#4c1d95',
        cardBackground: '#6b21a8',
        textPrimary: '#ffffff',
        textSecondary: '#e9d5ff'
      }
    },
    {
      id: 'teal',
      name: 'Teal',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#14b8a6',
        secondary: '#2dd4bf',
        accent: '#0d9488',
        background: '#134e4a',
        cardBackground: '#115e59',
        textPrimary: '#ffffff',
        textSecondary: '#99f6e4'
      }
    },
    {
      id: 'slate',
      name: 'Slate',
      icon: <Sparkles className="w-4 h-4" />,
      colors: {
        primary: '#64748b',
        secondary: '#94a3b8',
        accent: '#475569',
        background: '#0f172a',
        cardBackground: '#1e293b',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1'
      }
    },
    {
      id: 'light',
      name: 'Light Mode',
      icon: <Sun className="w-4 h-4" />,
      colors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#0284c7',
        background: '#f8fafc',
        cardBackground: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#334155'
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: <Moon className="w-4 h-4" />,
      colors: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
        accent: '#2563eb',
        background: '#111827',
        cardBackground: '#1f2937',
        textPrimary: '#ffffff',
        textSecondary: '#d1d5db'
      }
    },
    {
      id: 'custom',
      name: 'Custom',
      icon: <Sliders className="w-4 h-4" />,
      colors: customColors
    }
  ];

  // Apply theme to document
  useEffect(() => {
    const theme = themes.find(t => t.id === activeTheme)?.colors || themes[0].colors;

    // Set CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-card-background', theme.cardBackground);
    document.documentElement.style.setProperty('--color-text-primary', theme.textPrimary);
    document.documentElement.style.setProperty('--color-text-secondary', theme.textSecondary);

    // Extract RGB values for primary color
    const primaryRgb = hexToRgb(theme.primary);
    if (primaryRgb) {
      document.documentElement.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }

    // Extract RGB values for secondary color
    const secondaryRgb = hexToRgb(theme.secondary);
    if (secondaryRgb) {
      document.documentElement.style.setProperty('--color-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }

    // Update card gradient
    document.documentElement.style.setProperty(
      '--card-gradient',
      `linear-gradient(145deg, ${theme.cardBackground}, rgba(10, 10, 10, 0.5))`
    );

    // Apply theme to body background
    document.body.style.backgroundColor = theme.background;

    // Apply theme to specific elements that might not use CSS variables
    const styleElement = document.getElementById('theme-styles') || document.createElement('style');
    if (!styleElement.id) {
      styleElement.id = 'theme-styles';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      /* Basic elements */
      .lucide { color: ${theme.textPrimary}; }
      button:not([class*="bg-"]) { color: ${theme.textPrimary}; }
      h1, h2, h3, h4, h5, h6 { color: ${theme.textPrimary}; }
      p { color: ${theme.textSecondary}; }
      a:not([class*="text-"]) { color: ${theme.primary}; }

      /* Background colors */
      .bg-black { background-color: ${theme.background} !important; }
      [class*="bg-black"] { background-color: ${theme.background} !important; }
      [class*="bg-[#0a0a0a]"] { background-color: ${theme.cardBackground} !important; }

      /* Text colors */
      [class*="text-gray-400"] { color: ${theme.textSecondary} !important; }
      [class*="text-gray-300"] { color: ${theme.textSecondary} !important; }
      [class*="text-white"] { color: ${theme.textPrimary} !important; }
      [class*="text-[#00DC82]"] { color: ${theme.primary} !important; }
      [class*="text-[#36E4DA]"] { color: ${theme.secondary} !important; }

      /* Border colors */
      [class*="border-gray-800"] { border-color: rgba(${primaryRgb?.r || 0}, ${primaryRgb?.g || 0}, ${primaryRgb?.b || 0}, 0.2) !important; }
      [class*="border-[#00DC82]"] { border-color: ${theme.primary} !important; }
      [class*="border-[#36E4DA]"] { border-color: ${theme.secondary} !important; }

      /* Background colors for buttons and elements */
      [class*="bg-[#00DC82]"] { background-color: ${theme.primary} !important; }
      [class*="bg-[#36E4DA]"] { background-color: ${theme.secondary} !important; }

      /* Gradient colors */
      [class*="from-[#00DC82]"] { --tw-gradient-from: ${theme.primary} !important; }
      [class*="to-[#36E4DA]"] { --tw-gradient-to: ${theme.secondary} !important; }

      /* Shadow effects */
      [class*="shadow-[0_0_30px_rgba(0,220,130,0.2)]"] { box-shadow: 0 0 30px rgba(${primaryRgb?.r || 0}, ${primaryRgb?.g || 0}, ${primaryRgb?.b || 0}, 0.2) !important; }
      [class*="shadow-[0_0_15px_rgba(0,220,130,0.3)]"] { box-shadow: 0 0 15px rgba(${primaryRgb?.r || 0}, ${primaryRgb?.g || 0}, ${primaryRgb?.b || 0}, 0.3) !important; }
      [class*="shadow-[0_0_10px_rgba(0,220,130,0.2)]"] { box-shadow: 0 0 10px rgba(${primaryRgb?.r || 0}, ${primaryRgb?.g || 0}, ${primaryRgb?.b || 0}, 0.2) !important; }

      /* Specific component overrides */
      .bg-gradient-to-r { background-image: linear-gradient(to right, ${theme.primary}, ${theme.secondary}) !important; }
      .bg-gradient-to-b { background-image: linear-gradient(to bottom, ${theme.background}, ${theme.cardBackground}) !important; }
      [class*="hover:bg-[#00DC82]/90"] { transition: background-color 0.2s !important; }
      [class*="hover:bg-[#00DC82]/90"]:hover { background-color: ${theme.primary}e6 !important; }
      [class*="hover:bg-[#36E4DA]/90"] { transition: background-color 0.2s !important; }
      [class*="hover:bg-[#36E4DA]/90"]:hover { background-color: ${theme.secondary}e6 !important; }
      [class*="hover:border-[#00DC82]"] { transition: border-color 0.2s !important; }
      [class*="hover:border-[#00DC82]"]:hover { border-color: ${theme.primary} !important; }
      [class*="hover:text-[#00DC82]"] { transition: color 0.2s !important; }
      [class*="hover:text-[#00DC82]"]:hover { color: ${theme.primary} !important; }

      /* Background opacity variants */
      [class*="bg-[#00DC82]/10"] { background-color: ${theme.primary}1a !important; }
      [class*="bg-[#00DC82]/20"] { background-color: ${theme.primary}33 !important; }
      [class*="bg-[#00DC82]/30"] { background-color: ${theme.primary}4d !important; }
      [class*="bg-[#36E4DA]/10"] { background-color: ${theme.secondary}1a !important; }
      [class*="bg-[#36E4DA]/20"] { background-color: ${theme.secondary}33 !important; }
      [class*="bg-[#36E4DA]/30"] { background-color: ${theme.secondary}4d !important; }

      /* Border opacity variants */
      [class*="border-[#00DC82]/20"] { border-color: ${theme.primary}33 !important; }
      [class*="border-[#00DC82]/30"] { border-color: ${theme.primary}4d !important; }
      [class*="border-[#00DC82]/50"] { border-color: ${theme.primary}80 !important; }
      [class*="border-[#36E4DA]/20"] { border-color: ${theme.secondary}33 !important; }
      [class*="border-[#36E4DA]/30"] { border-color: ${theme.secondary}4d !important; }
      [class*="border-[#36E4DA]/50"] { border-color: ${theme.secondary}80 !important; }
    `;
  }, [activeTheme, customColors]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace(/^#/, '');

    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  };

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setActiveTheme(savedTheme);

      // Load custom colors if saved
      const savedCustomColors = localStorage.getItem('customColors');
      if (savedCustomColors) {
        try {
          setCustomColors(JSON.parse(savedCustomColors));
        } catch (e) {
          console.error('Error parsing saved custom colors', e);
        }
      }
    }
  }, []);

  // Save theme to localStorage
  const saveTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem('theme', themeId);

    // Save custom colors if using custom theme
    if (themeId === 'custom') {
      localStorage.setItem('customColors', JSON.stringify(customColors));
    }
  };

  // Handle color change for custom theme
  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    setCustomColors(prev => {
      const updated = { ...prev, [colorKey]: value };

      // If custom theme is active, update localStorage
      if (activeTheme === 'custom') {
        localStorage.setItem('customColors', JSON.stringify(updated));
      }

      return updated;
    });
  };

  return (
    <>
      {/* Theme Controller Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 md:bottom-20 left-4 md:left-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-black flex items-center justify-center theme-button-pulse hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.7)] hover:scale-110 transition-all duration-300 md:opacity-100 opacity-60"
        aria-label="Theme settings"
      >
        <Palette className="w-6 h-6" />
      </button>

      {/* Theme Controller Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-40 md:bottom-36 left-4 md:left-6 z-40 w-[300px] md:w-[360px] ${
              isMinimized ? 'h-16' : 'h-[400px] md:h-[500px]'
            } bg-[var(--color-card-background)] border border-[var(--color-primary)]/30 rounded-xl shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)] backdrop-blur-sm flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <h3 className="font-medium text-[var(--color-primary)]">Theme Controller</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">Select Theme</h4>
                      <span className="text-xs text-gray-500">{themes.length - 1} themes available</span>
                    </div>

                    {/* Theme Category Filter */}
                    <div className="flex mb-3 bg-black/30 rounded-lg p-1 text-xs">
                      <button
                        onClick={() => setThemeCategory('all')}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${themeCategory === 'all' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setThemeCategory('dark')}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${themeCategory === 'dark' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'}`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setThemeCategory('light')}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${themeCategory === 'light' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'}`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setThemeCategory('colorful')}
                        className={`flex-1 py-1.5 rounded-md transition-colors ${themeCategory === 'colorful' ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'}`}
                      >
                        Colorful
                      </button>
                    </div>

                    <div className="max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                      <div className="grid grid-cols-2 gap-2">
                        {themes
                          .filter(theme => {
                            if (themeCategory === 'all') return true;
                            if (themeCategory === 'light' && theme.id === 'light') return true;
                            if (themeCategory === 'dark' && theme.id !== 'light' && theme.id !== 'custom') return true;
                            if (themeCategory === 'colorful' && ['rose', 'ocean', 'forest', 'amber', 'cherry', 'lavender', 'teal'].includes(theme.id)) return true;
                            return false;
                          })
                          .map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => saveTheme(theme.id)}
                            className={`p-3 rounded-lg border transition-all ${
                              activeTheme === theme.id
                                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                : 'border-gray-800 hover:border-gray-700 bg-black/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium truncate mr-1">{theme.name}</span>
                              {activeTheme === theme.id && (
                                <Check className="w-4 h-4 flex-shrink-0 text-[var(--color-primary)]" />
                              )}
                            </div>
                            <div className="flex gap-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.primary }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.secondary }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.accent }}
                              ></div>
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.colors.background }}
                              ></div>
                            </div>
                          </button>
                        ))
                        }
                      </div>
                    </div>
                  </div>

                  {/* Custom Theme Controls */}
                  {activeTheme === 'custom' && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">Customize Colors</h4>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Primary Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={customColors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="w-8 h-8 rounded border border-gray-700 bg-transparent"
                            />
                            <input
                              type="text"
                              value={customColors.primary}
                              onChange={(e) => handleColorChange('primary', e.target.value)}
                              className="flex-1 bg-black/50 border border-gray-800 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Secondary Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={customColors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="w-8 h-8 rounded border border-gray-700 bg-transparent"
                            />
                            <input
                              type="text"
                              value={customColors.secondary}
                              onChange={(e) => handleColorChange('secondary', e.target.value)}
                              className="flex-1 bg-black/50 border border-gray-800 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Accent Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={customColors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="w-8 h-8 rounded border border-gray-700 bg-transparent"
                            />
                            <input
                              type="text"
                              value={customColors.accent}
                              onChange={(e) => handleColorChange('accent', e.target.value)}
                              className="flex-1 bg-black/50 border border-gray-800 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-gray-400 block mb-1">Background Color</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={customColors.background}
                              onChange={(e) => handleColorChange('background', e.target.value)}
                              className="w-8 h-8 rounded border border-gray-700 bg-transparent"
                            />
                            <input
                              type="text"
                              value={customColors.background}
                              onChange={(e) => handleColorChange('background', e.target.value)}
                              className="flex-1 bg-black/50 border border-gray-800 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  <div>
                    <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Preview</h4>
                    <div
                      className="p-4 rounded-lg border border-gray-800"
                      style={{ background: `linear-gradient(145deg, ${themes.find(t => t.id === activeTheme)?.colors.cardBackground || '#0a0a0a'}, rgba(10, 10, 10, 0.5))` }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themes.find(t => t.id === activeTheme)?.colors.primary }}
                        ></div>
                        <h5
                          className="text-sm font-medium"
                          style={{ color: themes.find(t => t.id === activeTheme)?.colors.primary }}
                        >
                          Sample Heading
                        </h5>
                      </div>
                      <p
                        className="text-xs mb-2"
                        style={{ color: themes.find(t => t.id === activeTheme)?.colors.textPrimary }}
                      >
                        This is how your text will look with the selected theme.
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: themes.find(t => t.id === activeTheme)?.colors.textSecondary }}
                      >
                        Secondary text appears like this.
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          className="px-2 py-1 text-xs rounded-md"
                          style={{
                            backgroundColor: themes.find(t => t.id === activeTheme)?.colors.primary,
                            color: '#000000'
                          }}
                        >
                          Primary
                        </button>
                        <button
                          className="px-2 py-1 text-xs rounded-md"
                          style={{
                            backgroundColor: themes.find(t => t.id === activeTheme)?.colors.secondary,
                            color: '#000000'
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeController;
