import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search, Edit2, Check, Plus, Trash2 } from 'lucide-react';

const MOCK_FAQ = [
    { id: 1, type: '기업', q: '전문가와의 미팅은 보통 어디서 진행하나요?', a: '기본적으로 화상 미팅을 권장하며, 불가피한 경우 양자 간 협의하여 오프라인으로 진행 가능합니다.' },
    { id: 2, type: '전문가', q: '활동비 지급을 위한 요건은 무엇인가요?', a: '매월 말일까지 월간 보고서를 제출 완료해야 익월 15일 이내 활동비가 지급됩니다.' },
    { id: 3, type: '공통', q: '결과물 업로드는 어떻게 하나요?', a: '수탁기관에서 별도로 안내드리는 공유 드라이브 링크에 폴더명(기업명_전문가명)을 생성하여 업로드 해주시면 됩니다.' },
    { id: 4, type: '기업', q: '디자인 방향성이 중간에 크게 바뀌면 어떻게 하나요?', a: '과업 명세에 최초 합의된 기준을 원칙으로 하며, 부득이한 수정은 수탁기관 및 양자 간 합의 후 공식적으로 수정해야 합니다.' },
    { id: 5, type: '전문가', q: '영세기업과 연락이 두절되면 어떻게 해야 하나요?', a: '3영업일 이상 회신이 없을 경우 수탁기관 담당자에게 즉시 보고해 주시기 바랍니다.' }
];

type TabType = '전체' | '기업' | '전문가' | '공통';

export const Qna = () => {
    const [faqData, setFaqData] = useState(() => {
        const saved = localStorage.getItem('mockFaq');
        return saved ? JSON.parse(saved) : MOCK_FAQ;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [openId, setOpenId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('전체');
    const [searchQuery, setSearchQuery] = useState('');

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    useEffect(() => {
        localStorage.setItem('mockFaq', JSON.stringify(faqData));
    }, [faqData]);

    const filteredFaq = useMemo(() => {
        return faqData.filter((faq: any) => {
            const matchTab = activeTab === '전체' || faq.type === activeTab;
            const matchSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [activeTab, searchQuery, faqData]);

    const handleFaqChange = (id: number, field: string, value: string) => {
        setFaqData((prev: any[]) => prev.map((f: any) => f.id === id ? { ...f, [field]: value } : f));
    };

    const addFaq = () => {
        const newId = faqData.length > 0 ? Math.max(...faqData.map((f: any) => f.id)) + 1 : 1;
        setFaqData([...faqData, { id: newId, type: '공통', q: '새로운 질문', a: '새로운 답변' }]);
    };

    const deleteFaq = (id: number) => {
        setFaqData((prev: any[]) => prev.filter((f: any) => f.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>자주 묻는 질문 (FAQ)</h2>
                    <p className="text-secondary">사업 진행과 관련하여 자주 묻는 질문들을 모아두었습니다.</p>
                </div>
                <button
                    className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    {isEditing ? <><Check size={16} /> 편집 완료</> : <><Edit2 size={16} /> FAQ 편집</>}
                </button>
            </div>

            {/* Tabs & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-2)' }}>
                    {(['전체', '기업', '전문가', '공통'] as TabType[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 'var(--spacing-2) var(--spacing-4)',
                                fontSize: '1rem',
                                fontWeight: activeTab === tab ? 600 : 400,
                                color: activeTab === tab ? 'var(--point-primary)' : 'var(--text-secondary)',
                                borderBottom: activeTab === tab ? '2px solid var(--point-primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                marginBottom: '-9px' /* overlap the border-bottom */
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="질문이나 키워드로 검색해보세요."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '36px', borderRadius: 'var(--radius-lg)', width: '100%', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '10px 12px 10px 36px' }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {filteredFaq.length > 0 ? (
                    filteredFaq.map((faq: any) => (
                        <div key={faq.id} className="card" onClick={() => !isEditing && toggle(faq.id)} style={{ cursor: isEditing ? 'default' : 'pointer', padding: 'var(--spacing-4) var(--spacing-6)' }}>

                            {isEditing ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                                        <select
                                            value={faq.type}
                                            onChange={(e) => handleFaqChange(faq.id, 'type', e.target.value)}
                                            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                        >
                                            <option value="공통">공통</option>
                                            <option value="기업">기업</option>
                                            <option value="전문가">전문가</option>
                                        </select>
                                        <input
                                            value={faq.q}
                                            onChange={(e) => handleFaqChange(faq.id, 'q', e.target.value)}
                                            placeholder="질문내용"
                                            style={{ flexGrow: 1, padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                        />
                                        <button onClick={() => deleteFaq(faq.id)} className="btn btn-secondary" style={{ padding: '6px', color: 'var(--status-danger)', border: 'none' }}><Trash2 size={18} /></button>
                                    </div>
                                    <textarea
                                        value={faq.a}
                                        onChange={(e) => handleFaqChange(faq.id, 'a', e.target.value)}
                                        placeholder="답변내용"
                                        style={{ minHeight: '80px', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', resize: 'vertical' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                                            <span className={`badge ${faq.type === '기업' ? 'badge-blue' : faq.type === '전문가' ? 'badge-outline' : ''}`} style={{ backgroundColor: faq.type === '공통' ? 'var(--bg-tertiary)' : undefined }}>
                                                {faq.type}
                                            </span>
                                            <strong style={{ fontSize: '1.125rem' }}>Q. {faq.q}</strong>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className="text-muted"
                                            style={{ transform: openId === faq.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                        />
                                    </div>
                                    {openId === faq.id && (
                                        <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                            A. {faq.a}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-muted)' }}>
                        검색 결과가 없습니다.
                    </div>
                )}

                {isEditing && (
                    <button className="btn btn-secondary" onClick={addFaq} style={{ width: '100%', marginTop: 'var(--spacing-2)' }}>
                        <Plus size={16} /> FAQ 항목 추가
                    </button>
                )}
            </div>
        </div>
    );
};
