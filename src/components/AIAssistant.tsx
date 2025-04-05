import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  options?: Option[];
};

type Option = {
  id: string;
  text: string;
  action: () => void;
};

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Sound effects removed

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        toggleAssistant();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  // Add AI message with typing effect
  const addAIMessage = (text: string, options?: Option[]) => {
    setIsTyping(true);

    // Simulate typing
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text, sender: 'ai', options }]);
      setIsTyping(false);
      // Sound effect removed
    }, 1000);
  };

  // Add user message
  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
  };

  // Handle user input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);

    // If we don't have the user's name yet, save it
    if (!userName) {
      setUserName(inputValue);
      localStorage.setItem('userName', inputValue);

      // Respond to the name with personalized greeting
      setTimeout(() => {
        // Variety of personalized greetings
        const nameGreetings = [
          `Nice to meet you, ${inputValue}! I'm Synth, your AI assistant for this website. How can I help you today?`,
          `It's a pleasure to meet you, ${inputValue}! I'm Synth, and I'm here to enhance your experience. What would you like to explore?`,
          `Hello ${inputValue}! Thanks for sharing your name. I'm Synth, your personal guide to this website. What interests you most?`,
          `Great to meet you, ${inputValue}! I'm Synth, and I'm excited to help you discover everything this website has to offer. Where should we start?`
        ];

        addAIMessage(nameGreetings[Math.floor(Math.random() * nameGreetings.length)], [
          {
            id: 'tour',
            text: 'Give me a tour of the website',
            action: () => startTour()
          },
          {
            id: 'models',
            text: 'Tell me about the models',
            action: () => scrollToSection('models')
          },
          {
            id: 'shortcuts',
            text: 'Show keyboard shortcuts',
            action: () => showKeyboardShortcuts()
          },
          {
            id: 'developer',
            text: 'Developer resources',
            action: () => scrollToSection('developer')
          }
        ]);
      }, 500);
    } else {
      // Handle other user inputs
      handleUserInput(inputValue);
    }

    setInputValue('');
  };

  // Process user input and generate appropriate response with advanced NLP
  const handleUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    const words = lowerInput.split(/\s+/);
    const containsAny = (arr: string[]) => arr.some(term => lowerInput.includes(term));

    // Greeting patterns
    if (containsAny(['hello', 'hi', 'hey', 'greetings', 'howdy', 'sup'])) {
      const greetings = [
        `Hello again, ${userName}! How can I assist you today?`,
        `Hi there, ${userName}! What can I help you with?`,
        `Hey ${userName}! Great to chat with you. What would you like to know?`
      ];
      addAIMessage(greetings[Math.floor(Math.random() * greetings.length)], getMainOptions());
      return;
    }

    // Tour requests
    if (containsAny(['tour', 'show me', 'guide', 'walk', 'explore'])) {
      const responses = [
        `I'd be happy to give you a tour of our website, ${userName}!`,
        `Let me show you around our site, ${userName}!`,
        `I'll guide you through our website's features, ${userName}!`
      ];
      addAIMessage(responses[Math.floor(Math.random() * responses.length)]);
      setTimeout(() => startTour(), 1000);
      return;
    }

    // GenAI specific requests
    if (containsAny(['genai', 'gemini api', 'try gemini', 'google ai', 'chat with gemini'])) {
      addAIMessage('Would you like to try our GenAI interface to interact with Google Gemini API?', [
        {
          id: 'genai',
          text: 'Open GenAI',
          action: () => {
            addAIMessage('Opening the GenAI interface where you can interact with Google Gemini API...');
            const event = new CustomEvent('openGenAI');
            window.dispatchEvent(event);
          }
        },
        {
          id: 'more-info',
          text: 'Tell me more',
          action: () => {
            addAIMessage('GenAI is our interface for interacting with Google\'s Gemini API. You can ask questions, get creative responses, and explore the capabilities of this powerful language model. You\'ll need to provide your own API key to use it.');
          }
        }
      ]);
      return;
    }

    // Model information requests
    if (containsAny(['model', 'llama', 'gemini', 'grok', 'ai', 'language model', 'ml'])) {
      const responses = [
        'We have several cutting-edge AI models available. Which one interests you?',
        'Our platform features multiple state-of-the-art models. Which would you like to explore?',
        'I can tell you about our AI models. Which one would you like to learn about?'
      ];
      addAIMessage(responses[Math.floor(Math.random() * responses.length)], [
        {
          id: 'llama',
          text: 'Meta Llama 2',
          action: () => openModelModal('llama')
        },
        {
          id: 'gemini',
          text: 'Google Gemini',
          action: () => openModelModal('gemini')
        },
        {
          id: 'grok',
          text: 'xAI Grok',
          action: () => openModelModal('grok')
        }
      ]);
      return;
    }

    // Keyboard shortcuts
    if (containsAny(['keyboard', 'shortcut', 'hotkey', 'key', 'press', 'command'])) {
      const responses = [
        'Let me show you the keyboard shortcuts that make navigation easier:',
        'Here are the keyboard shortcuts you can use on our website:',
        'These keyboard shortcuts will help you navigate more efficiently:'
      ];
      addAIMessage(responses[Math.floor(Math.random() * responses.length)]);
      setTimeout(() => showKeyboardShortcuts(), 1000);
      return;
    }

    // Developer tools and technical questions
    if (containsAny(['developer', 'code', 'api', 'sdk', 'programming', 'develop', 'build', 'create', 'tech', 'technology'])) {
      addAIMessage(`Our developer tools provide everything you need to integrate our models into your applications. Would you like to learn more?`, [
        {
          id: 'dev-tools',
          text: 'Developer Tools',
          action: () => scrollToSection('developer')
        },
        {
          id: 'cli-tools',
          text: 'CLI Tools',
          action: () => scrollToSection('cli')
        },
        {
          id: 'tech-stack',
          text: 'Our Tech Stack',
          action: () => scrollToSection('tech')
        }
      ]);
      return;
    }

    // Documentation and learning
    if (containsAny(['doc', 'documentation', 'learn', 'course', 'tutorial', 'guide', 'how to', 'example'])) {
      addAIMessage(`We have comprehensive resources to help you learn. What are you interested in?`, [
        {
          id: 'docs',
          text: 'Documentation',
          action: () => scrollToSection('docs')
        },
        {
          id: 'courses',
          text: 'Courses',
          action: () => scrollToSection('course')
        },
        {
          id: 'config',
          text: 'Configuration Guides',
          action: () => scrollToSection('config')
        }
      ]);
      return;
    }

    // Help requests
    if (containsAny(['help', 'assist', 'support', 'guidance', 'confused', 'lost', 'what can you do'])) {
      const responses = [
        `I'm here to help you navigate our website and find what you need, ${userName}. What are you interested in?`,
        `I can assist you with exploring our website, ${userName}. What would you like to know about?`,
        `I'm your personal guide to our platform, ${userName}. How can I help you today?`
      ];
      addAIMessage(responses[Math.floor(Math.random() * responses.length)], getMainOptions());
      return;
    }

    // Thanks and appreciation
    if (containsAny(['thank', 'thanks', 'appreciate', 'helpful', 'awesome', 'great', 'good job'])) {
      const responses = [
        `You're welcome, ${userName}! I'm happy I could help. Is there anything else you'd like to know?`,
        `My pleasure, ${userName}! What else can I assist you with today?`,
        `Glad I could be of assistance, ${userName}! What else would you like to explore?`
      ];
      addAIMessage(responses[Math.floor(Math.random() * responses.length)], getMainOptions());
      return;
    }

    // Questions about the company/team
    if (containsAny(['who', 'team', 'company', 'founder', 'about', 'devrel', 'people'])) {
      addAIMessage(`Our Founder and DevRel lead specializes in CUDA optimization with C++. Would you like to learn more about them?`, [
        {
          id: 'founder',
          text: 'Meet our Founder',
          action: () => scrollToSection('founder')
        },
        {
          id: 'connect',
          text: 'Connect with us',
          action: () => scrollToSection('connect')
        }
      ]);
      return;
    }

    // Questions about capabilities
    if (containsAny(['what can you do', 'capabilities', 'features', 'function'])) {
      addAIMessage(`I can help you navigate the website, learn about our AI models, explore developer tools, find documentation, and much more. What are you interested in?`, getMainOptions());
      return;
    }

    // Handling negative feedback or frustration
    if (containsAny(['not working', 'broken', 'stupid', 'useless', 'bad', 'terrible', 'hate', 'sucks', 'awful'])) {
      addAIMessage(`I'm sorry to hear that you're having trouble, ${userName}. Let me try to help you better. What specifically are you looking for?`, getMainOptions());
      return;
    }

    // Handling compliments
    if (containsAny(['smart', 'intelligent', 'clever', 'good', 'amazing', 'excellent', 'love', 'like'])) {
      addAIMessage(`Thank you for the kind words, ${userName}! I'm here to make your experience better. What can I help you with today?`, getMainOptions());
      return;
    }

    // Try to extract intent from question format
    if (lowerInput.startsWith('how') || lowerInput.startsWith('what') || lowerInput.startsWith('where') ||
        lowerInput.startsWith('when') || lowerInput.startsWith('why') || lowerInput.startsWith('who') ||
        lowerInput.startsWith('can') || lowerInput.endsWith('?')) {

      // Technical questions
      if (containsAny(['work', 'use', 'implement', 'integrate', 'setup', 'configure', 'install'])) {
        addAIMessage(`That's a great question about implementation. Our documentation and developer resources can help with that:`, [
          {
            id: 'docs',
            text: 'Documentation',
            action: () => scrollToSection('docs')
          },
          {
            id: 'developer',
            text: 'Developer Tools',
            action: () => scrollToSection('developer')
          },
          {
            id: 'config',
            text: 'Configuration',
            action: () => scrollToSection('config')
          }
        ]);
        return;
      }

      // General questions
      addAIMessage(`That's an interesting question, ${userName}. I think these resources might help you find the answer:`, getMainOptions());
      return;
    }

    // Default response with more personality
    const defaultResponses = [
      `I'm not quite sure I understood that, ${userName}. Here are some topics I can help with:`,
      `I'd like to help you better, ${userName}. Could you try rephrasing or check out these options:`,
      `I'm still learning, ${userName}! Here are some things I know about that might interest you:`,
      `Let me suggest some popular topics that might be helpful, ${userName}:`
    ];
    addAIMessage(defaultResponses[Math.floor(Math.random() * defaultResponses.length)], getMainOptions());
  };

  // Get main options for the assistant
  const getMainOptions = (): Option[] => {
    return [
      {
        id: 'tour',
        text: 'Give me a tour',
        action: () => startTour()
      },
      {
        id: 'models',
        text: 'Explore models',
        action: () => scrollToSection('models')
      },
      {
        id: 'developer',
        text: 'Developer tools',
        action: () => scrollToSection('developer')
      },
      {
        id: 'shortcuts',
        text: 'Keyboard shortcuts',
        action: () => showKeyboardShortcuts()
      },
      {
        id: 'genai',
        text: 'Try GenAI',
        action: () => {
          addAIMessage('Opening the GenAI interface where you can interact with Google Gemini API...');
          // Dispatch a custom event to open the GenAI modal
          const event = new CustomEvent('openGenAI');
          window.dispatchEvent(event);
        }
      }
    ];
  };

  // Start the website tour
  const startTour = () => {
    addAIMessage(`Great! Let me show you around our website, ${userName}.`);

    setTimeout(() => {
      addAIMessage('We have several sections to explore:', [
        {
          id: 'models-tour',
          text: 'AI Models',
          action: () => {
            scrollToSection('models');
            setTimeout(() => {
              addAIMessage('This is our Models section. We showcase Meta Llama 2, Google Gemini, and xAI Grok. Click on any model to learn more!', [
                {
                  id: 'next-developer',
                  text: 'Next: Developer Tools',
                  action: () => {
                    scrollToSection('developer');
                    setTimeout(() => {
                      addAIMessage('Here are our Developer Tools. We provide powerful APIs and SDKs for integrating our models into your applications.', [
                        {
                          id: 'next-cli',
                          text: 'Next: CLI Tools',
                          action: () => {
                            scrollToSection('cli');
                            setTimeout(() => {
                              addAIMessage('Our Command Line Interface makes it easy to work with our models directly from your terminal.', [
                                {
                                  id: 'next-config',
                                  text: 'Next: Configuration',
                                  action: () => {
                                    scrollToSection('config');
                                    setTimeout(() => {
                                      addAIMessage('The Configuration section shows how to set up and customize our tools for your specific needs.', [
                                        {
                                          id: 'next-docs',
                                          text: 'Next: Documentation',
                                          action: () => {
                                            scrollToSection('docs');
                                            setTimeout(() => {
                                              addAIMessage('Our comprehensive documentation helps you get the most out of our platform.', [
                                                {
                                                  id: 'next-course',
                                                  text: 'Next: Courses',
                                                  action: () => {
                                                    scrollToSection('course');
                                                    setTimeout(() => {
                                                      addAIMessage('We offer courses to help you master our tools and technologies.', [
                                                        {
                                                          id: 'next-tech',
                                                          text: 'Next: Tech Stack',
                                                          action: () => {
                                                            scrollToSection('tech');
                                                            setTimeout(() => {
                                                              addAIMessage('Our Tech Stack section showcases the technologies we use.', [
                                                                {
                                                                  id: 'next-founder',
                                                                  text: 'Next: Founder',
                                                                  action: () => {
                                                                    scrollToSection('founder');
                                                                    setTimeout(() => {
                                                                      addAIMessage('Meet our Founder and DevRel lead who specializes in CUDA optimization with C++.', [
                                                                        {
                                                                          id: 'next-connect',
                                                                          text: 'Next: Connect',
                                                                          action: () => {
                                                                            scrollToSection('connect');
                                                                            setTimeout(() => {
                                                                              addAIMessage('Finally, here\'s how you can connect with us. That completes our tour! What would you like to do next?', getMainOptions());
                                                                            }, 1000);
                                                                          }
                                                                        },
                                                                        {
                                                                          id: 'end-tour',
                                                                          text: 'End tour',
                                                                          action: () => {
                                                                            addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                                                          }
                                                                        }
                                                                      ]);
                                                                    }, 1000);
                                                                  }
                                                                },
                                                                {
                                                                  id: 'end-tour',
                                                                  text: 'End tour',
                                                                  action: () => {
                                                                    addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                                                  }
                                                                }
                                                              ]);
                                                            }, 1000);
                                                          }
                                                        },
                                                        {
                                                          id: 'end-tour',
                                                          text: 'End tour',
                                                          action: () => {
                                                            addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                                          }
                                                        }
                                                      ]);
                                                    }, 1000);
                                                  }
                                                },
                                                {
                                                  id: 'end-tour',
                                                  text: 'End tour',
                                                  action: () => {
                                                    addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                                  }
                                                }
                                              ]);
                                            }, 1000);
                                          }
                                        },
                                        {
                                          id: 'end-tour',
                                          text: 'End tour',
                                          action: () => {
                                            addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                          }
                                        }
                                      ]);
                                    }, 1000);
                                  }
                                },
                                {
                                  id: 'end-tour',
                                  text: 'End tour',
                                  action: () => {
                                    addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                                  }
                                }
                              ]);
                            }, 1000);
                          }
                        },
                        {
                          id: 'end-tour',
                          text: 'End tour',
                          action: () => {
                            addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                          }
                        }
                      ]);
                    }, 1000);
                  }
                },
                {
                  id: 'end-tour',
                  text: 'End tour',
                  action: () => {
                    addAIMessage('Tour ended. What would you like to do next?', getMainOptions());
                  }
                }
              ]);
            }, 1000);
          }
        }
      ]);
    }, 1000);
  };

  // Scroll to a specific section
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Show keyboard shortcuts
  const showKeyboardShortcuts = () => {
    // This function should trigger the keyboard shortcuts modal
    // We'll use a global event to communicate with the App component
    addAIMessage('Here are the keyboard shortcuts for navigating the website:');

    setTimeout(() => {
      addAIMessage('Press Shift + / to toggle the keyboard shortcuts overlay at any time.');

      // Dispatch a custom event to open the keyboard shortcuts modal
      const event = new CustomEvent('openKeyboardShortcuts');
      window.dispatchEvent(event);
    }, 1000);
  };

  // Open a model modal
  const openModelModal = (model: 'llama' | 'gemini' | 'grok') => {
    // This function should trigger the model modal
    // We'll use a global event to communicate with the App component
    addAIMessage(`Opening information about ${model === 'llama' ? 'Meta Llama 2' : model === 'gemini' ? 'Google Gemini' : 'xAI Grok'}...`);

    // Dispatch a custom event to open the model modal
    const event = new CustomEvent('openModelModal', { detail: { model } });
    window.dispatchEvent(event);
  };

  // Toggle the assistant
  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
    setHasInteracted(true);

    if (!isOpen) {
      // Sound effect removed

      // If this is the first time opening, check for saved name
      if (messages.length === 0) {
        const savedName = localStorage.getItem('userName');

        if (savedName) {
          setUserName(savedName);
          // Personalized welcome back messages
          const welcomeBackMessages = [
            `Welcome back, ${savedName}! It's great to see you again. How can I assist you today?`,
            `Hello again, ${savedName}! I'm here to help make your experience better. What would you like to explore?`,
            `${savedName}! Good to have you back. What can I help you with on this visit?`
          ];
          addAIMessage(welcomeBackMessages[Math.floor(Math.random() * welcomeBackMessages.length)], getMainOptions());
        } else {
          // First-time greeting messages
          const firstTimeGreetings = [
            "Hi there! I'm Synth, your friendly AI assistant for this website. What's your name?",
            "Hello! I'm Synth, and I'm here to help you navigate this website. May I know your name?",
            "Welcome! My name is Synth, and I'll be your personal guide. What should I call you?"
          ];
          addAIMessage(firstTimeGreetings[Math.floor(Math.random() * firstTimeGreetings.length)]);
        }
      }
    }
  };

  return (
    <>
      {/* Assistant Button */}
      <motion.button
        className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-50 w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#00DC82] text-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleAssistant}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        )}
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-28 md:bottom-24 right-1 md:right-6 z-50 w-[95%] sm:w-80 md:w-96 max-w-[95vw] ${isMinimized ? 'h-16' : 'h-[50vh] md:h-[500px]'} bg-[#0a0a0a] border border-[#00DC82]/30 rounded-xl shadow-[0_0_30px_rgba(0,220,130,0.2)] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00DC82]/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00DC82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#36E4DA] font-medium">Synth Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-pulse"></span>
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isMinimized ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
              </button>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-black/50 to-transparent">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-[#00DC82]/10 border border-[#00DC82]/20 text-white'
                              : 'bg-black/50 border border-gray-800 text-gray-200'
                          }`}
                        >
                          <p>{message.text}</p>
                          {message.options && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {message.options.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={option.action}
                                  className="px-3 py-1.5 bg-[#00DC82]/10 hover:bg-[#00DC82]/20 border border-[#00DC82]/30 rounded-md text-sm text-[#00DC82] transition-colors"
                                >
                                  {option.text}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-lg bg-black/50 border border-gray-800 text-gray-200">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-bounce"></span>
                            <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 rounded-full bg-[#00DC82] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-3 pr-2 border-t border-gray-800 bg-black/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00DC82]/50"
                    />
                    <button
                      type="submit"
                      className="bg-[#00DC82] text-black rounded-lg w-10 h-10 flex items-center justify-center hover:bg-[#00DC82]/90 transition-colors shadow-[0_0_10px_rgba(0,220,130,0.2)]"
                      aria-label="Send message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                        <path d="M22 2 11 13"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
