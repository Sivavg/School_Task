import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, Eye, EyeOff, AlertCircle, ShieldCheck, User, Command
} from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('admin');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', name: '', standard: '', rollNumber: ''
  });

  const { login, register } = useAuth();

  const handle = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.username, formData.password);
      } else {
        await register(formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '3.5rem 2.5rem', background: 'var(--bg-main)', borderColor: 'var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '48px', height: '48px', margin: '0 auto 1.5rem', 
            background: 'var(--primary)', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Command size={24} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-pure)' }}>Student Management</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {mode === 'login' ? 'Authenticate with secure protocols' : 'Register a new verified profile'}
          </p>
        </div>

        {mode === 'login' && (
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '2rem', padding: '0.25rem', background: 'var(--bg-darker)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setRole('admin')}
              style={{ 
                flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none',
                background: role === 'admin' ? 'var(--bg-elevated)' : 'transparent',
                color: role === 'admin' ? '#fff' : 'var(--text-dim)',
                fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s'
              }}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('student')}
              style={{ 
                flex: 1, padding: '0.5rem', borderRadius: '6px', border: 'none',
                background: role === 'student' ? 'var(--bg-elevated)' : 'transparent',
                color: role === 'student' ? '#fff' : 'var(--text-dim)',
                fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s'
              }}
            >
              Student
            </button>
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '0.75rem', marginBottom: '1.5rem', borderRadius: 'var(--radius)', 
            background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' 
          }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {mode === 'register' && (
            <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Full Name</label>
                <input name="name" type="text" className="form-control" placeholder="e.g. John Doe" onChange={handle} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Division</label>
                  <input name="standard" type="text" className="form-control" placeholder="10-A" onChange={handle} required />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Roll No</label>
                  <input name="rollNumber" type="text" className="form-control" placeholder="R700" onChange={handle} required />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>
              Username
            </label>
            <input name="username" type="text" className="form-control" placeholder="Enter username" onChange={handle} required />
          </div>

          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem', display: 'block', textTransform: 'uppercase' }}>Credential</label>
            <div style={{ position: 'relative' }}>
              <input 
                name="password" 
                type={showPass ? 'text' : 'password'} 
                className="form-control" 
                placeholder="••••••••" 
                onChange={handle} 
                required 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '42px', fontSize: '0.85rem', width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Confirm Access' : 'Create Record'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          {mode === 'login' ? (
            role === 'student' && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Require an account? <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Register profile</button>
              </p>
            )
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Existing record? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Sign in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
