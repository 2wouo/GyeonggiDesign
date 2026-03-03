import { LayoutDashboard } from 'lucide-react';

export const Admin = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>수탁기관 관리자 패널</h2>
                <p className="text-secondary">공지사항, 일정, FAQ 등의 웹사이트 콘텐츠를 관리하는 공간입니다.</p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
                <LayoutDashboard size={48} className="text-muted" style={{ marginBottom: 'var(--spacing-4)', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-2)' }}>현재 프론트엔드 목업 단계입니다.</h3>
                <p className="text-muted">향후 Supabase DB 연결 (Step 10) 후 이 화면에서 CRUD 폼을 제어할 수 있게 됩니다.</p>
            </div>
        </div>
    );
};
