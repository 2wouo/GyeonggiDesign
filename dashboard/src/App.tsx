import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, Calendar as CalendarIcon, MessageSquare, ShieldAlert, Bell } from 'lucide-react';
import './App.css';

import { Home } from './pages/Home';
import { Schedule } from './pages/Schedule';
import { Notices } from './pages/Notices';
import { Qna } from './pages/Qna';
import { Admin } from './pages/Admin';

// Main Layout Component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈 (프로세스 맵)', icon: <HomeIcon size={20} /> },
    { path: '/notices', label: '공지사항', icon: <Bell size={20} /> },
    { path: '/schedule', label: '주요 일정', icon: <CalendarIcon size={20} /> },
    { path: '/qna', label: '자주 묻는 질문', icon: <MessageSquare size={20} /> },
    { path: '/admin', label: '관리자 페이지', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <div className="app-layout">
      {/* Header / GNB */}
      <header style={{
        height: '64px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--point-gradient)', borderRadius: '6px', boxShadow: 'var(--glow-primary)' }}></div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              공공디자인나눔 <span className="text-muted" style={{ fontWeight: 400, marginLeft: '4px' }}>협업 라운지</span>
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            {/* Mock user selector will go here later */}
            <div className="badge badge-outline">수혜/일반 기업 뷰</div>
          </div>
        </div>
      </header>

      <div className="container" style={{ display: 'flex', flexGrow: 1, gap: 'var(--spacing-8)', paddingTop: 'var(--spacing-8)' }}>
        {/* Sidebar Navigation */}
        <aside style={{ width: '240px', flexShrink: 0 }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-3)',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    borderRadius: 'var(--radius-md)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span style={{ color: isActive ? 'var(--point-primary)' : 'inherit' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={{ flexGrow: 1, minWidth: 0, paddingBottom: 'var(--spacing-12)' }}>
          <div className="container" style={{ paddingTop: 'var(--spacing-8)' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/qna" element={<Qna />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
