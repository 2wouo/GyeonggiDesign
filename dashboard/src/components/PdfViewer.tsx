import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Download, Columns, Square } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use local static worker file served from public directory
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfViewerProps {
    file: string | File | null;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ file }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    // options를 useMemo로 고정 - 매 렌더링마다 새 객체 생성 시 react-pdf가 문서 재로드 → 페이지 1 리셋 발생
    const pdfOptions = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }), []);
    const [scale, setScale] = useState<number>(1.0);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isDualPage, setIsDualPage] = useState<boolean>(false); // Default to single page

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const newPage = prevPageNumber + offset;
            // Ensure we don't go out of bounds
            if (newPage < 1) return 1;
            if (numPages && newPage > numPages) return numPages;
            return newPage;
        });
    };

    // 2면 보기: 1p는 단독, 2p부터 쌍(2+3, 4+5...)으로 표시
    // 이전: 현재 2~3p면 → 1p로, 그 외 -2
    // 다음: 현재 1p면 → 2p로, 그 외 +2
    const previousPage = () => {
        if (isDualPage) {
            if (pageNumber <= 3) setPageNumber(1);
            else changePage(-2);
        } else {
            changePage(-1);
        }
    };
    const nextPage = () => {
        if (isDualPage && pageNumber === 1) changePage(1);
        else changePage(isDualPage ? 2 : 1);
    };

    const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 3.0));
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.5));

    const toggleFullscreen = () => {
        const viewerElement = document.getElementById('pdf-viewer-container');
        if (!viewerElement) return;

        if (!document.fullscreenElement) {
            viewerElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const toggleDualPage = () => {
        setIsDualPage(!isDualPage);
        // 2면 보기 전환 시: 1p 제외하고 짝수 페이지(스프레드 시작)로 맞춤
        // 예) 3p → 2p, 5p → 4p (홀수이면서 1 초과인 경우)
        if (!isDualPage && pageNumber > 1 && pageNumber % 2 !== 0) {
            setPageNumber(pageNumber - 1);
        }
    };

    // Listen for fullscreen change events to update state
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
            if (document.fullscreenElement) {
                setScale(1.2); // Slightly larger in fullscreen
            } else {
                setScale(1.0);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (!file) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>선택된 문서가 없습니다.</p>
            </div>
        );
    }

    return (
        <div
            id="pdf-viewer-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: isFullscreen ? '100vh' : '100%',
                backgroundColor: isFullscreen ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                borderRadius: isFullscreen ? '0' : 'var(--radius-lg)',
                overflow: 'hidden',
                border: isFullscreen ? 'none' : '1px solid var(--border-color)'
            }}
        >
            {/* Viewer Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-3) var(--spacing-4)',
                backgroundColor: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border-color)',
                gap: 'var(--spacing-4)'
            }}>
                {/* Page Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <button
                        onClick={previousPage}
                        disabled={pageNumber <= 1}
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="이전 페이지"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minWidth: '80px', textAlign: 'center' }}>
                        {pageNumber} / {numPages || '--'}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="다음 페이지"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <button
                        onClick={zoomOut}
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="축소"
                    >
                        <ZoomOut size={18} />
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', minWidth: '50px', textAlign: 'center' }}>
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={zoomIn}
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="확대"
                    >
                        <ZoomIn size={18} />
                    </button>

                    {/* View Mode Toggle */}
                    <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
                    <button
                        onClick={toggleDualPage}
                        className="btn btn-outline"
                        style={{
                            padding: '6px',
                            minWidth: 'auto',
                            border: 'none',
                            backgroundColor: isDualPage ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                            color: isDualPage ? 'var(--point-primary)' : 'inherit'
                        }}
                        title={isDualPage ? "단일 페이지 보기" : "두 페이지 보기"}
                    >
                        {isDualPage ? <Square size={18} /> : <Columns size={18} />}
                    </button>
                </div>

                {/* Action Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <a
                        href={typeof file === 'string' ? file : URL.createObjectURL(file)}
                        download
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="다운로드"
                    >
                        <Download size={18} />
                    </a>
                    <button
                        onClick={toggleFullscreen}
                        className="btn btn-outline"
                        style={{ padding: '6px', minWidth: 'auto', border: 'none', backgroundColor: 'transparent' }}
                        title="전체 화면"
                    >
                        <Maximize size={18} />
                    </button>
                </div>
            </div>

            {/* Document Area Wrapper */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#1E1E1E' }}>

                {/* Scrollable Document Container */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 'var(--spacing-4)',
                }}>
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        options={pdfOptions}
                        loading={
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                                문서를 불러오는 중입니다...
                            </div>
                        }
                        error={
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--status-danger)' }}>
                                문서를 불러오는데 실패했습니다.
                            </div>
                        }
                    >
                        <div style={{
                            display: 'flex',
                            gap: isDualPage ? 'var(--spacing-2)' : '0',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={true}
                                className="pdf-page-wrapper shadow-lg"
                            />
                            {isDualPage && pageNumber > 1 && numPages && pageNumber < numPages && (
                                <Page
                                    pageNumber={pageNumber + 1}
                                    scale={scale}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={true}
                                    className="pdf-page-wrapper shadow-lg"
                                />
                            )}
                        </div>
                    </Document>
                </div>

                {/* Left Navigation Overlay */}
                <button
                    onClick={previousPage}
                    disabled={pageNumber <= 1}
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '10%',
                        minWidth: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingLeft: 'var(--spacing-4)',
                        background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                        color: 'white',
                        border: 'none',
                        cursor: pageNumber <= 1 ? 'default' : 'pointer',
                        opacity: pageNumber <= 1 ? 0 : 0.5,
                        transition: 'opacity 0.2s',
                        zIndex: 10
                    }}
                    onMouseEnter={e => { if (pageNumber > 1) e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={e => { if (pageNumber > 1) e.currentTarget.style.opacity = '0.5'; }}
                >
                    <ChevronLeft size={64} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                </button>

                {/* Right Navigation Overlay */}
                <button
                    onClick={nextPage}
                    disabled={pageNumber >= (numPages || 1)}
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '10%',
                        minWidth: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: 'var(--spacing-4)',
                        background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)',
                        color: 'white',
                        border: 'none',
                        cursor: pageNumber >= (numPages || 1) ? 'default' : 'pointer',
                        opacity: pageNumber >= (numPages || 1) ? 0 : 0.5,
                        transition: 'opacity 0.2s',
                        zIndex: 10
                    }}
                    onMouseEnter={e => { if (pageNumber < (numPages || 1)) e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={e => { if (pageNumber < (numPages || 1)) e.currentTarget.style.opacity = '0.5'; }}
                >
                    <ChevronRight size={64} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                </button>
            </div>
        </div>
    );
};
