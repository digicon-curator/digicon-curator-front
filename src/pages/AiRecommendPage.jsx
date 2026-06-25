import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { INITIAL_STORIES } from '../data';
import styles from './AiRecommendPage.module.css';

const OPTIONS = {
  age: ['20대', '30대', '40대', '50대 이상'],
  vibe: ['고즈넉한', '힙하고 트렌디한', '레트로/아날로그', '활기찬'],
  purpose: ['힐링/휴식', '역사 탐방', '문화/예술 감상', '인생샷/데이트'],
  interest: ['맛집/카페', '성곽/건축', '골목길 산책', '인문학/스토리']
};

function AiRecommendPage() {
  const navigate = useNavigate();

  const [selections, setSelections] = useState({
    age: [],
    vibe: [],
    purpose: [],
    interest: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedPlaces, setRecommendedPlaces] = useState(null);

  const toggleSelection = (category, value) => {
    setSelections(prev => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  const handleRecommend = async () => {
    const totalSelected = Object.values(selections).flat().length;
    if (totalSelected === 0) {
      alert("최소 한 개 이상의 취향을 선택해 주세요!");
      return;
    }

    setIsAnalyzing(true);
    setRecommendedPlaces(null);

    try {
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: selections.age.join(', ') || '전 연령대',
          mood: selections.vibe.join(', ') || '전반적',
          purpose: selections.purpose.join(', ') || '여행',
          interest: selections.interest.join(', ') || '문화',
        }),
      });

      if (!response.ok) {
        throw new Error('AI 서버 응답 오류');
      }

      const aiData = await response.json();

      setRecommendedPlaces([{
        id: aiData.id,
        title: aiData.title,
        desc: aiData.description,
        category: aiData.category,
        imageUrl: aiData.imageUrl,
        color: aiData.color,
        region: aiData.region,
        matchRate: 95
      }]);

      setIsAnalyzing(false);

    } catch (error) {
      console.warn('AI 서버 연결 실패 - 시뮬레이션 모드:', error);

      setTimeout(() => {
        const shuffled = [...INITIAL_STORIES].sort(() => 0.5 - Math.random());
        const selectedCards = shuffled.slice(0, 4).map(item => ({
          ...item,
          matchRate: Math.floor(Math.random() * 8) + 92
        }));
        setRecommendedPlaces(selectedCards.sort((a, b) => b.matchRate - a.matchRate));
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  return (
      <div className={styles.container}>

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

        <section className={styles.formSection}>

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

        {isAnalyzing && (
            <div className={styles.loadingBox}>
              <BrainCircuit size={64} color="#a855f7" />
              <h3 style={{ marginTop: '16px', color: '#7e22ce' }}>알고리즘 매칭 중...</h3>
            </div>
        )}

        {recommendedPlaces && !isAnalyzing && (
            <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
              <h2 className={styles.resultHeader}>🎉 고객님을 위한 AI 추천 로컬 명소</h2>

              <div className={styles.cardGrid}>
                {recommendedPlaces.map((place) => (
                    <article
                        key={place.id}
                        className={styles.resultCard}
                        onClick={() => navigate(`/detail/${place.id}`)}
                    >
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