import { LayoutDashboard, Upload, Trash2, FileText, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ArchiveDocument } from './Archive';

export const Admin = () => {
    const [documents, setDocuments] = useState<ArchiveDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Form state
    const [title, setTitle] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file && !editingId) {
            alert('PDF 파일을 선택해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('title', title);
            formData.append('year', year);
            formData.append('description', description);
            if (file) {
                formData.append('pdfFile', file);
            }

            const url = editingId
                ? `http://localhost:3001/api/documents/${editingId}`
                : 'http://localhost:3001/api/documents';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData, // the browser automatically sets the Content-Type to multipart/form-data
            });

            if (response.ok) {
                alert(editingId ? '문서가 성공적으로 수정되었습니다.' : '성공적으로 업로드되었습니다.');
                // Reset form
                setTitle('');
                setYear(new Date().getFullYear().toString());
                setDescription('');
                setFile(null);
                setEditingId(null);
                const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // Refresh list
                fetchDocuments();
            } else {
                alert('업데이트에 실패했습니다. 서버 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (doc: ArchiveDocument) => {
        setEditingId(doc.id);
        setTitle(doc.title);
        setYear(doc.year.toString());
        setDescription(doc.description || '');
        setFile(null); // Optional to replace file

        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setYear(new Date().getFullYear().toString());
        setDescription('');
        setFile(null);
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleDelete = async (id: string, docTitle: string) => {
        if (window.confirm(`'${docTitle}' 문서를 정말 삭제하시겠습니까?`)) {
            try {
                const response = await fetch(`http://localhost:3001/api/documents/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setDocuments(prev => prev.filter(doc => doc.id !== id));
                } else {
                    alert('삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>수탁기관 관리자 패널</h2>
                <p className="text-secondary">공지사항, 일정, FAQ 등의 웹사이트 콘텐츠를 관리하는 공간입니다.</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
                {/* Upload Form Area */}
                <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                    <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <Upload size={20} className="text-point" />
                            {editingId ? '문서 정보 수정' : '새로운 지난 년도 작업물 (Archive) 문서 추가'}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                            {editingId ? '기존 문서의 정보를 수정합니다. 새로운 PDF를 선택하지 않으면 기존 파일이 유지됩니다.' : 'PDF 파일을 로컬 서버에 업로드하여 홈페이지에 즉시 노출할 수 있습니다.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>문서 제목 <span style={{ color: 'var(--status-danger)' }}>*</span></label>
                            <input
                                type="text"
                                className="input"
                                placeholder="예: 2024년 공공디자인나눔 최종 결과보고서"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>해당 연도 <span style={{ color: 'var(--status-danger)' }}>*</span></label>
                            <input
                                type="number"
                                className="input"
                                placeholder="2024"
                                required
                                value={year}
                                onChange={e => setYear(e.target.value)}
                                style={{ width: '100px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>간략 설명 (선택)</label>
                            <textarea
                                className="input"
                                placeholder="문서에 대한 설명을 간단하게 적어주세요."
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>PDF 첨부파일 {!editingId && <span style={{ color: 'var(--status-danger)' }}>*</span>}</label>
                            <div style={{
                                border: '2px dashed var(--border-color)',
                                padding: 'var(--spacing-6)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                backgroundColor: 'var(--bg-tertiary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--point-primary)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                onClick={() => document.getElementById('pdf-upload')?.click()}
                            >
                                <input
                                    id="pdf-upload"
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                {file ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={32} className="text-point" />
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{file.name}</span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setFile(null); const input = document.getElementById('pdf-upload') as HTMLInputElement; if (input) input.value = ''; }}
                                            style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--status-danger)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            다른 파일 선택하기
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                                        <Plus size={32} />
                                        <span style={{ fontWeight: 500 }}>클릭하여 파일 {editingId ? '변경' : '업로드'}</span>
                                        <span style={{ fontSize: '0.875rem' }}>PDF 파일만 업로드 가능합니다 (최대 50MB)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-4)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="btn btn-outline"
                                    style={{ padding: '10px 16px', fontSize: '1rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}
                                >
                                    취소
                                </button>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{ padding: '10px 24px', fontSize: '1rem', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? '저장 중...' : (editingId ? '수정 내용 저장' : '문서 등록하기')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Area */}
                <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                    <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                <FileText size={20} className="text-point" />
                                현재 배포된 지난 년도 작업물 목록
                            </h3>
                            <span className="badge badge-outline">{documents.length}개</span>
                        </div>

                        <div style={{ flex: '1', overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                                    데이터 불러오는 중...
                                </div>
                            ) : documents.length === 0 ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)', color: 'var(--text-secondary)' }}>
                                    등록된 문서가 없습니다.
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                    <thead style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                                        <tr>
                                            <th style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-secondary)' }}>연도</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-secondary)', width: '50%' }}>제목</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-secondary)' }}>파일명</th>
                                            <th style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--text-secondary)', textAlign: 'center' }}>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documents.map(doc => (
                                            <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '12px 16px' }}>{doc.year}</td>
                                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{doc.title}</td>
                                                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                                                    <a href={`http://localhost:3001${doc.url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--point-primary)', textDecoration: 'none' }}>
                                                        {doc.url.split('/').pop()?.substring(0, 15)}...
                                                    </a>
                                                </td>
                                                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                    <button
                                                        onClick={() => handleEdit(doc)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px', color: 'var(--text-primary)', border: '1px solid var(--border-color)', backgroundColor: 'transparent', marginRight: '4px' }}
                                                        title="문서 수정"
                                                    >
                                                        <FileText size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doc.id, doc.title)}
                                                        className="btn btn-outline"
                                                        style={{ padding: '6px', color: 'var(--status-danger)', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}
                                                        title="문서 삭제"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)', marginTop: 'var(--spacing-4)', border: '1px dashed var(--border-color)' }}>
                <LayoutDashboard size={32} className="text-muted" style={{ marginBottom: 'var(--spacing-2)', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-1)' }}>메인 대시보드 구조 연결 대기중</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>향후 Supabase DB 연결을 통해 더 완전한 관리자 제어를 지원하도록 시스템을 전환할 예정입니다.</p>
            </div>
        </div>
    );
};
