import React, { useRef, useState } from 'react';
import { PresentationFile } from '../types';
import { FileUp, FileText, CheckCircle2, Play, ArrowRight } from 'lucide-react';

interface PresentationPickerProps {
  loadedFile: PresentationFile | null;
  onSelectFile: (name: string, totalSlides?: number) => void;
  onStartPresenting: () => void;
}

export const PresentationPicker: React.FC<PresentationPickerProps> = ({
  loadedFile,
  onSelectFile,
  onStartPresenting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onSelectFile(file.name, 28);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onSelectFile(file.name, 28);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-md border border-[#b1d3b9] shadow-xl text-center text-[#1b3832] animate-in fade-in zoom-in-95 duration-200">
      <input
        ref={fileInputRef}
        type="file"
        accept=".ppt,.pptx,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {!loadedFile ? (
        /* STAGE 1: Laptop Connected -> Choose presentation */
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f2dd] text-xs font-semibold text-[#2d554c] mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Phone Connected</span>
            </div>
            <h3 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1b3832]">
              You're connected.
            </h3>
            <p className="text-sm sm:text-base text-[#2d554c] mt-2 max-w-md mx-auto">
              Your phone is ready to control your presentation.
            </p>
          </div>

          {/* Minimal Upload / File Selection Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-[#3d5f57] bg-[#e6f2dd]'
                : 'border-[#b1d3b9] bg-[#f8faf8] hover:bg-[#e6f2dd]/40 hover:border-[#659287]'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#e6f2dd] text-[#3d5f57] flex items-center justify-center">
              <FileUp className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#1b3832]">
                Drop a presentation here
              </p>
              <p className="text-xs text-[#659287] mt-0.5">
                or click to browse your files
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              className="mt-2 px-6 py-3 rounded-full bg-[#3d5f57] hover:bg-[#2c4740] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              Choose presentation
            </button>

            {/* Supported Formats */}
            <span className="text-[11px] font-medium tracking-wider text-[#659287] uppercase mt-2">
              PPT · PPTX · PDF
            </span>
          </div>

          {/* Quick Demo deck option for immediate testing */}
          <div className="pt-2 border-t border-[#b1d3b9]/40">
            <span className="text-xs text-[#2d554c] block mb-2">
              Want to test right away without uploading?
            </span>
            <button
              onClick={() => onSelectFile('INCINERATE.pptx', 28)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6f2dd] hover:bg-[#d6e8cb] text-xs font-semibold text-[#1b3832] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#547f74]" />
              <span>Use demo presentation (INCINERATE.pptx · 28 slides)</span>
            </button>
          </div>
        </div>
      ) : (
        /* STAGE 2: Presentation Selected - Ready to Present */
        <div className="space-y-6 py-2">
          <div className="w-16 h-16 rounded-2xl bg-[#e6f2dd] text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
            <CheckCircle2 className="w-9 h-9 text-[#3d5f57]" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#659287]">
              Presentation Selected
            </span>
            <h3 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#1b3832] mt-1.5">
              {loadedFile.name}
            </h3>
            <p className="text-sm font-medium text-[#2d554c] mt-1">
              {loadedFile.totalSlides} slides
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-full border border-[#b1d3b9] bg-white text-xs font-medium text-[#2d554c] hover:bg-neutral-50 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Change file
            </button>
            <button
              onClick={onStartPresenting}
              className="px-8 py-3.5 rounded-full bg-[#3d5f57] hover:bg-[#2c4740] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto active:scale-95 group"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start presenting</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
