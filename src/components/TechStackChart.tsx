import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, BarChart2 } from 'lucide-react';

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'infrastructure';
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  color: string;
}

interface TechStackChartProps {
  openExpandedView?: () => void;
}

const TechStackChart: React.FC<TechStackChartProps> = ({ openExpandedView }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [animateChart, setAnimateChart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Technology stack data
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
    { name: 'Firebase', category: 'backend', trend: 'up', percentage: 89, color: '#ffca28' },

    // AI
    { name: 'Google Gemini', category: 'ai', trend: 'up', percentage: 94, color: '#4285f4' },
    { name: 'CUDA', category: 'ai', trend: 'up', percentage: 89, color: '#76b900' },
    { name: 'C++', category: 'ai', trend: 'stable', percentage: 84, color: '#659ad2' },
    { name: 'Python', category: 'ai', trend: 'stable', percentage: 91, color: '#3776ab' },
    { name: 'Hugging Face', category: 'ai', trend: 'up', percentage: 88, color: '#ffbd59' },

    // Infrastructure
    { name: 'Docker', category: 'infrastructure', trend: 'up', percentage: 93, color: '#2496ed' },
    { name: 'Kubernetes', category: 'infrastructure', trend: 'up', percentage: 87, color: '#326ce5' },
    { name: 'Vercel', category: 'infrastructure', trend: 'up', percentage: 88, color: '#000000' },
    { name: 'GCP', category: 'infrastructure', trend: 'up', percentage: 86, color: '#4285f4' },
    { name: 'Cloudinary', category: 'infrastructure', trend: 'up', percentage: 85, color: '#3448c5' },
  ];

  // Trigger animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateChart(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter tech stack based on active category
  const filteredTechStack = techStack.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  // Limit the number of items shown in the compact view
  const limitedTechStack = filteredTechStack.slice(0, 6);

  return (
    <div className="w-full bg-black/30 rounded-xl border border-gray-800 p-4 sm:p-6 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Technology Stack</h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Performance metrics and adoption trends</p>
          </div>

          {/* Category Filter - Mobile Dropdown */}
          {isMobile && (
            <div className="relative w-full">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full bg-black/30 border border-gray-800 rounded-lg px-3 py-2 text-white appearance-none text-sm"
              >
                <option value="all">All Categories</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="ai">AI</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* Category Filter - Desktop Tabs */}
          {!isMobile && (
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
          )}
        </div>

        {/* Chart Header */}
        <div className="grid grid-cols-12 text-xs text-gray-500 border-b border-gray-800 pb-2">
          <div className="col-span-5 md:col-span-3">Technology</div>
          <div className="col-span-4 md:col-span-2 hidden sm:block">Category</div>
          <div className="col-span-2 md:col-span-1 text-center">Trend</div>
          <div className="col-span-5 md:col-span-6">Adoption</div>
        </div>

        {/* Chart Rows */}
        <div className="space-y-3 sm:space-y-4 max-h-[350px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
          {limitedTechStack.map((tech, index) => (
            <div key={tech.name} className="grid grid-cols-12 items-center">
              {/* Technology Name */}
              <div className="col-span-5 md:col-span-3 font-medium text-white flex items-center gap-1 sm:gap-2 text-xs sm:text-sm truncate">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tech.color }}></div>
                <span className="truncate">{tech.name}</span>
              </div>

              {/* Category - Hidden on mobile */}
              <div className="col-span-4 md:col-span-2 text-xs hidden sm:block">
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-medium ${
                  tech.category === 'frontend' ? 'bg-blue-500/20 text-blue-400' :
                  tech.category === 'backend' ? 'bg-green-500/20 text-green-400' :
                  tech.category === 'ai' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {tech.category}
                </span>
              </div>

              {/* Trend */}
              <div className="col-span-2 md:col-span-1 text-center">
                {tech.trend === 'up' && (
                  <span className="text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </span>
                )}
                {tech.trend === 'down' && (
                  <span className="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
                {tech.trend === 'stable' && (
                  <span className="text-yellow-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Percentage Bar */}
              <div className="col-span-5 md:col-span-6">
                <div className="h-1.5 sm:h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: animateChart ? `${tech.percentage}%` : 0 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                </div>
                <div className="flex justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-xs">
                  <span className="text-gray-500 hidden xs:inline">Adoption</span>
                  <span className="text-white font-medium">{tech.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {filteredTechStack.length > limitedTechStack.length && (
          <div className="flex justify-center pt-2 border-t border-gray-800">
            <button
              onClick={openExpandedView}
              className="flex items-center gap-2 px-4 py-2 bg-[#36E4DA]/10 border border-[#36E4DA]/30 rounded-lg text-[#36E4DA] hover:bg-[#36E4DA]/20 hover:border-[#36E4DA]/50 transition-colors text-sm font-medium"
            >
              <span>View {filteredTechStack.length - limitedTechStack.length} More</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-4 pt-2 border-t border-gray-800 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <span className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </span>
            <span className="text-gray-400">Increasing</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </span>
            <span className="text-gray-400">Stable</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <span className="text-gray-400">Decreasing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackChart;
