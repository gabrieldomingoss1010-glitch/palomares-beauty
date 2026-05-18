import { Search, LogOut, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/upload': return 'Upload de Arquivos';
      case '/library': return 'Biblioteca';
      default: return 'Palomares Beauty';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-20 bg-cream border-b border-wine/10 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-wine/70 hover:text-wine-dark transition-colors rounded-lg hover:bg-wine/5"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl md:text-3xl font-semibold text-wine-dark truncate max-w-[150px] sm:max-w-xs">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-wine/50" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 rounded-full bg-white border border-wine/10 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 w-48 md:w-64 transition-all text-sm md:text-base"
          />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-wine/70 hover:text-wine-dark hover:bg-rose-light/50 transition-all cursor-pointer"
          title="Sair"
          id="logout-button"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wine-dark to-wine flex items-center justify-center text-cream font-medium shadow-sm" title={user?.username || 'Usuário'}>
          {user?.username?.charAt(0).toUpperCase() || 'P'}
        </div>
      </div>
    </header>
  );
}
