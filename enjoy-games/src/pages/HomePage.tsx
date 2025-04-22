import { useNavigate } from 'react-router-dom';
import { GameProvider } from '../context/GameContext';
import './Homepage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGameSelect = (game: string) => {
    // 닉네임 입력 페이지로 이동 예정
    navigate(`/play?game=${game}`);
  };


  return (
      <div className="home-wrapper">
        <div className="home-box">
          <h1>🎮 Choose a Game</h1>
          <button onClick={() => handleGameSelect('RABBIT')}>MashRabbit Hunter</button>
          <br />
          <button onClick={() => handleGameSelect('TAP')}>Tap Game</button>
          <br />
          <button onClick={() => handleGameSelect('FLIP')}>Flip Game</button>
        </div>
      </div>
  );
};

export default HomePage;