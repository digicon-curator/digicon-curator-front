import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import DetailPage from './pages/DetailPage'; // 1. 상세페이지 가져오기

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        {/* 2. 주소창 뒤에 어떤 ID 숫자가 붙어도 DetailPage 컴포넌트 하나가 전부 처리함 */}
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;