import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../utils/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

// Dynamically import NetworkStatus with no SSR
const NetworkStatus = dynamic(() => import('./NetworkStatus'), {
  ssr: false
});

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <Head>
        <title>{title ? `${title} | ModelForge` : 'ModelForge'}</title>
      </Head>
      <header style={{ padding: '1rem', background: '#1a1a1a', color: '#fff' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div>
            <Link href="/" style={{ color: '#f44336', fontWeight: 'bold', fontSize: '1.2rem', marginRight: '1rem' }}>
              ModelForge
            </Link>
            <Link href="/models" style={{ marginRight: '1rem' }}>
              Models
            </Link>
            <Link href="/upload" style={{ marginRight: '1rem' }}>
              Upload
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/models/create" style={{ marginRight: '1rem' }}>
              Add New Model
            </Link>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {user.username}
                  <span style={{ marginLeft: '0.5rem' }}>▼</span>
                </button>
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: '#fff',
                    color: '#000',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    zIndex: 1000
                  }}>
                    {user.role === 'admin' && (
                      <Link href="/admin/monitored-users" style={{ display: 'block', padding: '0.5rem', color: '#000', textDecoration: 'none' }}>
                        Monitored Users
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#f44336'
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    background: 'none',
                    border: '1px solid #fff',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    marginRight: '1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  style={{
                    background: '#f44336',
                    border: 'none',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main style={{ flex: 1, maxWidth: '1200px', margin: '1rem auto', padding: '1rem' }}>
        {children}
      </main>
      <footer style={{ background: '#1a1a1a', color: '#aaa', textAlign: 'center', padding: '1rem' }}>
        © 2025 ModelForge
      </footer>
      <NetworkStatus />
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
