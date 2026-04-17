import { useState, useEffect } from 'react';
import api from '../api';
import { 
  Plus, Trash2, Edit3, X, Mail, Phone, Hash, Info
} from 'lucide-react';

const StudentList = ({ preview = false }) => {
  const [students, setStudents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', standard: '', rollNumber: '', contact: '', email: '' });
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const resetForm = () => {
    setFormData({ name: '', standard: '', rollNumber: '', contact: '', email: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({ 
      name: student.name, standard: student.standard, rollNumber: student.rollNumber, 
      contact: student.contact || '', email: student.email || '' 
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) { await api.put(`/students/${editingId}`, formData); }
      else { await api.post('/students', formData); }
      resetForm();
      fetchStudents();
    } catch (err) { alert('Operation failed.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete student and revoke system access?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) { console.error(err); }
    }
  };

  if (preview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {students.slice(0, 4).map(s => (
          <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-pure)', fontSize: '0.65rem' }}>{s.name.charAt(0).toUpperCase()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-pure)' }}>{s.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{s.standard} • {s.rollNumber}</div>
            </div>
          </div>
        ))}
        {students.length === 0 && <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center' }}>No records found.</p>}
      </div>
    );
  }

  return (
    <div className="card">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Student</h3>
        <button className="btn btn-primary" onClick={() => isAdding ? resetForm() : setIsAdding(true)} style={{ height: '32px', fontSize: '0.7rem' }}>
          {isAdding ? <X size={14} /> : <Plus size={14} />} 
          {isAdding ? 'Dismiss' : 'New Entry'}
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="animate-fade" style={{ background: 'var(--bg-darker)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Full Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Johnathan Doe" />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Division</label>
              <input type="text" className="form-control" value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value})} required placeholder="Grade 12-B" />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Roll No</label>
              <input type="text" className="form-control" value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} required placeholder="IDX-001" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
                <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Phone Contact</label>
                <input type="text" className="form-control" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} placeholder="+1..." />
            </div>
            <div className="form-group">
                <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Official Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="student@org.edu" />
            </div>
          </div>

          <div style={{ 
            marginTop: '1.25rem', padding: '0.75rem', background: 'var(--primary-subtle)', 
            borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem',
            border: '1px solid var(--primary)'
          }}>
            <Info size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              Note: The Roll No will be the default password for the student's portal.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }} onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.75rem' }} disabled={loading}>
                {loading ? 'Synchronizing...' : editingId ? 'Update Entry' : 'Create Entry'}
            </button>
          </div>
        </form>
      )}

      <div className="table-container" style={{ border: 'none' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
          <thead>
            <tr style={{ background: 'transparent' }}>
              <th style={{ background: 'transparent', border: 'none' }}>Personnel</th>
              <th style={{ background: 'transparent', border: 'none' }}>Classification</th>
              <th style={{ background: 'transparent', border: 'none' }}>Communications</th>
              <th style={{ textAlign: 'right', background: 'transparent', border: 'none' }}>Controls</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} style={{ background: 'var(--bg-card)', borderRadius: '8px' }}>
                <td style={{ borderRadius: '8px 0 0 8px', border: '1px solid var(--border)', borderRight: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-pure)', fontSize: '0.7rem' }}>{s.name.charAt(0).toUpperCase()}</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{s.rollNumber}</span>
                    </div>
                  </div>
                </td>
                <td style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}><span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{s.standard}</span></td>
                <td style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Phone size={10} /> {s.contact || '-'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Mail size={10} /> {s.email || '-'}</span>
                    </div>
                </td>
                <td style={{ textAlign: 'right', borderRadius: '0 8px 8px 0', border: '1px solid var(--border)', borderLeft: 'none' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost" style={{ padding: '0.35rem', border: 'none' }} onClick={() => handleEdit(s)}><Edit3 size={14} strokeWidth={1.5} /></button>
                    <button className="btn btn-ghost" style={{ padding: '0.35rem', border: 'none', color: 'var(--danger)' }} onClick={() => handleDelete(s._id)}><Trash2 size={14} strokeWidth={1.5} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>No data found.</div>}
      </div>
    </div>
  );
};

export default StudentList;
