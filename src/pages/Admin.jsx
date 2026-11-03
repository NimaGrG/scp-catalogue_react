import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const initialFormState = {
  item: '',
  class: 'Euclid',
  description: '',
  containment: '',
  image: '',
};

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const fetchSubjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scp_subjects')
      .select('*')
      .order('item', { ascending: true });

    if (error) {
      setStatusMessage({ type: 'error', text: error.message });
    } else {
      setSubjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam && subjects.length > 0) {
      const target = subjects.find(s => String(s.id) === String(editParam));
      if (target) {
        setEditingId(target.id);
        setFormData({
          item: target.item || '',
          class: target.class || 'Euclid',
          description: target.description || '',
          containment: target.containment || '',
          image: target.image || '',
        });
      }
    }
  }, [searchParams, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    const payload = {
      item: formData.item.trim(),
      class: formData.class.trim(),
      description: formData.description.trim(),
      containment: formData.containment.trim(),
      image: formData.image.trim() || `/images/${formData.item.trim()}.jpg`,
    };

    if (editingId) {
      const { error } = await supabase.from('scp_subjects').update(payload).eq('id', editingId);
      if (error) {
        setStatusMessage({ type: 'error', text: error.message });
      } else {
        setStatusMessage({ type: 'success', text: 'Record updated successfully!' });
        setEditingId(null);
        setFormData(initialFormState);
        setSearchParams({});
        fetchSubjects();
      }
    } else {
      const { error } = await supabase.from('scp_subjects').insert([payload]);
      if (error) {
        setStatusMessage({ type: 'error', text: error.message });
      } else {
        setStatusMessage({ type: 'success', text: 'Record created successfully!' });
        setFormData(initialFormState);
        fetchSubjects();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id, itemName) => {
    if (!window.confirm(`Delete ${itemName}?`)) return;
    const { error } = await supabase.from('scp_subjects').delete().eq('id', id);
    if (error) {
      setStatusMessage({ type: 'error', text: error.message });
    } else {
      setStatusMessage({ type: 'success', text: 'Record deleted.' });
      if (editingId === id) {
        setEditingId(null);
        setFormData(initialFormState);
        setSearchParams({});
      }
      fetchSubjects();
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <span className="section-tag">ADMIN PORTAL</span>
          <h2>SCP Administration & CRUD</h2>
        </div>
      </div>

      {statusMessage.text && (
        <div className={`alert alert-${statusMessage.type}`}>{statusMessage.text}</div>
      )}

      <div className="admin-layout">
        <section className="admin-form-card">
          <h3>{editingId ? `Update Record (#${editingId})` : 'Create SCP Subject'}</h3>
          <form onSubmit={handleSubmit} className="crud-form">
            <div className="form-row">
              <div className="form-group">
                <label>Item Designation *</label>
                <input name="item" type="text" required placeholder="SCP-022" className="form-input" value={formData.item} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Object Class *</label>
                <select name="class" className="form-select" value={formData.class} onChange={handleChange}>
                  <option value="Safe">Safe</option>
                  <option value="Euclid">Euclid</option>
                  <option value="Keter">Keter</option>
                  <option value="Thaumiel">Thaumiel</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Image Path</label>
              <input name="image" type="text" placeholder="/images/SCP-002.jpg" className="form-input" value={formData.image} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Containment Procedures *</label>
              <textarea name="containment" rows="3" required className="form-textarea" value={formData.containment} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" rows="4" required className="form-textarea" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Subject'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData(initialFormState); setSearchParams({}); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-table-card">
          <div className="table-header-row">
            <h3>Database Records ({subjects.length})</h3>
            <button className="btn btn-ghost btn-sm" onClick={fetchSubjects}>↻ Refresh</button>
          </div>
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(scp => (
                    <tr key={scp.id} className={editingId === scp.id ? 'editing-row' : ''}>
                      <td className="font-mono">{scp.item}</td>
                      <td><span className={`badge badge-${scp.class?.toLowerCase()}`}>{scp.class}</span></td>
                      <td className="action-cells">
                        <button className="btn btn-outline btn-xs" onClick={() => { setEditingId(scp.id); setFormData({ item: scp.item, class: scp.class, description: scp.description, containment: scp.containment, image: scp.image }); }}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleDelete(scp.id, scp.item)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Admin;
