import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AIPartner {
  name: string;
  efficiency: number;
  accuracy: number;
  color: string;
}

interface AIPartnersChartProps {
  openExpandedView?: () => void;
}

const AIPartnersChart: React.FC<AIPartnersChartProps> = ({ openExpandedView }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // AI Partners data
  const partners: AIPartner[] = [
    { name: 'GitHub Copilot', efficiency: 85, accuracy: 78, color: '#6e40c9' },
    { name: 'Bolt', efficiency: 92, accuracy: 83, color: '#00DC82' },
    { name: 'Blackbox AI', efficiency: 88, accuracy: 81, color: '#333333' },
    { name: 'Qodo', efficiency: 79, accuracy: 86, color: '#ff6b6b' },
    { name: 'Augment Code', efficiency: 94, accuracy: 89, color: '#36E4DA' },
    { name: 'Gemini 2.5 Pro', efficiency: 93, accuracy: 94, color: '#4285f4' },
    { name: 'Gemini 2.0 Flash', efficiency: 90, accuracy: 92, color: '#34a853' },
    { name: 'GPT-4o', efficiency: 95, accuracy: 93, color: '#10a37f' },
    { name: 'GPT-4o-mini', efficiency: 91, accuracy: 89, color: '#19c37d' },
    { name: 'Claude 3.5 Sonnet', efficiency: 92, accuracy: 91, color: '#9c5aff' },
    { name: 'Claude 3.7 Sonnet', efficiency: 94, accuracy: 93, color: '#7b3fe4' },
    { name: 'DeepSeek R1', efficiency: 89, accuracy: 88, color: '#ff7700' },
    { name: 'DeepSeek R1 (d-32B)', efficiency: 87, accuracy: 86, color: '#ff9e44' },
    { name: 'Codium', efficiency: 82, accuracy: 77, color: '#f9a825' },
    { name: 'Widsurf', efficiency: 76, accuracy: 80, color: '#26a69a' },
  ];

  // Sort partners by efficiency for better visualization
  const sortedPartners = [...partners].sort((a, b) => b.efficiency - a.efficiency);

  // Intersection Observer to trigger animation when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);

  // Intersection Observer to trigger animation when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);

  // Draw the chart
  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set canvas styles
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Chart dimensions
    const padding = { top: 40, right: 30, bottom: 60, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Draw title
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('AI Coding Partners Performance Analysis', rect.width / 2, 25);

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    // Y-axis label
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Efficiency (%)', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Accuracy (%)', padding.left + chartWidth / 2, padding.top + chartHeight + 40);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = padding.top + chartHeight - (i / 10) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${i * 10}`, padding.left - 10, y + 3);
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();

      // X-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${i * 10}`, x, padding.top + chartHeight + 15);
    }

    // Draw data points with animation
    sortedPartners.forEach((partner, index) => {
      setTimeout(() => {
        if (!canvasRef.current || !ctx) return;

        const x = padding.left + (partner.accuracy / 100) * chartWidth;
        const y = padding.top + chartHeight - (partner.efficiency / 100) * chartHeight;
        const radius = 8;

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = partner.color;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw label
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(partner.name, x + radius + 5, y + 3);

        // Draw connecting line to axes
        ctx.strokeStyle = partner.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        // Vertical line to x-axis
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.stroke();

        // Horizontal line to y-axis
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(padding.left, y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }, index * 200); // Stagger animation
    });

    // Draw legend
    const legendX = padding.left;
    const legendY = padding.top - 15;

    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText('Bubble size represents relative usage', legendX, legendY);

  }, [isVisible, sortedPartners]);



  return (
    <div className="w-full bg-black/30 rounded-xl border border-gray-800 p-4 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] md:h-[500px]"
        />

        {/* Overlay for small screens with scrollable table */}
        <div className="md:hidden mt-4">
          <p className="text-xs text-gray-400 mb-2">For better visualization on mobile, here's the data in table format:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/50">
                <tr>
                  <th className="px-2 py-2 text-left text-[#36E4DA]">AI Partner</th>
                  <th className="px-2 py-2 text-right text-[#36E4DA]">Efficiency</th>
                  <th className="px-2 py-2 text-right text-[#36E4DA]">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {sortedPartners.map((partner) => (
                  <tr key={partner.name} className="border-b border-gray-800">
                    <td className="px-2 py-2 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: partner.color }}></div>
                        {partner.name}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right">{partner.efficiency}%</td>
                    <td className="px-2 py-2 text-right">{partner.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View More Button */}
        {openExpandedView && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={openExpandedView}
              className="flex items-center gap-2 px-4 py-2 bg-[#36E4DA]/10 border border-[#36E4DA]/30 rounded-lg text-[#36E4DA] hover:bg-[#36E4DA]/20 hover:border-[#36E4DA]/50 transition-colors text-sm font-medium"
            >
              <span>View Detailed Analysis</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPartnersChart;
