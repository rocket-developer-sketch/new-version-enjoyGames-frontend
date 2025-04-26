import { useEffect, useRef, useState } from 'react';

interface Ball {
  bx: number;
  by: number;
}

interface PikaBallGameCanvasProps {
  onGameOver: (score: number) => void;
  timeLeft: number;
  setScore: (score: number) => void;
}

const canvasWidth = 800;
const canvasHeight = 600;

const PikaBallGameCanvas = ({ onGameOver, timeLeft, setScore }: PikaBallGameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgImg = useRef(new Image());
  const cloudsImg1 = useRef(new Image());
  const cloudsImg2 = useRef(new Image());
  const myPikaImages = useRef<HTMLImageElement[]>([]);
  const ePikaImages = useRef<HTMLImageElement[]>([]);
  const monsterBallImages = useRef<HTMLImageElement[]>([]);

  const myPika = useRef({ x: 50, y: 50 });
  const ePikaY = useRef(0);
  const ePikaup = useRef(false);

  const ballXArray = useRef<Ball[]>([]);
  const bigBallXArray = useRef<Ball[]>([]);

  const cloudsImg1X = useRef(0);
  const cloudsImg2X = useRef(-800);

  const animationId = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const ballCanGo = useRef(true);

  /** 이미지 로딩 */
  useEffect(() => {
    const bg = new Image();
    const clouds1 = new Image();
    const clouds2 = new Image();
    const myPikas = [new Image(), new Image(), new Image(), new Image(), new Image()];
    const ePikas = [new Image(), new Image(), new Image(), new Image(), new Image()];
    const balls = [new Image(), new Image(), new Image(), new Image(), new Image()];

    const images = [bg, clouds1, clouds2, ...myPikas, ...ePikas, ...balls];
    let loadedCount = 0;

    images.forEach((img) => {
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          bgImg.current = bg;
          cloudsImg1.current = clouds1;
          cloudsImg2.current = clouds2;
          myPikaImages.current = myPikas;
          ePikaImages.current = ePikas;
          monsterBallImages.current = balls;
          setAssetsLoaded(true);
        }
      };
    });

    bg.src = "/images/pikaballgame/pikabg.jpg";
    clouds1.src = "/images/pikaballgame/clouds.jpg";
    clouds2.src = "/images/pikaballgame/clouds.jpg";

    myPikas[0].src = "/images/pikaballgame/p1.png";
    myPikas[1].src = "/images/pikaballgame/p2.png";
    myPikas[2].src = "/images/pikaballgame/p3.png";
    myPikas[3].src = "/images/pikaballgame/p4.png";
    myPikas[4].src = "/images/pikaballgame/p5.png";

    ePikas[0].src = "/images/pikaballgame/p11.png";
    ePikas[1].src = "/images/pikaballgame/p22.png";
    ePikas[2].src = "/images/pikaballgame/p33.png";
    ePikas[3].src = "/images/pikaballgame/p44.png";
    ePikas[4].src = "/images/pikaballgame/p55.png";

    balls[0].src = "/images/pikaballgame/pikaball1.png";
    balls[1].src = "/images/pikaballgame/pikaball2.png";
    balls[2].src = "/images/pikaballgame/pikaball3.png";
    balls[3].src = "/images/pikaballgame/pikaball4.png";
    balls[4].src = "/images/pikaballgame/pikaball5.png";
  }, []);

  /** 캔버스 이벤트 */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const movePika = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      myPika.current.x = e.clientX - rect.left - 30;
      myPika.current.y = e.clientY - rect.top - 30;
    };

    const fireBall = () => {
      if (myPika.current.x > 190) return;
      if (ballXArray.current.length < 6) {
        ballXArray.current.push({ bx: myPika.current.x, by: myPika.current.y });
      }
    };

    const fireBigBall = (e: KeyboardEvent) => {
      if (e.key !== " " && e.code !== "Space") return;
      if (myPika.current.x > 190) return;
      if (!ballCanGo.current) return;

      bigBallXArray.current.push({ bx: myPika.current.x, by: myPika.current.y });

      if (bigBallXArray.current.length === 3) {
        chargingBigBall();
      }
    };

    canvas.addEventListener("mousemove", movePika);
    canvas.addEventListener("click", fireBall);
    window.addEventListener("keydown", fireBigBall);

    return () => {
      canvas.removeEventListener("mousemove", movePika);
      canvas.removeEventListener("click", fireBall);
      window.removeEventListener("keydown", fireBigBall);
    };
  }, []);

  /** 게임 루프 */
  useEffect(() => {
    if (!assetsLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const drawScreen = () => {
      if (timeLeft === 0) {
        if (animationId.current) cancelAnimationFrame(animationId.current);
        onGameOver(scoreRef.current);
        return;
      }
    
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
    
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
      // 1. 배경 (풀배경 800x600)
      ctx.drawImage(bgImg.current, 0, 0, canvasWidth, canvasHeight);
    
      // 2. 구름 이동
      cloudsImg1X.current += 2;
      cloudsImg2X.current += 2;
    
      if (cloudsImg1X.current >= canvasWidth) {
        cloudsImg1X.current = cloudsImg2X.current - canvasWidth;
      }
      if (cloudsImg2X.current >= canvasWidth) {
        cloudsImg2X.current = cloudsImg1X.current - canvasWidth;
      }
    
      ctx.drawImage(cloudsImg1.current, cloudsImg1X.current, 0, canvasWidth, 200);
      ctx.drawImage(cloudsImg2.current, cloudsImg2X.current, 0, canvasWidth, 200);
    
      // 3. 내 피카츄 그리기
      ctx.drawImage(myPikaImages.current[0], 10, myPika.current.y, 80, 80);
    
      // 4. 상대 피카츄 이동
      if (ePikaup.current) ePikaY.current -= 5;
      else ePikaY.current += 5;
      if (ePikaY.current >= 495) ePikaup.current = true;
      if (ePikaY.current <= 0) ePikaup.current = false;
    
      ctx.drawImage(ePikaImages.current[0], 720, ePikaY.current, 80, 80);
    
      // 5. 작은 공 (일반 볼) 처리
      ballXArray.current.forEach((ball, index) => {
        ball.bx += 10;
        ctx.drawImage(monsterBallImages.current[0], ball.bx, ball.by, 40, 40);
    
        if (ball.bx >= 720 && ball.bx <= 800 && Math.abs(ball.by - ePikaY.current) <= 38) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          ballXArray.current.splice(index, 1); // 맞으면 삭제
        }
      });
    
      // 6. 큰 공 (빅볼) 처리
      bigBallXArray.current.forEach((bigBall, index) => {
        bigBall.bx += 10;
        ctx.drawImage(monsterBallImages.current[0], bigBall.bx, bigBall.by, 200, 200);
    
        if (bigBall.bx >= 720 && bigBall.bx <= 800 && Math.abs(bigBall.by - ePikaY.current) <= 190) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          bigBallXArray.current.splice(index, 1); // 맞으면 삭제
        }
      });
    
      // 7. 화면 밖으로 벗어난 공 정리
      ballXArray.current = ballXArray.current.filter(ball => ball.bx <= canvasWidth);
      bigBallXArray.current = bigBallXArray.current.filter(bigBall => bigBall.bx <= canvasWidth);
    
      animationId.current = requestAnimationFrame(drawScreen);
    };
    

    animationId.current = requestAnimationFrame(drawScreen);

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [assetsLoaded, timeLeft, onGameOver, setScore]);

  const chargingBigBall = () => {
    ballCanGo.current = false;
    setTimeout(() => {
      ballCanGo.current = true;
      bigBallXArray.current = []; // 충전 후 다시 큰 공 비워서 새로 발사할 수 있게
    }, 5000);
  };

  return (
    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ background: "#aaaaaa" }} />
  );
};

export default PikaBallGameCanvas;
