import { useState, useRef, useContext } from 'react';
import { FilesContext } from '../context/FilesContext';
import { FileText, Video, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Upload() {
  const { addFile } = useContext(FilesContext);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedName, setUploadedName] = useState('');
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);

  const handleRealUpload = async (file) => {
    setUploading(true);
    setProgress(0);
    setSuccess(false);
    setError(null);
    setUploadedName(file.name);

    try {
      const newFile = await addFile(file, (pct) => setProgress(pct));
      setUploading(false);
      setSuccess(true);
      setHistory(prev => [newFile, ...prev]);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setUploading(false);
      setError(err.message || 'Erro ao fazer upload');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleRealUpload(file);
    }
    e.target.value = '';
  };

  const handleCardClick = (accept) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <UploadCard 
          icon={FileText} 
          title="Upload de PDF" 
          description="Documentos, apostilas e guias" 
          color="hover:border-[#f5c5c5] hover:bg-[#fdeaea]/30"
          onClick={() => handleCardClick('.pdf')}
          disabled={uploading}
        />
        <UploadCard 
          icon={Video} 
          title="Upload de Vídeo" 
          description="Aulas, tutoriais e workshops" 
          color="hover:border-[#d5cced] hover:bg-[#eae4f5]/30"
          onClick={() => handleCardClick('video/*')}
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="bg-white rounded-xl border border-wine/10 p-6 mb-8 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-wine-dark truncate max-w-xs">{uploadedName}</span>
            <span className="text-sm font-semibold text-rose">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-rose-light/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-wine-dark to-rose rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-wine/50 mt-2">Enviando para o servidor...</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 rounded-xl p-4 mb-8 flex items-center gap-3 border border-green-200">
          <CheckCircle2 className="text-green-600 shrink-0" />
          <span className="font-medium">Upload concluído com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 rounded-xl p-4 mb-8 flex items-center gap-3 border border-red-200">
          <AlertCircle className="text-red-600 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {history.length > 0 && (
        <section className="bg-white rounded-xl border border-wine/10 p-6">
          <h3 className="text-xl font-semibold text-wine-dark mb-4 border-b border-wine/5 pb-4">Histórico da Sessão</h3>
          <div className="space-y-3">
            {history.map(file => (
              <div key={file.id} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-light/30 flex items-center justify-center text-wine">
                    {file.type === 'pdf' ? <FileText size={16} /> : <Video size={16} />}
                  </div>
                  <span className="font-medium text-wine-dark">{file.name}</span>
                </div>
                <span className="text-sm text-wine/60">{formatSize(file.size)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function UploadCard({ icon: Icon, title, description, color, onClick, disabled }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`border-2 border-dashed border-wine/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all bg-white cursor-pointer ${color} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} w-full`}
    >
      <div className="w-16 h-16 rounded-full bg-rose-light/30 flex items-center justify-center text-wine mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-semibold text-wine-dark mb-2">{title}</h3>
      <p className="text-sm text-wine/60">{description}</p>
      <div className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-wine-dark to-[#6b4a4a] text-white text-sm font-medium hover:shadow-lg transition-shadow">
        Selecionar Arquivo
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
