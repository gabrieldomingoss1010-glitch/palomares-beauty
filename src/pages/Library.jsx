import { useState, useContext, useMemo } from 'react';
import { FilesContext } from '../context/FilesContext';
import { Search, Filter, Download, Eye, Trash2, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import VideoModal from '../components/VideoModal';
import PdfModal from '../components/PdfModal';

export default function Library() {
  const { files, loading, deleteFile } = useContext(FilesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewingFile, setViewingFile] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || file.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [files, searchTerm, filter]);

  const handleDelete = async (file) => {
    if (!confirm(`Tem certeza que deseja deletar "${file.name}"?`)) return;
    setDeleting(file.id);
    try {
      await deleteFile(file.id);
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-rose" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl border border-wine/10 p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-wine/60" />
          <div className="flex bg-rose-light/20 p-1 rounded-lg">
            {['all', 'pdf', 'video'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f 
                    ? 'bg-white text-wine-dark shadow-sm' 
                    : 'text-wine/60 hover:text-wine-dark'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'pdf' ? 'PDFs' : 'Vídeos'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/50" size={18} />
          <input 
            type="text" 
            placeholder="Buscar na biblioteca..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-cream/50 border border-wine/10 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose transition-all text-sm"
          />
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-wine/60 text-lg">Nenhum arquivo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFiles.map(file => (
            <FileCard 
              key={file.id} 
              file={file} 
              onView={() => setViewingFile(file)}
              onDelete={() => handleDelete(file)}
              isDeleting={deleting === file.id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {viewingFile && viewingFile.type === 'video' && (
        <VideoModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
      {viewingFile && viewingFile.type === 'pdf' && (
        <PdfModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
    </div>
  );
}

function FileCard({ file, onView, onDelete, isDeleting }) {
  return (
    <div className="bg-white rounded-xl border border-wine/10 overflow-hidden group hover:shadow-lg transition-all duration-300 relative">
      <div className={`h-40 flex items-center justify-center text-5xl relative overflow-hidden ${
        file.type === 'pdf' ? 'bg-gradient-to-br from-[#fdeaea] to-[#f5c5c5]' : 'bg-gradient-to-br from-[#eae4f5] to-[#d5cced]'
      }`}>
        {file.type === 'pdf' ? '📄' : '🎬'}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-wine-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button 
            onClick={onView}
            className="w-10 h-10 rounded-full bg-white text-wine-dark flex items-center justify-center hover:bg-rose transition-colors" 
            title="Visualizar"
          >
            <Eye size={18} />
          </button>
          <a 
            href={api.getFileUrl(file.path)}
            download={file.name}
            className="w-10 h-10 rounded-full bg-white text-wine-dark flex items-center justify-center hover:bg-rose transition-colors" 
            title="Baixar"
          >
            <Download size={18} />
          </a>
          <button 
            onClick={onDelete}
            disabled={isDeleting}
            className="w-10 h-10 rounded-full bg-white text-wine-dark flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50" 
            title="Deletar"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-wine-dark truncate" title={file.name}>{file.name}</h3>
        <div className="mt-2 flex items-center justify-between text-xs text-wine/60">
          <span className="bg-cream px-2 py-1 rounded">{formatSize(file.size)}</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
