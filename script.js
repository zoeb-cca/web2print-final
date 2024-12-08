// Select elements
const colorChangeButton = document.getElementById("colorChangeButton");
const sizeSlider = document.getElementById("sizeSlider");
const rotationKnob = document.getElementById("rotationKnob");
const shakeCheckbox = document.getElementById("shakeCheckbox");
const bwToggle = document.getElementById("bwToggle");
const bgColorSlider = document.getElementById("bgColorSlider");
const spaceBarSound = document.getElementById("spaceBarSound");

const buttons = document.querySelectorAll(".control-button, .knob, .slider, .vertical-slider, #lightSwitch, #printButton, #refreshButton, #joystick");

// Colors for cycling
const colors = ["#007bff", "#28a745", "#ff5722", "#ffc107", "#17a2b8"];
let colorIndex = 0;

// Change colors of all buttons
colorChangeButton.addEventListener("click", () => {
  colorIndex = (colorIndex + 1) % colors.length;
  buttons.forEach(button => {
    button.style.backgroundColor = colors[colorIndex];
  });
});

// Adjust button size with slider
sizeSlider.addEventListener("input", (event) => {
  const scale = 1 + event.target.value / 100;
  buttons.forEach(button => {
    button.style.transform = `scale(${scale})`;
  });
});

// Rotate buttons with knob
let isRotating = false;
let startAngle = 0;

rotationKnob.addEventListener("mousedown", (event) => {
  isRotating = true;
  const rect = rotationKnob.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const getAngle = (x, y) => {
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
  };

  startAngle = getAngle(event.clientX, event.clientY);

  const rotate = (event) => {
    if (!isRotating) return;
    const currentAngle = getAngle(event.clientX, event.clientY);
    const rotation = currentAngle - startAngle;
    buttons.forEach(button => {
      button.style.transform = `rotate(${rotation}deg)`;
    });
  };

  const stopRotating = () => {
    isRotating = false;
    window.removeEventListener("mousemove", rotate);
    window.removeEventListener("mouseup", stopRotating);
  };

  window.addEventListener("mousemove", rotate);
  window.addEventListener("mouseup", stopRotating);
});

// Shake buttons when checkbox is clicked
shakeCheckbox.addEventListener("change", () => {
  if (shakeCheckbox.checked) {
    buttons.forEach(button => {
      button.classList.add("shake");
    });
  } else {
    buttons.forEach(button => {
      button.classList.remove("shake");
    });
  }
});

// Toggle black and white when toggle switch is clicked
const captions = document.querySelectorAll(".caption"); // Select all captions
bwToggle.addEventListener("change", () => {
  if (bwToggle.checked) {
    document.body.style.filter = "grayscale(100%)";
    captions.forEach(caption => {
      caption.style.visibility = "visible"; // Make captions visible
    });
  } else {
    document.body.style.filter = "grayscale(0%)";
    captions.forEach(caption => {
      caption.style.visibility = "hidden"; // Hide captions but keep their space
    });
  }
});

// Change background color with vertical slider
bgColorSlider.addEventListener("input", (event) => {
  const hue = event.target.value;
  document.body.style.backgroundColor = `hsl(${hue}, 100%, 80%)`;
});

// Play sound when space bar is pressed
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    spaceBarSound.play();
  }
});

// Select the explosion toggle and apply explosion effect
const explosionToggle = document.getElementById("explosionToggle");

explosionToggle.addEventListener("change", () => {
  if (explosionToggle.checked) {
    // Apply explosion effect to all buttons
    buttons.forEach(button => {
      button.classList.add("explode");
    });
  } else {
    // Revert the explosion effect and make the buttons reappear
    buttons.forEach(button => {
      button.classList.remove("explode");
      button.style.transform = 'scale(1)'; // Reset size to normal
      button.style.opacity = '1'; // Reset opacity to full
    });
  }
});

document.getElementById("runProgramInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") { // Check if the Enter key was pressed
    const inputValue = e.target.value.trim().toUpperCase();
    if (inputValue === "RUN PROGRAM") {
      moveButtonsRandomly();
      e.target.value = ""; // Clear the input field after the action
    }
  }
});

function moveButtonsRandomly() {
  // Select all buttons in the control panel
  const buttons = document.querySelectorAll(".control-button, .knob, .slider, .switch, .vertical-switch");

  buttons.forEach((button) => {
    const randomX = Math.random() * (window.innerWidth - button.offsetWidth);
    const randomY = Math.random() * (window.innerHeight - button.offsetHeight);

    button.style.position = "absolute";
    button.style.left = `${randomX}px`;
    button.style.top = `${randomY}px`;
  });
}

// Print page functionality
document.getElementById("printButton").addEventListener("click", function () {
  window.print();
});

// Light switch functionality
document.addEventListener("DOMContentLoaded", () => {
  const lightSwitch = document.getElementById("lightSwitch");
  const overlay = document.getElementById("overlay");

  lightSwitch.addEventListener("click", (event) => {
    const rect = lightSwitch.getBoundingClientRect();
    const clickY = event.clientY - rect.top; // Position of the click relative to the image
    const halfHeight = rect.height / 2;

    if (clickY < halfHeight) {
      // Top half clicked - activate the overlay
      overlay.style.opacity = 1; // Show the overlay
    } else {
      // Bottom half clicked - deactivate the overlay
      overlay.style.opacity = 0; // Hide the overlay
    }
  });
});

// When the refresh button is clicked, the page reloads
document.getElementById('refreshButton').addEventListener('click', function() {
  location.reload();  // This reloads the page
});

// Joystick drag functionality
const joystick = document.getElementById("joystick");
let joystickDragging = false;
let joystickStartX = 0;

joystick.addEventListener("mousedown", (event) => {
  joystickDragging = true;
  joystickStartX = event.clientX;
  event.preventDefault(); // Prevent text selection
});

document.addEventListener("mousemove", (event) => {
  if (!joystickDragging) return;

  const deltaX = event.clientX - joystickStartX;

  // Move all buttons horizontally based on deltaX
  buttons.forEach((button) => {
    const currentTransform = button.style.transform || "";
    const translateMatch = currentTransform.match(/translateX\(([-0-9.]+)px\)/);
    const currentTranslateX = translateMatch ? parseFloat(translateMatch[1]) : 0;

    // Calculate the new translateX value
    const newTranslateX = currentTranslateX + deltaX;

    // Preserve other transforms (e.g., scale, rotate)
    const updatedTransform = currentTransform
      .replace(/translateX\(([-0-9.]+)px\)/, "") // Remove existing translateX
      .trim();

    button.style.transform = `${updatedTransform} translateX(${newTranslateX}px)`;
  });

  joystickStartX = event.clientX; // Update start position
});

document.addEventListener("mouseup", () => {
  joystickDragging = false;
});
