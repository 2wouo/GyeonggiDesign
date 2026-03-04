import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PdfViewer } from '../components/PdfViewer';
import { ArrowLeft } from 'lucide-react';
import type { ArchiveDocument } from './Archive';

export const ArchiveViewer = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [document, setDocument] = useState<ArchiveDocument | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/documents');
                if (response.ok) {
                    const docs: ArchiveDocument[] = await response.json();
                    const doc = docs.find(d => d.id === id);
                    if (doc) {
                        setDocument(doc);
                    } else {
                        navigate('/archive');
                    }
                } else {
                    console.error('Failed to fetch documents:', response.statusText);
                    navigate('/archive');
                }
            } catch (error) {
                console.error('Failed to fetch document:', error);
                navigate('/archive');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id, navigate]);

    if (loading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>Loading...</div>;
    }

    if (!document) {
        return null; // Will redirect via useEffect
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            backgroundColor: 'var(--bg-primary)',
            zIndex: 100 // Ensure it covers the layout
        }}>
            {/* Viewer Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: 'var(--spacing-3) var(--spacing-6)',
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
                gap: 'var(--spacing-4)'
            }}>
                <button
                    onClick={() => navigate('/archive')}
                    style={{
                        padding: '8px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
                    title="목록으로 돌아가기"
                >
                    <ArrowLeft size={18} />
                    <span>목록으로</span>
                </button>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                        {document.title}
                    </h1>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {document.year}년 발행
                    </span>
                </div>
            </div>

            {/* Main Viewer Area */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <PdfViewer file={`http://localhost:3001${document.url}`} />
            </div>
        </div>
    );
};
