import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    safe: 0,
    euclid: 0,
    keter: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('scp_subjects')
        .select('class');

      if (!error && data) {
        const safeCount = data.filter((s) => s.class?.toLowerCase() === 'safe').length;
        const euclidCount = data.filter((s) => s.class?.toLowerCase() === 'euclid').length;
        const keterCount = data.filter((s) => s.class?.toLowerCase() === 'keter').length;

        setStats({
          total: data.length,
          safe: safeCount,
          euclid: euclidCount,
          keter: keterCount,
          loading: false,
        });
      } else {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-content">
          <div className="clearance-badge">CLEARANCE LEVEL 4 // AUTHORIZED ACCESS</div>
          <h1>SCP Foundation Cloud Database</h1>
          <p className="hero-description">
            Welcome to the centralized Special Containment Procedures Registry. 
            Browse catalogued anomalous entities, review containment procedures, and manage database records.
          </p>
          <div className="hero-actions">
            <Link to="/catalogue" className="btn btn-primary">
              Browse SCP Files
            </Link>
            <Link to="/admin" className="btn btn-secondary">
              Manage Records (CRUD)
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <span className="stat-label">TOTAL ARCHIVED FILES</span>
          <span className="stat-value">{stats.loading ? '...' : stats.total}</span>
          <span className="stat-meta">Cloud PostgreSQL Records</span>
        </div>
        <div className="stat-card stat-safe">
          <span className="stat-label">CLASS: SAFE</span>
          <span className="stat-value">{stats.loading ? '...' : stats.safe}</span>
          <span className="stat-meta">Reliable Containment</span>
        </div>
        <div className="stat-card stat-euclid">
          <span className="stat-label">CLASS: EUCLID</span>
          <span className="stat-value">{stats.loading ? '...' : stats.euclid}</span>
          <span className="stat-meta">Unpredictable Behavior</span>
        </div>
        <div className="stat-card stat-keter">
          <span className="stat-label">CLASS: KETER</span>
          <span className="stat-value">{stats.loading ? '...' : stats.keter}</span>
          <span className="stat-meta">High Breach Risk</span>
        </div>
      </section>
    </div>
  );
}

export default Home;
