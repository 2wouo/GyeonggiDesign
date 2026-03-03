import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronRight, AlertCircle, Edit2, Check, Plus, Trash2 } from 'lucide-react';

const INITIAL_ROADMAP = [
    { id: 1, phase: '1단계', title: '기업 매칭 및 현황 진단', status: 'completed', date: '3월 1주차' },
    { id: 2, phase: '2단계', title: '디자인 방향성 수립 워크숍', status: 'active', date: '3월 2주차' },
    { id: 3, phase: '3단계', title: '1차 시안 리뷰 및 피드백', status: 'pending', date: '4월 1주차' },
    { id: 4, phase: '4단계', title: '최종 디자인 산출물 제출', status: 'pending', date: '4월 3주차' },
    { id: 5, phase: '5단계', title: '성과공유회 및 만족도 조사', status: 'pending', date: '5월 1주차' },
];

export const Home = () => {
    // Local state for MVP
    const [roadmap, setRoadmap] = useState(() => {
        const saved = localStorage.getItem('mockRoadmap');
        return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
    });
    const [isEditingMap, setIsEditingMap] = useState(false);

    const [notices, setNotices] = useState(() => {
        const saved = localStorage.getItem('mockHomeNotices');
        return saved ? JSON.parse(saved) : {
            enterprise: "전문가와의 매칭 후, 첫 미팅 전까지 '기업 현황 조사서'를 작성하여 지정된 드라이브에 업로드해 주시기 바랍니다.",
            expert: "매월 말일까지 담당 기업과의 진행 상황을 요약한 '월간 보고서'를 수탁기관으로 제출해야 활동비가 정상 지급됩니다."
        };
    });
    const [isEditingNotices, setIsEditingNotices] = useState(false);

    useEffect(() => {
        localStorage.setItem('mockRoadmap', JSON.stringify(roadmap));
    }, [roadmap]);

    useEffect(() => {
        localStorage.setItem('mockHomeNotices', JSON.stringify(notices));
    }, [notices]);

    // Map Handlers
    const handleMapChange = (id: number, field: string, value: string) => {
        setRoadmap((prev: any[]) => prev.map((item: any) => item.id === id ? { ...item, [field]: value } : item));
    };
    const addMapStep = () => {
        const newId = roadmap.length > 0 ? Math.max(...roadmap.map((r: any) => r.id)) + 1 : 1;
        setRoadmap([...roadmap, { id: newId, phase: `${newId}단계`, title: '새로운 단계', status: 'pending', date: '미정' }]);
    };
    const removeMapStep = (id: number) => {
        setRoadmap((prev: any[]) => prev.filter((item: any) => item.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>

            {/* Roadmap Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--spacing-2)' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem' }}>사업 전체 프로세스 맵</h2>
                        <p className="text-secondary">현재 우리 기업과 전문가가 어느 단계에 있는지 한눈에 파악하세요.</p>
                    </div>
                    <button
                        className={`btn ${isEditingMap ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsEditingMap(!isEditingMap)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        {isEditingMap ? <><Check size={16} /> 완료</> : <><Edit2 size={16} /> 관리자 모드 (수정)</>}
                    </button>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                        {roadmap.length === 0 && <p className="text-muted text-center" style={{ padding: 'var(--spacing-4)' }}>목록이 비어있습니다.</p>}
                        {roadmap.map((step: any, idx: number) => (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)' }}>
                                {/* Status Icon */}
                                <div style={{
                                    marginTop: '4px',
                                    color: step.status === 'completed' ? 'var(--status-success)' :
                                        step.status === 'active' ? 'var(--point-primary)' : 'var(--text-muted)'
                                }}>
                                    {step.status === 'completed' ? <CheckCircle2 size={24} /> :
                                        step.status === 'active' ? <Clock size={24} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />}
                                </div>

                                {/* Content */}
                                <div style={{ flexGrow: 1, paddingBottom: idx === roadmap.length - 1 ? 0 : 'var(--spacing-6)', borderBottom: idx === roadmap.length - 1 ? 'none' : '1px solid var(--border-color)' }}>

                                    {isEditingMap ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <input value={step.phase} onChange={(e) => handleMapChange(step.id, 'phase', e.target.value)} style={{ width: '100px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                                                <input value={step.date} onChange={(e) => handleMapChange(step.id, 'date', e.target.value)} style={{ width: '150px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                                                <select
                                                    value={step.status}
                                                    onChange={(e) => handleMapChange(step.id, 'status', e.target.value)}
                                                    style={{ width: '120px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                                >
                                                    <option value="pending">대기 중</option>
                                                    <option value="active">진행 중</option>
                                                    <option value="completed">완료</option>
                                                </select>
                                                <button onClick={() => removeMapStep(step.id)} className="btn btn-secondary" style={{ padding: '6px', color: 'var(--status-danger)', border: 'none' }}><Trash2 size={18} /></button>
                                            </div>
                                            <input value={step.title} onChange={(e) => handleMapChange(step.id, 'title', e.target.value)} placeholder="과업 제목" style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '100%' }} />
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: '4px' }}>
                                                <span className="badge badge-outline">{step.phase}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{step.date}</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', color: step.status === 'active' ? 'var(--text-primary)' : step.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                                                {step.title}
                                            </h3>
                                        </>
                                    )}

                                </div>
                            </div>
                        ))}

                        {isEditingMap && (
                            <button className="btn btn-secondary" onClick={addMapStep} style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>
                                <Plus size={16} /> 새로운 단계 추가
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notices Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-2)' }}>
                    <button
                        className={`btn ${isEditingNotices ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setIsEditingNotices(!isEditingNotices)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.875rem' }}
                    >
                        {isEditingNotices ? <><Check size={14} /> 저장</> : <><Edit2 size={14} /> 공지 내용 편집</>}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)' }}>
                    <div className="card" style={{ borderLeft: '4px solid var(--status-warning)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                            <AlertCircle size={20} className="text-primary" />
                            <h4 style={{ fontSize: '1.125rem' }}>영세기업 필독란</h4>
                        </div>
                        {isEditingNotices ? (
                            <textarea
                                value={notices.enterprise}
                                onChange={(e) => setNotices((prev: any) => ({ ...prev, enterprise: e.target.value }))}
                                style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                            />
                        ) : (
                            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{notices.enterprise}</p>
                        )}
                        {!isEditingNotices && <button className="btn btn-secondary" style={{ marginTop: 'var(--spacing-4)', width: '100%' }}>자세히 보기 <ChevronRight size={16} /></button>}
                    </div>

                    <div className="card" style={{ borderLeft: '4px solid var(--point-primary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
                            <AlertCircle size={20} className="text-primary" />
                            <h4 style={{ fontSize: '1.125rem' }}>디자인 전문가 필독란</h4>
                        </div>
                        {isEditingNotices ? (
                            <textarea
                                value={notices.expert}
                                onChange={(e) => setNotices((prev: any) => ({ ...prev, expert: e.target.value }))}
                                style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                            />
                        ) : (
                            <p className="text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{notices.expert}</p>
                        )}
                        {!isEditingNotices && <button className="btn btn-secondary" style={{ marginTop: 'var(--spacing-4)', width: '100%' }}>자세히 보기 <ChevronRight size={16} /></button>}
                    </div>
                </div>
            </div>

        </div>
    );
};
