import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ResultCard from "./components/ResultCard";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const analyzeImage = async (file) => {
    setLoading(true);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Server error. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const resetImage = () => {
    setPreviewImage(null);
    setResult(null);
    setLoading(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    analyzeImage(file);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-sky-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 max-w-7xl">

        {/* Header */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-violet-300 mb-4 animate-fade-in-scale">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>VeriPixel</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-gradient">VeriPixel</span>
            <br />
            <span className="text-slate-100">AI Authenticity Detector</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Verify digital integrity with enterprise-grade logical analysis.
            Detect AI-generated content 
          </p>
        </header>

        {/* Core Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Upload Area and Image */}
          <div className="space-y-8">
            {!previewImage ? (
              <div className="glass-panel p-1 rounded-3xl transition-all duration-500 hover:shadow-violet-500/10 hover:shadow-2xl">
                <UploadBox onUpload={analyzeImage} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="glass-panel rounded-3xl overflow-hidden relative group min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 z-10"></div>
                  <div className="w-full h-full flex items-center justify-center p-6">
                    <img
                      src={previewImage}
                      alt="Analyzed content"
                      className="max-h-[360px] max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="text-sm font-mono text-violet-300">FILENAME: IMAGE_ANALYSIS_01.JPG</p>
                  </div>
                </div>
                <div className="text-center">
                  <label className="cursor-pointer text-sm text-violet-400 hover:underline inline-flex items-center gap-2">
                    <span>Upload another image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Right: Results Section */}
          <div className="animate-fade-in-up relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="glass-panel rounded-3xl p-12 text-center space-y-6">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-4 border-t-violet-500 border-r-transparent border-b-fuchsia-500 border-l-transparent rounded-full animate-spin"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Analyzing Neural Patterns...</h3>
                    <p className="text-slate-400 mt-2">Scanning pixel-level artifacts and metadata</p>
                  </div>
                </div>
              </div>
            )}

            <div className={`${loading ? 'opacity-40 pointer-events-none' : ''}`}>
              <ResultCard result={result} loading={loading} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-24 border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VeriPixel. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
