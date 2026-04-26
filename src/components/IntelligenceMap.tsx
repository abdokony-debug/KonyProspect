
import React from 'react';
import { motion } from 'motion/react';

interface GridCellProps {
  active: boolean;
  intensity: number;
}

const GridCell: React.FC<GridCellProps> = ({ active, intensity }) => (
  <motion.div
    animate={{ 
      opacity: active ? [0.2, 0.8, 0.2] : 0.1,
      scale: active ? [1, 1.2, 1] : 1
    }}
    transition={{ repeat: Infinity, duration: 2 + Math.random() * 2 }}
    className={`w-full h-full rounded-[1px] ${
      intensity > 0.8 ? 'bg-accent shadow-[0_0_8px_#f97316]' : 
      intensity > 0.5 ? 'bg-accent/60' : 'bg-white/10'
    }`}
  />
);

export const IntelligenceMap: React.FC = () => {
  // 12x12 Grid for visual OSINT mapping
  const grid = Array.from({ length: 144 }, (_, i) => ({
    id: i,
    active: Math.random() > 0.9,
    intensity: Math.random()
  }));

  return (
    <div className="relative w-full aspect-square max-w-[200px] border border-white/5 p-1 bg-black/20 rounded-lg overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent pointer-events-none" />
      <div className="grid grid-cols-12 grid-rows-12 gap-[1px] w-full h-full">
        {grid.map(cell => (
          <GridCell key={cell.id} active={cell.active} intensity={cell.intensity} />
        ))}
      </div>
      
      {/* Scanning Overlay */}
      <motion.div
        animate={{ translateY: ['0%', '1000%', '0%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-accent/40 shadow-[0_0_10px_#f97316] z-10"
      />
      
      {/* HUD Info */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-bg-panel/80 backdrop-blur-md flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[6px] font-mono text-accent">NODE_SYNC: 94%</span>
        <span className="text-[6px] font-mono text-emerald-400">ENCRYPT: ON</span>
      </div>
    </div>
  );
};
