document.addEventListener("DOMContentLoaded", () => {
  let zIndexCounter = 0; 

  const canvasContainer = document.getElementById('canvasContainer');
  let canvasWidth = 400;
  let globalZIndex = 0;
  let linesArr = []

  const app = new PIXI.Application({
    width: canvasWidth,
    height: canvasWidth,
    backgroundColor: 0xFFFFFF,
    //antialias: false
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

  /*const generateLine = (start, angle, color) => {
        const line = new PIXI.Graphics();
        line.lineStyle(4, color);

        const farPoint = 1000; 
        const dx = farPoint * Math.cos(angle);
        const dy = farPoint * Math.sin(angle);

        line.moveTo(start.x - dx, start.y - dy);
        line.lineTo(start.x + dx, start.y + dy);

        return line;
    };

    let basisX = 350; let basisY = 60;
    let offset = canvasWidth / 2

    function generateLineObject(basisX, basisY, color) {
        let childLinesArr = []

        let line1Recipe = [{x: basisX, y: basisY}, Math.PI / 4, color]
        let line2Recipe = [{x: basisX, y: basisY}, -Math.PI / 4, color]
        let line3Recipe = [{x: basisX + offset, y: basisY - offset}, Math.PI / 4, color]
        let line4Recipe = [{x: basisX, y: basisY - canvasWidth}, -Math.PI / 4, color]
        let line5Recipe = [{x: basisX + offset, y: basisY + offset}, -Math.PI / 4, color]
        let line6Recipe = [{x: basisX - offset, y: basisY + offset}, Math.PI / 4, color]

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
    }*/

  //let isOdd = true
  let currentColour;

  /*function generateLineNew(startX, startY, colour, angleInDegrees) {
      let graphics = new PIXI.Graphics();
      graphics.eventMode = 'static';
      graphics.beginFill(colour);
  // Draw the rectangle starting from 0,0 to make pivot easier to calculate
      graphics.drawRect(0, 0, canvasWidth * 2, 1);
      graphics.endFill();

      let angleInRadians = angleInDegrees * (Math.PI / 180);

      graphics.pivot.x = canvasWidth;
      graphics.pivot.y = 0.5;

      graphics.rotation = angleInRadians;

      graphics.x = startX;
      graphics.y = startY;

      app.stage.addChild(graphics);
  } 

  generateLineNew(30, 30, 0xff0000, 270)

  generateLineNew(270, 180, 0x000000, -10)*/


  function generateLineObject(startX, startY, colour, angleInDegrees) {
    let lineContainer = new PIXI.Container();
    lineContainer.interactive = true;
    lineContainer.buttonMode = true;

    let graphics1 = createLine(startX, startY, colour, angleInDegrees);
    lineContainer.addChild(graphics1);

    let graphics2 = createLine(startX, startY, colour, -angleInDegrees);
    lineContainer.addChild(graphics2);

    lineContainer.on('mouseenter', (e) => {
      lineContainer.children.forEach(child => {
        currentColour = child.tint;
        child.tint = 0x008000;
      });
    });

    lineContainer.on('mousedown', () => {
      lineContainer.children.forEach(child => {
        child.tint = 0x000000;
      });
    });

    lineContainer.on('mouseleave', () => {
      lineContainer.children.forEach(child => {
        if (child.tint === 0x008000) {
          child.tint = currentColour;
        }
      });
    });

    app.stage.addChild(lineContainer);
  }

  function createLine(startX, startY, colour, angleInDegrees) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(colour);
    graphics.drawRect(0, 0, canvasWidth * 2, 1);
    graphics.endFill();

    let angleInRadians = angleInDegrees * (Math.PI / 180);
    graphics.pivot.x = canvasWidth;
    graphics.pivot.y = 0.5;
    graphics.rotation = angleInRadians;
    graphics.x = startX;
    graphics.y = startY;

    return graphics;
  }

  generateLineObject(200, 200, 0xff0000, 45);

  /*let graphics2 = new PIXI.Graphics();

    graphics2.eventMode = 'static';
    graphics2.beginFill(0xff0000);
    graphics2.drawRect(50, 50, canvasWidth * 2, 1);
    graphics2.endFill();

    graphics2.pivot.x = graphics2.width / 2;
    graphics2.pivot.y = graphics2.height / 2;
  // Move the rectangle to the center of the screen
    graphics2.x = app.screen.width / 2.0;
    graphics2.y = app.screen.height / 2.0;
          graphics2.on('mousedown', (e) => {
      console.log(graphics2.zIndex)
    })  

    app.stage.addChild(graphics2)
        for (let i = 0; i < 400; i++) { 

    let graphics = new PIXI.Graphics();

  // Set the pivot point to the center of the rectangle
    graphics.eventMode = 'static';
    graphics.beginFill(0xffff00);
    graphics.drawRect(i, i, canvasWidth * 2, 1);
    graphics.endFill();

    graphics.pivot.x = graphics.width / 2;
    graphics.pivot.y = graphics.height / 2;
    isOdd = false
  // Move the rectangle to the center of the screen
    graphics.x = app.screen.width / 2.0;
    graphics.y = app.screen.height / 2.0;

    if (isOdd) {
      graphics.rotation = 45 * Math.PI / 180;
      graphics.tint = 0xFF0000
    } else {
      graphics.rotation = -45 * Math.PI / 180;
    }

    graphics.on('mouseenter', (e) => {
        const canvasRect = app.view.getBoundingClientRect(); // Get the canvas boundaries
        const mouseX = event.clientX - canvasRect.left; // Get the mouse X-coordinate relative to the canvas
        const mouseY = event.clientY - canvasRect.top; // Get the mouse Y-coordinate relative to the canvas
      // Check if the mouse is inside the canvas boundaries
        if (mouseX >= 1 && mouseX <= canvasRect.width - 1 && mouseY >= 1 && mouseY <= canvasRect.height - 1) {
      console.log(graphics.tint)
      currentColour = graphics.tint
      graphics.tint = 0x008000
      }
    })

    graphics.on('mousedown', () => {
      console.log(graphics.zIndex)  
      graphics.tint = 0x000000
    })

    graphics.on('mouseleave', () => {

      if (graphics.tint == 32768) { 
        graphics.tint = currentColour   
      }
    })

    app.stage.addChild(graphics);
  }*/

  app.renderer.render(app.stage);
});


