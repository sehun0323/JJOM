const uploader = document.getElementById('imageUploader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const instructionText = document.getElementById('instructionText');
let carImage = new Image(); 
const MAX_WIDTH = 800; 

// 이미지 업로드 핸들러
uploader.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
        };
        carImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});


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
    ctx.beginPath();
    
    // 각 좌표는 이미지 크기 대비 상대적인 위치(0.0~1.0)로 설정되어 어떤 이미지에도 적용됩니다.
    // 좌표는 첫 번째 이미지의 본넷 곡선에 맞추어 설정된 비율입니다.

    // 시작점 (P0)
    const P0_x = canvas.width * 0.05;
    const P0_y = canvas.height * 0.50; 
    ctx.moveTo(P0_x, P0_y); 
    
    // 끝점 (P3)
    const P3_x = canvas.width * 0.65; 
    const P3_y = canvas.height * 0.35;
    
    // 제어점 1 (P1)
    const P1_x = canvas.width * 0.25; 
    const P1_y = canvas.height * 0.30; 
    
    // 제어점 2 (P2)
    const P2_x = canvas.width * 0.45; 
    const P2_y = canvas.height * 0.25; 

    ctx.bezierCurveTo(
        P1_x, P1_y, 
        P2_x, P2_y, 
        P3_x, P3_y
    );
    
    ctx.stroke();
    ctx.closePath();
}
