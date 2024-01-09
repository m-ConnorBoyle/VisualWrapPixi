document.addEventListener('DOMContentLoaded', (event) => {
  const dragItem = document.querySelector("#draggable-container");
  const dragHandle = document.querySelector(".drag-handle");
  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  let active = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  // Drag and drop functionality
  dragHandle.addEventListener("mousedown", dragStart, false);
  document.addEventListener("mouseup", dragEnd, false);
  document.addEventListener("mousemove", drag, false);

  // Close button functionality
  document.querySelector('.close-icon').addEventListener('click', function() {
    dragItem.style.display = 'none';
  });

  // Line numbers update
  document.getElementById('code-editor').addEventListener('input', updateLineNumbers);

  // Adjust textarea height
  document.getElementById('code-editor').addEventListener('input', adjustTextareaHeight);
  document.getElementById('code-editor').addEventListener('mouseup', function() {
    setTimeout(adjustTextareaHeight, 0); // Timeout ensures this runs after the resize event
  });

  // Initial setup calls
  updateLineNumbers();
  adjustTextareaHeight();

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    active = true;
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    active = false;
  }

  function drag(e) {
    if (active) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }

  function updateLineNumbers() {                                               
    const text = codeEditor.value;
    const lines = text.split('\n');
    lineNumbers.innerHTML = lines.map((line, index) => index + 1).join('<br>');
  }

  function adjustTextareaHeight() {
    // If the textarea is resized smaller than its content, make it scrollable
    if (codeEditor.clientHeight < codeEditor.scrollHeight) {
      codeEditor.style.height = 'auto';
      codeEditor.style.height = codeEditor.scrollHeight + 'px';
    }
  }

  // Sync the line numbers scrolling with the textarea scrolling
  codeEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeEditor.scrollTop;
  });

  /*function adjustTextareaWidth() {
    // Create a temporary span element to calculate the width of the textarea content
    const tempSpan = document.createElement('span');
    // Copy text styles to ensure width calculation is as accurate as possible
    tempSpan.style.font = window.getComputedStyle(codeEditor).font;
    tempSpan.style.visibility = 'hidden'; // Hide the element
    tempSpan.style.whiteSpace = 'nowrap'; // Prevent wrapping
    tempSpan.innerText = codeEditor.value.replace(/\n/g, ' '); // Replace newlines with spaces for width calculation
    document.body.appendChild(tempSpan); // Add to the body to get dimensions

    // Calculate the new width based on content
    const newWidth = Math.max(tempSpan.offsetWidth + 20, codeEditor.offsetWidth);
    codeEditor.style.width = `${newWidth}px`;

    // Clean up by removing the temporary span element
    document.body.removeChild(tempSpan);
  }*/

  function adjustTextareaWidth() {
    const lines = codeEditor.value.split('\n');
    let maxWidth = codeEditor.offsetWidth;

    // Create a temporary span element to calculate the width of each line
    const tempSpan = document.createElement('span');
    tempSpan.style.font = window.getComputedStyle(codeEditor).font;
    tempSpan.style.visibility = 'hidden'; // Hide the element
    tempSpan.style.whiteSpace = 'nowrap'; // Prevent wrapping
    document.body.appendChild(tempSpan); // Add to the body to get dimensions

    // Calculate the new width based on the longest line
    lines.forEach(line => {
      tempSpan.innerText = line;
      maxWidth = Math.max(maxWidth, tempSpan.offsetWidth + 20); // +20 for some padding
    });

    // Update the textarea width only if a line exceeds the current width
    if (maxWidth > codeEditor.offsetWidth) {
      codeEditor.style.width = `${maxWidth}px`;
    }

    // Clean up by removing the temporary span element
    document.body.removeChild(tempSpan);
  } 
  document.getElementById('code-editor').addEventListener('input', adjustTextareaWidth);
});
