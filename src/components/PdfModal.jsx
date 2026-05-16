import { useState } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function PdfModal({ file, onClose }) {
  const [scale, setScale] = useState(1);

  if (!file) return null;

  const pdfUrl = api.getFileUrl(file.path);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wine/10 bg-cream">
          <h3 className="font-semibold text-wine-dark truncate pr-4">{file.name}</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
              className="w-8 h-8 rounded-lg bg-wine/10 hover:bg-wine/20 flex items-center justify-center text-wine transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs text-wine/60 min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
            <button 
              onClick={() => setScale(s => Math.min(3, s + 0.25))}
              className="w-8 h-8 rounded-lg bg-wine/10 hover:bg-wine/20 flex items-center justify-center text-wine transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn size={16} />
            </button>
            <div className="w-px h-6 bg-wine/10 mx-2"></div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-wine/10 hover:bg-red-100 flex items-center justify-center text-wine hover:text-red-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF iframe viewer */}
        <div className="flex-1 overflow-auto bg-gray-100" style={{ minHeight: '70vh' }}>
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${scale * 100}`}
            className="w-full border-0"
            style={{ height: '75vh', transform: `scale(${scale})`, transformOrigin: 'top center' }}
            title={file.name}
          />
        </div>
      </div>
    </div>
  );
}
