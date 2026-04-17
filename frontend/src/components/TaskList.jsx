import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, CheckCircle, Circle, Trash2, X, Calendar, Activity
} from 'lucide-react';

const TaskList = ({ preview = false }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', studentId: '', subject: 'Mathematics', priority: 'Medium', dueDate: '', description: '' });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    try {
      const tRes = await api.get('/tasks');
      setTasks(tRes.data);
      if (isAdmin) {
        const sRes = await api.get('/students');
        setStudents(sRes.data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', formData);
      setFormData({ title: '', studentId: '', subject: 'Mathematics', priority: 'Medium', dueDate: '', description: '' });
      setIsAdding(false);
      fetchData();
    } catch (err) { alert('Transaction failed.'); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id, current) => {
    try {
      await api.put(`/tasks/${id}`, { isCompleted: !current });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this curriculum objective?')) {
        try {
            await api.delete(`/tasks/${id}`);
            fetchData();
        } catch (err) { console.error(err); }
    }
  };

  if (preview) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {tasks.filter(t => !t.isCompleted).slice(0, 4).map(t => (
          <div key={t._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem', background: 'var(--bg-darker)', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--primary)' }}><Circle size={14} strokeWidth={2} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-pure)' }}>{t.title}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.subject}</div>
            </div>
          </div>
        ))}
        {tasks.filter(t => !t.isCompleted).length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>All objectives finalized.</p>}
      </div>
    );
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Curriculum & Assignments</h3>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ height: '32px', fontSize: '0.7rem' }}>
            {isAdding ? <X size={14} /> : <Plus size={14} />} New Entry
          </button>
        )}
      </header>

      {isAdmin && isAdding && (
        <form onSubmit={handleSubmit} className="animate-fade" style={{ background: 'var(--bg-darker)', padding: '1.5rem', borderRadius: 'var(--radius)', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Objective Header</label>
              <input type="text" className="form-control" value={formData.title} placeholder="e.g. Mechanics Block A" onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Assignee</label>
              <select className="form-control" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required>
                <option value="">Select Personnel</option>
                {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Core Subject</label>
              <select className="form-control" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}>
                <option>Mathematics</option><option>Science</option><option>English</option><option>Tamil</option><option>History</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Submission Guard</label>
              <input type="date" className="form-control" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.35rem', display: 'block', textTransform: 'uppercase' }}>Contextual Description</label>
            <textarea className="form-control" rows="2" placeholder="Document specific task requirements..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '0.75rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.75rem' }} disabled={loading}>{loading ? 'Committing...' : 'Finalize Task'}</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {tasks.map(t => (
          <div key={t._id} className="card" style={{ 
            padding: '1.25rem', borderLeft: `2px solid ${t.isCompleted ? 'var(--success)' : 'var(--primary)'}`,
            background: t.isCompleted ? 'rgba(16, 185, 129, 0.02)' : 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div className="badge badge-indigo" style={{ fontSize: '0.6rem' }}>{t.subject}</div>
              {isAdmin && <button onClick={() => handleDelete(t._id)} style={{ border: 'none', background: 'transparent', color: 'var(--text-dim)' }}><Trash2 size={14} /></button>}
            </div>
            
            <div style={{ fontSize: '1rem', fontWeight: 700, color: t.isCompleted ? 'var(--text-dim)' : 'var(--text-pure)', textDecoration: t.isCompleted ? 'line-through' : 'none', marginBottom: '0.5rem' }}>{t.title}</div>
            
            <div style={{ background: 'var(--bg-darker)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem', border: '1px solid var(--border)', lineHeight: 1.5 }}>
                {t.description || 'Reference organizational curriculum documents.'}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                <Calendar size={14} strokeWidth={1.5} /> {new Date(t.dueDate).toLocaleDateString()}
              </div>
              
              <button 
                onClick={() => toggleStatus(t._id, t.isCompleted)}
                className={`btn ${t.isCompleted ? 'btn-ghost' : 'btn-primary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', color: t.isCompleted ? 'var(--success)' : '#fff', border: t.isCompleted ? '1px solid var(--success)' : 'none' }}
              >
                {t.isCompleted ? <><CheckCircle size={14} /> Finalized</> : 'Confirm Finalization'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
