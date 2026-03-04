import { useState, useEffect } from 'react';
import { Edit2, Check, Plus, Trash2, ChevronLeft, Building2, UserCircle, Calendar as CalendarIcon, Package, CheckCircle2, Circle, FileSignature, X, Clock, RefreshCw, FileBox, Lightbulb, AlertCircle } from 'lucide-react';

// Monthly tracking from March to October (typical project duration)
const PROJECT_MONTHS = [3, 4, 5, 6, 7, 8, 9, 10];

const FILE_TYPE_OPTIONS = ['AI', 'PDF', 'PNG', 'JPG', 'PSD', 'SVG', 'INDD', '인쇄용 CMYK PDF', '원본 파일 포함'];

const DEFAULT_SCOPE = {
    deliveryDate: '',
    designItems: [] as string[],
    fileTypes: [] as string[],
    revisionCount: 3,
    conceptDescription: '',
    extraNotes: '',
    updatedAt: '',
};

const getScope = (enterprise: any) => ({ ...DEFAULT_SCOPE, ...enterprise.scopeDefinition });

const MOCK_STATUS = [
    {
        id: 1,
        enterpriseName: '(주)디자인랩',
        designerName: '김전문',
        expectedDate: '2026-05-30',
        deliverables: '브랜드 가이드라인, 명함',
        minutes: { 3: true, 4: false, 5: false },
        scopeDefinition: {
            deliveryDate: '2026-05-30',
            designItems: ['로고 디자인', '브랜드 컬러/폰트 가이드', '명함 디자인', '봉투 디자인'],
            fileTypes: ['AI', 'PDF', 'PNG', '원본 파일 포함'],
            revisionCount: 3,
            conceptDescription: '트렌디하고 미니멀한 스타일 지향.\n주 타겟층인 2030 세대에게 어필할 수 있는 젊고 감각적인 느낌.\n주조색은 신뢰를 주는 딥 블루 톤으로 요청합니다.',
            extraNotes: '로고 심볼 버전을 별도로 요청함.\n명함은 임직원 5명 분량에 대한 베리에이션 작업 포함.\n최종 원본 파일은 AI 버전(CS6 호환)으로 납품 요망.',
            updatedAt: '2026-03-01T10:30:00.000Z'
        }
    },
    {
        id: 2,
        enterpriseName: '혁신제조(주)',
        designerName: '이프로',
        expectedDate: '2026-06-15',
        deliverables: '패키지 디자인, 포스터',
        minutes: { 3: true, 4: true, 5: false },
        scopeDefinition: {
            deliveryDate: '2026-06-15',
            designItems: ['제품 패키지 단상자', '홍보용 포스터 A2', '상세페이지 이미지 (1종)'],
            fileTypes: ['AI', 'PDF', '인쇄용 CMYK PDF'],
            revisionCount: 2,
            conceptDescription: '친환경 소재와 건강함을 강조하는 오가닉 패키지.\n크라프트지 재질에 1도 또는 2도 인쇄를 고려한 심플하고 자연스러운 아트웍.',
            extraNotes: '후가공(형압, 부분코팅 등) 시안 포함.\n칼선(전개도)은 당사에서 제공하는 규격에 맞춰 작업 필수.',
            updatedAt: '2026-03-05T14:15:00.000Z'
        }
    },
    {
        id: 3,
        enterpriseName: '미래푸드',
        designerName: '박실장',
        expectedDate: '2026-07-01',
        deliverables: '웹사이트 시안, 로고',
        minutes: { 3: false, 4: false, 5: false },
        scopeDefinition: {
            deliveryDate: '2026-07-01',
            designItems: ['브랜드 로고 리뉴얼', '반응형 웹사이트 메인 페이지 시안', '서브 페이지(회사소개, 제품소개) 2종'],
            fileTypes: ['AI', 'PDF', 'JPG', 'PSD'],
            revisionCount: 5,
            conceptDescription: '전통적인 이미지에서 벗어나 글로벌 시장 진출에 적합한 모던하고 직관적인 스타일.\n푸드테크 스타트업으로서 기술적이고 위생적인 느낌의 톤앤매너 유지.',
            extraNotes: '웹사이트 시안은 데스크탑/모바일 버전 각각 제출.\n사용된 모든 이미지와 폰트는 라이선스에 문제가 없는 상업적 이용 가능 소스여야 함.',
            updatedAt: '2026-03-10T09:00:00.000Z'
        }
    },
    {
        id: 4,
        enterpriseName: '그린에코상사',
        designerName: '정수석',
        expectedDate: '2026-06-20',
        deliverables: '친환경 포장재, 브로슈어',
        minutes: { 3: true, 4: true, 5: true, 6: false },
        scopeDefinition: {}
    },
    {
        id: 5,
        enterpriseName: '늘품공예',
        designerName: '오수석',
        expectedDate: '2026-08-10',
        deliverables: '제품 촬영, 카탈로그',
        minutes: { 3: true, 4: false, 5: false, 6: false, 7: false },
        scopeDefinition: {}
    },
    {
        id: 6,
        enterpriseName: '스타트업 팩토리',
        designerName: '최대표',
        expectedDate: '2026-09-30',
        deliverables: '앱 UI/UX 시안, 홍보영상',
        minutes: { 3: true, 4: true, 5: true, 6: true, 7: false, 8: false },
        scopeDefinition: {
            deliveryDate: '2026-09-30',
            designItems: ['모바일 앱 10개 핵심 화면 UI', '온보딩 일러스트 3종', '15초 홍보용 모션 그래픽'],
            fileTypes: ['PNG', 'SVG', '원본 파일 포함'],
            revisionCount: 4,
            conceptDescription: '앱의 주요 사용자층인 Z세대에 맞춘 다크모드 기반 네온 컬러 포인트 UI.\n애니메이션 효과가 돋보이도록 각 요소의 컴포넌트화 요망.',
            extraNotes: '피그마(Figma) 링크로 원본 공유 요망.\n개발자가 바로 적용할 수 있도록 에셋 익스포트 세팅 필수.',
            updatedAt: '2026-04-01T16:45:00.000Z'
        }
    },
    {
        id: 7,
        enterpriseName: '우리지역농산물',
        designerName: '이지원',
        expectedDate: '2026-05-15',
        deliverables: 'BI 개발, 스티커 라벨',
        minutes: { 3: true, 4: true, 5: false },
        scopeDefinition: {}
    },
    {
        id: 8,
        enterpriseName: '케이텍바이오',
        designerName: '윤팀장',
        expectedDate: '2026-10-31',
        deliverables: '기업 홈페이지 리뉴얼, 리플렛',
        minutes: { 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false },
        scopeDefinition: {}
    },
];

const ScopeDefinition = ({ enterprise, isEditing, onScopeChange, onToggleFileType, onAddDesignItem, onRemoveDesignItem }: any) => {
    const scope = getScope(enterprise);
    const [itemInput, setItemInput] = useState('');

    const inputStyle: React.CSSProperties = {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '0.95rem',
        width: '100%',
        boxSizing: 'border-box',
    };

    const rowStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: '16px',
        alignItems: 'start',
        padding: '16px 0',
        borderBottom: '1px solid var(--border-color)',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        paddingTop: '10px',
        gap: '6px'
    };

    const valueStyle: React.CSSProperties = {
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        lineHeight: 1.6,
        padding: '8px 0',
        minHeight: '40px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    };

    return (
        <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)', paddingBottom: 'var(--spacing-4)', borderBottom: '2px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileSignature size={20} className="text-point" />
                    과업 범위 및 산출물 정의서
                    <span className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                        {isEditing ? '편집 중' : scope.deliveryDate || scope.designItems.length > 0 ? '작성됨' : '미작성'}
                    </span>
                </h3>
                {scope.updatedAt && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        최종 업데이트: {new Date(scope.updatedAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>

                {/* 1열: 기본 요구사항 (Group Container) */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 'var(--spacing-4) 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} className="text-point" />
                    <span>일정 및 기본 조건</span>
                </h4>

                {/* 납품 희망일 */}
                <div style={rowStyle}>
                    <div style={labelStyle}><CalendarIcon size={14} /> 납품 희망일</div>
                    {isEditing
                        ? <input type="date" style={inputStyle} value={scope.deliveryDate}
                            onChange={e => onScopeChange(enterprise.id, 'deliveryDate', e.target.value)} />
                        : <div style={{ ...valueStyle, display: 'flex', alignItems: 'center' }}>{scope.deliveryDate || '-'}</div>}
                </div>

                {/* 수정 횟수 */}
                <div style={rowStyle}>
                    <div style={labelStyle}><RefreshCw size={14} /> 제한 수정 횟수</div>
                    {isEditing
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input type="number" min={0} max={20} style={{ ...inputStyle, width: '80px' }}
                                value={scope.revisionCount}
                                onChange={e => onScopeChange(enterprise.id, 'revisionCount', Number(e.target.value))} />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>회</span>
                        </div>
                        : <div style={{ ...valueStyle, display: 'flex', alignItems: 'center' }}>{scope.revisionCount}회</div>}
                </div>

                {/* 전달 파일 종류 */}
                <div style={rowStyle}>
                    <div style={labelStyle}><Package size={14} /> 납품 파일 형식</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
                        {scope.fileTypes.length === 0 && !isEditing && <span style={{ color: 'var(--text-muted)' }}>-</span>}
                        {FILE_TYPE_OPTIONS.map(type => {
                            const checked = scope.fileTypes.includes(type);
                            if (!isEditing && !checked) return null;
                            return (
                                <label key={type} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    padding: '4px 12px', borderRadius: '4px', cursor: isEditing ? 'pointer' : 'default',
                                    fontSize: '0.85rem', fontWeight: 500,
                                    border: `1px solid ${checked ? 'var(--point-primary)' : 'var(--border-color)'}`,
                                    background: checked ? 'rgba(74,222,128,0.08)' : 'var(--bg-primary)',
                                    color: checked ? 'var(--point-primary)' : 'var(--text-secondary)',
                                    userSelect: 'none',
                                    transition: 'all 0.2s'
                                }}>
                                    {isEditing && (
                                        <input type="checkbox" checked={checked} style={{ display: 'none' }}
                                            onChange={() => onToggleFileType(enterprise.id, type)} />
                                    )}
                                    <span onClick={() => isEditing && onToggleFileType(enterprise.id, type)}>{type}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* 2열: 상세 가이드라인 (Group Container) */}
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', margin: 'var(--spacing-8) 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileBox size={16} className="text-point" />
                    <span>상세 정의서</span>
                </h4>

                {/* 디자인 품목 */}
                <div style={rowStyle}>
                    <div style={labelStyle}>필요 디자인 품목 (상세)</div>
                    <div style={{ padding: '8px 0' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: isEditing ? '10px' : '0' }}>
                            {scope.designItems.length === 0 && !isEditing && <span style={{ color: 'var(--text-muted)' }}>-</span>}
                            {scope.designItems.map((item: string) => (
                                <span key={item} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)', borderRadius: '4px',
                                    padding: '4px 10px', fontSize: '0.9rem', fontWeight: 500
                                }}>
                                    {item}
                                    {isEditing && (
                                        <button
                                            onClick={() => onRemoveDesignItem(enterprise.id, item)}
                                            style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '2px', cursor: 'pointer', color: 'var(--status-danger)', display: 'flex', alignItems: 'center' }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                        {isEditing && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    style={{ ...inputStyle, flex: 1 }}
                                    placeholder="추가할 품목 입력 (예: 명함, 포스터)"
                                    value={itemInput}
                                    onChange={e => setItemInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddDesignItem(enterprise.id, itemInput); setItemInput(''); } }}
                                />
                                <button className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}
                                    onClick={() => { onAddDesignItem(enterprise.id, itemInput); setItemInput(''); }}>
                                    + 추가
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 컨셉 방향 */}
                <div style={rowStyle}>
                    <div style={labelStyle}><Lightbulb size={14} /> 컨셉 방향 및 레퍼런스</div>
                    {isEditing
                        ? <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                            placeholder="원하는 디자인 방향, 분위기, 참고 레퍼런스 등을 작성해주세요."
                            value={scope.conceptDescription}
                            onChange={e => onScopeChange(enterprise.id, 'conceptDescription', e.target.value)} />
                        : <div style={valueStyle}>{scope.conceptDescription || '-'}</div>}
                </div>

                {/* 기타 규칙 / 특이사항 */}
                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div style={labelStyle}><AlertCircle size={14} /> 기타 합의사항</div>
                    {isEditing
                        ? <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            placeholder="수정 방식, 납품 방법, 저작권 조건 등 추가 합의 사항을 작성해주세요."
                            value={scope.extraNotes}
                            onChange={e => onScopeChange(enterprise.id, 'extraNotes', e.target.value)} />
                        : <div style={valueStyle}>{scope.extraNotes || '-'}</div>}
                </div>

            </div>
        </div>
    );
};

export const Status = () => {
    const [statusList, setStatusList] = useState(() => {
        const saved = localStorage.getItem('mockStatusAdvancedV3');
        return saved ? JSON.parse(saved) : MOCK_STATUS;
    });
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        localStorage.setItem('mockStatusAdvancedV3', JSON.stringify(statusList));
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

    const handleScopeChange = (id: number, field: string, value: any) => {
        setStatusList((prev: any[]) => prev.map((s: any) =>
            s.id === id ? { ...s, scopeDefinition: { ...getScope(s), [field]: value, updatedAt: new Date().toISOString() } } : s
        ));
    };

    const toggleFileType = (id: number, type: string) => {
        const scope = getScope(statusList.find((s: any) => s.id === id));
        const updated = scope.fileTypes.includes(type)
            ? scope.fileTypes.filter((t: string) => t !== type)
            : [...scope.fileTypes, type];
        handleScopeChange(id, 'fileTypes', updated);
    };

    const addDesignItem = (id: number, item: string) => {
        if (!item.trim()) return;
        const scope = getScope(statusList.find((s: any) => s.id === id));
        if (!scope.designItems.includes(item.trim())) {
            handleScopeChange(id, 'designItems', [...scope.designItems, item.trim()]);
        }
    };

    const removeDesignItem = (id: number, item: string) => {
        const scope = getScope(statusList.find((s: any) => s.id === id));
        handleScopeChange(id, 'designItems', scope.designItems.filter((i: string) => i !== item));
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

                {/* 과업범위 및 산출물 정의서 */}
                <ScopeDefinition
                    enterprise={selectedEnterprise}
                    isEditing={isEditing}
                    onScopeChange={handleScopeChange}
                    onToggleFileType={toggleFileType}
                    onAddDesignItem={addDesignItem}
                    onRemoveDesignItem={removeDesignItem}
                />

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
