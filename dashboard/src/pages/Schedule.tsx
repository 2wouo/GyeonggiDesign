import { useState, useEffect, useMemo } from 'react';
import { CalendarPlus, MapPin, Edit2, Check, Plus, Trash2, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

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

    // Calendar Logic
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Default to March 2026 based on mock data

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

        // Add trailing nulls to complete the grid (optional, but keeps rows consistent)
        const totalCells = Math.ceil(days.length / 7) * 7;
        while (days.length < totalCells) days.push(null);

        return days;
    }, [currentMonth]);

    const getEventsForDate = (date: Date | null) => {
        if (!date) return [];
        const dateString = `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
        return schedule.filter((s: any) => s.date.includes(dateString));
    };

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

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

            {/* Calendar View */}
            <div className="card" style={{ padding: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                        <CalendarIcon className="text-primary" size={24} />
                        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                            {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                        <button className="btn btn-secondary" onClick={prevMonth} style={{ padding: '6px' }}><ChevronLeft size={20} /></button>
                        <button className="btn btn-secondary" onClick={nextMonth} style={{ padding: '6px' }}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }}>
                    {weekDays.map((day, i) => (
                        <div key={day} style={{ fontWeight: 600, color: i === 0 ? 'var(--status-danger)' : i === 6 ? 'var(--point-primary)' : 'var(--text-secondary)', fontSize: '0.875rem', paddingBottom: '8px' }}>
                            {day}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                    {calendarDays.map((date, idx) => {
                        const events = getEventsForDate(date);
                        const isToday = date && date.toDateString() === new Date().toDateString();
                        const isSunday = date && date.getDay() === 0;
                        const isSaturday = date && date.getDay() === 6;

                        return (
                            <div key={idx} style={{
                                minHeight: '80px',
                                padding: '8px',
                                backgroundColor: date ? 'var(--bg-secondary)' : 'transparent',
                                borderRadius: 'var(--radius-sm)',
                                border: date ? (isToday ? '1px solid var(--point-primary)' : '1px solid var(--border-color)') : 'none',
                                opacity: date ? 1 : 0
                            }}>
                                {date && (
                                    <>
                                        <div style={{
                                            textAlign: 'right',
                                            fontSize: '0.875rem',
                                            marginBottom: '4px',
                                            fontWeight: isToday ? 700 : 400,
                                            color: isToday ? 'var(--point-primary)' : isSunday ? 'var(--status-danger)' : isSaturday ? 'var(--point-primary)' : 'var(--text-primary)'
                                        }}>
                                            {date.getDate()}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {events.map((e: any) => (
                                                <div
                                                    key={e.id}
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        padding: '4px',
                                                        backgroundColor: e.type === '워크숍' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                        color: e.type === '워크숍' ? '#93c5fd' : '#fcd34d',
                                                        borderRadius: '4px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        borderLeft: `2px solid ${e.type === '워크숍' ? 'var(--point-primary)' : 'var(--status-warning)'}`
                                                    }}
                                                    title={e.title}
                                                >
                                                    {e.title}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
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
