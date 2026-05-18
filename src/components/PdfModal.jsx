import { useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function PdfModal({ file, onClose }) {
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

  const pdfUrl = api.getFileUrl(file.path);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center md:p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full h-full md:max-w-5xl md:h-auto md:max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-wine/10 flex-shrink-0" style={{ background: '#fdf6f0' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fdeaea' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3 className="font-semibold text-wine-dark truncate" style={{ fontSize: '0.95rem' }}>{file.name}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-wine/5"
              style={{ borderColor: 'rgba(120,50,60,0.15)', color: '#7a3a4a' }}
              title="Abrir em nova aba"
            >
              <ExternalLink size={13} /> Nova aba
            </a>
            <a
              href={pdfUrl}
              download={file.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ background: '#fdeaea', color: '#c0392b' }}
              title="Baixar PDF"
            >
              <Download size={13} /> Baixar
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 hover:text-red-600"
              style={{ background: 'rgba(120,50,60,0.08)', color: '#7a3a4a' }}
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 overflow-hidden" style={{ minHeight: '0' }}>
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            style={{ height: '80vh' }}
            title={file.name}
          />
        </div>
      </div>
    </div>
  );
}
