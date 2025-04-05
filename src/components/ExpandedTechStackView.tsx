import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'infrastructure';
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  color: string;
}

const ExpandedTechStackView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Technology stack data - same as in TechStackChart
  const techStack: TechItem[] = [
    // Frontend
    { name: 'TypeScript', category: 'frontend', trend: 'up', percentage: 92, color: '#3178c6' },
    { name: 'React', category: 'frontend', trend: 'up', percentage: 88, color: '#61dafb' },
    { name: 'Tailwind CSS', category: 'frontend', trend: 'up', percentage: 85, color: '#38bdf8' },
    { name: 'Framer Motion', category: 'frontend', trend: 'up', percentage: 78, color: '#ff4d4d' },

    // Backend
    { name: 'Node.js', category: 'backend', trend: 'up', percentage: 90, color: '#8cc84b' },
    { name: 'FastAPI', category: 'backend', trend: 'up', percentage: 82, color: '#009688' },
    { name: 'Flask', category: 'backend', trend: 'stable', percentage: 75, color: '#000000' },
    { name: 'Rust', category: 'backend', trend: 'up', percentage: 86, color: '#dea584' },

    // AI
    { name: 'Google Gemini', category: 'ai', trend: 'up', percentage: 94, color: '#4285f4' },
    { name: 'CUDA', category: 'ai', trend: 'up', percentage: 89, color: '#76b900' },
    { name: 'C++', category: 'ai', trend: 'stable', percentage: 84, color: '#659ad2' },
    { name: 'Python', category: 'ai', trend: 'stable', percentage: 91, color: '#3776ab' },

    // Infrastructure
    { name: 'Docker', category: 'infrastructure', trend: 'up', percentage: 93, color: '#2496ed' },
    { name: 'Kubernetes', category: 'infrastructure', trend: 'up', percentage: 87, color: '#326ce5' },
    { name: 'Vercel', category: 'infrastructure', trend: 'up', percentage: 88, color: '#000000' },
    { name: 'GCP', category: 'infrastructure', trend: 'up', percentage: 86, color: '#4285f4' },
  ];

  // Filter tech stack based on active category
  const filteredTechStack = techStack.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap bg-black/30 rounded-lg p-1 text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-md transition-colors ${activeCategory === 'all' ? 'bg-[#00DC82]/20 text-[#00DC82]' : 'text-gray-400 hover:text-white'}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveCategory('frontend')}
          className={`px-3 py-1.5 rounded-md transition-colors ${activeCategory === 'frontend' ? 'bg-[#00DC82]/20 text-[#00DC82]' : 'text-gray-400 hover:text-white'}`}
        >
          Frontend
        </button>
        <button
          onClick={() => setActiveCategory('backend')}
          className={`px-3 py-1.5 rounded-md transition-colors ${activeCategory === 'backend' ? 'bg-[#00DC82]/20 text-[#00DC82]' : 'text-gray-400 hover:text-white'}`}
        >
          Backend
        </button>
        <button
          onClick={() => setActiveCategory('ai')}
          className={`px-3 py-1.5 rounded-md transition-colors ${activeCategory === 'ai' ? 'bg-[#00DC82]/20 text-[#00DC82]' : 'text-gray-400 hover:text-white'}`}
        >
          AI
        </button>
        <button
          onClick={() => setActiveCategory('infrastructure')}
          className={`px-3 py-1.5 rounded-md transition-colors ${activeCategory === 'infrastructure' ? 'bg-[#00DC82]/20 text-[#00DC82]' : 'text-gray-400 hover:text-white'}`}
        >
          Infrastructure
        </button>
      </div>

      {/* Detailed Table */}
      <div className="bg-black/20 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="px-4 py-3 text-left text-[#36E4DA]">Technology</th>
              <th className="px-4 py-3 text-left text-[#36E4DA]">Category</th>
              <th className="px-4 py-3 text-center text-[#36E4DA]">Trend</th>
              <th className="px-4 py-3 text-left text-[#36E4DA]">Adoption</th>
              <th className="px-4 py-3 text-left text-[#36E4DA]">Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredTechStack.map((tech, index) => (
              <tr key={tech.name} className="border-b border-gray-800 hover:bg-black/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tech.color }}></div>
                    <span className="font-medium text-white">{tech.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-medium ${
                    tech.category === 'frontend' ? 'bg-blue-500/20 text-blue-400' :
                    tech.category === 'backend' ? 'bg-green-500/20 text-green-400' :
                    tech.category === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {tech.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {tech.trend === 'up' && (
                    <span className="text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  )}
                  {tech.trend === 'down' && (
                    <span className="text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  )}
                  {tech.trend === 'stable' && (
                    <span className="text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: tech.color }}
                      />
                    </div>
                    <span className="text-white">{tech.percentage}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm">
                  {getTechDescription(tech.name)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 rounded-xl border border-gray-800 p-4">
          <h3 className="text-lg font-semibold text-[#36E4DA] mb-3">Technology Adoption Trends</h3>
          <p className="text-gray-400 text-sm mb-4">
            Our technology stack is carefully selected based on industry trends, performance metrics, and team expertise.
            The adoption percentages represent our internal usage and confidence in each technology.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#36E4DA]/10 text-[#36E4DA] rounded-full text-xs">High Performance</span>
            <span className="px-3 py-1 bg-[#36E4DA]/10 text-[#36E4DA] rounded-full text-xs">Scalability</span>
            <span className="px-3 py-1 bg-[#36E4DA]/10 text-[#36E4DA] rounded-full text-xs">Developer Experience</span>
            <span className="px-3 py-1 bg-[#36E4DA]/10 text-[#36E4DA] rounded-full text-xs">Community Support</span>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl border border-gray-800 p-4">
          <h3 className="text-lg font-semibold text-[#36E4DA] mb-3">Technology Selection Criteria</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1.5"></div>
              <span>Performance benchmarks and optimization potential</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1.5"></div>
              <span>Ecosystem maturity and community support</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1.5"></div>
              <span>Integration capabilities with existing infrastructure</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#36E4DA] mt-1.5"></div>
              <span>Long-term maintenance and support outlook</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper function to get technology descriptions
function getTechDescription(techName: string): string {
  const descriptions: Record<string, string> = {
    'TypeScript': 'Strongly typed programming language that builds on JavaScript, giving better tooling at any scale.',
    'React': 'JavaScript library for building user interfaces, particularly single-page applications.',
    'Tailwind CSS': 'Utility-first CSS framework for rapidly building custom user interfaces.',
    'Framer Motion': 'Production-ready motion library for React that makes creating animations easy.',
    'Node.js': "JavaScript runtime built on Chrome's V8 JavaScript engine for building scalable network applications.",
    'FastAPI': 'Modern, fast web framework for building APIs with Python based on standard type hints.',
    'Flask': 'Lightweight WSGI web application framework designed to make getting started quick and easy.',
    'Rust': 'Systems programming language focused on safety, speed, and concurrency.',
    'Firebase': 'Platform developed by Google for creating mobile and web applications, providing tools and infrastructure to build, improve, and grow apps.',
    'Google Gemini': "Google's multimodal AI model capable of understanding and reasoning across text, images, audio, and video.",
    'CUDA': 'Parallel computing platform and API model created by NVIDIA for general computing on GPUs.',
    'C++': 'General-purpose programming language with a bias toward systems programming and performance.',
    'Python': 'Interpreted high-level general-purpose programming language with a focus on code readability.',
    'Hugging Face': 'AI community platform that provides tools to build, train and deploy ML models based on open source code and technologies.',
    'Docker': 'Platform for developing, shipping, and running applications in containers.',
    'Kubernetes': 'Open-source system for automating deployment, scaling, and management of containerized applications.',
    'Vercel': 'Platform for frontend frameworks and static sites, built to integrate with headless content, commerce, and databases.',
    'GCP': 'Suite of cloud computing services that runs on the same infrastructure that Google uses internally.',
    'Cloudinary': 'Cloud-based image and video management service that provides an end-to-end image and video management solution.'
  };

  return descriptions[techName] || 'Advanced technology integrated into our stack for optimal performance.';
}

export default ExpandedTechStackView;
