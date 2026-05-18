import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, Library, FileText, Video, X } from 'lucide-react';
import { useContext } from 'react';
import { FilesContext } from '../context/FilesContext';

export default function Sidebar({ isOpen, onClose }) {
  const { stats } = useContext(FilesContext);

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/library', icon: Library, label: 'Biblioteca' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}
      
      <aside className={`w-[220px] fixed inset-y-0 left-0 flex flex-col bg-gradient-to-b from-wine-dark via-wine to-[#6b4a4a] text-rose-light z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-rose flex items-center justify-center text-wine-dark font-serif text-2xl font-bold">
              P
            </div>
            <span className="font-serif text-xl tracking-wide font-semibold text-cream">Palomares</span>
          </div>
          <button onClick={onClose} className="md:hidden text-rose-light hover:text-cream transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-rose/20 border-l-3 border-rose text-cream'
                    : 'hover:bg-wine-dark/50 text-rose-light hover:text-cream'
                }`
              }
              onClick={() => {
                if(window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-wine-dark/40 border border-rose/10">
          <p className="text-sm font-medium mb-2 text-cream">Armazenamento</p>
          <div className="w-full h-2 bg-wine-dark rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-wine-dark to-rose rounded-full transition-all duration-500" 
              style={{ width: `${stats.storagePercentage || 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-rose-light">{stats.storage || '0 B'} de 10 GB usados</p>
        </div>
      </aside>
    </>
  );
}
