import { useState, useEffect } from 'react';
import { Edit2, Check, ChevronRight } from 'lucide-react';

const INITIAL_NOTICES = [
    {
        id: 1,
        target: 'enterprise',
        title: "영세기업 필독: 첫 미팅 전 '기업 현황 조사서' 작성 안내",
        content: "전문가와의 매칭 후, 첫 미팅 전까지 반드시 '기업 현황 조사서'를 작성하여 지정된 드라이브에 업로드해 주시기 바랍니다. 본 조사서는 전문가가 귀사의 현재 상황을 정확히 진단하고 올바른 디자인 방향성을 수립하는 데 필수적인 기초 자료입니다. 양식 다운로드 및 제출 기한을 엄수해 주시기 바랍니다.",
        date: '2026. 03. 01'
    },
    {
        id: 2,
        target: 'expert',
        title: "디자인 전문가 필독: 월간 보고서 제출 및 활동비 지급 안내",
        content: "매월 말일까지 담당 기업과의 진행 상황을 요약한 '월간 보고서'를 수탁기관으로 제출해주셔야 합니다. 보고서에는 협의 내용, 진척도, 특이사항 등이 포함되어야 하며, 해당 서류의 결재가 완료되어야 익월 중으로 활동비가 정상 지급됩니다. 양식은 상단의 자료실 탭을 참고해 주세요.",
        date: '2026. 03. 02'
    }
];

export const Notices = () => {
    const [notices, setNotices] = useState(() => {
        const saved = localStorage.getItem('mockNotices');
        return saved ? JSON.parse(saved) : INITIAL_NOTICES;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'enterprise' | 'expert'>('all');

    const filteredNotices = notices.filter((n: any) => activeTab === 'all' || n.target === activeTab);

    useEffect(() => {
        localStorage.setItem('mockNotices', JSON.stringify(notices));
    }, [notices]);

    const handleNoticeChange = (id: number, field: string, value: string) => {
        setNotices((prev: any[]) => prev.map((n: any) => n.id === id ? { ...n, [field]: value } : n));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2)' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>공지사항 (필독란)</h2>
                    <p className="text-secondary">수탁기관에서 안내하는 중요 공지사항과 제출 서류를 확인하세요.</p>
                </div>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    {isEditing ? <><Check size={16} /> 저장 완료</> : <><Edit2 size={16} /> 관리자 공지 작성</>}
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--spacing-2)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-2)' }}>
                {[
                    { id: 'all', label: '전체 공지' },
                    { id: 'enterprise', label: '영세기업 전용' },
                    { id: 'expert', label: '전문가 전용' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 'var(--spacing-2) var(--spacing-4)',
                            fontSize: '1rem',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            color: activeTab === tab.id ? 'var(--point-primary)' : 'var(--text-secondary)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--point-primary)' : '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '-9px'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Notice List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {filteredNotices.length === 0 && <div className="card text-center text-muted" style={{ padding: 'var(--spacing-8)' }}>해당하는 공지사항이 없습니다.</div>}

                {filteredNotices.map((notice: any) => (
                    <div key={notice.id} className="card" style={{
                        borderLeft: `3px solid ${notice.target === 'enterprise' ? 'var(--status-warning)' : 'var(--point-primary)'}`,
                        padding: 'var(--spacing-4) var(--spacing-5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isEditing ? 'var(--spacing-3)' : 'var(--spacing-2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                <span className={`badge ${notice.target === 'enterprise' ? 'badge-warning' : 'badge-blue'}`}>
                                    {notice.target === 'enterprise' ? '영세기업' : '전문가'}
                                </span>
                                {!isEditing && <h3 style={{ fontSize: '1.125rem', margin: 0 }}>{notice.title}</h3>}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap', marginLeft: 'var(--spacing-4)' }}>{notice.date}</span>
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                <input
                                    value={notice.title}
                                    onChange={(e) => handleNoticeChange(notice.id, 'title', e.target.value)}
                                    style={{ fontSize: '1.25rem', fontWeight: 600, padding: '8px 12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                                />
                                <textarea
                                    value={notice.content}
                                    onChange={(e) => handleNoticeChange(notice.id, 'content', e.target.value)}
                                    style={{ minHeight: '120px', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)', lineHeight: '1.6', resize: 'vertical' }}
                                />
                            </div>
                        ) : (
                            <div>
                                <p className="text-secondary" style={{
                                    lineHeight: '1.5',
                                    fontSize: '0.9375rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{notice.content}</p>
                            </div>
                        )}

                        {!isEditing && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-3)' }}>
                                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.8125rem' }}>
                                    상세 보기 <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
};
