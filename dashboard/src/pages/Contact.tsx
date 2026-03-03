import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        type: '디자인 지원', // default option
        title: '',
        content: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would normally plug into an email service or Supabase.
        // For now, just show a success message mock functionality.
        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ type: '디자인 지원', title: '', content: '', email: '' });
            }, 3000); // Reset after 3 seconds
        }, 500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>문의하기</h2>
                <p className="text-secondary">궁금하신 사항이나 도움이 필요하신 부분을 남겨주시면 담당자가 빠른 시일 내에 답변해 드립니다.</p>
            </div>

            <div className="card" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {isSubmitted ? (
                    <div style={{ padding: 'var(--spacing-12) var(--spacing-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-4)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--point-primary)' }}>
                            <CheckCircle2 size={64} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-2)' }}>문의가 정상적으로 접수되었습니다.</h3>
                            <p className="text-secondary">작성해주신 이메일로 담당자가 검토 후 빠른 시일 내에 회신드리겠습니다.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>

                        {/* Type Selection */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <label style={{ fontWeight: 600, display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                                문의 유형 <span style={{ color: 'var(--status-danger)' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                                {['디자인 지원', '일정 관련', '정산/서류', '기타 오류'].map((type) => (
                                    <label key={type} className="badge badge-outline" style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-2)',
                                        backgroundColor: formData.type === type ? 'var(--bg-tertiary)' : 'transparent',
                                        borderColor: formData.type === type ? 'var(--point-primary)' : 'var(--border-color)',
                                        color: formData.type === type ? 'var(--point-primary)' : 'var(--text-secondary)',
                                        transition: 'all 0.2s',
                                        padding: 'var(--spacing-2) var(--spacing-4)'
                                    }}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={formData.type === type}
                                            onChange={handleChange}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '50%',
                                            border: `2px solid ${formData.type === type ? 'var(--point-primary)' : 'var(--text-muted)'}`,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {formData.type === type && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--point-primary)' }}></div>}
                                        </div>
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <label style={{ fontWeight: 600 }}>답변 받을 이메일 <span style={{ color: 'var(--status-danger)' }}>*</span></label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Title */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <label style={{ fontWeight: 600 }}>문의 제목 <span style={{ color: 'var(--status-danger)' }}>*</span></label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="어떤 내용으로 문의하시나요?"
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                            <label style={{ fontWeight: 600 }}>문의 내용 <span style={{ color: 'var(--status-danger)' }}>*</span></label>
                            <textarea
                                name="content"
                                required
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="상세한 문의 내용을 입력해주세요. 발생한 문제의 요건이나 상황을 자세히 적어주시면 더 정확한 답변이 가능합니다."
                                style={{
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    minHeight: '200px',
                                    resize: 'vertical',
                                    lineHeight: '1.6'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'flex-start', padding: 'var(--spacing-4)', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                            <AlertCircle size={20} style={{ color: 'var(--point-primary)', flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                작성하신 내용은 담당자에게 메일로 자동 전송됩니다. 입력하신 이메일 주소로 회신이 가오니 오타가 없는지 다시 한번 확인해 주세요.
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-4)' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={20} /> 문의 보내기
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
