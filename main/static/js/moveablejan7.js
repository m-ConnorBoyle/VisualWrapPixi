document.addEventListener('DOMContentLoaded', (event) => {
  const dragItem = document.querySelector("#draggable-container");
  const dragHandle = document.querySelector(".drag-handle");
  let active = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  dragHandle.addEventListener("mousedown", dragStart, false);
  document.addEventListener("mouseup", dragEnd, false);
  document.addEventListener("mousemove", drag, false);

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

  document.querySelector('.close-icon').addEventListener('click', function() {
    document.getElementById('draggable-container').style.display = 'none';
  });

  function updateLineNumbers() {
  const text = document.getElementById('code-editor').value;
  const lines = text.split('\n');
  const lineNumbersContainer = document.getElementById('line-numbers');
  lineNumbersContainer.innerHTML = '';

  for (let i = 1; i <= lines.length; i++) {
    lineNumbersContainer.innerHTML += `${i}<br>`;
  }
}

  document.getElementById('code-editor').addEventListener('input', updateLineNumbers);

  // Initial line numbers
  updateLineNumbers();

  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');

  codeEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeEditor.scrollTop;
  });

  function autoResizeTextarea() {
    const codeEditor = document.getElementById('code-editor');
    
    // Only expand the textarea if the content exceeds its current height
    if (codeEditor.scrollHeight > codeEditor.clientHeight) {
      codeEditor.style.height = codeEditor.scrollHeight + 'px';
    }
  }

  // Listen for input events to adjust the textarea height
  document.getElementById('code-editor').addEventListener('input', autoResizeTextarea);

  // This ensures the height adjusts for content already present on load and after window resize
  document.addEventListener('DOMContentLoaded', function() {
    autoResizeTextarea();
  });
  window.addEventListener('resize', autoResizeTextarea); 

  codeEditor.addEventListener('input', autoResizeTextarea);

  document.addEventListener('DOMContentLoaded', autoResizeTextarea);
  window.addEventListener('resize', autoResizeTextarea);

  document.getElementById('code-editor').addEventListener('mouseup', function() {
    setTimeout(adjustTextareaHeight, 0); // Timeout ensures this runs after the resize event
  });

  function adjustTextareaHeight() {
    const codeEditor = document.getElementById('code-editor');
    // If the textarea is resized smaller than its content, make it scrollable
    if (codeEditor.clientHeight < codeEditor.scrollHeight) {
      codeEditor.style.height = codeEditor.scrollHeight + 'px';
    }
    } 
  }

// Adjust the textarea height whenever the content changes
document.getElementById('code-editor').addEventListener('input', adjustTextareaHeight);

// Adjust when the user manually resizes the textarea
document.getElementById('code-editor').addEventListener('mouseup', function() {
  setTimeout(adjustTextareaHeight, 0); // Timeout ensures this runs after the resize event
});

// Call the function on initial page load
document.addEventListener('DOMContentLoaded', adjustTextareaHeight);  

});
