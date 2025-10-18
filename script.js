const uploader = document.getElementById('imageUploader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const instructionText = document.getElementById('instructionText');
let carImage = new Image(); 
const MAX_WIDTH = 800; 

// 이미지 업로드 핸들러 (미리보기 문제 해결 로직 강화)
uploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        console.error("파일이 선택되지 않았습니다.");
        return;
    }

    const reader = new FileReader();
    
    // 파일이 성공적으로 읽히면 이미지 소스를 설정
    reader.onload = (e) => {
        carImage.src = e.target.result; 
    };

    // 이미지 소스가 설정된 후 이미지가 완전히 로드되면 캔버스에 그림
    carImage.onload = () => {
        
        // 이미지 비율 유지 및 캔버스 크기 조정
        const scaleFactor = Math.min(MAX_WIDTH / carImage.width, 1);
        const displayWidth = carImage.width * scaleFactor;
        const displayHeight = carImage.height * scaleFactor;

        canvas.width = displayWidth;
        canvas.height = displayHeight;

        // 이미지를 캔버스에 그리기
        ctx.drawImage(carImage, 0, 0, displayWidth, displayHeight);
        
        // 안내 텍스트 숨기기
        instructionText.style.display = 'none';
        
        console.log(`[Validator] 이미지 로드 및 캔버스 그리기 완료. 크기: ${displayWidth}x${displayHeight}`);
    };
    
    // 파일 읽기 시작
    reader.readAsDataURL(file);
});


// 곡선(빨간 선)을 모델링하여 그리는 함수 (정확도 개선된 수학적 모델링)
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
    // (좌표는 첫 번째 사진의 본넷 곡선에 맞추어 정밀 조정된 비율입니다.)

    // P0: 시작점 (Start Point) - 헤드라이트 위 본넷 시작점
    const P0_x = canvas.width * 0.08;  
    const P0_y = canvas.height * 0.45;  
    
    // P3: 끝점 (End Point) - A필러 시작점
    const P3_x = canvas.width * 0.60;  
    const P3_y = canvas.height * 0.33;  
    
    // P1: 제어점 1 (Control Point 1) - 초반 곡률 제어 (정확도 개선)
    const P1_x = canvas.width * 0.30; 
    const P1_y = canvas.height * 0.30; 
    
    // P2: 제어점 2 (Control Point 2) - 후반 곡률 제어 (정확도 개선)
    const P2_x = canvas.width * 0.50; 
    const P2_y = canvas.height * 0.28; 

    ctx.beginPath();
    ctx.moveTo(P0_x, P0_y); 
    
    ctx.bezierCurveTo(
        P1_x, P1_y, 
        P2_x, P2_y, 
        P3_x, P3_y
    );
    
    ctx.stroke();
    ctx.closePath();
}
