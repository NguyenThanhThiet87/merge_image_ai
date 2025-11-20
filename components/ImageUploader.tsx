import React, { useRef } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { ImageAttachment } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  label: string;
  image: ImageAttachment | null;
  onImageUpload: (img: ImageAttachment) => void;
  onRemove: () => void;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onImageUpload, onRemove, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        const newImage: ImageAttachment = {
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          base64,
          mimeType: file.type,
        };
        onImageUpload(newImage);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
    // Reset input so same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      
      {!image ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="group relative h-48 w-full border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center bg-slate-800/30 hover:bg-slate-800/50 hover:border-yellow-500/50 transition-all cursor-pointer"
        >
          <input 
            type="file" 
            ref={inputRef}
            id={id}
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="p-4 rounded-full bg-slate-800 group-hover:scale-110 transition-transform duration-200 mb-3">
             <ImagePlus className="w-6 h-6 text-slate-400 group-hover:text-yellow-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Click to upload</p>
          <p className="text-slate-500 text-xs mt-1">JPG, PNG, WEBP</p>
        </div>
      ) : (
        <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-700 group">
          <img 
            src={image.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
               onClick={onRemove}
               className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all"
             >
               <X className="w-5 h-5" />
             </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs text-white truncate px-1">{image.file.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;