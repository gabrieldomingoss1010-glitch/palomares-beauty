import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-container">
        {/* Left side - Branding */}
        <div className="login-branding">
          <div className="login-branding-content">
            <div className="login-logo-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                <path d="M24 8C24 8 32 14 32 24C32 34 24 40 24 40C24 40 16 34 16 24C16 14 24 8 24 8Z" 
                      fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="24" cy="22" r="4" fill="currentColor" opacity="0.4"/>
              </svg>
            </div>
            <h1 className="login-brand-title">Palomares</h1>
            <p className="login-brand-subtitle">Beauty</p>
            <div className="login-brand-divider" />
            <p className="login-brand-tagline">Plataforma de Treinamento</p>
          </div>
          <p className="login-brand-footer">© 2026 Palomares Beauty. Todos os direitos reservados.</p>
        </div>

        {/* Right side - Login Form */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2 className="login-form-title">Bem-vindo de volta</h2>
              <p className="login-form-description">Entre com suas credenciais para acessar a plataforma</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" id="login-form">
              {error && (
                <div className="login-error" id="login-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="username" className="login-label">Usuário</label>
                <div className="login-input-wrapper">
                  <User className="login-input-icon" size={18} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário"
                    className="login-input"
                    autoComplete="username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">Senha</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="login-input login-input-password"
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-password-toggle"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                id="login-submit"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <span className="login-submit-loading">
                    <span className="login-spinner" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="login-form-footer">
              <div className="login-secure-badge">
                <Lock size={12} />
                <span>Conexão segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3a2828 0%, #543c3c 50%, #6b4a4a 100%);
          position: relative;
          overflow: hidden;
          padding: 16px;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }
        .login-bg-orb-1 {
          width: 500px;
          height: 500px;
          background: #cab2a1;
          top: -150px;
          right: -100px;
          animation: loginFloat 15s ease-in-out infinite;
        }
        .login-bg-orb-2 {
          width: 400px;
          height: 400px;
          background: #e8d8cd;
          bottom: -100px;
          left: -100px;
          animation: loginFloat 20s ease-in-out infinite reverse;
        }
        .login-bg-orb-3 {
          width: 300px;
          height: 300px;
          background: #faf6f3;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: loginFloat 12s ease-in-out infinite;
          opacity: 0.05;
        }

        @keyframes loginFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.95); }
        }

        .login-container {
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 520px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 1;
        }

        /* Left branding panel */
        .login-branding {
          flex: 1;
          background: linear-gradient(160deg, #3a2828 0%, #4a3535 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .login-branding::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(202, 178, 161, 0.12) 0%, transparent 60%),
                      radial-gradient(circle at 70% 80%, rgba(232, 216, 205, 0.08) 0%, transparent 50%);
        }

        .login-branding-content {
          position: relative;
          text-align: center;
        }

        .login-logo-icon {
          color: #cab2a1;
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
          animation: loginPulse 3s ease-in-out infinite;
        }
        @keyframes loginPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .login-brand-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 300;
          color: #faf6f3;
          letter-spacing: 4px;
          margin: 0;
          line-height: 1.1;
        }
        .login-brand-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: #cab2a1;
          letter-spacing: 8px;
          text-transform: uppercase;
          margin: 4px 0 0;
        }

        .login-brand-divider {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #cab2a1, transparent);
          margin: 24px auto;
        }

        .login-brand-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(202, 178, 161, 0.6);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
        }

        .login-brand-footer {
          position: absolute;
          bottom: 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(202, 178, 161, 0.3);
          text-align: center;
        }

        /* Right form panel */
        .login-form-section {
          flex: 1;
          background: #faf6f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 340px;
        }

        .login-form-header {
          margin-bottom: 32px;
        }
        .login-form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: #3a2828;
          margin: 0 0 8px;
        }
        .login-form-description {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #7a6565;
          margin: 0;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 12px;
          color: #dc2626;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          animation: loginShake 0.4s ease-in-out;
        }
        @keyframes loginShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .login-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #543c3c;
          letter-spacing: 0.3px;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          color: #b09a8a;
          pointer-events: none;
          transition: color 0.2s;
        }
        .login-input-wrapper:focus-within .login-input-icon {
          color: #543c3c;
        }

        .login-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #3a2828;
          background: white;
          border: 1.5px solid #e8d8cd;
          border-radius: 12px;
          outline: none;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .login-input::placeholder {
          color: #c0b0a0;
        }
        .login-input:focus {
          border-color: #cab2a1;
          box-shadow: 0 0 0 3px rgba(202, 178, 161, 0.15);
        }
        .login-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-input-password {
          padding-right: 42px;
        }

        .login-password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #b09a8a;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .login-password-toggle:hover {
          color: #543c3c;
          background: rgba(202, 178, 161, 0.15);
        }

        .login-submit {
          width: 100%;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #faf6f3;
          background: linear-gradient(135deg, #543c3c 0%, #3a2828 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          margin-top: 4px;
          position: relative;
          overflow: hidden;
        }
        .login-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(202, 178, 161, 0.2) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .login-submit:hover:not(:disabled)::before {
          opacity: 1;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(58, 40, 40, 0.3);
        }
        .login-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-submit-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(250, 246, 243, 0.3);
          border-top-color: #faf6f3;
          border-radius: 50%;
          animation: loginSpin 0.6s linear infinite;
        }
        @keyframes loginSpin {
          to { transform: rotate(360deg); }
        }

        .login-form-footer {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }
        .login-secure-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #b09a8a;
          letter-spacing: 0.3px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            max-width: 420px;
            min-height: auto;
          }
          .login-branding {
            padding: 36px 32px;
          }
          .login-brand-title {
            font-size: 32px;
          }
          .login-brand-subtitle {
            font-size: 18px;
          }
          .login-brand-footer {
            display: none;
          }
          .login-form-section {
            padding: 36px 32px;
          }
        }
      `}</style>
    </div>
  );
}
