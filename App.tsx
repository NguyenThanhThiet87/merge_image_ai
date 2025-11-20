import React, { useState, useCallback } from 'react';
import { Wand2, Image as ImageIcon, Plus, Sparkles } from 'lucide-react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultView from './components/ResultView';
import { ImageAttachment, GenerationStatus } from './types';
import { generateImage } from './services/geminiService';

const DEFAULT_PROMPT = "Ghép ảnh xe VF6 này vào bức ảnh nhà thờ một cách hợp lý, nhìn chân thực, ảnh sắc nét. Sau đó thêm một dòng chữ màu vàng Taxi Tây Ninh 0968 57 51 57";

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [prompt, setPrompt] = useState<string>('');
  const [image1, setImage1] = useState<ImageAttachment | null>(null);
  const [image2, setImage2] = useState<ImageAttachment | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
        // If prompt is empty, use a default descriptive prompt if user hasn't provided one, 
        // but usually we want to force a prompt. For this specific app, if they uploaded the car and church,
        // they might expect the example behavior.
        if (!image1 && !image2) {
             setError("Please provide at least one image or a prompt.");
             return;
        }
    }
    
    // Use user prompt or fallback to default if they are trying the specific use case with empty prompt
    const finalPrompt = prompt.trim() || DEFAULT_PROMPT;

    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResultUrl(null);

    try {
      const imagesToProcess: ImageAttachment[] = [];
      if (image1) imagesToProcess.push(image1);
      if (image2) imagesToProcess.push(image2);

      const url = await generateImage(finalPrompt, imagesToProcess);
      setResultUrl(url);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const applyExample = () => {
      setPrompt(DEFAULT_PROMPT);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                 <ImageIcon className="w-5 h-5 text-yellow-400" />
                 <h2 className="text-lg font-semibold text-white">Assets</h2>
              </div>
              
              <div className="space-y-4">
                <ImageUploader 
                  id="img1"
                  label="Background Image (Optional)" 
                  image={image1} 
                  onImageUpload={setImage1} 
                  onRemove={() => setImage1(null)} 
                />
                
                {image1 && (
                    <div className="relative flex items-center justify-center py-2">
                         <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700"></div>
                         </div>
                         <div className="relative bg-slate-900 px-2">
                            <Plus className="w-4 h-4 text-slate-500" />
                         </div>
                    </div>
                )}

                <ImageUploader 
                  id="img2"
                  label="Object/Reference Image (Optional)" 
                  image={image2} 
                  onImageUpload={setImage2} 
                  onRemove={() => setImage2(null)} 
                />
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 shadow-lg flex-grow flex flex-col">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-lg font-semibold text-white">Prompt</h2>
                 </div>
                 <button 
                    onClick={applyExample}
                    className="text-xs text-yellow-400 hover:text-yellow-300 underline decoration-dotted underline-offset-2"
                 >
                    Load example prompt
                 </button>
               </div>
               
               <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to edit or merge these images. E.g., 'Place the car in front of the building...'"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 resize-none flex-grow min-h-[120px]"
               />

               <button
                onClick={handleGenerate}
                disabled={status === GenerationStatus.LOADING || (!image1 && !image2 && !prompt)}
                className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
               >
                 {status === GenerationStatus.LOADING ? (
                   <>Processing...</>
                 ) : (
                   <>
                     <Sparkles className="w-5 h-5" />
                     Generate
                   </>
                 )}
               </button>
            </div>

          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8 h-full min-h-[500px] lg:min-h-0">
             <ResultView status={status} resultUrl={resultUrl} error={error} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;