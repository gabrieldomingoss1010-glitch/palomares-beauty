import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FilesProvider } from './context/FilesContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Library from './pages/Library';
import Login from './pages/Login';

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col">
        <Topbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <FilesProvider>
                <Layout><Dashboard /></Layout>
              </FilesProvider>
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <FilesProvider>
                <Layout><Upload /></Layout>
              </FilesProvider>
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute>
              <FilesProvider>
                <Layout><Library /></Layout>
              </FilesProvider>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
