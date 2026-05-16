import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading = false }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fef2f2' }}>
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
            </div>
            <h3 className="font-semibold text-wine-dark text-lg">{title || 'Confirmar ação'}</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <p className="px-6 pb-6 text-wine/70 text-sm leading-relaxed">{message}</p>

        {/* Divider */}
        <div className="border-t border-wine/5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: 'rgba(120,50,60,0.15)', color: '#7a3a4a' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-60 flex items-center gap-2"
            style={{ background: loading ? '#f87171' : '#ef4444' }}
          >
            {loading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
