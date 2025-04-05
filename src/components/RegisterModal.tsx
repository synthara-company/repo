import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  openTermsModal?: () => void;
  openPrivacyModal?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, openTermsModal, openPrivacyModal }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    // Get the form element
    const form = e.target as HTMLFormElement;

    // Create FormData object
    const formData = new FormData(form);

    // Submit to Out
    fetch('https://usebasin.com/f/bec2e3c667f5', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    })
    .then(response => {
      if (response.ok) {
        // Show success message
        setSubmitted(true);
        setError('');
      } else {
        // Handle error
        setError('There was a problem submitting your form. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      setError('There was a problem submitting your form. Please try again.');
    });
  };

  const handleClose = () => {
    // Reset form when closing
    if (submitted) {
      setEmail('');
      setName('');
      setSubmitted(false);
      setError('');
    }
    onClose();
  };

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
            onClick={handleClose}
          />

          {/* Modal Container - for perfect centering */}
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
                <h2 className="text-xl font-bold text-[#36E4DA]">Register Your Interest</h2>
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {!submitted ? (
                  <>
                    <p className="text-gray-300 mb-6">
                      Be the first to know when we launch! Register your interest to receive early access and exclusive updates.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4" action="https://usebasin.com/f/bec2e3c667f5" method="POST" encType="multipart/form-data">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                          Name (Optional)
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/30"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                          Email Address <span className="text-[#00DC82]">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full bg-black/50 border ${
                            error ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/30`}
                          placeholder="your.email@example.com"
                          required
                        />
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                      </div>

                      {/* Honeypot field to prevent spam */}
                      <div style={{ display: 'none' }}>
                        <label htmlFor="_honeypot">Leave this field blank</label>
                        <input type="text" name="_honeypot" id="_honeypot" />
                        <input type="hidden" name="_redirect" value="false" />
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black font-bold py-3 px-6 rounded-lg hover:shadow-[0_0_20px_rgba(0,220,130,0.4)] transition-all"
                        >
                          Register Interest
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 mt-4">
                        By registering, you agree to our{' '}
                        <button
                          type="button"
                          className="text-[#00DC82] hover:underline"
                          onClick={() => {
                            if (openTermsModal) {
                              onClose(); // Close register modal first
                              setTimeout(() => openTermsModal(), 300); // Open terms modal after a short delay
                            }
                          }}
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          className="text-[#00DC82] hover:underline"
                          onClick={() => {
                            if (openPrivacyModal) {
                              onClose(); // Close register modal first
                              setTimeout(() => openPrivacyModal(), 300); // Open privacy modal after a short delay
                            }
                          }}
                        >
                          Privacy Policy
                        </button>
                        .
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#00DC82]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00DC82]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-300 mb-6">
                      Your registration has been received. We'll notify you when we launch!
                    </p>
                    <button
                      onClick={handleClose}
                      className="bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/30 font-medium py-2 px-6 rounded-lg hover:bg-[#00DC82]/20 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;
