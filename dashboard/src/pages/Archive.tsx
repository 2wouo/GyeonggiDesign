import { useState, useEffect } from 'react';
import { PdfThumbnail } from '../components/PdfThumbnail';

// Define the shape of our archive documents
export interface ArchiveDocument {
    id: string;
    title: string;
    year: number;
    description: string;
    url: string;
    thumbnailUrl?: string;
}

export const Archive = () => {
    const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/documents');
                if (response.ok) {
                    const data = await response.json();
                    setDocuments(data);
                }
            } catch (error) {
                console.error('Failed to fetch documents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>
                        지난 년도 작업물 (Archive)
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        과거 공공디자인나눔 사업의 결과물과 주요 백서를 열람하실 수 있습니다.
                    </p>
                </div>
                {/* Optional filters can go here */}
            </div>

            {/* Main Content Layout - Grid of Documents */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--text-secondary)' }}>
                    문서 목록을 불러오는 중입니다...
                </div>
            ) : documents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-12)', color: 'var(--text-secondary)' }}>
                    등록된 문서가 없습니다.
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--spacing-6)'
                }}>
                    {documents.map((doc) => (
                        <a
                            key={doc.id}
                            href={`/archive/${doc.id}`}
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textDecoration: 'none',
                                transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--glow-primary)';
                                e.currentTarget.style.borderColor = 'var(--point-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            {/* PDF 표지 썸네일 */}
                            <PdfThumbnail url={`http://localhost:3001${doc.url}`} />

                            {/* Details */}
                            <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: 'var(--point-primary)',
                                        background: 'rgba(74, 222, 128, 0.1)',
                                        padding: '2px 8px',
                                        borderRadius: '12px'
                                    }}>
                                        {doc.year}
                                    </span>
                                </div>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    margin: 0,
                                    lineHeight: 1.4
                                }}>
                                    {doc.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {doc.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
