import { useContext } from 'react';
import { FilesContext } from '../context/FilesContext';
import { HardDrive, FileText, Video, Clock, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const { files, stats, loading } = useContext(FilesContext);
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
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={HardDrive} label="Total de Arquivos" value={stats.total} color="text-wine-dark" />
        <StatCard icon={FileText} label="Documentos PDF" value={stats.pdfs} color="text-rose" />
        <StatCard icon={Video} label="Aulas e Vídeos" value={stats.videos} color="text-wine" />
        <StatCard icon={HardDrive} label="Espaço Usado" value={stats.storage} color="text-wine-dark" />
      </section>

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
              <div key={file.id} className="bg-white rounded-xl border border-wine/10 p-4 hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
                <div className={`h-32 rounded-lg mb-4 flex items-center justify-center text-4xl ${
                  file.type === 'pdf' ? 'bg-gradient-to-br from-[#fdeaea] to-[#f5c5c5]' : 'bg-gradient-to-br from-[#eae4f5] to-[#d5cced]'
                }`}>
                  {file.type === 'pdf' ? '📄' : '🎬'}
                </div>
                <h3 className="font-medium text-wine-dark truncate group-hover:text-rose transition-colors">{file.name}</h3>
                <div className="mt-auto pt-2 flex items-center justify-between text-xs text-wine/60">
                  <span>{formatSize(file.size)}</span>
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-wine/10 p-6">
        <h2 className="text-2xl font-semibold text-wine-dark mb-6 flex items-center gap-2">
          <Clock size={24} className="text-rose" /> Atividade Recente
        </h2>
        {recentFiles.length === 0 ? (
          <p className="text-wine/50 py-4">Nenhuma atividade recente.</p>
        ) : (
          <div className="space-y-4">
            {recentFiles.map(file => (
              <div key={`act-${file.id}`} className="flex items-center gap-4 py-3 border-b border-wine/5 last:border-0">
                <div className="w-10 h-10 rounded-full bg-rose-light/50 flex items-center justify-center text-wine">
                  {file.type === 'pdf' ? <FileText size={18} /> : <Video size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-wine-dark">
                    Você fez upload de <span className="font-semibold">{file.name}</span>
                  </p>
                  <p className="text-xs text-wine/60">{formatDate(file.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
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
