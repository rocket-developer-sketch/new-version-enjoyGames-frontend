import { useEffect, useRef } from 'react';
import { pythagoras } from '../game/calculate';
import { createGradient } from '../game/style';

interface Hole {
  x: number;
  y: number;
}

interface MashRabbitGameCanvasProps {
  onGameOver: (score: number) => void;
  timeLeft: number;
  setScore: (score: number) => void; 
}

const imageWidth = 1900;
const canvasWidth = 800;
const canvasHeight = 600;

const MashRabbitGameCanvas = ({ onGameOver, timeLeft, setScore }: MashRabbitGameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreRef = useRef(0);
  const gameOverTriggered = useRef(false);
  const snipeXRef = useRef(0);
  const snipeYRef = useRef(0);
  const scrollXRef = useRef(0);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new Image();
    const rabbit1 = new Image();
    const rabbit2 = new Image();
    const snipeImg = new Image();
    const holeImg = new Image();

    bgImg.src = '/images/mashrabbitgame/bg.jpg';
    rabbit1.src = '/images/mashrabbitgame/rabbit1.png';
    rabbit2.src = '/images/mashrabbitgame/rabbit2.png';
    snipeImg.src = '/images/mashrabbitgame/snipe.png';
    holeImg.src = '/images/mashrabbitgame/hole.png';

    let rabbitX = Math.floor(Math.random() * 700);
    let rabbitY = Math.floor(Math.random() * 500);
    let rabbitVX = Math.floor(Math.random() * 7 - 3);
    let rabbitVY = Math.floor(Math.random() * 7 - 3);
    let reboundY = 0;
    let isReload = false;
    let counter = 0;
    let rabbitFrame = 0;
    let rabbitFrameCount = 0;
    const holeArry: Hole[] = [];

    const moveSnipe = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      snipeXRef.current = e.clientX - rect.left;
      snipeYRef.current = e.clientY - rect.top;
    };

    const moveRabbit = (e: KeyboardEvent) => {
      switch (e.key) {
        // case 'ArrowUp': rabbitY -= 3; break;
        // case 'ArrowDown': rabbitY += 3; break;
        // case 'ArrowLeft': rabbitX -= 3; break;
        // case 'ArrowRight': rabbitX += 3; break;
        case ' ': fire(); break;
      }
    };

    const fire = () => {
      if (isReload || gameOverTriggered.current) return;
      isReload = true;
      reboundY = 50;
      const dis = pythagoras(rabbitX, rabbitY, snipeXRef.current, snipeYRef.current);
      if (dis <= 60) {
        scoreRef.current += 100;
        setScore(scoreRef.current);
        holeArry.push({ x: snipeXRef.current - rabbitX, y: snipeYRef.current - rabbitY });
        rabbitX = Math.floor(Math.random() * 700);
        rabbitY = Math.floor(Math.random() * 500);
      }
    };

    const drawScreen = () => {
      counter++;
      rabbitFrameCount++;

      if (timeLeft === 0 && !gameOverTriggered.current) {
        gameOverTriggered.current = true;
        onGameOver(scoreRef.current);
      }

      // Game Over 시 배경만 흐르게, 나머지 멈춤
      if (!gameOverTriggered.current) {
        if (counter % 30 === 0) {
          rabbitVX = Math.floor(Math.random() * 7 - 3);
          rabbitVY = Math.floor(Math.random() * 7 - 3);
        }

        rabbitX += rabbitVX;
        rabbitY += rabbitVY;
        rabbitX = Math.max(0, Math.min(rabbitX, canvasWidth));
        rabbitY = Math.max(0, Math.min(rabbitY, canvasHeight));

        if (rabbitFrameCount >= 30) {
          rabbitFrame = rabbitFrame === 0 ? 1 : 0;
          rabbitFrameCount = 0;
        }

        if (reboundY >= 3) reboundY -= 3;
        else if (isReload) {
          reboundY = 0;
          isReload = false;
        }
      }

      // 배경 스크롤 속도 2배 증가
      scrollXRef.current -= 2;
      if (scrollXRef.current <= -imageWidth) {
        scrollXRef.current = 0;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(bgImg, 0, 0, imageWidth, canvasHeight, scrollXRef.current, 0, imageWidth, canvasHeight);
      ctx.drawImage(bgImg, 0, 0, imageWidth, canvasHeight, scrollXRef.current + imageWidth, 0, imageWidth, canvasHeight);

      if (!gameOverTriggered.current) {
        const rabbitImg = rabbitFrame === 0 ? rabbit1 : rabbit2;
        ctx.drawImage(rabbitImg, rabbitX - 50, rabbitY - 50, 100, 100);

        holeArry.forEach(h => {
          ctx.drawImage(holeImg, h.x - 5 + rabbitX, h.y - 5 + rabbitY, 10, 10);
        });

        ctx.drawImage(
          snipeImg,
          snipeXRef.current - 50,
          snipeYRef.current - 50 - reboundY,
          100,
          100
        );

        ctx.font = '35px sans-serif';
        createGradient(ctx, canvas);
        // ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        // ctx.fillRect(canvasWidth / 2 - 80, 15, 160, 45);
        // ctx.fillStyle = '#ffe600';
        // ctx.font = 'bold 22px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillText(`🎯 Score: ${scoreRef.current}`, canvasWidth / 2, 37);
      }

      // Game Over 오버레이 출력
      if (gameOverTriggered.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.font = '48px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // 정확히 가운데 정렬
        //ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
      }

      animationIdRef.current = requestAnimationFrame(drawScreen);
    };

    // 최초 1회 실행
    animationIdRef.current = requestAnimationFrame(drawScreen);

    canvas.addEventListener('mousemove', moveSnipe);
    canvas.addEventListener('mousedown', fire);
    window.addEventListener('keydown', moveRabbit);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      canvas.removeEventListener('mousemove', moveSnipe);
      canvas.removeEventListener('mousedown', fire);
      window.removeEventListener('keydown', moveRabbit);
    };
  }, [onGameOver, timeLeft]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default MashRabbitGameCanvas;
