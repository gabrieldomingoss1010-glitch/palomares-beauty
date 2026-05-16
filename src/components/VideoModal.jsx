import { X } from 'lucide-react';
import { api } from '../services/api';

export default function VideoModal({ file, onClose }) {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-wine-dark rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wine/20">
          <h3 className="font-semibold text-cream truncate pr-4">{file.name}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-wine/30 hover:bg-wine/60 flex items-center justify-center text-cream transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <video 
            controls 
            autoPlay
            className="w-full max-h-[70vh]"
            src={api.getFileUrl(file.path)}
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      </div>
    </div>
  );
}
