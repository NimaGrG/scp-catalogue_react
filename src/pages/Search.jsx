import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111622'/%3E%3Ccircle cx='300' cy='175' r='55' fill='none' stroke='%23ef4444' stroke-width='4'/%3E%3Ctext x='300' y='183' font-family='monospace' font-size='22' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ESCP%3C/text%3E%3Ctext x='300' y='280' font-family='monospace' font-size='16' fill='%2394a3b8' text-anchor='middle'%3ECLASSIFIED RECORD%3C/text%3E%3C/svg%3E";

function Search() {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      setLoading(true);
      const { data } = await supabase
        .from('scp_subjects')
        .select('*')
        .order('item', { ascending: true });
      setSubjects(data || []);
      setLoading(false);
    }
    loadSubjects();
  }, []);

  const results = subjects.filter((scp) => {
    const matchesClass = classFilter === 'All' || scp.class?.toLowerCase() === classFilter.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesQuery = !query || scp.item?.toLowerCase().includes(query) || scp.description?.toLowerCase().includes(query);
    return matchesClass && matchesQuery;
  });

  const getBadgeClass = (scpClass) => {
    const normalized = scpClass?.toLowerCase() || '';
    if (normalized.includes('safe')) return 'badge badge-safe';
    if (normalized.includes('euclid')) return 'badge badge-euclid';
    if (normalized.includes('keter')) return 'badge badge-keter';
    return 'badge badge-neutral';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="section-tag">QUERY TERMINAL</span>
          <h2>Search SCP Database</h2>
        </div>
      </div>

      <div className="search-bar-panel">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by item designation or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
        >
          <option value="All">All Classes</option>
          <option value="Safe">Safe</option>
          <option value="Euclid">Euclid</option>
          <option value="Keter">Keter</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-state"><p>Searching registry...</p></div>
      ) : (
        <div className="search-results-list">
          <p className="search-count">Found <strong>{results.length}</strong> matching record(s).</p>
          {results.map((scp) => (
            <div key={scp.id} className="search-result-item">
              <img
                src={scp.image || FALLBACK_IMAGE}
                alt={scp.item}
                className="search-thumb"
                onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
              />
              <div className="search-result-info">
                <div className="search-result-header">
                  <h3>{scp.item}</h3>
                  <span className={getBadgeClass(scp.class)}>{scp.class}</span>
                </div>
                <p><strong>Description:</strong> {scp.description}</p>
              </div>
              <div className="search-result-actions">
                <Link to={`/admin?edit=${scp.id}`} className="btn btn-outline btn-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
