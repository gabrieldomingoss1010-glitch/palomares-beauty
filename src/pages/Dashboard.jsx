import { useState, useContext } from 'react';
import { FilesContext } from '../context/FilesContext';
import { HardDrive, FileText, Video, Clock, Loader2, Eye, Download } from 'lucide-react';
import { api } from '../services/api';
import VideoModal from '../components/VideoModal';
import PdfModal from '../components/PdfModal';

export default function Dashboard() {
  const { files, stats, loading } = useContext(FilesContext);
  const [viewingFile, setViewingFile] = useState(null);
  const recentFiles = files.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-rose" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={HardDrive} label="Total de Arquivos" value={stats.total} color="text-wine-dark" />
        <StatCard icon={FileText} label="Documentos PDF" value={stats.pdfs} color="text-rose" />
        <StatCard icon={Video} label="Aulas e Vídeos" value={stats.videos} color="text-wine" />
        <StatCard icon={HardDrive} label="Espaço Usado" value={stats.storage} color="text-wine-dark" />
      </section>

      {/* Recent files */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-wine-dark">Adicionados Recentemente</h2>
        </div>
        {recentFiles.length === 0 ? (
          <div className="bg-white rounded-xl border border-wine/10 p-12 text-center">
            <p className="text-wine/50 text-lg">Nenhum arquivo ainda. Faça seu primeiro upload!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentFiles.map(file => (
              <RecentFileCard
                key={file.id}
                file={file}
                onView={() => setViewingFile(file)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="bg-white rounded-xl border border-wine/10 p-6">
        <h2 className="text-2xl font-semibold text-wine-dark mb-6 flex items-center gap-2">
          <Clock size={24} className="text-rose" /> Atividade Recente
        </h2>
        {recentFiles.length === 0 ? (
          <p className="text-wine/50 py-4">Nenhuma atividade recente.</p>
        ) : (
          <div className="space-y-2">
            {recentFiles.map(file => (
              <div
                key={`act-${file.id}`}
                className="flex items-center gap-4 py-3 px-3 rounded-xl border border-transparent hover:border-wine/8 hover:bg-rose-light/5 transition-all group cursor-pointer"
                onClick={() => setViewingFile(file)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: file.type === 'pdf' ? '#fdeaea' : '#ede9f8' }}
                >
                  {file.type === 'pdf'
                    ? <FileText size={18} style={{ color: '#c0392b' }} />
                    : <Video size={18} style={{ color: '#7c3aed' }} />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-wine-dark truncate">
                    Você fez upload de <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-xs text-wine/60">{formatDate(file.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <span className="text-xs text-wine/50 flex items-center gap-1">
                    <Eye size={12} /> Clique para visualizar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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

function RecentFileCard({ file, onView }) {
  const isPdf = file.type === 'pdf';

  return (
    <div className="bg-white rounded-xl border border-wine/10 overflow-hidden group hover:shadow-lg transition-all duration-300 relative">
      {/* Thumbnail */}
      <div
        className="h-36 flex items-center justify-center relative overflow-hidden cursor-pointer"
        style={{
          background: isPdf
            ? 'linear-gradient(135deg, #fdeaea 0%, #f5c5c5 100%)'
            : 'linear-gradient(135deg, #ede9f8 0%, #d5cced 100%)',
        }}
        onClick={onView}
      >
        <div className="flex flex-col items-center gap-2">
          {isPdf
            ? <FileText size={40} style={{ color: '#c0392b', opacity: 0.8 }} />
            : <Video size={40} style={{ color: '#7c3aed', opacity: 0.8 }} />
          }
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: 'rgba(58,20,30,0.75)' }}>
          <button
            onClick={onView}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            title="Visualizar"
          >
            <Eye size={18} style={{ color: '#7a3a4a' }} />
          </button>
          <a
            href={api.getFileUrl(file.path)}
            download={file.name}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            title="Baixar"
          >
            <Download size={18} style={{ color: '#7a3a4a' }} />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: isPdf ? '#fdeaea' : '#ede9f8',
              color: isPdf ? '#c0392b' : '#7c3aed',
            }}
          >
            {isPdf ? 'PDF' : 'Vídeo'}
          </span>
        </div>
        <h3 className="font-medium text-wine-dark truncate text-sm group-hover:text-rose transition-colors" title={file.name}>
          {file.name}
        </h3>
        <div className="mt-2 flex items-center justify-between text-xs text-wine/50">
          <span>{formatSize(file.size)}</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-wine/10 p-6 flex items-center gap-4 hover:border-rose/30 transition-colors">
      <div className={`w-12 h-12 rounded-lg bg-rose-light/30 flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-wine/70 font-medium">{label}</p>
        <p className="text-2xl font-semibold text-wine-dark font-serif">{value}</p>
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
