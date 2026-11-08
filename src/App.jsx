import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Search from './pages/Search';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-state" style={{ marginTop: '20vh' }}>
        <div className="spinner"></div>
        <p>Verifying Foundation Clearance...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-shell">
        {session && <Navbar />}
        <main className="main-content">
          <Routes>
            {!session ? (
              <Route path="*" element={<Login />} />
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/search" element={<Search />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
        {session && (
          <footer className="app-footer">
            <p>
              SCP Foundation Cloud Registry // COMP.6210 Web Services & Design Methodologies
              <button
                onClick={() => supabase.auth.signOut()}
                className="btn btn-ghost btn-xs"
                style={{ marginLeft: '1rem', color: '#ef4444' }}
              >
                Sign Out
              </button>
            </p>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;