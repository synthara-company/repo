import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Upload, Image as ImageIcon, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ImageRecognitionProps {
  apiKey: string;
}

const ImageRecognition: React.FC<ImageRecognitionProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default prompts for quick selection
  const defaultPrompts = [
    "Describe what you see in this image",
    "Identify objects in this image",
    "Read and transcribe any text in this image",
    "Analyze the chart or graph in this image",
    "Identify any people or characters in this image"
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Analyze image with Gemini
  const analyzeImage = async (selectedPrompt?: string) => {
    if (!image || !apiKey) return;

    setIsLoading(true);
    setResult('');
    setError(null);

    // Determine which prompt to use
    const promptToUse = selectedPrompt || customPrompt || "Analyze this image in detail. Describe what you see, identify any objects, people, text, or notable elements. If there's text in the image, transcribe it. If there are charts or diagrams, explain them.";

    try {
      // Convert base64 data URL to base64 string
      const base64Image = image.split(',')[1];

      // Prepare the request
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptToUse
                },
                {
                  inline_data: {
                    mime_type: image.split(';')[0].split(':')[1],
                    data: base64Image
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.4,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 8192,
          }
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error analyzing image');
      }

      // Extract the response text
      const resultText = data.candidates[0].content.parts[0].text;
      setResult(resultText);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError((err as Error).message || 'Failed to analyze image');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the current image and result
  const clearImage = () => {
    setImage(null);
    setResult('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Image Recognition Button */}
      <motion.button
        className="fixed top-4 right-4 md:top-6 md:right-6 z-40 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all md:opacity-100 opacity-60"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Image Recognition"
        title="Image Recognition"
      >
        <Camera className="w-5 h-5" />
      </motion.button>

      {/* Image Recognition Modal */}
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

            {/* Modal Container */}
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
                className="w-[98%] max-w-3xl bg-[#0a0a0a] border border-purple-500/30 rounded-xl p-3 md:p-6 z-[10000] shadow-[0_0_30px_rgba(168,85,247,0.2)] max-h-[85vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-purple-400 font-medium">Image Recognition</h3>
                      <p className="text-xs text-gray-400">Powered by Google Gemini</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row gap-4">
                  {/* Image Upload Section */}
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div
                      className={`border-2 border-dashed rounded-lg flex-1 flex flex-col items-center justify-center p-4 min-h-[200px] ${
                        image ? 'border-purple-500/50' : 'border-gray-700 hover:border-gray-500'
                      } transition-colors cursor-pointer`}
                      onClick={triggerFileInput}
                    >
                      {image ? (
                        <div className="relative w-full h-full">
                          <img
                            src={image}
                            alt="Uploaded"
                            className="w-full h-full object-contain rounded"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearImage();
                            }}
                            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white hover:bg-black"
                            aria-label="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-gray-300 text-center">Click to upload an image</p>
                          <p className="text-gray-500 text-xs text-center mt-1">or drag and drop</p>
                        </>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {error && (
                      <div className="mt-2 text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {!showPromptInput && (
                      <div className="mt-3 flex justify-center">
                        <button
                          onClick={() => analyzeImage()}
                          disabled={!image || isLoading}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-4 h-4" />
                              Analyze with Default Prompt
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Results Section */}
                  <div className="w-full md:w-1/2 flex flex-col">
                    {/* Prompt Selection */}
                    <div className="mb-4 bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-purple-400 font-medium">What do you want to know?</h4>
                        <button
                          onClick={() => setShowPromptInput(!showPromptInput)}
                          className="text-xs text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                        >
                          {showPromptInput ? 'Use preset' : 'Custom prompt'}
                          <MessageSquare className="w-3 h-3" />
                        </button>
                      </div>

                      {showPromptInput ? (
                        <div className="mb-2">
                          <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            placeholder="Enter your custom prompt..."
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_10px_rgba(168,85,247,0.1)] min-h-[80px]"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {defaultPrompts.map((prompt, index) => (
                            <button
                              key={index}
                              onClick={() => analyzeImage(prompt)}
                              className="px-2 py-1 bg-black/50 border border-gray-800 rounded-lg text-xs text-gray-300 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 transition-colors"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}

                      {showPromptInput && (
                        <button
                          onClick={() => analyzeImage()}
                          disabled={!image || isLoading || !customPrompt.trim()}
                          className="w-full px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Analyze with Custom Prompt'
                          )}
                        </button>
                      )}
                    </div>

                    {/* Analysis Results */}
                    <div className="flex-1 bg-black/30 rounded-lg p-4 overflow-y-auto max-h-[300px] md:max-h-[400px] custom-scrollbar">
                      <h4 className="text-purple-400 font-medium mb-2">Analysis Results</h4>
                      {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-2" />
                            <p className="text-gray-400 text-sm">Analyzing image...</p>
                          </div>
                        </div>
                      ) : result ? (
                        <div className="text-gray-300 text-sm markdown-content">
                          <ReactMarkdown>{result}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic">
                          Upload an image and select what you want to know about it
                        </div>
                      )}
                    </div>
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

export default ImageRecognition;
