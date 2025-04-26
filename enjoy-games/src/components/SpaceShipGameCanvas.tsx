import { useEffect, useRef, useState } from 'react';
import { pythagoras } from '../game/calculate';
import { createGradient } from '../game/style';

interface Ball {
  mx: number;
  my: number;
}

interface Enemy {
  x: number;
  y: number;
}

interface SpaceShipGameCanvasProps {
  onGameOver: (score: number) => void;
  timeLeft: number;
  setScore: (score: number) => void;
}

const canvasWidth = 600;
const canvasHeight = 800;

const SpaceShipGameCanvas = ({ onGameOver, timeLeft, setScore }: SpaceShipGameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bg1 = useRef(new Image());
  const bg2 = useRef(new Image());
  const shipImages = useRef<HTMLImageElement[]>([]);
  const enemyShipImages = useRef<HTMLImageElement[]>([]);
  const missileImg = useRef(new Image());

  const bg1Y = useRef(0);
  const bg2Y = useRef(-canvasHeight);
  const counter = useRef(0);

  const shipPos = useRef({ x: 150, y: 650 });
  const missiles = useRef<Ball[]>([]);
  const enemies = useRef<Enemy[]>([]);

  const scoreRef = useRef(0);
  const triesRef = useRef(3);
  const animationId = useRef<number | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const shipImgs = [new Image(), new Image(), new Image(), new Image()];
    const enemyImgs = [new Image(), new Image(), new Image(), new Image()];

    const images = [bg1.current, bg2.current, missileImg.current, ...shipImgs, ...enemyImgs];
    let loaded = 0;

    images.forEach(img => {
      img.onload = () => {
        loaded++;
        if (loaded === images.length) setAssetsLoaded(true);
      };
    });

    bg1.current.src = "/images/spaceshipgame/space.jpg";
    bg2.current.src = "/images/spaceshipgame/space.jpg";

    shipImgs[0].src = "/images/spaceshipgame/gunship4.png";
    shipImgs[1].src = "/images/spaceshipgame/gunship5.png";
    shipImgs[2].src = "/images/spaceshipgame/gunship6.png";
    shipImgs[3].src = "/images/spaceshipgame/gunship7.png";
    shipImages.current = shipImgs;

    enemyImgs[0].src = "/images/spaceshipgame/gunship0.png";
    enemyImgs[1].src = "/images/spaceshipgame/gunship1.png";
    enemyImgs[2].src = "/images/spaceshipgame/gunship2.png";
    enemyImgs[3].src = "/images/spaceshipgame/gunship3.png";
    enemyShipImages.current = enemyImgs;

    missileImg.current.src = "/images/spaceshipgame/missile1.png";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const moveShip = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      shipPos.current.x = e.clientX - rect.left;
      shipPos.current.y = e.clientY - rect.top;
    };

    const fireMissile = () => {
      missiles.current.push({ mx: shipPos.current.x, my: shipPos.current.y });
    };

    canvas.addEventListener('mousemove', moveShip);
    canvas.addEventListener('mousedown', fireMissile);

    return () => {
      canvas.removeEventListener('mousemove', moveShip);
      canvas.removeEventListener('mousedown', fireMissile);
    };
  }, []);

  useEffect(() => {
    if (!assetsLoaded) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const drawScreen = () => {
      if (triesRef.current <= 0 || timeLeft === 0) {
        if (animationId.current) cancelAnimationFrame(animationId.current);
        onGameOver(scoreRef.current);
        return;
      }

      counter.current++;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background
      bg1Y.current += 2;
      bg2Y.current += 2;

      if (bg1Y.current >= canvasHeight) bg1Y.current = -canvasHeight;
      if (bg2Y.current >= canvasHeight) bg2Y.current = -canvasHeight;

      ctx.drawImage(bg1.current, 0, bg1Y.current, canvasWidth, canvasHeight);
      ctx.drawImage(bg2.current, 0, bg2Y.current, canvasWidth, canvasHeight);

      // Missiles
      missiles.current.forEach(missile => {
        missile.my -= 10;
        ctx.drawImage(missileImg.current, missile.mx - 2.5, missile.my, 5, 20);
      });
      missiles.current = missiles.current.filter(m => m.my > -50);

      // Player Ship
      const shipImage = shipImages.current[counter.current % 4];
      ctx.drawImage(shipImage, shipPos.current.x - 25, shipPos.current.y - 25, 50, 50);

      // Enemies
      if (counter.current % 40 === 0) {
        enemies.current.push({ x: Math.floor(Math.random() * 550), y: 10 });
      }

      enemies.current.forEach(enemy => {
        enemy.y += 3;
        const enemyImg = enemyShipImages.current[counter.current % 4];
        ctx.drawImage(enemyImg, enemy.x - 25, enemy.y - 25, 50, 50);
      });
      enemies.current = enemies.current.filter(e => e.y <= canvasHeight + 50);

      // Collisions
      checkCollisions();

      // Score and tries
      ctx.font = '35px sans-serif';
      createGradient(ctx, canvasRef.current!);
      ctx.fillText(`Tries: ${triesRef.current}`, 300, 50);

      animationId.current = requestAnimationFrame(drawScreen);
    };

    animationId.current = requestAnimationFrame(drawScreen);

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [assetsLoaded, timeLeft]);

  const checkCollisions = () => {
    for (const enemy of enemies.current) {
      const d = pythagoras(shipPos.current.x, shipPos.current.y, enemy.x, enemy.y);
      if (d < 40 && triesRef.current > 0) {
        triesRef.current--;
        enemy.x = -300;
      }

      for (const missile of missiles.current) {
        const distance = pythagoras(missile.mx, missile.my, enemy.x, enemy.y);
        if (distance < 40) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          enemy.x = -300;
          missile.mx = -100;
        }
      }
    }
  };

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ background: '#aaaaaa' }} />;
};

export default SpaceShipGameCanvas;