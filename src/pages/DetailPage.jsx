import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, MapPin, Calendar, Bookmark, Clock } from 'lucide-react';
import { INITIAL_STORIES } from '../data';
import styles from './DetailPage.module.css';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ID와 일치하는 데이터 조회
  const story = INITIAL_STORIES.find(item => item.id === parseInt(id));

  if (!story) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>존재하지 않는 스토리입니다.</h2>
        <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 20px', cursor: 'pointer' }}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* --- 1. 상단 내비게이션 바 --- */}
      <header className={styles.header}>
        <div className={styles.navGroup}>
          <button className={styles.navBtn} onClick={() => navigate(-1)} title="이전 페이지로">
            <ArrowLeft size={18} />
            <span>뒤로가기</span>
          </button>
          {/* [추가] 뒤로가기 옆 홈 버튼 */}
          <button className={styles.navBtn} onClick={() => navigate('/')} title="메인 홈으로">
            <Home size={18} />
            <span>홈</span>
          </button>
        </div>
        <span className={styles.topCategory} style={{ borderColor: story.color, color: story.color }}>
          {story.category}
        </span>
      </header>

      <main className={styles.mainWrapper}>
        
        {/* --- 2. 상단 상하 분할 / 좌우 레이아웃 영역 --- */}
        <section className={styles.introSection}>
          {/* 왼쪽: 여행지 이미지 */}
          <div className={styles.imageBox}>
            <img src={story.imageUrl} alt={story.title} className={styles.mainImage} />
          </div>
          
          {/* 오른쪽: 여행지 설명 */}
          <div className={styles.infoBox}>
            <h1 className={styles.title}>{story.title}</h1>
            <p className={styles.desc}>{story.desc}</p>
            
            <div className={styles.metaList}>
              <div className={styles.metaItem}>
                <MapPin size={16} color={story.color} />
                <span>위치 정보: 경도 {story.lng} / 위도 {story.lat}</span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} color="#64748b" />
                <span>테마 분류: {story.category} 공간 보존 조사</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. 하단 서사 중심 세로형 타임라인 영역 --- */}
        <section className={styles.timelineSection}>
          <div className={styles.timelineHeader}>
            <Clock size={20} color={story.color} />
            <h2>시간의 기록 (역사 서사)</h2>
          </div>
          
          <div className={styles.timelineContainer}>
            {story.timeline && story.timeline.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                {/* 왼쪽 연도 표시 기둥 */}
                <div className={styles.timelineBadgeColumn}>
                  <span className={styles.timeYear} style={{ backgroundColor: story.color }}>
                    {item.year}
                  </span>
                  <div className={styles.timelineLine} />
                </div>
                
                {/* 오른쪽 내용 상자 */}
                <div className={styles.timelineContentCard}>
                  <h4 className={styles.timelineCardTitle}>{item.title}</h4>
                  <p className={styles.timelineCardText}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. 가장 하단 지도 이동 확인 버튼 --- */}
        <footer className={styles.footerArea}>
          <button className={styles.mapActionBtn} onClick={() => navigate('/map')}>
            <Bookmark size={18} />
            <span>지도에서 위치 확인하기</span>
          </button>
        </footer>

      </main>
    </div>
  );
}

export default DetailPage;