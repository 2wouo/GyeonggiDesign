import React from 'react';
import { Search, Target, PenTool, CheckCircle } from 'lucide-react';

export const Process = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            <div>
                <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>환경디자인 프로세스</h2>
                <p className="text-secondary">서비스디자인 방법론 (Double Diamond) 기반의 추진 절차입니다.</p>
            </div>

            <div className="card" style={{ padding: 'var(--spacing-8)' }}>
                {/* SVG Double Diamond Graphic */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 'var(--spacing-12)',
                    width: '100%'
                }}>
                    <svg viewBox="0 0 800 240" style={{ width: '100%', maxWidth: '800px', height: 'auto', overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="15%" stopColor="rgba(255,255,255,0.3)" />
                                <stop offset="85%" stopColor="rgba(255,255,255,0.3)" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        {/* Background Line */}
                        <rect x="0" y="119" width="800" height="2" fill="url(#lineGrad)" />

                        {/* First Diamond */}
                        <path d="M 280 20 L 400 120 L 280 220 L 160 120 Z"
                            fill="rgba(37, 99, 235, 0.05)"
                            stroke="#2563eb"
                            strokeWidth="2" />

                        <text x="220" y="115" fill="#2563eb" fontWeight="800" fontSize="18" textAnchor="middle">이해/발견</text>
                        <text x="220" y="138" fill="var(--text-secondary)" fontSize="14" textAnchor="middle">Discover</text>

                        <text x="340" y="115" fill="#2563eb" fontWeight="800" fontSize="18" textAnchor="middle">정의</text>
                        <text x="340" y="138" fill="var(--text-secondary)" fontSize="14" textAnchor="middle">Define</text>

                        {/* Second Diamond */}
                        <path d="M 520 20 L 640 120 L 520 220 L 400 120 Z"
                            fill="rgba(151, 37, 235, 0.05)"
                            stroke="#9725eb"
                            strokeWidth="2" />

                        <text x="460" y="115" fill="#9725eb" fontWeight="800" fontSize="18" textAnchor="middle">개발</text>
                        <text x="460" y="138" fill="var(--text-secondary)" fontSize="14" textAnchor="middle">Develop</text>

                        <text x="580" y="115" fill="#9725eb" fontWeight="800" fontSize="18" textAnchor="middle">전달</text>
                        <text x="580" y="138" fill="var(--text-secondary)" fontSize="14" textAnchor="middle">Deliver</text>

                        {/* Center Node */}
                        <circle cx="400" cy="120" r="6" fill="var(--bg-secondary)" stroke="#4b5563" strokeWidth="3" />
                    </svg>
                </div>

                {/* Process Steps */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-6)' }}>

                    {/* Step 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--point-primary)' }}>
                                <Search size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>1. 이해/발견</h3>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--point-primary)', fontWeight: 600 }}>Discover</div>
                        <ul className="text-secondary" style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                            <li>이용자 관찰 및 동선 분석을 통한 정보 혼선 지점 도출</li>
                            <li>고령자·보호자·운영자 인터뷰로 반복 문의 유형 파악</li>
                            <li>기존 안내체계의 가독성·위계·배치 현황 점검</li>
                        </ul>
                    </div>

                    {/* Step 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--point-primary)' }}>
                                <Target size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>2. 정의</h3>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--point-primary)', fontWeight: 600 }}>Define</div>
                        <ul className="text-secondary" style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                            <li>핵심 문제 유형화 및 우선 개선 과제 설정</li>
                            <li>안내정보 위계 재정립(핵심-보조-세부)</li>
                            <li>가독성·표현 기준 수립(글자·대비·용어 통일 등)</li>
                        </ul>
                    </div>

                    {/* Step 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(151, 37, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--point-secondary)' }}>
                                <PenTool size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>3. 개발</h3>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--point-secondary)', fontWeight: 600 }}>Develop</div>
                        <ul className="text-secondary" style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                            <li>주요 거점 중심 안내체계 재설계</li>
                            <li>이동 전환 구간 정보 연계 보완</li>
                            <li>시안 제작 및 이해도 점검 후 수정</li>
                        </ul>
                    </div>

                    {/* Step 4 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(151, 37, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--point-secondary)' }}>
                                <CheckCircle size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>4. 전달</h3>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--point-secondary)', fontWeight: 600 }}>Deliver</div>
                        <ul className="text-secondary" style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                            <li>최종 디자인 적용 및 설치 지원</li>
                            <li>유지·관리 기준 정리</li>
                            <li>개선 효과 점검 및 피드백 반영</li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};
