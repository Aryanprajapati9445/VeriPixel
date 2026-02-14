import { useState } from "react";

export default function UploadBox({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    onUpload(file);
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFile(files[0]);
  };

  return (
    <div className="w-full">
      <label
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`group relative flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-3xl p-12 cursor-pointer transition-all duration-500 overflow-hidden ${isDragging
            ? "border-violet-400 bg-violet-500/10 scale-[1.02]"
            : "border-slate-700 bg-slate-800/30 hover:border-violet-500/50 hover:bg-slate-800/50"
          }`}
      >
        {/* Animated background glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 transition-all duration-500 ${isDragging ? "opacity-20 from-violet-600 to-fuchsia-600" : "opacity-0 group-hover:opacity-10"
            }`}
        ></div>

        <div className="relative z-10 text-center space-y-6">
          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className={`absolute inset-0 bg-violet-500 rounded-full blur-xl opacity-20 transition-all duration-500 ${isDragging ? "scale-150 opacity-40" : "group-hover:scale-125 group-hover:opacity-30"}`}></div>
            <div className={`relative bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl transition-transform duration-500 ${isDragging ? "scale-110 -rotate-3" : "group-hover:scale-105 group-hover:-rotate-3"}`}>
              <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            {/* Upload Icon Badge */}
            <div className="absolute -top-3 -right-3 bg-fuchsia-500 text-white p-2 rounded-full shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold text-white transition-colors">
              {isDragging ? "Drop to analyze" : "Upload Image"}
            </p>
            <p className="text-slate-400 max-w-xs mx-auto">
              Drag and drop or <span className="text-violet-400 border-b border-violet-400/30 hover:border-violet-400 transition-colors">browse</span> to detect AI manipulation
            </p>
          </div>

          {/* File Types Pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>JPG</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>PNG</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>WEBP</span>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
}