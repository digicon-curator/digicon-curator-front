import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { INITIAL_STORIES } from '../data';
import styles from './AiRecommendPage.module.css';

// 질문 선택지 데이터베이스
const OPTIONS = {
  age: ['20대', '30대', '40대', '50대 이상'],
  vibe: ['고즈넉한', '힙하고 트렌디한', '레트로/아날로그', '활기찬'],
  purpose: ['힐링/휴식', '역사 탐방', '문화/예술 감상', '인생샷/데이트'],
  interest: ['맛집/카페', '성곽/건축', '골목길 산책', '인문학/스토리']
};

function AiRecommendPage() {
  const navigate = useNavigate();

  // 1. 다중 선택 상태 관리 (각 카테고리별로 배열 형태로 저장)
  const [selections, setSelections] = useState({
    age: [],
    vibe: [],
    purpose: [],
    interest: []
  });

  // 2. AI 분석 로딩 상태 및 결과물 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState(null);

  // 칩(Chip) 클릭 시 다중 선택 토글 함수
  const toggleSelection = (category, value) => {
    setSelections(prev => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        // 이미 선택된 항목이면 제거
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        // 선택되지 않은 항목이면 추가
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  // AI 추천받기 실행 함수 (실제 API 연동 + 실패 시 시뮬레이션 폴백 적용)
  const handleRecommend = async () => {
    // 1. 유효성 검사: 최소 1개 이상 선택했는지 확인
    const totalSelected = Object.values(selections).flat().length;
    if (totalSelected === 0) {
      alert("최소 한 개 이상의 취향을 선택해 주세요!");
      return;
    }

    setIsAnalyzing(true);
    setRecommendedPlaces(null);

    try {
      // 2. [진짜 AI 연동 시도] 백엔드 API로 사용자의 선택 데이터를 전송합니다.
      // 주의: 'http://localhost:8000/api/ai-recommend' 부분은 나중에 실제 백엔드 주소로 바꿔야 합니다.
      const response = await fetch('http://localhost:8000/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 사용자가 누른 칩 데이터를 JSON 형태로 묶어서 서버로 보냅니다.
        body: JSON.stringify({ preferences: selections }), 
      });

      // 서버가 404, 500 에러 등을 뱉으면 강제로 에러를 발생시켜 catch 블록으로 보냅니다.
      if (!response.ok) {
        throw new Error('AI 서버 응답 오류 또는 연결 실패');
      }

      // 3. AI 서버가 정상적으로 추천 결과를 보내주면 화면에 뿌려줍니다.
      const aiData = await response.json();
      setRecommendedPlaces(aiData.recommendations);
      setIsAnalyzing(false);

    } catch (error) {
      // 4. [폴백 모드] 서버가 꺼져있거나 에러가 나면 콘솔에 로그만 띄우고 시뮬레이션을 실행합니다.
      console.warn('AI 서버와 연결할 수 없습니다. 시뮬레이션 모드로 결과를 출력합니다:', error);

      // 자연스러운 로딩 연출을 위해 1.5초 딜레이를 줍니다.
      setTimeout(() => {
        const shuffled = [...INITIAL_STORIES].sort(() => 0.5 - Math.random());
        
        const selectedCards = shuffled.slice(0, 4).map(item => ({
          ...item,
          matchRate: Math.floor(Math.random() * 8) + 92 // 92% ~ 99% 랜덤 부여
        }));
        
        setRecommendedPlaces(selectedCards.sort((a, b) => b.matchRate - a.matchRate));
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* 상단 네비게이션 */}
      <header className={styles.header}>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>메인 홈으로 돌아가기</span>
        </button>
        <div className={styles.titleBox}>
          <h1><Sparkles color="#a855f7" size={32} /> AI 맞춤형 로컬 여행 추천</h1>
          <p>몇 가지 취향만 알려주시면, 숨겨진 완벽한 로컬 여행지를 찾아드릴게요.</p>
        </div>
      </header>

      {/* --- 1. 취향 입력 폼 섹션 --- */}
      <section className={styles.formSection}>
        
        {/* 연령대 선택 */}
        <div className={styles.questionGroup}>
          <div className={styles.questionTitle}>Q1. 어떤 연령대의 여행인가요?</div>
          <div className={styles.chipContainer}>
            {OPTIONS.age.map(item => (
              <button 
                key={item}
                className={`${styles.chip} ${selections.age.includes(item) ? styles.selected : ''}`}
                onClick={() => toggleSelection('age', item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 선호 분위기 선택 */}
        <div className={styles.questionGroup}>
          <div className={styles.questionTitle}>Q2. 어떤 분위기를 선호하시나요? (다중 선택 가능)</div>
          <div className={styles.chipContainer}>
            {OPTIONS.vibe.map(item => (
              <button 
                key={item}
                className={`${styles.chip} ${selections.vibe.includes(item) ? styles.selected : ''}`}
                onClick={() => toggleSelection('vibe', item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 여행 목적 선택 */}
        <div className={styles.questionGroup}>
          <div className={styles.questionTitle}>Q3. 이번 여행의 목적은 무엇인가요?</div>
          <div className={styles.chipContainer}>
            {OPTIONS.purpose.map(item => (
              <button 
                key={item}
                className={`${styles.chip} ${selections.purpose.includes(item) ? styles.selected : ''}`}
                onClick={() => toggleSelection('purpose', item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 관심사 선택 */}
        <div className={styles.questionGroup}>
          <div className={styles.questionTitle}>Q4. 평소 관심 있는 키워드를 골라주세요.</div>
          <div className={styles.chipContainer}>
            {OPTIONS.interest.map(item => (
              <button 
                key={item}
                className={`${styles.chip} ${selections.interest.includes(item) ? styles.selected : ''}`}
                onClick={() => toggleSelection('interest', item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* --- 2. 액션 버튼 --- */}
      <button 
        className={styles.submitBtn} 
        onClick={handleRecommend}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <BrainCircuit size={24} className={styles.spinIcon} />
            AI가 빅데이터를 분석하여 코스를 짜는 중입니다...
          </>
        ) : (
          <>
            <Sparkles size={24} />
            내 취향 기반 AI 로컬 코스 추천받기
          </>
        )}
      </button>

      {/* --- 3. 로딩 및 결과 렌더링 섹션 --- */}
      {isAnalyzing && (
        <div className={styles.loadingBox}>
          <BrainCircuit size={64} color="#a855f7" />
          <h3 style={{ marginTop: '16px', color: '#7e22ce' }}>알고리즘 매칭 중...</h3>
        </div>
      )}

      {recommendedPlaces && !isAnalyzing && (
        <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
          <h2 className={styles.resultHeader}>🎉 고객님을 위한 AI 추천 로컬 명소 4곳</h2>
          
          <div className={styles.cardGrid}>
            {recommendedPlaces.map((place) => (
              <article 
                key={place.id} 
                className={styles.resultCard}
                onClick={() => navigate(`/detail/${place.id}`)}
              >
                {/* 💡 AI 매칭률 뱃지 */}
                <div className={styles.matchBadge}>
                  <CheckCircle2 size={14} /> 매칭률 {place.matchRate}%
                </div>
                
                <img src={place.imageUrl} alt={place.title} className={styles.cardImg} />
                
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{place.title}</h3>
                  <p className={styles.cardDesc}>{place.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AiRecommendPage;