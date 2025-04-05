import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the Google Generative AI library
// Note: We're using the client-side version of the library

// Simple markdown parser function
const parseMarkdown = (markdown: string) => {
  if (!markdown) return '';

  // Replace code blocks
  let parsed = markdown.replace(/```([\s\S]*?)```/g, '<pre class="bg-black/50 p-3 rounded-md overflow-x-auto my-3 text-xs"><code>$1</code></pre>');

  // Replace inline code
  parsed = parsed.replace(/`([^`]+)`/g, '<code class="bg-black/50 px-1 py-0.5 rounded text-xs">$1</code>');

  // Replace headers
  parsed = parsed.replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold text-[#36E4DA] mt-4 mb-2">$1</h3>');
  parsed = parsed.replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold text-[#36E4DA] mt-5 mb-3">$1</h2>');
  parsed = parsed.replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold text-[#36E4DA] mt-6 mb-4">$1</h1>');

  // Replace bold and italic
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Replace lists
  parsed = parsed.replace(/^- (.*)$/gm, '<li class="ml-4 list-disc">$1</li>');
  parsed = parsed.replace(/^\d+\. (.*)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Replace paragraphs (must be done last)
  parsed = parsed.replace(/^(?!<[hl\d]|<li|<pre|<code)(.+)$/gm, '<p class="mb-3">$1</p>');

  // Replace line breaks with <br>
  parsed = parsed.replace(/\n\n/g, '<br>');

  return parsed;
};
import { GoogleGenerativeAI } from '@google/generative-ai';

const GenAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [codeZoom, setCodeZoom] = useState(1);

  // Password protection states
  const [adminPassword, setAdminPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'set' | 'clear' | 'change'>('set');
  const [passwordError, setPasswordError] = useState('');

  // Voice input states
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const responseRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  // Check for saved API key and password on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setHasApiKey(true);
    }

    const savedPassword = localStorage.getItem('gemini_admin_password');
    if (savedPassword) {
      setAdminPassword(savedPassword);
      setHasPassword(true);
    }

    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceSupported(false);
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = () => {
    if (apiKey.trim()) {
      // If no password is set yet, show password modal to set one
      if (!hasPassword) {
        setPasswordAction('set');
        setShowPasswordModal(true);
        return;
      }

      localStorage.setItem('gemini_api_key', apiKey);
      setHasApiKey(true);
    }
  };

  // Clear API key (requires password)
  const clearApiKey = () => {
    if (hasPassword) {
      setPasswordAction('clear');
      setShowPasswordModal(true);
    } else {
      // If no password protection, clear directly
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setHasApiKey(false);
    }
  };

  // Change API key (requires password if already set)
  const changeApiKey = () => {
    if (hasPassword) {
      setPasswordAction('change');
      setShowPasswordModal(true);
    } else {
      // If no password protection, allow direct change
      localStorage.setItem('gemini_api_key', apiKey);
      setHasApiKey(true);
    }
  };

  // Handle password submission
  const handlePasswordSubmit = () => {
    setPasswordError('');

    if (passwordAction === 'set') {
      // Setting a new password
      if (enteredPassword.length < 4) {
        setPasswordError('Password must be at least 4 characters');
        return;
      }

      // Save the password
      localStorage.setItem('gemini_admin_password', enteredPassword);
      setAdminPassword(enteredPassword);
      setHasPassword(true);

      // Also save the API key
      localStorage.setItem('gemini_api_key', apiKey);
      setHasApiKey(true);

      // Close modal and reset
      setShowPasswordModal(false);
      setEnteredPassword('');
    } else {
      // Verifying existing password
      if (enteredPassword !== adminPassword) {
        setPasswordError('Incorrect password');
        return;
      }

      // Password is correct, perform the action
      if (passwordAction === 'clear') {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setHasApiKey(false);
      } else if (passwordAction === 'change') {
        localStorage.setItem('gemini_api_key', apiKey);
        setHasApiKey(true);
      }

      // Close modal and reset
      setShowPasswordModal(false);
      setEnteredPassword('');
    }
  };

  // Scroll to bottom of response
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  // Cleanup voice recognition when component unmounts
  useEffect(() => {
    return () => {
      if (isListening) {
        // @ts-ignore - Accessing the property we added to window
        if (window.recognitionInstance) {
          // @ts-ignore - Accessing the property we added to window
          window.recognitionInstance.stop();
        }
      }
    };
  }, [isListening]);

  // Voice recognition functionality
  const startListening = () => {
    if (!voiceSupported) return;

    setIsListening(true);
    setTranscript('');

    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      setInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();

    // Store the recognition instance so we can stop it later
    // @ts-ignore - Adding a property to window
    window.recognitionInstance = recognition;
  };

  const stopListening = () => {
    setIsListening(false);
    // @ts-ignore - Accessing the property we added to window
    if (window.recognitionInstance) {
      // @ts-ignore - Accessing the property we added to window
      window.recognitionInstance.stop();
    }
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    if (!voiceSupported) return;

    const newVoiceMode = !isVoiceMode;
    setIsVoiceMode(newVoiceMode);

    if (newVoiceMode) {
      startListening();
    } else {
      stopListening();
    }
  };

  // Handle keyboard shortcuts for code zoom and modal close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle when modal is open
      if (!isOpen) return;

      // Check if an input element is focused
      const isInputFocused = document.activeElement?.tagName === 'INPUT' ||
                            document.activeElement?.tagName === 'TEXTAREA' ||
                            document.activeElement?.getAttribute('contenteditable') === 'true';

      // Always handle Escape key to close modal, regardless of focus
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      // Don't handle zoom shortcuts if input is focused
      if (isInputFocused) return;

      // Check for Cmd+Shift+- (zoom out) and Cmd+Shift+= (zoom in)
      if (e.metaKey && e.shiftKey) {
        if (e.key === '-') {
          e.preventDefault();
          setCodeZoom(prev => Math.max(0.5, prev - 0.1));
        } else if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setCodeZoom(prev => Math.min(2, prev + 0.1));
        }
      }

      // Check for Cmd+V (Mac) or Ctrl+V (Windows/Linux) for voice mode toggle
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleVoiceMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleVoiceMode]);

  // Function to start a new chat
  const startNewChat = () => {
    setChatHistory([]);
    setResponse('');
  };

  // Function to call the Gemini API
  const callGeminiAPI = async () => {
    if (!apiKey || !input.trim()) return;

    setIsLoading(true);

    // Add user message to chat history
    const userMessage = { role: 'user' as const, content: input };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);

    try {
      // Initialize the API
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      // Set generation config
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      };

      // Convert chat history to the format expected by the API
      const historyForAPI = chatHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Start a chat session with history
      const chatSession = model.startChat({
        generationConfig,
        history: historyForAPI,
      });

      // Send the message
      const result = await chatSession.sendMessage(input);

      // Get the response text
      const responseText = result.response.text();

      // Add assistant response to chat history
      const assistantMessage = { role: 'assistant' as const, content: responseText };
      setChatHistory([...updatedHistory, assistantMessage]);

      // Build full conversation for display
      const fullConversation = [...updatedHistory, assistantMessage]
        .map(msg => `${msg.role === 'user' ? '**You:**' : '**Synthara AI:**'} ${msg.content}`)
        .join('\n\n');

      // Update the response state
      setResponse(fullConversation);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setResponse(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !hasApiKey || isLoading) return;

    // If voice mode is active and listening, stop listening
    if (isVoiceMode && isListening) {
      stopListening();
    }

    callGeminiAPI();
    setInput('');
  };

  return (
    <>
      {/* GenAI Button */}
      <motion.button
        className="fixed bottom-16 md:bottom-6 left-4 md:left-6 z-40 px-2 md:px-4 py-1 md:py-2 rounded-full bg-[#36E4DA] text-black flex items-center gap-1 md:gap-2 shadow-lg hover:shadow-xl transition-all genai-button text-xs md:text-base md:opacity-100 opacity-60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-[20px] md:h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"></path>
          <rect width="16" height="12" x="4" y="8" rx="2"></rect>
          <path d="M2 14h2"></path>
          <path d="M20 14h2"></path>
          <path d="M15 13v2"></path>
          <path d="M9 13v2"></path>
        </svg>
        <span className="font-medium">GenAI</span>
      </motion.button>

      {/* GenAI Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/80 z-[9999]"
              style={{ backdropFilter: 'blur(8px)' }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container - for perfect centering */}
            <div className="fixed inset-0 flex items-center justify-center z-[10000] px-1" onClick={() => setIsOpen(false)}>
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
                className="w-[98%] max-w-3xl bg-[#0a0a0a] border border-[#36E4DA]/30 rounded-xl p-3 md:p-6 z-[10000] shadow-[0_0_30px_rgba(54,228,218,0.2)] max-h-[85vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#36E4DA]/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#36E4DA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8"></path>
                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                        <path d="M2 14h2"></path>
                        <path d="M20 14h2"></path>
                        <path d="M15 13v2"></path>
                        <path d="M9 13v2"></path>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[#36E4DA]">Synthara GenAI</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* API Key Input */}
                {!hasApiKey ? (
                  <div className="mb-6 p-4 bg-black/50 rounded-lg border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-2">Enter your Gemini API Key</h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      You need a Google Gemini API key to use this feature. Your API key is stored locally and never sent to our servers.
                      {hasPassword && <span className="ml-1 text-[#36E4DA]">Protected by password.</span>}
                    </p>
                    <div className="flex gap-2 pr-1">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#36E4DA]/50 focus:shadow-[0_0_10px_rgba(54,228,218,0.1)]"
                      />
                      <button
                        onClick={saveApiKey}
                        className="bg-[#36E4DA] text-black rounded-lg w-20 h-12 flex items-center justify-center font-medium hover:bg-[#36E4DA]/90 transition-colors shadow-[0_0_10px_rgba(54,228,218,0.2)] hover:shadow-[0_0_15px_rgba(54,228,218,0.3)]"
                        aria-label="Save API key"
                      >
                        <span className="text-sm font-bold">Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-sm text-gray-400">
                        API Key: Connected
                        {hasPassword && <span className="ml-1 text-[#36E4DA] text-xs">(Password Protected)</span>}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={startNewChat}
                        className="text-xs px-3 py-2 bg-[#36E4DA]/10 border border-[#36E4DA]/30 rounded-lg text-[#36E4DA] hover:bg-[#36E4DA]/20 hover:border-[#36E4DA]/50 transition-colors font-medium"
                        aria-label="Start new chat"
                      >
                        New Chat
                      </button>
                      <button
                        onClick={() => changeApiKey()}
                        className="text-xs px-3 py-2 bg-[#36E4DA]/10 border border-[#36E4DA]/30 rounded-lg text-[#36E4DA] hover:bg-[#36E4DA]/20 hover:border-[#36E4DA]/50 transition-colors font-medium"
                        aria-label="Change API key"
                      >
                        Change Key
                      </button>
                      <button
                        onClick={clearApiKey}
                        className="text-xs px-3 py-2 bg-black/30 border border-gray-700 rounded-lg text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors font-medium"
                        aria-label="Clear API key"
                      >
                        Clear Key
                      </button>
                    </div>
                  </div>
                )}

                {/* Response Area */}
                <div
                  ref={responseRef}
                  className="flex-1 bg-black/50 border border-gray-800 rounded-lg p-4 mb-4 overflow-y-auto text-sm text-gray-300 shadow-inner markdown-content"
                >
                  {response ? (
                    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(response) }} />
                  ) : (
                    <div className="font-mono whitespace-pre-wrap">// Responses will appear here
// Enter your query below and click Send</div>
                  )}
                  {isLoading && (
                    <div className="mt-2 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#36E4DA] animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-[#36E4DA] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 rounded-full bg-[#36E4DA] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  )}
                </div>

                {/* Voice Mode Indicator */}
                {isVoiceMode && (
                  <div className="mb-2 flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-gray-300">
                      {isListening ? 'Listening... (Speak now)' : 'Voice mode active (Press Cmd+V or Ctrl+V to toggle)'}
                    </span>
                  </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-1 pr-0">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isVoiceMode ? 'Speak your prompt or type here...' : 'Enter your prompt...'}
                      className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#36E4DA]/50 focus:shadow-[0_0_10px_rgba(54,228,218,0.1)]"
                      disabled={!hasApiKey || isLoading}
                    />
                    {isVoiceMode && isListening && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                        <span className="w-1.5 h-4 bg-[#36E4DA] rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-6 bg-[#36E4DA] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-1.5 h-3 bg-[#36E4DA] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    )}
                  </div>

                  {/* Voice Button */}
                  {voiceSupported && (
                    <button
                      type="button"
                      onClick={toggleVoiceMode}
                      className={`rounded-lg w-10 h-10 flex items-center justify-center transition-colors ${isVoiceMode
                        ? 'bg-[#36E4DA]/20 text-[#36E4DA] border border-[#36E4DA]/50'
                        : 'bg-black/50 text-gray-400 border border-gray-800 hover:text-[#36E4DA] hover:border-[#36E4DA]/30'}`}
                      disabled={!hasApiKey || isLoading}
                      aria-label={isVoiceMode ? 'Disable voice input' : 'Enable voice input'}
                      title={`${isVoiceMode ? 'Disable' : 'Enable'} voice input (Cmd+V or Ctrl+V)`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="22"></line>
                      </svg>
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    className="bg-[#36E4DA] text-black rounded-lg w-10 h-10 md:w-auto md:px-4 md:py-2 font-medium hover:bg-[#36E4DA]/90 transition-colors shadow-[0_0_10px_rgba(54,228,218,0.2)] hover:shadow-[0_0_15px_rgba(54,228,218,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
                    disabled={!hasApiKey || isLoading}
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-4 md:h-4 block md:hidden">
                      <path d="m22 2-7 20-4-9-9-4Z"></path>
                      <path d="M22 2 11 13"></path>
                    </svg>
                    <span className="hidden md:inline text-sm ml-1">Send</span>
                  </button>
                </form>

                {/* Code Reference */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-300 transition-colors">Show Code Reference</summary>
                    <div className="flex flex-col gap-2 mt-2 mb-1 text-xs text-gray-500">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCodeZoom(prev => Math.max(0.5, prev - 0.1))}
                            className="px-2 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                          >
                            -
                          </button>
                          <span className="cursor-pointer hover:text-white" onClick={() => setCodeZoom(1)} title="Reset zoom">Zoom: {Math.round(codeZoom * 100)}%</span>
                          <button
                            onClick={() => setCodeZoom(prev => Math.min(2, prev + 0.1))}
                            className="px-2 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">⌘</kbd>
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">⇧</kbd>
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">-</kbd>
                          <span className="mx-1">or</span>
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">⌘</kbd>
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">⇧</kbd>
                          <kbd className="px-1 py-0.5 bg-black/70 border border-gray-700 rounded text-gray-400 text-[10px]">+</kbd>
                          <span className="ml-1">to adjust zoom</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center text-center text-[#36E4DA]/70">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M12 22v-7"></path>
                          <path d="M5 12H2a10 10 0 0 0 10 10v-3"></path>
                          <path d="M22 12h-3"></path>
                          <path d="M19 12a7 7 0 0 0-7-7"></path>
                          <path d="M12 8v4l3 3"></path>
                        </svg>
                        <span>Scroll to see the entire code</span>
                      </div>
                    </div>
                    <div className="relative max-h-[300px] overflow-auto bg-black/50 border border-gray-800 rounded-lg code-container" style={{ overscrollBehavior: 'contain' }}>
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          onClick={() => {
                            const codeText = codeRef.current?.textContent || '';
                            navigator.clipboard.writeText(codeText);
                            // Show a temporary tooltip or notification
                            const tooltip = document.createElement('div');
                            tooltip.textContent = 'Copied!';
                            tooltip.className = 'absolute -top-8 right-0 bg-[#36E4DA] text-black px-2 py-1 rounded text-xs';
                            document.querySelector('.code-container')?.appendChild(tooltip);
                            setTimeout(() => tooltip.remove(), 2000);
                          }}
                          className="bg-black/50 hover:bg-black/70 p-1.5 rounded border border-gray-700 hover:border-[#36E4DA]/50 transition-colors"
                          title="Copy code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#36E4DA]">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10">
                      </div>
                      <div style={{ width: `${Math.max(100, 100 / codeZoom)}%`, minWidth: '100%' }}>
                        <pre
                          ref={codeRef}
                          className="p-4 pb-8 text-gray-400 text-xs whitespace-pre-wrap"
                          style={{ transform: `scale(${codeZoom})`, transformOrigin: 'top left', transition: 'transform 0.1s ease' }}
                        >
{`// Import required libraries
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");
const express = require("express");
const { Client } = require("pg");
const http = require("http");
const path = require("path");

// Initialize Node.js Express app
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to PostgreSQL
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});
pgClient.connect();

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

// API endpoint to generate response
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Call Gemini API
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    // Save to PostgreSQL
    await pgClient.query(
      "INSERT INTO responses(prompt, response, created_at) VALUES($1, $2, $3)",
      [prompt, responseText, new Date()]
    );

    res.json({ response: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Define routes
app.get('/api/history', async (req, res) => {
  try {
    const result = await pgClient.query(
      "SELECT * FROM responses ORDER BY created_at DESC LIMIT 10"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create HTTP server
const server = http.createServer(app);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Node.js server running on port \${PORT}\`);
});
`}
                      </pre>
                      </div>
                    </div>
                  </details>
                </div>

                {/* Bottom indicator */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="bg-[#36E4DA] h-1.5 w-16 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
              onClick={() => {
                setShowPasswordModal(false);
                setEnteredPassword('');
                setPasswordError('');
              }}
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
                className="w-[90%] max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="relative p-6 border-b border-gray-800 bg-black/50">
                    <h2 className="text-xl font-bold text-[#36E4DA]">
                      {passwordAction === 'set' ? 'Set Admin Password' :
                       passwordAction === 'clear' ? 'Confirm Password to Clear API Key' :
                       'Confirm Password to Change API Key'}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-300 mb-6">
                      {passwordAction === 'set'
                        ? 'Create an admin password to protect your API key. You will need this password to change or remove the API key in the future.'
                        : 'Enter your admin password to continue with this action.'}
                    </p>

                    <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }} className="space-y-4">
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                          {passwordAction === 'set' ? 'New Password' : 'Admin Password'} <span className="text-[#36E4DA]">*</span>
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={enteredPassword}
                          onChange={(e) => setEnteredPassword(e.target.value)}
                          className={`w-full bg-black/50 border ${
                            passwordError ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#36E4DA] focus:ring-1 focus:ring-[#36E4DA]/30`}
                          placeholder={passwordAction === 'set' ? 'Create a password' : 'Enter your password'}
                          required
                          autoFocus
                        />
                        {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
                      </div>

                      <div className="pt-4 flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPasswordModal(false);
                            setEnteredPassword('');
                            setPasswordError('');
                          }}
                          className="px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black font-medium rounded-lg hover:shadow-[0_0_15px_rgba(0,220,130,0.4)] transition-all"
                        >
                          {passwordAction === 'set' ? 'Set Password' : 'Confirm'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GenAI;