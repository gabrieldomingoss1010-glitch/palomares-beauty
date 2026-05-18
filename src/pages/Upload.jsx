import { useState, useRef, useContext } from 'react';
import { FilesContext } from '../context/FilesContext';
import { FileText, Video, CheckCircle2, AlertCircle, UploadCloud, X } from 'lucide-react';

export default function Upload() {
  const { addFile } = useContext(FilesContext);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  const handleRealUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    setSuccess(false);
    setError(null);
    setSelectedFile(file);

    try {
      const newFile = await addFile(file, (pct) => setProgress(pct));
      setUploading(false);
      setSuccess(true);
      setSelectedFile(null);
      setHistory(prev => [newFile, ...prev]);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setUploading(false);
      setError(err.message || 'Erro ao fazer upload');
      setSelectedFile(null);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleRealUpload(file);
    e.target.value = '';
  };

  const handleCardClick = (accept) => {
    if (uploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        <UploadCard
          icon={FileText}
          title="Upload de PDF"
          description="Documentos, apostilas e guias"
          accentColor="#c0392b"
          bgColor="#fdeaea"
          onClick={() => handleCardClick('.pdf')}
          disabled={uploading}
        />
        <UploadCard
          icon={Video}
          title="Upload de Vídeo"
          description="Aulas, tutoriais e workshops"
          accentColor="#7c3aed"
          bgColor="#ede9f8"
          onClick={() => handleCardClick('video/*')}
          disabled={uploading}
        />
      </div>

      {/* Progress bar */}
      {uploading && selectedFile && (
        <div className="bg-white rounded-xl border border-wine/10 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selectedFile.type.includes('pdf') ? '#fdeaea' : '#ede9f8' }}>
              {selectedFile.type.includes('pdf')
                ? <FileText size={20} style={{ color: '#c0392b' }} />
                : <Video size={20} style={{ color: '#7c3aed' }} />
              }
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-wine-dark truncate">{selectedFile.name}</p>
              <p className="text-xs text-wine/50">{formatSize(selectedFile.size)}</p>
            </div>
            <span className="text-sm font-bold text-rose ml-2 flex-shrink-0">{progress}%</span>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f5e8ea' }}>
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7a3a4a 0%, #c0392b 100%)',
              }}
            />
          </div>
          <p className="text-xs text-wine/50 mt-2">Enviando para o servidor, aguarde...</p>
        </div>
      )}

      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl p-4 mb-6 border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
          <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
          <span className="font-medium" style={{ color: '#15803d' }}>Upload concluído com sucesso! O arquivo já está disponível na biblioteca.</span>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl p-4 mb-6 border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
          <span className="font-medium" style={{ color: '#991b1b' }}>{error}</span>
        </div>
      )}

      {/* Session history */}
      {history.length > 0 && (
        <section className="bg-white rounded-xl border border-wine/10 p-6">
          <h3 className="text-lg font-semibold text-wine-dark mb-4 border-b border-wine/5 pb-4">
            Histórico da Sessão ({history.length})
          </h3>
          <div className="space-y-3">
            {history.map(file => (
              <div key={file.id} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-rose-light/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: file.type === 'pdf' ? '#fdeaea' : '#ede9f8' }}
                  >
                    {file.type === 'pdf'
                      ? <FileText size={15} style={{ color: '#c0392b' }} />
                      : <Video size={15} style={{ color: '#7c3aed' }} />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-wine-dark text-sm">{file.name}</p>
                    <p className="text-xs text-wine/50">{formatSize(file.size)}</p>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: '#f0fdf4', color: '#16a34a' }}
                >
                  ✓ Enviado
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function UploadCard({ icon: Icon, title, description, accentColor, bgColor, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-200 border-2 border-dashed border-wine/15 bg-white hover:shadow-lg hover:border-wine/30 group"
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
        style={{ background: bgColor }}
      >
        <Icon size={32} style={{ color: accentColor }} />
      </div>
      <h3 className="text-xl font-semibold text-wine-dark mb-1">{title}</h3>
      <p className="text-sm text-wine/55 mb-6">{description}</p>

      <div
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-all duration-200"
        style={{ background: `linear-gradient(135deg, #7a3a4a 0%, ${accentColor} 100%)` }}
      >
        <UploadCloud size={16} />
        {disabled ? 'Enviando...' : 'Selecionar Arquivo'}
      </div>
    </button>
  );
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
