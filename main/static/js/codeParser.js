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

function parseThreadDown(str) {
  let xCoord = str.split(' ')[1];
  let yCoord = str.split(' ')[3];
  let color = str.split(' ')[5];
  let direction = str.split(' ')[6];
  let progression = str.split(' ')[7];
  let progressionDir; 
  let currentWidth = 0;
  let widthVector = 0;
  let direction 
  let directionVector = 0;
  if (progression === 'Band') {
    currentWidth = str.split(' ')[8]; 
  } else if (progression === 'Right') {
    widthVector = str.split(' ')[8];
    direction = 'Right';
  } else if (progression === 'Left') {
    widthVector = str.split(' ')[8];
    direction = 'Left';
  }

}

function parseCross(str) {

}

function parseBox(str) {
}

function parseThreadUp(str) {
  
}

