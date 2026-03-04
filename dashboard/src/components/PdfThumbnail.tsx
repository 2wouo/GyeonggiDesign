import { useState, useMemo, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CONTAINER_HEIGHT = 280;

interface PdfThumbnailProps {
    url: string;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({ url }) => {
    const [failed, setFailed] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [renderWidth, setRenderWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const options = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }), []);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            setContainerWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // 페이지 비율을 읽어서 cover처럼 꽉 채울 width 계산
    const handlePageLoadSuccess = (page: any) => {
        const viewport = page.getViewport({ scale: 1 });
        const pageAspect = viewport.width / viewport.height;
        const containerAspect = containerWidth / CONTAINER_HEIGHT;

        if (pageAspect > containerAspect) {
            // 가로형 PDF: 높이 기준으로 맞추면 width가 containerWidth보다 커짐
            setRenderWidth(Math.ceil(CONTAINER_HEIGHT * pageAspect) + 1);
        } else {
            // 세로형 PDF: 너비 기준으로 맞추면 height가 CONTAINER_HEIGHT보다 커짐
            setRenderWidth(Math.ceil(containerWidth) + 1);
        }
    };

    if (failed) {
        return (
            <div style={{
                height: `${CONTAINER_HEIGHT}px`,
                backgroundColor: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'var(--text-muted)',
            }}>
                <FileText size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>PDF Document</span>
            </div>
        );
    }

    return (
        <div ref={containerRef} style={{
            height: `${CONTAINER_HEIGHT}px`,
            overflow: 'hidden',
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 0,
            fontSize: 0,
        }}>
            {containerWidth > 0 && (
                <Document
                    file={url}
                    options={options}
                    onLoadError={() => setFailed(true)}
                    loading={
                        <div style={{ height: `${CONTAINER_HEIGHT}px`, width: `${containerWidth}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 'normal' }}>
                            로딩 중...
                        </div>
                    }
                >
                    <Page
                        pageNumber={1}
                        width={renderWidth || Math.ceil(containerWidth) + 1}
                        onLoadSuccess={handlePageLoadSuccess}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                </Document>
            )}
        </div>
    );
};
