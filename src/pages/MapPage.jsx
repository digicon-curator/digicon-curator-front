import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Marker } from 'pigeon-maps'; 
import { Menu, X, Home, Filter, ChevronRight } from 'lucide-react';
import { INITIAL_STORIES } from '../data';
import styles from './MapPage.module.css';

function MapPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filter, setFilter] = useState('전체');
  const [selectedPlace, setSelectedPlace] = useState(null);

  // 지도 중심좌표 및 줌 상태
  const [mapCenter, setMapCenter] = useState([36.3338, 127.4385]);
  const [mapZoom, setMapZoom] = useState(8);

  const categories = ['전체', ...new Set(INITIAL_STORIES.map(s => s.category))];
  const filteredPlaces = filter === '전체' 
    ? INITIAL_STORIES 
    : INITIAL_STORIES.filter(p => p.category === filter);

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    setIsSidebarOpen(true);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(11);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* --- 1. 지도 레이어 --- */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <Map 
          center={mapCenter} 
          zoom={mapZoom} 
          provider={(x, y, z) => `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`}
          onBoundsChanged={({ center, zoom }) => {
            setMapCenter(center);
            setMapZoom(zoom);
          }}
        >
          {filteredPlaces.map((place) => (
            <Marker 
              key={place.id}
              width={38}
              anchor={[place.lat, place.lng]}
              color={place.color}
              onClick={() => handleMarkerClick(place)}
            />
          ))}
        </Map>
      </div>

      {/* --- 2. 왼쪽 사이드바 (디자인 유실 100% 방어) --- */}
      <aside 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: isSidebarOpen ? '0' : '-320px', 
          zIndex: 10, 
          height: '100%',
          width: '320px',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 25px rgba(15, 23, 42, 0.15)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          
          {/* 상단 홈 및 닫기 버튼 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <button 
              onClick={() => navigate('/')} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Home size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} />
            </button>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>
            로컬 문화 탐색
          </h2>

          {/* 메인 스토리 요약 카드 영역 */}
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            {selectedPlace ? (
              <div 
                onClick={() => navigate(`/detail/${selectedPlace.id}`)}
                style={{ 
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  overflow: 'hidden' // 이미지가 카드 모서리 라운딩을 삐져나가지 않도록 고정
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* --- [추가] 사이드바 요약 카드 내 이미지 영역 --- */}
                <div style={{ width: '100%', height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                  <img 
                    src={selectedPlace.imageUrl} 
                    alt={selectedPlace.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', color: '#ffffff', backgroundColor: selectedPlace.color, fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {selectedPlace.category}
                  </span>
                </div>

                {/* 카드 하단 텍스트 내용 (상단 패딩만 깔끔하게 추가) */}
                <div style={{ padding: '16px 20px 20px 20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                    {selectedPlace.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 16px 0', lineHeight: '1.6' }}>
                    {selectedPlace.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'flex-end', justifyContent: 'flex-end', fontSize: '13px', fontWeight: '700', color: '#4f46e5', gap: '2px' }}>
                    상세보기 <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', paddingTop: '60px', lineHeight: '1.6', margin: 0 }}>
                지도의 색상 마커를 클릭하여<br/>로컬 이야기를 확인해보세요.
              </p>
            )}
          </div>

          {/* 하단 카테고리 필터 칩 */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginBottom: '14px', fontWeight: '600' }}>
              <Filter size={14} /> <span>카테고리 필터</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => {
                const isActive = filter === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: `1px solid ${isActive ? '#4f46e5' : '#cbd5e1'}`,
                      backgroundColor: isActive ? '#4f46e5' : '#ffffff',
                      color: isActive ? '#ffffff' : '#475569',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if(!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if(!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* --- 3. 플로팅 메뉴 버튼 --- */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            zIndex: 5,
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '12px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="메뉴 열기"
        >
          <Menu size={24} color="#0f172a" />
        </button>
      )}
    </div>
  );
}

export default MapPage;