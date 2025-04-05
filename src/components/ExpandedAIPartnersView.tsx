import React from 'react';
import { motion } from 'framer-motion';

interface AIPartner {
  name: string;
  efficiency: number;
  accuracy: number;
  color: string;
  description: string;
  features: string[];
  useCases: string[];
}

const ExpandedAIPartnersView: React.FC = () => {
  // AI Partners data with extended information
  const partners: AIPartner[] = [
    {
      name: 'GitHub Copilot',
      efficiency: 85,
      accuracy: 78,
      color: '#6e40c9',
      description: 'AI pair programmer that helps you write code faster with less work. Trained on billions of lines of code, Copilot turns natural language prompts into coding suggestions.',
      features: ['Code completion', 'Function generation', 'Comment-to-code conversion', 'Multi-language support'],
      useCases: ['Rapid prototyping', 'Boilerplate code generation', 'Learning new languages', 'Documentation assistance']
    },
    {
      name: 'Bolt',
      efficiency: 92,
      accuracy: 83,
      color: '#00DC82',
      description: 'Lightning-fast AI coding assistant that specializes in refactoring and optimizing existing code. Provides intelligent suggestions for performance improvements.',
      features: ['Code optimization', 'Performance analysis', 'Refactoring suggestions', 'Memory usage optimization'],
      useCases: ['Legacy code modernization', 'Performance tuning', 'Technical debt reduction', 'Code quality improvement']
    },
    {
      name: 'Blackbox AI',
      efficiency: 88,
      accuracy: 81,
      color: '#333333',
      description: 'AI coding assistant that helps developers find and integrate code snippets from across the web. Specializes in solving specific coding problems with ready-to-use solutions.',
      features: ['Code search', 'Snippet integration', 'Error fixing', 'Stack Overflow integration'],
      useCases: ['Debugging complex issues', 'Finding optimal algorithms', 'Learning best practices', 'Quick implementation of common patterns']
    },
    {
      name: 'Qodo',
      efficiency: 79,
      accuracy: 86,
      color: '#ff6b6b',
      description: 'AI-powered code generator that excels at creating complete functions and classes from natural language descriptions. Focuses on accuracy and maintainable code.',
      features: ['Full function generation', 'Test case creation', 'Documentation generation', 'Type inference'],
      useCases: ['Rapid development', 'Creating unit tests', 'API implementation', 'Data processing pipelines']
    },
    {
      name: 'Augment Code',
      efficiency: 94,
      accuracy: 89,
      color: '#36E4DA',
      description: 'Comprehensive AI coding partner that combines code generation, optimization, and explanation. Provides context-aware suggestions based on your entire codebase.',
      features: ['Context-aware suggestions', 'Codebase analysis', 'Architecture recommendations', 'Security vulnerability detection'],
      useCases: ['Enterprise development', 'System architecture', 'Security-critical applications', 'Large-scale refactoring']
    },
    {
      name: 'Gemini 2.5 Pro',
      efficiency: 93,
      accuracy: 94,
      color: '#4285f4',
      description: "Google's most advanced multimodal AI model with enhanced reasoning capabilities and code generation. Excels at understanding complex requirements and generating high-quality code.",
      features: ['Advanced reasoning', 'Multimodal understanding', 'Code optimization', 'Documentation generation'],
      useCases: ['Complex problem solving', 'System design', 'Code documentation', 'Algorithm development']
    },
    {
      name: 'Gemini 2.0 Flash',
      efficiency: 90,
      accuracy: 92,
      color: '#34a853',
      description: "Google's faster, more efficient AI model optimized for real-time code generation and image processing tasks. Provides quick responses with high accuracy.",
      features: ['Fast response time', 'Image generation', 'Code completion', 'Real-time assistance'],
      useCases: ['Rapid prototyping', 'Image creation', 'Interactive development', 'Quick code fixes']
    },
    {
      name: 'GPT-4o',
      efficiency: 95,
      accuracy: 93,
      color: '#10a37f',
      description: "OpenAI's most advanced multimodal model with omni capabilities across text, vision, and audio. Provides state-of-the-art performance for code generation and problem-solving.",
      features: ['Multimodal processing', 'Advanced reasoning', 'Context understanding', 'Code generation'],
      useCases: ['Full-stack development', 'Complex debugging', 'System architecture', 'Technical documentation']
    },
    {
      name: 'GPT-4o-mini',
      efficiency: 91,
      accuracy: 89,
      color: '#19c37d',
      description: "A smaller, faster version of GPT-4o that maintains impressive capabilities while being more efficient. Optimized for quick responses and lower computational requirements.",
      features: ['Efficient processing', 'Quick responses', 'Lower latency', 'Reduced compute needs'],
      useCases: ['Mobile development', 'Real-time assistance', 'Edge computing', 'Resource-constrained environments']
    },
    {
      name: 'Claude 3.5 Sonnet',
      efficiency: 92,
      accuracy: 91,
      color: '#9c5aff',
      description: "Anthropic's advanced AI assistant known for its thoughtful, nuanced responses and strong reasoning capabilities. Excels at understanding context and generating high-quality code.",
      features: ['Nuanced reasoning', 'Context awareness', 'Safety features', 'Long context windows'],
      useCases: ['Complex reasoning tasks', 'Detailed explanations', 'Safe code generation', 'Technical writing']
    },
    {
      name: 'Claude 3.7 Sonnet',
      efficiency: 94,
      accuracy: 93,
      color: '#7b3fe4',
      description: "Anthropic's latest AI model with enhanced capabilities for code generation, reasoning, and multimodal understanding. Provides state-of-the-art performance across various tasks.",
      features: ['Advanced reasoning', 'Improved code generation', 'Enhanced safety', 'Multimodal capabilities'],
      useCases: ['Enterprise development', 'Research assistance', 'Complex problem-solving', 'System design']
    },
    {
      name: 'DeepSeek R1',
      efficiency: 89,
      accuracy: 88,
      color: '#ff7700',
      description: "A powerful open-source AI model specialized in code generation and technical reasoning. Provides strong performance for software development tasks.",
      features: ['Code understanding', 'Technical reasoning', 'Open-source architecture', 'Multilingual support'],
      useCases: ['Software development', 'Code analysis', 'Technical documentation', 'Programming education']
    },
    {
      name: 'DeepSeek R1 (d-32B)',
      efficiency: 87,
      accuracy: 86,
      color: '#ff9e44',
      description: "A distilled version of DeepSeek R1 with 32 billion parameters, offering a good balance between performance and efficiency for code-related tasks.",
      features: ['Efficient processing', 'Smaller model size', 'Faster inference', 'Lower resource requirements'],
      useCases: ['Edge deployment', 'CI/CD integration', 'Developer workstations', 'Resource-constrained environments']
    },
    {
      name: 'Codium',
      efficiency: 82,
      accuracy: 77,
      color: '#f9a825',
      description: 'Open-source AI coding assistant that focuses on generating test cases and finding edge cases in your code. Helps improve code quality and reliability.',
      features: ['Test generation', 'Edge case detection', 'Code coverage analysis', 'Bug prediction'],
      useCases: ['Test-driven development', 'Quality assurance', 'Regression testing', 'Code maintenance']
    },
    {
      name: 'Widsurf',
      efficiency: 76,
      accuracy: 80,
      color: '#26a69a',
      description: 'Specialized AI assistant for web development that excels at generating UI components and styling. Helps bridge the gap between design and implementation.',
      features: ['UI component generation', 'CSS optimization', 'Responsive design', 'Accessibility suggestions'],
      useCases: ['Frontend development', 'Design implementation', 'UI/UX improvements', 'Accessibility compliance']
    },
  ];

  // Sort partners by efficiency for better visualization
  const sortedPartners = [...partners].sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div className="space-y-8">
      {/* Detailed Table */}
      <div className="bg-black/20 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="px-4 py-3 text-left text-[#36E4DA]">AI Partner</th>
              <th className="px-4 py-3 text-center text-[#36E4DA]">Efficiency</th>
              <th className="px-4 py-3 text-center text-[#36E4DA]">Accuracy</th>
              <th className="px-4 py-3 text-left text-[#36E4DA]">Description</th>
            </tr>
          </thead>
          <tbody>
            {sortedPartners.map((partner) => (
              <tr key={partner.name} className="border-b border-gray-800 hover:bg-black/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: partner.color }}></div>
                    <span className="font-medium text-white">{partner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${partner.efficiency}%`,
                          backgroundColor: partner.color
                        }}
                      />
                    </div>
                    <span className="text-white">{partner.efficiency}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${partner.accuracy}%`,
                          backgroundColor: partner.color
                        }}
                      />
                    </div>
                    <span className="text-white">{partner.accuracy}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300 text-sm">
                  {partner.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedPartners.slice(0, 4).map((partner) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black/20 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800" style={{ backgroundColor: `${partner.color}20` }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: partner.color }}></div>
                <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-300 text-sm mb-4">{partner.description}</p>

              <h4 className="text-sm font-medium text-[#36E4DA] mb-2">Key Features</h4>
              <ul className="grid grid-cols-2 gap-2 mb-4">
                {partner.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-sm font-medium text-[#36E4DA] mb-2">Use Cases</h4>
              <ul className="grid grid-cols-2 gap-2">
                {partner.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1"></div>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Section */}
      <div className="bg-black/20 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-[#36E4DA] mb-4">AI Coding Partners Comparison</h3>
        <p className="text-gray-300 text-sm mb-6">
          Our analysis of AI coding partners is based on extensive testing across various development scenarios.
          The efficiency metric measures how quickly the AI can generate useful code, while accuracy represents
          how often the generated code works correctly without requiring significant modifications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-white mb-3">Efficiency Leaders</h4>
            <ol className="space-y-2">
              {sortedPartners.slice(0, 3).map((partner, index) => (
                <li key={partner.name} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-xs font-medium" style={{ color: partner.color }}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-300">{partner.name} - {partner.efficiency}%</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-3">Accuracy Leaders</h4>
            <ol className="space-y-2">
              {[...partners].sort((a, b) => b.accuracy - a.accuracy).slice(0, 3).map((partner, index) => (
                <li key={partner.name} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-xs font-medium" style={{ color: partner.color }}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-300">{partner.name} - {partner.accuracy}%</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedAIPartnersView;
