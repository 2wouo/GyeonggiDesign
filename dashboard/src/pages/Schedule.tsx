import { CalendarPlus, MapPin } from 'lucide-react';

const MOCK_SCHEDULE = [
    { id: 1, title: '디자인 방향성 수립 대면 워크숍', date: '2026. 03. 14 (수) 14:00', location: '수원 컨벤션센터 3홀', type: '워크숍' },
    { id: 2, title: '디자인 전문가 월간 보고 제출기한', date: '2026. 03. 31 (금) 18:00', location: '온라인 제출', type: '제출기한' },
    { id: 3, title: '중간 점검 및 네트워킹 데이', date: '2026. 04. 15 (목) 13:00', location: '판교 스타트업캠퍼스', type: '워크숍' },
];

export const Schedule = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>주요 일정 안내</h2>
                    <p className="text-secondary">공식 오프라인 행사 및 서류 제출 기한을 확인하세요.</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {MOCK_SCHEDULE.map(item => (
                    <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                                <span className={`badge ${item.type === '워크숍' ? 'badge-blue' : 'badge-outline'}`}>
                                    {item.type}
                                </span>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{item.date}</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem' }}>{item.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                <MapPin size={14} />
                                {item.location}
                            </div>
                        </div>

                        <button className="btn btn-secondary" style={{ padding: 'var(--spacing-2)', borderRadius: '50%' }}>
                            <CalendarPlus size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
