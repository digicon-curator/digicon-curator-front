import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight, Search, BookOpen, Sparkles } from 'lucide-react'; // 💡 Sparkles 아이콘 추가
import { INITIAL_STORIES } from '../data';

function Home() {
  const navigate = useNavigate();

  // 💡 백엔드 API로부터 받아온 동적 데이터를 관리할 상태 변수
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 검색 및 페이지네이션 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // ==========================================
  // 🔗 1. 백엔드 API fetch 통신 데이터 파이프라인 (기존 기능 보존)
  // ==========================================
  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/stories`);
        if (!response.ok) {
          throw new Error('네트워크 응답에 문제가 발생했습니다.');
        }
        const data = await response.json();

        const mappedData = data.map(story => ({
          ...story,
          desc: story.description, 
          imageUrl: story.image_url || "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500",
          color: story.category === '역사/건축' ? '#EF4444' : '#10B981'
        }));
        setStories(mappedData);
      } catch (error) {
        console.warn('API 호출 실패 - 로컬 데이터 백업 모드로 전환합니다:', error);
        setStories(INITIAL_STORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  // 검색어 입력 시 첫 페이지로 이동 (방어 로직)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 검색 필터링 처리
  const filteredStories = useMemo(() => {
    return stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stories, searchTerm]);

  // 현재 페이지 바인딩 데이터 계산
  const currentStories = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredStories.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredStories, currentPage]);

  const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: '"Pretendard", -apple-system, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 상단 타이틀 및 인트로 내비게이션 구역 */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: '700', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <BookOpen size={16} /> Local Culture Archive
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>대한민국 로컬 문화 지도</h1>
        </div>
        
        {/* 상단 플로팅 지도 이동 액션 버튼 */}
        <button 
          onClick={() => navigate('/map')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#0f172a', color: '#ffffff',
            border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.15)', transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
        >
          <MapPin size={16} /> 지도에서 보기
        </button>
      </header>

      {/* --- 💡 검색 엔진 및 AI 맞춤형 추천 통합 포털 바 구역 --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
          {/* 일반 통합 검색창 */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} size={20} />
            <input 
              type="text" 
              placeholder="찾고 싶은 지역, 장소, 키워드를 입력해 보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 48px', borderRadius: '14px', border: '1px solid #e2e8f0',
                fontSize: '16px', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', backgroundColor: '#ffffff', transition: 'all 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* 💡 [신규 추가] AI 맞춤형 상세검색 진입 버튼 */}
          <button
            onClick={() => navigate('/ai-recommend')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 28px',
              backgroundColor: '#8b5cf6', // 퍼플 테라피 AI 시그니처 컬러
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7c3aed';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#8b5cf6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={16} />
            <span>AI 맞춤형 추천</span>
          </button>
        </div>
      </div>

      {/* 메인 리스트 뷰포트 구역 */}
      <main>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
            데이터 아카이브를 불러오는 중입니다...
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gridGap: '24px', flexWrap: 'wrap' }}>
              {currentStories.length > 0 ? (
                currentStories.map(story => (
                  <div 
                    key={story.id}
                    onClick={() => navigate(`/detail/${story.id}`)}
                    style={{
                      width: 'calc(33.333% - 16px)', minWidth: '300px', backgroundColor: '#ffffff', borderRadius: '16px',
                      overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(15,23,42,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ height: '200px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                      <img src={story.imageUrl} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute', top: '16px', left: '16px', backgroundColor: story.color || '#6366f1',
                        color: '#ffffff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700'
                      }}>
                        {story.category}
                      </span>
                    </div>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>{story.title}</h3>
                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0, height: '66px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                        {story.desc}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ width: '100%', textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: '15px' }}>
                  입력하신 키워드와 일치하는 로컬 스토리가 존재하지 않습니다.
                </div>
              )}
            </div>

            {/* 슬라이더 컨트롤 컴포넌트 */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '50px' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{ 
                    padding: '10px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', 
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, display: 'flex', alignItems: 'center'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{ 
                    padding: '10px', borderRadius: '50%', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', 
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, display: 'flex', alignItems: 'center'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Home;