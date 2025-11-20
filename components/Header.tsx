import React from 'react';
import { Zap, Image as ImageIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg">
            <ImageIcon className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Nano Banana Studio
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-yellow-400 font-mono border border-slate-700">
                Gemini 2.5 Flash
              </span>
            </h1>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            Powered by Google GenAI
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;