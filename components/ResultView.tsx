import React from 'react';
import { Download, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { GenerationStatus } from '../types';

interface ResultViewProps {
  status: GenerationStatus;
  resultUrl: string | null;
  error: string | null;
}

const ResultView: React.FC<ResultViewProps> = ({ status, resultUrl, error }) => {
  
  const handleDownload = () => {
    if (resultUrl) {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `gemini-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (status === GenerationStatus.ERROR) {
    return (
      <div className="h-full min-h-[400px] w-full bg-red-950/20 border border-red-900/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-200 mb-2">Generation Failed</h3>
        <p className="text-red-300/80 max-w-md">{error}</p>
      </div>
    );
  }

  if (status === GenerationStatus.LOADING) {
    return (
      <div className="h-full min-h-[400px] w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center p-8">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-yellow-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-white mt-6 animate-pulse">Gemini is thinking...</h3>
        <p className="text-slate-400 text-sm mt-2">Processing images and text instructions</p>
      </div>
    );
  }

  if (status === GenerationStatus.IDLE && !resultUrl) {
    return (
      <div className="h-full min-h-[400px] w-full bg-slate-800/30 border border-slate-700/50 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed">
        <Sparkles className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-300 mb-1">Ready to Create</h3>
        <p className="text-slate-500 max-w-xs">Upload images and enter a prompt to see the magic happen here.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex flex-col animate-in fade-in duration-500">
      <div className="relative flex-grow rounded-2xl overflow-hidden border border-slate-700 bg-black/40 shadow-2xl">
        {resultUrl && (
          <img 
            src={resultUrl} 
            alt="Generated Result" 
            className="w-full h-full object-contain max-h-[600px]"
          />
        )}
      </div>
      
      <div className="flex gap-3 mt-4 justify-end">
         <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default ResultView;