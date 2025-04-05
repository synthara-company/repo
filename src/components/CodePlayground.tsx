import React, { useState } from 'react';
import { Play, Copy, Check, Download, Maximize2, Minimize2 } from 'lucide-react';

interface CodePlaygroundProps {
  initialCode: string;
  language: 'javascript' | 'typescript' | 'bash';
  title?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({ 
  initialCode, 
  language,
  title = 'Interactive Code Playground'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to run the code (simulated)
  const runCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate loading
    setTimeout(() => {
      try {
        // For demo purposes, we'll just show some simulated output
        // In a real implementation, this would execute the code safely
        let simulatedOutput = '';
        
        if (language === 'javascript' || language === 'typescript') {
          if (code.includes('console.log')) {
            simulatedOutput += '> Console output:\n';
            
            // Extract console.log statements and simulate their output
            const logRegex = /console\.log\(['"](.+?)['"]\)/g;
            const matches = [...code.matchAll(logRegex)];
            
            if (matches.length > 0) {
              matches.forEach((match, index) => {
                simulatedOutput += `${match[1]}\n`;
              });
            } else {
              simulatedOutput += 'No console.log statements found.\n';
            }
          }
          
          if (code.includes('model.train')) {
            simulatedOutput += '\n> Training model...\n';
            simulatedOutput += 'Epoch 1/3: loss=0.342, accuracy=0.876\n';
            simulatedOutput += 'Epoch 2/3: loss=0.218, accuracy=0.923\n';
            simulatedOutput += 'Epoch 3/3: loss=0.156, accuracy=0.948\n';
            simulatedOutput += 'Training complete!\n';
          }
          
          if (code.includes('createModel')) {
            simulatedOutput += '\n> Model created successfully\n';
            simulatedOutput += 'Model ID: syn-2025-04-04-abcd1234\n';
          }
        } else if (language === 'bash') {
          if (code.includes('synthara init')) {
            simulatedOutput += '> Initializing Synthara project...\n';
            simulatedOutput += 'Created project structure\n';
            simulatedOutput += 'Installed dependencies\n';
            simulatedOutput += 'Project initialized successfully!\n';
          }
          
          if (code.includes('synthara login')) {
            simulatedOutput += '> Logging in to Synthara...\n';
            simulatedOutput += 'Authentication successful!\n';
            simulatedOutput += 'Welcome back, user@example.com\n';
          }
          
          if (code.includes('synthara models list')) {
            simulatedOutput += '> Listing available models...\n';
            simulatedOutput += 'ID                      | Name           | Status    | Created\n';
            simulatedOutput += '------------------------|----------------|-----------|------------------\n';
            simulatedOutput += 'syn-2025-03-15-efgh5678 | custom-model-1 | ACTIVE    | 2025-03-15 14:32\n';
            simulatedOutput += 'syn-2025-03-28-ijkl9012 | custom-model-2 | TRAINING  | 2025-03-28 09:17\n';
            simulatedOutput += 'syn-2025-04-01-mnop3456 | custom-model-3 | DEPLOYED  | 2025-04-01 11:45\n';
          }
        }
        
        // If no specific output was generated, show a default message
        if (!simulatedOutput) {
          simulatedOutput = '> Code executed successfully.\n';
          simulatedOutput += 'No output to display.\n';
        }
        
        setOutput(simulatedOutput);
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsRunning(false);
      }
    }, 1500);
  };

  // Function to copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Function to download code as a file
  const downloadCode = () => {
    const fileExtension = language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : 'sh';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synthara-example.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-black/40 border border-gray-800 rounded-xl overflow-hidden shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="border-b border-gray-800 p-3 flex justify-between items-center bg-black/60">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Copy code"
          >
            {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={downloadCode}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            aria-label="Download code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">
        {/* Code editor */}
        <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-800">
          <div className="p-1 bg-black/30">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-black/20 text-gray-300 p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-[#00DC82]/30 resize-none"
              spellCheck="false"
            />
          </div>
          <div className="p-3 flex justify-between items-center border-t border-gray-800 bg-black/40">
            <span className="text-xs text-gray-500">{language.toUpperCase()}</span>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-1 bg-[#00DC82] text-black px-3 py-1 rounded text-sm font-medium hover:bg-[#00DC82]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3 h-3" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>
        
        {/* Output console */}
        <div className="w-full md:w-1/2">
          <div className="p-1 bg-black/50">
            <div className="w-full h-64 bg-black/40 text-gray-300 p-3 font-mono text-sm overflow-auto whitespace-pre-wrap">
              {isRunning ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="animate-spin w-3 h-3 border-2 border-[#00DC82] border-t-transparent rounded-full"></div>
                  Executing code...
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-gray-500">// Output will appear here after running the code</span>
              )}
            </div>
          </div>
          <div className="p-3 border-t border-gray-800 bg-black/40">
            <span className="text-xs text-gray-500">Console Output</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
