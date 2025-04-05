import React, { useState } from 'react';
import { Search, Copy, Check, ChevronRight, BookOpen, Code, Terminal, Settings, Database, Zap, Download, FileText } from 'lucide-react';
import CodePlayground from './CodePlayground';

const PremiumDocs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Documentation sections
  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'api-reference', label: 'API Reference', icon: <Code className="w-4 h-4" /> },
    { id: 'cli-commands', label: 'CLI Commands', icon: <Terminal className="w-4 h-4" /> },
    { id: 'configuration', label: 'Configuration', icon: <Settings className="w-4 h-4" /> },
    { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'playground', label: 'Code Playground', icon: <Zap className="w-4 h-4" />, premium: true },
    { id: 'resources', label: 'Resources', icon: <Download className="w-4 h-4" />, premium: true },
  ];

  // Code examples
  const codeExamples = {
    'getting-started': `// Initialize Synthara with your API key
import { Synthara } from '@synthara/sdk';

const synthara = new Synthara({
  apiKey: process.env.SYNTHARA_API_KEY,
});

// Create a new model instance
const model = synthara.createModel({
  name: 'my-custom-model',
  baseModel: 'synthara-base-v1',
});

// Train the model
await model.train({
  dataset: './data/training.jsonl',
  epochs: 3,
  batchSize: 16,
});

console.log('Model training complete!');`,

    'api-reference': `// Synthara API Reference Example
import { Synthara, ModelConfig, TrainingOptions } from '@synthara/sdk';

// Create a model with advanced configuration
const modelConfig = {
  name: 'advanced-model',
  baseModel: 'synthara-base-v1',
  parameters: {
    layers: 12,
    hiddenSize: 768,
    attentionHeads: 12,
    intermediateSize: 3072,
  },
  quantization: 'int8',
};

const model = synthara.createModel(modelConfig);

// Advanced training options
const trainingOptions = {
  dataset: './data/training.jsonl',
  validationSet: './data/validation.jsonl',
  epochs: 5,
  batchSize: 32,
  learningRate: 5e-5,
  warmupSteps: 500,
  weightDecay: 0.01,
  evaluationStrategy: 'steps',
  evaluationSteps: 500,
  saveStrategy: 'steps',
  saveSteps: 1000,
};

await model.train(trainingOptions);`,

    'cli-commands': `# Synthara CLI Commands

# Initialize a new project
synthara init my-project

# Login to your account
synthara login

# List available models
synthara models list

# Create a new model
synthara models create --name my-model --base synthara-base-v1

# Train a model
synthara train --model my-model --data ./data/training.jsonl --epochs 3

# Evaluate a model
synthara evaluate --model my-model --data ./data/test.jsonl

# Deploy a model
synthara deploy --model my-model --platform cloud

# Monitor a deployed model
synthara monitor --model my-model`,

    'configuration': `// Configuration file: synthara.config.js
module.exports = {
  // Project configuration
  project: {
    name: 'my-synthara-project',
    version: '1.0.0',
    description: 'A custom Synthara project',
  },

  // Model configuration
  model: {
    name: 'custom-model',
    baseModel: 'synthara-base-v1',
    parameters: {
      layers: 12,
      hiddenSize: 768,
      attentionHeads: 12,
    },
  },

  // Training configuration
  training: {
    dataset: './data/training.jsonl',
    validationSet: './data/validation.jsonl',
    epochs: 3,
    batchSize: 16,
    learningRate: 5e-5,
  },

  // Deployment configuration
  deployment: {
    platform: 'cloud',
    scaling: 'auto',
    minInstances: 1,
    maxInstances: 5,
  },
};`,

    'database': `// Database integration example
import { Synthara } from '@synthara/sdk';
import { Database } from '@synthara/database';

// Initialize Synthara
const synthara = new Synthara({
  apiKey: process.env.SYNTHARA_API_KEY,
});

// Initialize database connection
const db = new Database({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Store model metadata in database
async function storeModelMetadata(modelId, metadata) {
  await db.models.insert({
    id: modelId,
    name: metadata.name,
    version: metadata.version,
    createdAt: new Date(),
    parameters: JSON.stringify(metadata.parameters),
  });
}

// Retrieve model from database
async function getModel(modelId) {
  const modelData = await db.models.findOne({ id: modelId });
  return synthara.loadModel(modelId, {
    parameters: JSON.parse(modelData.parameters),
  });
}

// Example usage
const model = await synthara.createModel({ name: 'db-model' });
await storeModelMetadata(model.id, model.metadata);
console.log('Model stored in database');

// Later, retrieve the model
const retrievedModel = await getModel(model.id);
console.log('Model retrieved from database');`,
  };

  // Handle code copy
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter sections based on search query
  const filteredSections = sections.filter(section =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-black/30 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      <div className="border-b border-gray-800 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Premium Documentation</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#00DC82] focus:ring-1 focus:ring-[#00DC82]/30"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800">
          <nav className="p-4">
            <ul className="space-y-1">
              {filteredSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#00DC82]/10 text-[#00DC82]'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                    {section.premium && (
                      <span className="text-[9px] font-bold bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black px-1.5 py-0.5 rounded-full ml-1">
                        PRO
                      </span>
                    )}
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="prose prose-invert max-w-none">
            {activeSection === 'getting-started' && (
              <>
                <h3 className="text-xl font-semibold text-[#00DC82] mb-4">Getting Started with Synthara</h3>
                <p className="mb-4">
                  Welcome to Synthara! This guide will help you get started with our platform for building, training, and deploying custom AI models.
                </p>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Installation</h4>
                <p className="mb-4">
                  First, install the Synthara SDK using npm or yarn:
                </p>
                <div className="bg-black/50 rounded-lg p-3 mb-6">
                  <code className="text-gray-300">npm install @synthara/sdk</code>
                </div>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Quick Start</h4>
                <p className="mb-4">
                  Here's a simple example to get you started with Synthara:
                </p>
                <div className="relative bg-black/50 rounded-lg p-4 mb-6 font-mono text-sm">
                  <button
                    onClick={() => handleCopyCode(codeExamples['getting-started'])}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeExamples['getting-started'] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-gray-300">
                    {codeExamples['getting-started']}
                  </pre>
                </div>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Next Steps</h4>
                <p className="mb-4">
                  After setting up your first model, you might want to explore:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Advanced model configuration options</li>
                  <li>Custom training pipelines</li>
                  <li>Model evaluation and metrics</li>
                  <li>Deployment options</li>
                </ul>
              </>
            )}

            {activeSection === 'api-reference' && (
              <>
                <h3 className="text-xl font-semibold text-[#00DC82] mb-4">API Reference</h3>
                <p className="mb-4">
                  Comprehensive documentation for the Synthara SDK API.
                </p>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Core Classes</h4>
                <div className="mb-6">
                  <h5 className="text-md font-medium text-[#00DC82]/80 mb-2">Synthara</h5>
                  <p className="mb-2">The main entry point for the Synthara SDK.</p>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <code className="text-gray-300">const synthara = new Synthara(&#123;&#123; apiKey: "your-api-key" &#125;&#125;)</code>
                  </div>

                  <h5 className="text-md font-medium text-[#00DC82]/80 mb-2">Model</h5>
                  <p className="mb-2">Represents a machine learning model in Synthara.</p>
                  <div className="bg-black/50 rounded-lg p-4 mb-4">
                    <code className="text-gray-300">const model = synthara.createModel(&#123;&#123; name: "my-model", baseModel: "synthara-base-v1" &#125;&#125;)</code>
                  </div>
                </div>

                <h4 className="text-lg font-medium text-white mt-6 mb-3">Advanced API Usage</h4>
                <p className="mb-4">
                  Here's an example of advanced API usage with TypeScript:
                </p>
                <div className="relative bg-black/50 rounded-lg p-4 mb-6 font-mono text-sm">
                  <button
                    onClick={() => handleCopyCode(codeExamples['api-reference'])}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeExamples['api-reference'] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-gray-300">
                    {codeExamples['api-reference']}
                  </pre>
                </div>
              </>
            )}

            {activeSection === 'cli-commands' && (
              <>
                <h3 className="text-xl font-semibold text-[#00DC82] mb-4">CLI Commands</h3>
                <p className="mb-4">
                  Synthara provides a powerful command-line interface for managing your models and projects.
                </p>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Installation</h4>
                <p className="mb-4">
                  Install the Synthara CLI globally:
                </p>
                <div className="bg-black/50 rounded-lg p-3 mb-6">
                  <code className="text-gray-300">npm install -g @synthara/cli</code>
                </div>

                <h4 className="text-lg font-medium text-white mt-6 mb-3">Available Commands</h4>
                <p className="mb-4">
                  Here's a reference of all available CLI commands:
                </p>
                <div className="relative bg-black/50 rounded-lg p-4 mb-6 font-mono text-sm">
                  <button
                    onClick={() => handleCopyCode(codeExamples['cli-commands'])}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeExamples['cli-commands'] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-gray-300">
                    {codeExamples['cli-commands']}
                  </pre>
                </div>
              </>
            )}

            {activeSection === 'configuration' && (
              <>
                <h3 className="text-xl font-semibold text-[#00DC82] mb-4">Configuration</h3>
                <p className="mb-4">
                  Learn how to configure your Synthara projects for optimal performance.
                </p>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Configuration File</h4>
                <p className="mb-4">
                  Synthara uses a configuration file to manage project settings. Create a <code className="bg-black/30 px-1 py-0.5 rounded">synthara.config.js</code> file in your project root:
                </p>
                <div className="relative bg-black/50 rounded-lg p-4 mb-6 font-mono text-sm">
                  <button
                    onClick={() => handleCopyCode(codeExamples['configuration'])}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeExamples['configuration'] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-gray-300">
                    {codeExamples['configuration']}
                  </pre>
                </div>
              </>
            )}

            {activeSection === 'database' && (
              <>
                <h3 className="text-xl font-semibold text-[#00DC82] mb-4">Database Integration</h3>
                <p className="mb-4">
                  Learn how to integrate Synthara with databases for model storage and retrieval.
                </p>
                <h4 className="text-lg font-medium text-white mt-6 mb-3">Supported Databases</h4>
                <p className="mb-4">
                  Synthara supports the following database systems:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>PostgreSQL</li>
                  <li>MySQL</li>
                  <li>MongoDB</li>
                  <li>SQLite</li>
                </ul>

                <h4 className="text-lg font-medium text-white mt-6 mb-3">Database Integration Example</h4>
                <p className="mb-4">
                  Here's an example of integrating Synthara with a PostgreSQL database:
                </p>
                <div className="relative bg-black/50 rounded-lg p-4 mb-6 font-mono text-sm">
                  <button
                    onClick={() => handleCopyCode(codeExamples['database'])}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white"
                    aria-label="Copy code"
                  >
                    {copiedCode === codeExamples['database'] ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-gray-300">
                    {codeExamples['database']}
                  </pre>
                </div>
              </>
            )}

            {activeSection === 'playground' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-[#00DC82]">Interactive Code Playground</h3>
                  <span className="text-xs font-bold bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black px-2 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                </div>
                <p className="mb-6">
                  Test and experiment with Synthara code in our interactive playground. Write, run, and see the results in real-time without setting up a local environment.
                </p>

                <div className="mb-8">
                  <h4 className="text-lg font-medium text-white mb-4">JavaScript SDK Example</h4>
                  <CodePlayground
                    initialCode={`// Initialize Synthara with your API key
import { Synthara } from '@synthara/sdk';

const synthara = new Synthara({
  apiKey: 'your-api-key',
});

// Create a new model instance
const model = synthara.createModel({
  name: 'my-custom-model',
  baseModel: 'synthara-base-v1',
});

// Log model information
console.log('Model created successfully!');

// Train the model (in a real environment)
// await model.train({
//   dataset: './data/training.jsonl',
//   epochs: 3,
//   batchSize: 16,
// });
`}
                    language="javascript"
                    title="Synthara SDK Playground"
                  />
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-medium text-white mb-4">CLI Commands Example</h4>
                  <CodePlayground
                    initialCode={`# Synthara CLI Commands

# Initialize a new project
synthara init my-project

# List available models
synthara models list

# Create a new model
synthara models create --name my-model --base synthara-base-v1
`}
                    language="bash"
                    title="Synthara CLI Playground"
                  />
                </div>

                <div className="p-4 bg-[#00DC82]/5 border border-[#00DC82]/20 rounded-lg">
                  <h4 className="text-md font-medium text-[#00DC82] mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Pro Tip
                  </h4>
                  <p className="text-sm text-gray-300">
                    The code playground is for educational purposes. For production use, we recommend setting up a proper development environment with our SDK installed locally.
                  </p>
                </div>
              </>
            )}

            {activeSection === 'resources' && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-semibold text-[#00DC82]">Premium Resources</h3>
                  <span className="text-xs font-bold bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black px-2 py-0.5 rounded-full">
                    PREMIUM
                  </span>
                </div>
                <p className="mb-6">
                  Access exclusive resources to accelerate your development with Synthara. Download guides, templates, and sample projects.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-[#00DC82]/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DC82]/10 rounded-lg group-hover:bg-[#00DC82]/20 transition-colors">
                        <FileText className="w-6 h-6 text-[#00DC82]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">Getting Started Guide</h4>
                        <p className="text-sm text-gray-400 mb-3">Comprehensive guide to setting up and using Synthara.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">PDF • 2.4 MB</span>
                          <button className="flex items-center gap-1 text-xs text-[#00DC82] hover:underline">
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-[#00DC82]/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DC82]/10 rounded-lg group-hover:bg-[#00DC82]/20 transition-colors">
                        <Code className="w-6 h-6 text-[#00DC82]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">Starter Project Template</h4>
                        <p className="text-sm text-gray-400 mb-3">Ready-to-use project template with best practices.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">ZIP • 1.8 MB</span>
                          <button className="flex items-center gap-1 text-xs text-[#00DC82] hover:underline">
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-[#00DC82]/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DC82]/10 rounded-lg group-hover:bg-[#00DC82]/20 transition-colors">
                        <Database className="w-6 h-6 text-[#00DC82]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">Sample Dataset</h4>
                        <p className="text-sm text-gray-400 mb-3">Pre-processed dataset for testing and development.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">JSONL • 5.2 MB</span>
                          <button className="flex items-center gap-1 text-xs text-[#00DC82] hover:underline">
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-gray-800 rounded-lg p-4 hover:border-[#00DC82]/30 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#00DC82]/10 rounded-lg group-hover:bg-[#00DC82]/20 transition-colors">
                        <Terminal className="w-6 h-6 text-[#00DC82]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-1">CLI Cheat Sheet</h4>
                        <p className="text-sm text-gray-400 mb-3">Quick reference for all CLI commands and options.</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">PDF • 1.1 MB</span>
                          <button className="flex items-center gap-1 text-xs text-[#00DC82] hover:underline">
                            <Download className="w-3 h-3" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#00DC82]/20 to-[#36E4DA]/20 rounded-lg p-6 border border-[#00DC82]/30">
                  <h4 className="text-lg font-medium text-white mb-3">Premium Support</h4>
                  <p className="text-gray-300 mb-4">
                    As a premium user, you have access to priority support and expert assistance. Our team is ready to help you with any questions or issues.
                  </p>
                  <button className="bg-[#00DC82] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00DC82]/90 transition-colors shadow-[0_0_15px_rgba(0,220,130,0.3)] hover:shadow-[0_0_20px_rgba(0,220,130,0.4)]">
                    Contact Support
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Documentation version: 2.0.0
          </div>
          <span className="text-xs font-bold bg-gradient-to-r from-[#00DC82] to-[#36E4DA] text-black px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="text-sm text-[#00DC82] hover:underline flex items-center gap-1">
            <Download className="w-3 h-3" /> Download PDF
          </button>
          <button className="text-sm text-[#00DC82] hover:underline">
            Report Issue
          </button>
          <button className="bg-[#00DC82]/10 border border-[#00DC82]/30 text-[#00DC82] px-3 py-1 rounded text-sm hover:bg-[#00DC82]/20 transition-colors">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumDocs;
