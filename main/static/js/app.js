document.addEventListener("DOMContentLoaded", () => {
    const canvasContainer = document.getElementById('canvasContainer');
    let canvasWidth = 400;
    let globalZIndex = 0;
    let linesArr = []

    const app = new PIXI.Application({
        width: canvasWidth,
        height: canvasWidth,
        backgroundColor: 0xFFFFFF
    });

    app.view.classList.add('border');
    canvasContainer.appendChild(app.view);

    let hoverLine1 = new PIXI.Graphics(); let hoverLine2 = new PIXI.Graphics(); let hoverLine3 = new PIXI.Graphics(); let hoverLine4 = new PIXI.Graphics(); let hoverLine5 = new PIXI.Graphics(); let hoverLine6 = new PIXI.Graphics();
    
    app.stage.addChild(hoverLine1, hoverLine2, hoverLine3, hoverLine4, hoverLine5, hoverLine6);

    app.view.addEventListener('pointermove', (e) => {
        let mouseX = Math.round(e.offsetX);
        let mouseY = Math.round(e.offsetY);
        let myOffset = canvasWidth / 2;

        // Update coordinate displays
        document.getElementById('x-coordinate').textContent = mouseX;
        document.getElementById('y-coordinate').textContent = mouseY;
        
        requestAnimationFrame(() => {
            hoverLine1.clear(); hoverLine2.clear(); hoverLine3.clear(); hoverLine4.clear(); hoverLine5.clear();hoverLine6.clear();

            drawDottedLine(hoverLine1, {x: mouseX, y: mouseY}, Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            drawDottedLine(hoverLine2, {x: mouseX, y: mouseY}, -Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            drawDottedLine(hoverLine3, {x: mouseX + myOffset, y: mouseY - myOffset}, Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            drawDottedLine(hoverLine4, {x: mouseX, y: mouseY - canvasWidth}, -Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            drawDottedLine(hoverLine5, {x: mouseX + myOffset, y: mouseY + myOffset}, -Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            drawDottedLine(hoverLine6, {x: mouseX - myOffset, y: mouseY + myOffset}, Math.PI / 4, 800, 0x000000, 2, [3,3] ) 
            
            app.renderer.render(app.stage);
        });
    });

    app.view.addEventListener('pointerout', () => {
        hoverLine1.clear();
        hoverLine2.clear();
        hoverLine3.clear();
        hoverLine4.clear();
        hoverLine5.clear();
        hoverLine6.clear();
        app.renderer.render(app.stage);
    });

    function drawDottedLine(graphics, start, angle, distance, color, lineWidth, dashArray) {
        const [dashSize, gapSize] = dashArray;
        const dashLength = dashSize + gapSize;
        const dashCount = Math.floor((distance * 2) / dashLength); 

        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        for (let i = -dashCount / 2; i < dashCount / 2; i++) { 
            const segmentStartX = start.x + (i * dashLength) * dx;
            const segmentStartY = start.y + (i * dashLength) * dy;
            const segmentEndX = segmentStartX + (dashSize * dx);
            const segmentEndY = segmentStartY + (dashSize * dy);

                graphics.lineStyle(lineWidth, color);
                graphics.moveTo(segmentStartX, segmentStartY);
                graphics.lineTo(segmentEndX, segmentEndY);
        }
    } 

    const generateLine = (start, angle, color) => {
        const line = new PIXI.Graphics();
        line.lineStyle(1, color);
        line.tint = Math.random() * 0xFFFFFF

        const farPoint = 1000; 
        const dx = farPoint * Math.cos(angle);
        const dy = farPoint * Math.sin(angle);

        line.moveTo(start.x - dx, start.y - dy);
        line.lineTo(start.x + dx, start.y + dy);

        return line;
    };

    let basisX = 350; let basisY = 60;
    let offset = canvasWidth / 2

    function generateLineObject(basisX, basisY) {
        let childLinesArr = []
       
        let line1Recipe = [{x: basisX, y: basisY}, Math.PI / 4, 0x000000]
        let line2Recipe = [{x: basisX, y: basisY}, -Math.PI / 4, 0x000000]
        let line3Recipe = [{x: basisX + offset, y: basisY - offset}, Math.PI / 4, 0x000000]
        let line4Recipe = [{x: basisX, y: basisY - canvasWidth}, -Math.PI / 4, 0x000000]
        let line5Recipe = [{x: basisX + offset, y: basisY + offset}, -Math.PI / 4, 0x000000]
        let line6Recipe = [{x: basisX - offset, y: basisY + offset}, Math.PI / 4, 0x000000]

        let line1 = generateLine(line1Recipe[0],line1Recipe[1],line1Recipe[2],line1Recipe[3])
        let line2 = generateLine(line2Recipe[0],line2Recipe[1],line2Recipe[2],line2Recipe[3]); 
        let line3 = generateLine(line3Recipe[0],line3Recipe[1],line3Recipe[2],line3Recipe[3]); 
        let line4 = generateLine(line4Recipe[0],line4Recipe[1],line4Recipe[2],line4Recipe[3]); 
        let line5 = generateLine(line5Recipe[0],line5Recipe[1],line5Recipe[2],line5Recipe[3]); 
        let line6 = generateLine(line6Recipe[0],line6Recipe[1],line6Recipe[2],line6Recipe[3]); 
       
        childLinesArr.push(["subLine1", line1Recipe]);
        childLinesArr.push(["subLine2", line3Recipe]);
        childLinesArr.push(["subLine3", line3Recipe]);
        childLinesArr.push(["subLine4", line4Recipe]);
        childLinesArr.push(["subLine5", line5Recipe]);
        childLinesArr.push(["subLine6", line6Recipe]);
         
        let lineId = "line" + globalZIndex
        globalZIndex++
        linesArr.push([lineId, childLinesArr]) 
        console.log(linesArr[globalZIndex - 1])
        let index = linesArr.length - 1;
        document.getElementById('lines-pointer').insertAdjacentHTML('afterend', 
            "<div id=line["+ index + "] class='mr-2 odd:bg-white even:bg-slate-50 hover:bg-slate-100 hover:cursor-pointer' style='padding-left: 5px;'> Line " + index + '</div>');
            document.getElementById('line['+index+']').addEventListener('mouseover', () => {
            console.log(linesArr[index])
            linesArr[index][1][2] = 0xFF0000
            let redrawLine = generateLine(linesArr[index][1])
            app.stage.addChild(redrawLine)
            app.renderer.render(app.stage); 
        })


        app.stage.addChild(line1); app.stage.addChild(line2); app.stage.addChild(line3); app.stage.addChild(line4); app.stage.addChild(line5); app.stage.addChild(line6);
    }

    generateLineObject(350, 60)
    generateLineObject(50, 350)
    generateLineObject(10, 50)
    generateLineObject(85, 10)
    generateLineObject(200, 300)

    linesArr[2].forEach(line => {
        line.tint = 0xFF0000; 
    });
        // Render the stage to display the lines
    app.renderer.render(app.stage);
});
