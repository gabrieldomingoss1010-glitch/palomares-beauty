import { useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { api } from '../services/api';

export default function VideoModal({ file, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!file) return null;

  const videoUrl = api.getFileUrl(file.path);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center md:p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full md:h-auto md:max-w-4xl rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ background: '#1a0a0a' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(159,122,234,0.25)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <h3 className="font-semibold truncate" style={{ color: '#f5ede8', fontSize: '0.95rem' }}>{file.name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <a
              href={videoUrl}
              download={file.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#c9a0a0' }}
              title="Baixar vídeo"
            >
              <Download size={14} /> Baixar
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#c9a0a0' }}
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="flex-1 flex items-center justify-center" style={{ background: '#000', minHeight: '0' }}>
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full"
            style={{ maxHeight: '72vh', outline: 'none' }}
            src={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/quicktime" />
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      </div>
    </div>
  );
}
