// ... (이전 코드 생략) ...

// 곡선(빨간 선)을 모델링하여 그리는 함수 (수학적 모델링)
function drawCurve() {
    if (!carImage.src || canvas.width === 0) {
        alert("먼저 차량 측면 이미지를 업로드해주세요.");
        return;
    }
    
    // 1. 이미지를 다시 그려서 기존에 그려진 선을 지웁니다.
    ctx.drawImage(carImage, 0, 0, canvas.width, canvas.height);

    // 2. 선의 스타일을 정의합니다.
    ctx.strokeStyle = 'red'; 
    ctx.lineWidth = 6;       
    ctx.lineCap = 'round';   
    
    // 3. 3차 베지어 곡선(Cubic Bezier Curve) 공식 적용

    // P0: 시작점 (Start Point) - 헤드라이트 위 본넷 시작점
    const P0_x = canvas.width * 0.08;  // 좌측에서 8% 지점
    const P0_y = canvas.height * 0.45;  // 상단에서 45% 지점 (더 낮춰 본넷에 근접)
    
    // P3: 끝점 (End Point) - A필러 시작점
    const P3_x = canvas.width * 0.60;  // 좌측에서 60% 지점 (더 짧고 정확하게)
    const P3_y = canvas.height * 0.33;  // 상단에서 33% 지점 (높이를 올려 지붕 라인과 구분)
    
    // P1: 제어점 1 (Control Point 1) - 초반 곡률 제어
    // P0 근처에서 곡선이 급격히 솟아오르는 것을 방지하기 위해 P0에 가깝고 높이는 P3에 가깝게 조정합니다.
    const P1_x = canvas.width * 0.30; 
    const P1_y = canvas.height * 0.30; // 이전보다 훨씬 낮춰 본넷 곡면에 붙임
    
    // P2: 제어점 2 (Control Point 2) - 후반 곡률 제어
    // P3 근처에서 부드럽게 A필러로 이어지도록 조정합니다.
    const P2_x = canvas.width * 0.50; 
    const P2_y = canvas.height * 0.28; // 가장 높은 점(크라운)을 P1과 P2 사이에 만듭니다.

    ctx.beginPath();
    ctx.moveTo(P0_x, P0_y); 
    
    // 3차 베지어 곡선 정의
    ctx.bezierCurveTo(
        P1_x, P1_y, 
        P2_x, P2_y, 
        P3_x, P3_y
    );
    
    ctx.stroke();
    ctx.closePath();
    
    // 개발자/Validator용 로그
    console.log("베지어 곡선 파라미터 업데이트됨:", {P0:[P0_x, P0_y], P1:[P1_x, P1_y], P2:[P2_x, P2_y], P3:[P3_x, P3_y]});
}
