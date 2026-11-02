import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Quizzy UI Crash caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('quizzy_active_user_session');
    } catch (e) {
      // ignore
    }
    window.location.href = '/Quizzy/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0f1a',
          color: '#f0f0f5',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <div style={{
            maxWidth: '480px',
            background: '#1a1a2e',
            border: '1px solid #2d2d47',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Terjadi Kesalahan Tampilan</h2>
            <p style={{ color: '#9a9ab0', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.75rem' }}>
              Aplikasi mengalami kendala teknis sementara. Sesi kamu tetap aman. Silakan muat ulang atau pulihkan aplikasi.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Muat Ulang Halaman 🔄
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#20203a',
                  color: '#c8c8dc',
                  border: '1px solid #2d2d47',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  cursor: 'pointer'
                }}
              >
                Kembali ke Beranda 🏠
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
