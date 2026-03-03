import { useState, useEffect } from 'react';
import { Edit2, Check, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

const MOCK_STATUS = [
    { id: 1, enterpriseName: '(주)디자인랩', designerName: '김전문', expectedDate: '2026-05-30', deliverables: '브랜드 가이드라인, 명함', minutesSubmitted: true },
    { id: 2, enterpriseName: '혁신제조(주)', designerName: '이프로', expectedDate: '2026-06-15', deliverables: '패키지 디자인, 포스터', minutesSubmitted: false },
    { id: 3, enterpriseName: '미래푸드', designerName: '박실장', expectedDate: '2026-07-01', deliverables: '웹사이트 시안, 로고', minutesSubmitted: true },
];

export const Status = () => {
    const [statusList, setStatusList] = useState(() => {
        const saved = localStorage.getItem('mockStatus');
        return saved ? JSON.parse(saved) : MOCK_STATUS;
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('mockStatus', JSON.stringify(statusList));
    }, [statusList]);

    const handleStatusChange = (id: number, field: string, value: any) => {
        setStatusList((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, [field]: value } : s));
    };

    const addStatusRow = () => {
        const newId = statusList.length > 0 ? Math.max(...statusList.map((s: any) => s.id)) + 1 : 1;
        setStatusList([...statusList, { id: newId, enterpriseName: '', designerName: '', expectedDate: '', deliverables: '', minutesSubmitted: false }]);
    };

    const deleteStatusRow = (id: number) => {
        setStatusList((prev: any[]) => prev.filter((s: any) => s.id !== id));
    };

    const toggleMinutes = (id: number) => {
        if (!isEditing) return;
        setStatusList((prev: any[]) => prev.map((s: any) => s.id === id ? { ...s, minutesSubmitted: !s.minutesSubmitted } : s));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>영세기업 현황</h2>
                    <p className="text-secondary">각 기업별 협의 내용과 진행 상황을 확인하세요.</p>
                </div>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    {isEditing ? <><Check size={16} /> 편집 완료</> : <><Edit2 size={16} /> 현황 편집</>}
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>영세기업명</th>
                            <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>담당 전문가</th>
                            <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>완성 예상일</th>
                            <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>예상 산출물</th>
                            <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>회의록 제출</th>
                            {isEditing && <th style={{ padding: 'var(--spacing-4)', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', width: '80px' }}>관리</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {statusList.length === 0 ? (
                            <tr>
                                <td colSpan={isEditing ? 6 : 5} style={{ padding: 'var(--spacing-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    등록된 기업 현황이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            statusList.map((status: any) => (
                                <tr key={status.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: 'var(--spacing-4)' }}>
                                        {isEditing ? (
                                            <input
                                                value={status.enterpriseName}
                                                onChange={(e) => handleStatusChange(status.id, 'enterpriseName', e.target.value)}
                                                placeholder="기업명"
                                                style={{ width: '100%', padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{status.enterpriseName}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-4)' }}>
                                        {isEditing ? (
                                            <input
                                                value={status.designerName}
                                                onChange={(e) => handleStatusChange(status.id, 'designerName', e.target.value)}
                                                placeholder="전문가명"
                                                style={{ width: '100%', padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                                            />
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>{status.designerName}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-4)' }}>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={status.expectedDate}
                                                onChange={(e) => handleStatusChange(status.id, 'expectedDate', e.target.value)}
                                                style={{ width: '100%', padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                                            />
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{status.expectedDate}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-4)' }}>
                                        {isEditing ? (
                                            <input
                                                value={status.deliverables}
                                                onChange={(e) => handleStatusChange(status.id, 'deliverables', e.target.value)}
                                                placeholder="로고, 패키지 등"
                                                style={{ width: '100%', padding: '6px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                                            />
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>{status.deliverables}</span>
                                        )}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
                                        <div
                                            onClick={() => toggleMinutes(status.id)}
                                            style={{
                                                display: 'inline-flex',
                                                cursor: isEditing ? 'pointer' : 'default',
                                                color: status.minutesSubmitted ? 'var(--point-primary)' : 'var(--text-muted)',
                                            }}
                                        >
                                            {status.minutesSubmitted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                        </div>
                                    </td>
                                    {isEditing && (
                                        <td style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
                                            <button
                                                onClick={() => deleteStatusRow(status.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '6px', color: 'var(--status-danger)', border: 'none' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {isEditing && (
                    <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)' }}>
                        <button className="btn btn-secondary" onClick={addStatusRow} style={{ width: '100%' }}>
                            <Plus size={16} /> 기업 현황 추가
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
