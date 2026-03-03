import { useState, useMemo } from 'react';
import { ChevronDown, MessageCircleQuestion, Search } from 'lucide-react';

const MOCK_FAQ = [
    { id: 1, type: '기업', q: '전문가와의 미팅은 보통 어디서 진행하나요?', a: '기본적으로 화상 미팅을 권장하며, 불가피한 경우 양자 간 협의하여 오프라인으로 진행 가능합니다.' },
    { id: 2, type: '전문가', q: '활동비 지급을 위한 요건은 무엇인가요?', a: '매월 말일까지 월간 보고서를 제출 완료해야 익월 15일 이내 활동비가 지급됩니다.' },
    { id: 3, type: '공통', q: '결과물 업로드는 어떻게 하나요?', a: '수탁기관에서 별도로 안내드리는 공유 드라이브 링크에 폴더명(기업명_전문가명)을 생성하여 업로드 해주시면 됩니다.' },
    { id: 4, type: '기업', q: '디자인 방향성이 중간에 크게 바뀌면 어떻게 하나요?', a: '과업 명세에 최초 합의된 기준을 원칙으로 하며, 부득이한 수정은 수탁기관 및 양자 간 합의 후 공식적으로 수정해야 합니다.' },
    { id: 5, type: '전문가', q: '영세기업과 연락이 두절되면 어떻게 해야 하나요?', a: '3영업일 이상 회신이 없을 경우 수탁기관 담당자에게 즉시 보고해 주시기 바랍니다.' }
];

type TabType = '전체' | '기업' | '전문가' | '공통';

export const Qna = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('전체');
    const [searchQuery, setSearchQuery] = useState('');

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    const filteredFaq = useMemo(() => {
        return MOCK_FAQ.filter(faq => {
            const matchTab = activeTab === '전체' || faq.type === activeTab;
            const matchSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase());
            return matchTab && matchSearch;
        });
    }, [activeTab, searchQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>자주 묻는 질문 (FAQ)</h2>
                    <p className="text-secondary">사업 진행과 관련하여 자주 묻는 질문들을 모아두었습니다.</p>
                </div>
                <button className="btn btn-primary">
                    <MessageCircleQuestion size={18} />
                    관리자에게 질문하기
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
                    filteredFaq.map(faq => (
                        <div key={faq.id} className="card" onClick={() => toggle(faq.id)} style={{ cursor: 'pointer', padding: 'var(--spacing-4) var(--spacing-6)' }}>
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
                        </div>
                    ))
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--text-muted)' }}>
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};
