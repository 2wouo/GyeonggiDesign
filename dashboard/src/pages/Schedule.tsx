import { useState, useEffect } from 'react';
import { CalendarPlus, MapPin, Edit2, Check, Plus, Trash2 } from 'lucide-react';

const MOCK_SCHEDULE = [
    { id: 1, title: '디자인 방향성 수립 대면 워크숍', date: '2026. 03. 14 (수) 14:00', location: '수원 컨벤션센터 3홀', type: '워크숍' },
    { id: 2, title: '디자인 전문가 월간 보고 제출기한', date: '2026. 03. 31 (금) 18:00', location: '온라인 제출', type: '제출기한' },
    { id: 3, title: '중간 점검 및 네트워킹 데이', date: '2026. 04. 15 (목) 13:00', location: '판교 스타트업캠퍼스', type: '워크숍' },
];

export const Schedule = () => {
    const [schedule, setSchedule] = useState(() => {
        const saved = localStorage.getItem('mockSchedule');
        return saved ? JSON.parse(saved) : MOCK_SCHEDULE;
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('mockSchedule', JSON.stringify(schedule));
    }, [schedule]);

    const handleScheduleChange = (id: number, field: string, value: string) => {
        setSchedule((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, [field]: value } : s));
    };

    const addSchedule = () => {
        const newId = schedule.length > 0 ? Math.max(...schedule.map((s: any) => s.id)) + 1 : 1;
        setSchedule([...schedule, { id: newId, title: '새로운 일정', date: '미정', location: '미정', type: '기타' }]);
    };

    const deleteSchedule = (id: number) => {
        setSchedule((prev: any[]) => prev.filter((s: any) => s.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>주요 일정 안내</h2>
                    <p className="text-secondary">공식 오프라인 행사 및 서류 제출 기한을 확인하세요.</p>
                </div>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    {isEditing ? <><Check size={16} /> 편집 완료</> : <><Edit2 size={16} /> 일정 편집</>}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {schedule.length === 0 && <p className="text-muted text-center" style={{ padding: 'var(--spacing-4)' }}>등록된 주요 일정이 없습니다.</p>}

                {schedule.map((item: any) => (
                    <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', width: '100%' }}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <input
                                        value={item.type}
                                        onChange={(e) => handleScheduleChange(item.id, 'type', e.target.value)}
                                        style={{ width: '100px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    />
                                    <input
                                        value={item.date}
                                        onChange={(e) => handleScheduleChange(item.id, 'date', e.target.value)}
                                        style={{ width: '200px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    />
                                    <button onClick={() => deleteSchedule(item.id)} className="btn btn-secondary" style={{ padding: '6px', color: 'var(--status-danger)', border: 'none', marginLeft: 'auto' }}><Trash2 size={18} /></button>
                                </div>
                                <input
                                    value={item.title}
                                    onChange={(e) => handleScheduleChange(item.id, 'title', e.target.value)}
                                    placeholder="일정 제목"
                                    style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '100%', fontSize: '1.125rem', fontWeight: 600 }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <MapPin size={14} />
                                    <input
                                        value={item.location}
                                        onChange={(e) => handleScheduleChange(item.id, 'location', e.target.value)}
                                        placeholder="장소"
                                        style={{ flexGrow: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-muted)' }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                ))}

                {isEditing && (
                    <button className="btn btn-secondary" onClick={addSchedule} style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>
                        <Plus size={16} /> 새로운 일정 추가
                    </button>
                )}
            </div>
        </div>
    );
};
