import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import DetailPage from './pages/DetailPage';
// 💡 [신규 추가] 새롭게 생성할 AI 맞춤형 추천 페이지 임포트
import AiRecommendPage from './pages/AiRecommendPage'; 

// src/App.jsx
function App() {
  return (
    /* 💡 이렇게 적어두면 로컬(dev)일 때는 알아서 공백으로, 
       깃허브 배포(deploy)일 때는 저장소 경로로 똑똑하게 작동합니다. */
      <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        {/* 💡 [신규 추가] AI 추천 컴포넌트를 브라우저 라우터 인프라에 등록 */}
        <Route path="/ai-recommend" element={<AiRecommendPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;