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

    //let isOdd = true
  let currentColour;

  function generateLineObject(startX, startY, colour, angleInDegrees, thickness) {
    let lineContainer = new PIXI.Container();
    lineContainer.interactive = true;
    lineContainer.buttonMode = true;

    //let graphics1 = createLine(startX, startY, colour, angleInDegrees);
    //lineContainer.addChild(graphics1);

    let graphics2 = createLine(startX, startY, colour, -angleInDegrees, thickness);
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

  function createLine(startX, startY, colour, angleInDegrees, thickness) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(colour);
    graphics.drawRect(0, 0, canvasWidth * 4, thickness);
    graphics.endFill();

    let angleInRadians = angleInDegrees * (Math.PI / 180);
    graphics.pivot.x = canvasWidth * 2;
    graphics.pivot.y = 0.5;
    graphics.rotation = angleInRadians;
    graphics.x = startX;
    graphics.y = startY;

    return graphics;
  }

  function parseCode(code) {
    let firstWord = code.split(' ')[0];
   
    if (firstWord === 'Box') {
      parseBox(code);
    } else if (firstWord === 'Cross') {
      parseCross(code); 
    } else if (firstWord === 'Thread_Up') {
      parseThreadUp(code); 
    } else if (firstWord === 'Thread_Down'){ 
      parseThreadDown(code); 
    }
  }

  /*function getWordAfterKeyword(sentence, keyword) {
    const regex = new RegExp(`\\b${keyword}\\b\\s+(\\w+)`, 'i');
    const matches = sentence.match(regex);
    return matches ? matches[1] : null;
  }*/

  function getWordAfterKeyword(sentence, keyword) {
    const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`${escapedKeyword}\\s+(\\S+)`, 'i');
    const matches = sentence.match(regex);
    return matches ? matches[1] : null;
  }

  function getSecondWordAfterKeyword(sentence, keyword) {
    const regex = new RegExp(`\\b${keyword}\\b\\s+\\w+\\s+(\\w+)`, 'i');
    const matches = sentence.match(regex);
    return matches ? matches[1] : null;
  }

  function parseThreadDown2(str) {
    let xCoord = getWordAfterKeyword(str, 'x') * 1; 
    let yCoord = getWordAfterKeyword(str, 'y') * 1;
    let color = getWordAfterKeyword(str, 'Spool_Up');
    let band = getWordAfterKeyword(str, 'Band') * 1;
    if (band != '') {
      band = true ;
    } else {
      band = false;
    }
    let direction = getSecondWordAfterKeyword(str, 'Spool_Up'); 
    let init = getWordAfterKeyword(str, 'init#') ;
    let passes = getWordAfterKeyword(str, 'passes');
    let gradient = getWordAfterKeyword(str, '%') * 1;
    console.log("x: " + xCoord, "y: " + yCoord,"color: " + color,"band: " + band,"direction: " + direction,"init: " + init,"passes: " + passes,"gradient: " + gradient);
    let currentWidth = init; 
    for (let i = 0; i < passes; i++) {
     // generateLineObject(xCoord, yCoord, color, 45, currentWidth);
      generateLineObject(xCoord, yCoord, '0xff0000', 45, currentWidth);
      if (direction === 'Left') {
        xCoord = xCoord - currentWidth;
      } else if (direction === 'Right') {   
        xCoord = xCoord + currentWidth;
      } else if (direction === 'Up') {
        yCoord = yCoord - currentWidth;
      } else if (direction === 'Down') {
        yCoord = yCoord + currentWidth;
      }
      currentWidth = currentWidth  
    } 

    //generateLineObject(xCoord, yCoord, '0xff0000', 45, band);
    app.renderer.render(app.stage);
  }

  function addRunEventListener() {
    document.getElementById('menuRun').addEventListener('click', () => {
      clearStage(); 
      let code = document.getElementById('code-editor').value;

      let lines = code.split('\n');
      lines.forEach(line => {
        parseThreadDown2(line);
      });
    }); 
  }

  function clearStage() {
    app.stage.removeChildren();
  }

  addRunEventListener();
  //generateLineObject(200, 200, 0xff0000, 45);

 
  app.renderer.render(app.stage);
});


