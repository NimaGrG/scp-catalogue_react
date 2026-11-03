import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111622'/%3E%3Ccircle cx='300' cy='175' r='55' fill='none' stroke='%23ef4444' stroke-width='4'/%3E%3Ctext x='300' y='183' font-family='monospace' font-size='22' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ESCP%3C/text%3E%3Ctext x='300' y='280' font-family='monospace' font-size='16' fill='%2394a3b8' text-anchor='middle'%3ECLASSIFIED RECORD%3C/text%3E%3C/svg%3E";

function Catalogue() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('All');
  const [activeSubject, setActiveSubject] = useState(null);

  useEffect(() => {
    async function getSubjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from('scp_subjects')
        .select('*')
        .order('item', { ascending: true });

      if (error) {
        console.error('Error fetching SCP subjects:', error.message);
      } else {
        setSubjects(data || []);
      }
      setLoading(false);
    }

    getSubjects();
  }, []);

  const filteredSubjects = selectedClass === 'All'
    ? subjects
    : subjects.filter(scp => scp.class?.toLowerCase() === selectedClass.toLowerCase());

  const getBadgeClass = (scpClass) => {
    const text = scpClass?.toLowerCase() || '';
    if (text.includes('safe')) return 'badge badge-safe';
    if (text.includes('euclid')) return 'badge badge-euclid';
    if (text.includes('keter')) return 'badge badge-keter';
    return 'badge badge-neutral';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="section-tag">DATABASE ARCHIVE</span>
          <h2>SCP Subject Catalogue</h2>
          <p className="text-muted">Showing {filteredSubjects.length} anomalous entities.</p>
        </div>

        <div className="filter-pills">
          {['All', 'Safe', 'Euclid', 'Keter'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`pill-btn ${selectedClass === cls ? 'active' : ''}`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Accessing cloud database...</p>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="empty-state">
          <h3>No Records Found</h3>
          <p>No SCP subjects match this category.</p>
        </div>
      ) : (
        <div className="scp-grid">
          {filteredSubjects.map((scp) => (
            <article key={scp.id} className="scp-card">
              <div className="scp-card-image-wrap">
                <img
                  src={scp.image || FALLBACK_IMAGE}
                  alt={scp.item}
                  className="scp-card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <span className={getBadgeClass(scp.class)}>{scp.class}</span>
              </div>

              <div className="scp-card-body">
                <h3 className="scp-item-title">{scp.item}</h3>
                <p className="scp-excerpt">
                  <strong>Description: </strong>
                  {scp.description?.length > 120 ? `${scp.description.substring(0, 120)}...` : scp.description}
                </p>

                <div className="scp-card-footer">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveSubject(scp)}
                  >
                    Read Dossier
                  </button>
                  <Link
                    to={`/admin?edit=${scp.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    Edit Record
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeSubject && (
        <div className="modal-backdrop" onClick={() => setActiveSubject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-tag">CLASSIFIED FILE</span>
                <h2>{activeSubject.item}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveSubject(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-top-grid">
                <img
                  src={activeSubject.image || FALLBACK_IMAGE}
                  alt={activeSubject.item}
                  className="modal-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="modal-meta-box">
                  <div className="meta-row">
                    <span className="meta-label">ITEM:</span>
                    <span className="meta-val">{activeSubject.item}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">CLASS:</span>
                    <span className={getBadgeClass(activeSubject.class)}>{activeSubject.class}</span>
                  </div>
                </div>
              </div>

              <div className="dossier-section">
                <h4>CONTAINMENT PROCEDURES</h4>
                <p>{activeSubject.containment}</p>
              </div>

              <div className="dossier-section">
                <h4>DESCRIPTION</h4>
                <p>{activeSubject.description}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setActiveSubject(null)}>Close File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Catalogue;
