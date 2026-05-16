import { useState, useContext, useMemo } from 'react';
import { FilesContext } from '../context/FilesContext';
import { Search, Filter, Download, Eye, Trash2, Loader2, FileText, Video } from 'lucide-react';
import { api } from '../services/api';
import VideoModal from '../components/VideoModal';
import PdfModal from '../components/PdfModal';
import ConfirmModal from '../components/ConfirmModal';

export default function Library() {
  const { files, loading, deleteFile } = useContext(FilesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewingFile, setViewingFile] = useState(null);
  const [deletingFile, setDeletingFile] = useState(null); // file object to confirm
  const [deletingId, setDeletingId] = useState(null);    // id while in progress

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || file.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [files, searchTerm, filter]);

  const handleDeleteRequest = (file) => {
    setDeletingFile(file);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingFile) return;
    setDeletingId(deletingFile.id);
    try {
      await deleteFile(deletingFile.id);
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
    setDeletingId(null);
    setDeletingFile(null);
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
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-wine/10 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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

      {/* File count */}
      {filteredFiles.length > 0 && (
        <p className="text-sm text-wine/50 mb-4 px-1">
          {filteredFiles.length} {filteredFiles.length === 1 ? 'arquivo encontrado' : 'arquivos encontrados'}
        </p>
      )}

      {filteredFiles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-wine/60 text-lg">Nenhum arquivo encontrado.</p>
          <p className="text-wine/40 text-sm mt-2">Tente mudar os filtros ou faça upload de novos conteúdos.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-wine/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wine/8 text-left" style={{ background: '#fdf8f5' }}>
                <th className="px-5 py-3 text-xs font-semibold text-wine/50 uppercase tracking-wider">Arquivo</th>
                <th className="px-4 py-3 text-xs font-semibold text-wine/50 uppercase tracking-wider hidden sm:table-cell">Tamanho</th>
                <th className="px-4 py-3 text-xs font-semibold text-wine/50 uppercase tracking-wider hidden md:table-cell">Data</th>
                <th className="px-5 py-3 text-xs font-semibold text-wine/50 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine/5">
              {filteredFiles.map(file => (
                <FileRow
                  key={file.id}
                  file={file}
                  onView={() => setViewingFile(file)}
                  onDelete={() => handleDeleteRequest(file)}
                  isDeleting={deletingId === file.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {viewingFile && viewingFile.type === 'video' && (
        <VideoModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}
      {viewingFile && viewingFile.type === 'pdf' && (
        <PdfModal file={viewingFile} onClose={() => setViewingFile(null)} />
      )}

      {deletingFile && (
        <ConfirmModal
          title="Excluir arquivo"
          message={`Tem certeza que deseja excluir "${deletingFile.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingFile(null)}
          loading={deletingId === deletingFile?.id}
        />
      )}
    </div>
  );
}

function FileRow({ file, onView, onDelete, isDeleting }) {
  const isPdf = file.type === 'pdf';

  return (
    <tr className="hover:bg-rose-light/5 transition-colors group">
      {/* Name + icon */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isPdf ? '#fdeaea' : '#ede9f8',
            }}
          >
            {isPdf
              ? <FileText size={18} style={{ color: '#c0392b' }} />
              : <Video size={18} style={{ color: '#7c3aed' }} />
            }
          </div>
          <div className="min-w-0">
            <p className="font-medium text-wine-dark truncate max-w-xs" title={file.name}>{file.name}</p>
            <p className="text-xs text-wine/50 sm:hidden">{formatSize(file.size)} · {formatDate(file.createdAt)}</p>
          </div>
        </div>
      </td>

      {/* Size */}
      <td className="px-4 py-4 hidden sm:table-cell">
        <span className="text-sm text-wine/60">{formatSize(file.size)}</span>
      </td>

      {/* Date */}
      <td className="px-4 py-4 hidden md:table-cell">
        <span className="text-sm text-wine/60">{formatDate(file.createdAt)}</span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onView}
            title="Visualizar"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-wine/5"
            style={{ borderColor: 'rgba(120,50,60,0.15)', color: '#7a3a4a' }}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Visualizar</span>
          </button>

          <a
            href={api.getFileUrl(file.path)}
            download={file.name}
            title="Baixar"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ background: isPdf ? '#fdeaea' : '#ede9f8', color: isPdf ? '#c0392b' : '#7c3aed' }}
          >
            <Download size={13} />
            <span className="hidden sm:inline">Baixar</span>
          </a>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            title="Excluir"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
            style={{ background: '#fef2f2', color: '#ef4444' }}
          >
            {isDeleting
              ? <Loader2 size={13} className="animate-spin" />
              : <Trash2 size={13} />
            }
            <span className="hidden sm:inline">Excluir</span>
          </button>
        </div>
      </td>
    </tr>
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
