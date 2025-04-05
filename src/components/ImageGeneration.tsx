import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, Loader2, Download, Sparkles, RefreshCw } from 'lucide-react';
import { generateImage } from '../services/ImageGenerationService';

const ImageGeneration: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageDescription('');

    try {
      // Generate a new image from Unsplash based on the prompt
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);

      // Set a descriptive text for the image
      setImageDescription(`AI-generated visualization based on: "${prompt}"`);
    } catch (err) {
      console.error('Error generating image:', err);
      setError((err as Error).message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh the image with the same prompt but slightly modified to get a different result
  const refreshImage = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add a slight variation to the prompt to get a different image
      const variedPrompt = prompt + ' (variation)';
      const imageUrl = await generateImage(variedPrompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error('Error refreshing image:', err);
      setError((err as Error).message || 'Failed to refresh image');
    } finally {
      setIsLoading(false);
    }
  };

  // Download the generated image
  const downloadImage = () => {
    if (!generatedImage) return;

    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `synthara-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Clear the current image and prompt
  const clearImage = () => {
    setGeneratedImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <>
      {/* Image Generation Button */}
      <motion.button
        className="fixed bottom-6 left-[calc(50%-160px)] z-50 hidden md:flex items-center gap-2 bg-black/80 border border-[#00DC82]/30 shadow-[0_0_10px_rgba(0,220,130,0.3)] rounded-full px-4 py-2 text-sm text-gray-300 backdrop-blur-sm cursor-pointer hover:bg-black/90 hover:border-[#00DC82]/50 transition-colors"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="w-4 h-4 text-[#00DC82]" />
        <span>Generate Images</span>
      </motion.button>

      {/* Image Generation Modal */}
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
                className="w-[98%] max-w-3xl bg-[#0a0a0a] border border-[#00DC82]/30 rounded-xl p-3 md:p-6 z-[10000] shadow-[0_0_30px_rgba(0,220,130,0.2)] max-h-[85vh] flex flex-col backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#00DC82]/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#00DC82]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#00DC82]">Image Generation</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
                  {/* Left side - Input form */}
                  <div className="w-full md:w-1/2 flex flex-col">
                    <form onSubmit={handleSubmit} className="mb-4">
                      <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
                        Describe the image you want to generate
                      </label>
                      <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A futuristic city with flying cars and neon lights..."
                        className="w-full h-32 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00DC82]/50 focus:shadow-[0_0_10px_rgba(0,220,130,0.1)] resize-none"
                        disabled={isLoading}
                      />
                      <div className="mt-3 flex justify-end">
                        <button
                          type="submit"
                          disabled={!prompt.trim() || isLoading}
                          className="bg-[#00DC82] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00DC82]/90 transition-colors shadow-[0_0_10px_rgba(0,220,130,0.2)] hover:shadow-[0_0_15px_rgba(0,220,130,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Image
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="bg-black/30 border border-gray-800 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold text-[#00DC82] mb-2">Tips for better results:</h3>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Be specific about what you want to see</li>
                        <li>• Include details about style, lighting, and composition</li>
                        <li>• Mention colors, textures, and materials</li>
                        <li>• Describe the mood or atmosphere</li>
                        <li>• Use references to art styles or artists</li>
                        <li>• Try different keywords if you don't get the desired result</li>
                      </ul>
                      <p className="text-xs text-gray-500 mt-2 italic">Images are generated using Google's Gemini AI model</p>
                    </div>

                    {error && (
                      <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
                        <p className="font-medium mb-1">Error:</p>
                        <p>{error}</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Image display */}
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="bg-black/50 border border-gray-800 rounded-lg flex-1 flex items-center justify-center p-2 overflow-hidden">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Loader2 className="w-8 h-8 animate-spin mb-2" />
                          <p className="text-sm">Generating your image...</p>
                          <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
                        </div>
                      ) : generatedImage ? (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <img
                            ref={imageRef}
                            src={generatedImage}
                            alt="Generated image"
                            className="max-w-full max-h-[350px] object-contain rounded-lg shadow-lg"
                          />
                          {imageDescription && (
                            <p className="text-xs text-gray-400 mt-2 text-center px-4">{imageDescription}</p>
                          )}
                          <div className="absolute bottom-2 right-2 flex gap-2">
                            <button
                              onClick={refreshImage}
                              className="bg-black/70 hover:bg-black/90 p-2 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
                              title="Generate new variation"
                            >
                              <RefreshCw className="w-4 h-4 text-blue-400" />
                            </button>
                            <button
                              onClick={downloadImage}
                              className="bg-black/70 hover:bg-black/90 p-2 rounded-lg border border-gray-700 hover:border-[#00DC82]/50 transition-colors"
                              title="Download image"
                            >
                              <Download className="w-4 h-4 text-[#00DC82]" />
                            </button>
                            <button
                              onClick={clearImage}
                              className="bg-black/70 hover:bg-black/90 p-2 rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors"
                              title="Clear image"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                          <p className="text-sm">Your generated image will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom indicator */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <div className="bg-[#00DC82] h-1.5 w-16 rounded-full"></div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGeneration;
