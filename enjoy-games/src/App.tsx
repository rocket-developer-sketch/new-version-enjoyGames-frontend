import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NicknameInputPage from './pages/NicknameInputPage';
import GamePage from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<NicknameInputPage />} />
        <Route path="/game/:gameType" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
