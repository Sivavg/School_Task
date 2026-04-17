import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentList from '../components/StudentList';
import TaskList from '../components/TaskList';
import api from '../api';
import { 
  LayoutDashboard, Users, BookOpen, LogOut, GraduationCap, 
  Activity, ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [counts, setCounts] = useState({ students: 0, pending: 0, completed: 0 });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isAdmin) {
          const [stdRes, taskRes] = await Promise.all([
            api.get('/students'),
            api.get('/tasks')
          ]);
          setCounts({ 
            students: stdRes.data.length, 
            pending: taskRes.data.filter(t => !t.isCompleted).length,
            completed: taskRes.data.filter(t => t.isCompleted).length
          });
        } else {
          const { data } = await api.get('/tasks');
          setCounts({ 
            students: 0, 
            pending: data.filter(t => !t.isCompleted).length,
            completed: data.filter(t => t.isCompleted).length
          });
        }
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, [isAdmin, activeTab]);

  const NavItem = ({ id, icon: Icon, label }) => (
    <div 
      className={`nav-item ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
      style={{ 
        padding: '0.75rem 1rem', borderRadius: 'var(--radius)', 
        marginBottom: '0.2rem', background: activeTab === id ? 'var(--primary-subtle)' : 'transparent',
        color: activeTab === id ? 'var(--primary)' : 'var(--text-dim)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: '0.2s'
      }}
    >
      <Icon size={18} strokeWidth={2} />
      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</span>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ padding: '2rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '34px', height: '34px', borderRadius: 'var(--radius)', background: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-pure)' }}>EduPortal</span>
        </div>
        
        <nav style={{ padding: '0 0.8rem', flex: 1 }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', padding: '1rem 1rem 0.5rem', textTransform: 'uppercase' }}>Main</div>
          <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
          {isAdmin && <NavItem id="students" icon={Users} label="Student" />}
          <NavItem id="tasks" icon={BookOpen} label={isAdmin ? 'Curriculum' : 'Homework'} />
        </nav>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.75rem' }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-pure)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{isAdmin ? 'Admin' : 'Student Access'}</div>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', height: '36px', fontSize: '0.75rem' }} onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="main-content">
        <header style={{ 
          padding: '1.25rem 2.5rem', background: 'var(--bg-darker)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>
            {activeTab === 'overview' ? 'Performance Insights' : activeTab === 'students' ? 'Student Directory' : 'Assignment Board'}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{new Date().toDateString()}</div>
        </header>

        <div style={{ padding: '2.5rem', maxWidth: '1300px', width: '100%', margin: '0 auto' }}>
          {activeTab === 'overview' && (
            <>
              {/* METRIC CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>{isAdmin ? 'ACTIVE STUDENTS' : 'COMPLETION STATUS'}</div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)' }}>{isAdmin ? counts.students : (counts.completed / (counts.pending + counts.completed || 1) * 100).toFixed(0) + '%'}</div>
                </div>
                <div className="card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '1rem' }}>PENDING TASKS</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{counts.pending}</div>
                </div>
                <div className="card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '1rem' }}>FINALIZED OBJECTIVES</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{counts.completed}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
                <div className="card">
                  <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Curriculum Pipeline</h3>
                    <Activity size={18} color="var(--primary)" />
                  </header>
                  <TaskList preview />
                </div>
                {isAdmin && (
                  <div className="card">
                    <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Student Directory</h3>
                        <Users size={18} color="var(--primary)" />
                    </header>
                    <StudentList preview />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'students' && isAdmin && <StudentList />}
          {activeTab === 'tasks' && <TaskList />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
