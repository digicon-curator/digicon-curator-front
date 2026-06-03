import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 메뉴(Menu), 닫기(X), 지도(Map), 검색(Search), 화살표(ChevronRight) 아이콘을 가져옵니다.
import { Menu, X, Map, Search, ChevronRight } from 'lucide-react'; 
import { INITIAL_STORIES } from '../data';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  
  // 기능 유지: 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  
  // [추가] 사이드바 온오프 상태 관리 (기본값: 닫힘 false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 기능 유지: 검색어와 매칭되는 스토리 필터링 로직
  const filteredStories = INITIAL_STORIES.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 기능 유지: 카드 클릭 시 상세 페이지 이동
  const handleCardClick = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.container}>
      
      {/* --- [추가] 메인페이지 왼쪽 사이드바 영역 --- */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarLogo}>로컬 메뉴</h3>
          <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)} title="메뉴 닫기">
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.sidebarContent}>
          <p className={styles.sidebarWelcome}>로컬 문화 지도에 오신 것을 환영합니다.</p>
          
          {/* [추가/이동] 지도페이지 이동 버튼을 사이드바 내부로 배치 */}
          <button className={styles.mapNavBtn} onClick={() => navigate('/map')}>
            <Map size={18} />
            <span>문화 지도 펼치기</span>
          </button>
        </div>
      </aside>

      {/* --- [추가] 사이드바가 열렸을 때 배경을 어둡게 해주는 레이어 --- */}
      {isSidebarOpen && <div className={styles.overlay} onClick={() => setIsSidebarOpen(false)} />}

      {/* 상단 헤더 영역 (검색창 포함) */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* [추가] 왼쪽 구석에 배치된 사이드바 온(열기) 버튼 */}
          <button className={styles.menuToggleBtn} onClick={() => setIsSidebarOpen(true)} title="메뉴 열기">
            <Menu size={22} />
          </button>
        </div>
        
        <div className={styles.searchSection}>
          <h2 className={styles.mainTitle}>어떤 로컬 이야기를 찾으시나요?</h2>
          <div className={styles.searchBarWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="지역명, 장소, 분위기를 검색해보세요..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 (기능 유지) */}
      <main className={styles.mainContent}>
        <div className={styles.sectionHeader}>
          <h3>전체 스토리 ({filteredStories.length}개)</h3>
        </div>
        
        {/* 스토리 카드 격자 목록 (이미지 노출 기능 유지) */}
        <div className={styles.cardGrid}>
          {filteredStories.length > 0 ? (
            filteredStories.map((story) => (
              <article 
                key={story.id} 
                className={styles.storyCard}
                onClick={() => handleCardClick(story.id)}
              >
                {/* 카드 상단 이미지 영역 */}
                <div className={styles.cardImageWrapper}>
                  <img 
                    src={story.imageUrl} 
                    alt={story.title} 
                    className={styles.cardImage} 
                  />
                  <span className={styles.cardCategory} style={{ backgroundColor: story.color }}>
                    {story.category}
                  </span>
                </div>

                {/* 카드 하단 텍스트 영역 */}
                <div className={styles.cardContent}>
                  <h4 className={styles.cardTitle}>{story.title}</h4>
                  <p className={styles.cardDesc}>{story.desc}</p>
                  <div className={styles.cardFooter}>
                    <span style={{ color: story.color }}>이야기 보기</span>
                    <ChevronRight size={14} color={story.color} />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className={styles.noResult}>
              <p>‘{searchQuery}’와(과) 일치하는 로컬 스토리가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;