export function createGradient(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.fillStyle = returnGradientObject(ctx, canvas);
}

export function returnGradientObject(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'magenta');
  gradient.addColorStop(0.5, 'blue');
  gradient.addColorStop(1.0, 'red');
  return gradient;
}

export function writeGameOver(ctx: CanvasRenderingContext2D, score: number, x: number, y: number) {
  ctx.font = '35px sans-serif';
  ctx.fillStyle = 'white';
  ctx.fillText('게임 종료', 200, 400);
  ctx.fillText(`최종 점수: ${score}`, x, y);
}
