import { useState, useEffect } from 'react';
import { Edit2, Check, Plus, Trash2, ChevronLeft, Building2, UserCircle, Calendar as CalendarIcon, Package, CheckCircle2, Circle } from 'lucide-react';

// Monthly tracking from March to October (typical project duration)
const PROJECT_MONTHS = [3, 4, 5, 6, 7, 8, 9, 10];

const MOCK_STATUS = [
    {
        id: 1,
        enterpriseName: '(주)디자인랩',
        designerName: '김전문',
        expectedDate: '2026-05-30',
        deliverables: '브랜드 가이드라인, 명함',
        minutes: { 3: true, 4: false, 5: false }
    },
    {
        id: 2,
        enterpriseName: '혁신제조(주)',
        designerName: '이프로',
        expectedDate: '2026-06-15',
        deliverables: '패키지 디자인, 포스터',
        minutes: { 3: true, 4: true, 5: false }
    },
    {
        id: 3,
        enterpriseName: '미래푸드',
        designerName: '박실장',
        expectedDate: '2026-07-01',
        deliverables: '웹사이트 시안, 로고',
        minutes: { 3: false, 4: false, 5: false }
    },
];

export const Status = () => {
    const [statusList, setStatusList] = useState(() => {
        const saved = localStorage.getItem('mockStatusAdvanced');
        return saved ? JSON.parse(saved) : MOCK_STATUS;
    });
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('mockStatusAdvanced', JSON.stringify(statusList));
    }, [statusList]);

    const handleStatusChange = (id: number, field: string, value: any) => {
        setStatusList((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, [field]: value } : s));
    };

    const toggleMinute = (id: number, month: number) => {
        if (!isEditing) return;
        setStatusList((prev: any[]) => prev.map((s: any) => {
            if (s.id === id) {
                return {
                    ...s,
                    minutes: {
                        ...s.minutes,
                        [month]: !s.minutes[month]
                    }
                };
            }
            return s;
        }));
    };

    const addEnterprise = () => {
        const newId = statusList.length > 0 ? Math.max(...statusList.map((s: any) => s.id)) + 1 : 1;
        setStatusList([...statusList, {
            id: newId,
            enterpriseName: '새로운 기업',
            designerName: '미정',
            expectedDate: '',
            deliverables: '',
            minutes: {}
        }]);
    };

    const deleteEnterprise = (id: number) => {
        setStatusList((prev: any[]) => prev.filter((s: any) => s.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const selectedEnterprise = statusList.find((s: any) => s.id === selectedId);

    // Detail View
    if (selectedEnterprise) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        <button
                            onClick={() => { setSelectedId(null); setIsEditing(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: 'var(--text-secondary)', background: 'transparent', border: 'none',
                                padding: 0, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500
                            }}
                        >
                            <ChevronLeft size={16} /> 목록으로 돌아가기
                        </button>
                        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {isEditing ? (
                                <input
                                    value={selectedEnterprise.enterpriseName}
                                    onChange={(e) => handleStatusChange(selectedEnterprise.id, 'enterpriseName', e.target.value)}
                                    style={{ fontSize: '2rem', fontWeight: 700, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', padding: '4px 12px', width: '300px' }}
                                />
                            ) : selectedEnterprise.enterpriseName}
                        </h2>
                    </div>
                    <button
                        className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        {isEditing ? <><Check size={16} /> 저장 완료</> : <><Edit2 size={16} /> 상세 편집</>}
                    </button>
                </div>

                {/* Info Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}><UserCircle size={16} /> 담당 전문가</div>
                        {isEditing ? (
                            <input
                                value={selectedEnterprise.designerName}
                                onChange={(e) => handleStatusChange(selectedEnterprise.id, 'designerName', e.target.value)}
                                style={{ fontSize: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '6px 12px' }}
                            />
                        ) : <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedEnterprise.designerName || '-'}</div>}
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon size={16} /> 완성 예상일</div>
                        {isEditing ? (
                            <input
                                type="date"
                                value={selectedEnterprise.expectedDate}
                                onChange={(e) => handleStatusChange(selectedEnterprise.id, 'expectedDate', e.target.value)}
                                style={{ fontSize: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '6px 12px' }}
                            />
                        ) : <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedEnterprise.expectedDate || '미정'}</div>}
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Package size={16} /> 예상 산출물</div>
                        {isEditing ? (
                            <input
                                value={selectedEnterprise.deliverables}
                                onChange={(e) => handleStatusChange(selectedEnterprise.id, 'deliverables', e.target.value)}
                                style={{ fontSize: '1.25rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', padding: '6px 12px' }}
                            />
                        ) : <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{selectedEnterprise.deliverables || '-'}</div>}
                    </div>
                </div>

                {/* Monthly Minutes Tracking */}
                <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        월별 회의록 제출 현황
                        <span className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 400 }}>클릭하여 상태 변경 (편집 모드)</span>
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                        {PROJECT_MONTHS.map(month => {
                            const isSubmitted = selectedEnterprise.minutes[month] || false;
                            return (
                                <div
                                    key={month}
                                    onClick={() => toggleMinute(selectedEnterprise.id, month)}
                                    style={{
                                        width: '80px',
                                        height: '90px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        borderRadius: '8px',
                                        border: `1px solid ${isSubmitted ? 'var(--point-primary)' : 'var(--border-color)'}`,
                                        backgroundColor: isSubmitted ? 'rgba(37, 99, 235, 0.05)' : 'var(--bg-primary)',
                                        cursor: isEditing ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        opacity: (!isSubmitted && !isEditing) ? 0.6 : 1
                                    }}
                                >
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isSubmitted ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                        {month}월
                                    </div>
                                    <div style={{ color: isSubmitted ? 'var(--point-primary)' : 'var(--text-muted)' }}>
                                        {isSubmitted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Danger Zone */}
                {isEditing && (
                    <div style={{ marginTop: 'var(--spacing-8)', paddingTop: 'var(--spacing-6)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => deleteEnterprise(selectedEnterprise.id)}
                            style={{ color: 'var(--status-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                            <Trash2 size={16} style={{ marginRight: '6px' }} /> 이 기업 현황 삭제
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // Master List View
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>영세기업 현황</h2>
                    <p className="text-secondary">각 기업별 협의 내용과 진행 상황을 확인하세요.</p>
                </div>
                <button className="btn btn-primary" onClick={addEnterprise} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={16} /> 신규 기업 등록
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
                {statusList.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: 'var(--spacing-12)', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                        등록된 기업 현황이 없습니다.
                    </div>
                )}

                {statusList.map((status: any) => {
                    // Calculate quick progress based on months 3 to 10
                    const totalMonths = PROJECT_MONTHS.length;
                    const submittedCount = PROJECT_MONTHS.filter(m => status.minutes[m]).length;
                    const progressPercent = Math.round((submittedCount / totalMonths) * 100);

                    return (
                        <div
                            key={status.id}
                            className="card"
                            style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border-color)' }}
                            onClick={() => setSelectedId(status.id)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--point-primary)' }}>
                                        <Building2 size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{status.enterpriseName}</h3>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--spacing-6)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>담당 전문가</span>
                                    <span style={{ fontWeight: 500 }}>{status.designerName || '-'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>예상 산출물</span>
                                    <span style={{ fontWeight: 500 }}>{status.deliverables || '-'}</span>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>회의록 제출 진척도</span>
                                    <span style={{ fontWeight: 600, color: 'var(--point-primary)' }}>{progressPercent}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--point-gradient)', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
