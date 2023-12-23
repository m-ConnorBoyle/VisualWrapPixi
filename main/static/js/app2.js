document.addEventListener("DOMContentLoaded", () => {
    const canvasContainer = document.getElementById('canvasContainer');
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.classList.add('border');
    canvasContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    canvas.addEventListener('pointermove', (e) => {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        // Update coordinate displays
        document.getElementById('x-coordinate').textContent = mouseX;
        document.getElementById('y-coordinate').textContent = mouseY;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDottedLine(ctx, mouseX, mouseY, Math.PI / 4, 800, 2, [3,3]);
        // Add other lines similarly
    });

    canvas.addEventListener('pointerout', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    function drawDottedLine(ctx, startX, startY, angle, distance, lineWidth, dashArray) {
        const [dashSize, gapSize] = dashArray;
        const dashCount = Math.floor(distance / (dashSize + gapSize));
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        ctx.beginPath();
        ctx.setLineDash([dashSize, gapSize]);
        ctx.lineWidth = lineWidth;

        for (let i = 0; i < dashCount; i++) {
            const segmentStartX = startX + i * (dashSize + gapSize) * dx;
            const segmentStartY = startY + i * (dashSize + gapSize) * dy;

            ctx.moveTo(segmentStartX, segmentStartY);
            ctx.lineTo(segmentStartX + dashSize * dx, segmentStartY + dashSize * dy);
        }

        ctx.stroke();
    }

    // You can add other functions for generating lines and handling your specific logic here
});
