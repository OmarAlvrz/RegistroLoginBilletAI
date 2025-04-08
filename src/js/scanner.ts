import '../css/styles.css';
import { BillScanner } from './components/billScanner';

// Initialize bill scanner when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Restauramos la animación de fondo
  const backgroundAnimation = document.getElementById('background-animation');
  if (backgroundAnimation) {
    // Añadimos la clase para activar la animación
    backgroundAnimation.classList.add('index-page');
    
    // Creamos los cuadrados animados
    for (let i = 1; i <= 11; i++) {
      const square = document.createElement('div');
      square.classList.add('squares', `square${i}`);
      backgroundAnimation.appendChild(square);
    }
  }

  const billScanner = new BillScanner({
    modelUrl: "hhttps://teachablemachine.withgoogle.com/models/lomwQ0x-4/",
    webcamContainerId: "webcam-container",
    labelContainerId: "label-container",
    startButtonId: "startButton",
    flipButtonId: "flipButton"
  });

  // Set up event listeners
  const startButton = document.getElementById('startButton');
  const flipButton = document.getElementById('flipButton');
  
  if (startButton) {
    startButton.addEventListener('click', () => billScanner.initialize());
  }
  
  if (flipButton) {
    flipButton.addEventListener('click', () => billScanner.flipCamera());
  }
  
  // Add accessibility features
  document.addEventListener('keydown', (event) => {
    // Space bar to start camera
    if (event.code === 'Space' && startButton && 
        !(startButton as HTMLButtonElement).hasAttribute('disabled')) {
      event.preventDefault();
      billScanner.initialize();
    }
    
    // F key to flip camera
    if (event.code === 'KeyF' && flipButton) {
      event.preventDefault();
      billScanner.flipCamera();
    }
  });
  
  // Handle orientation changes for mobile
  window.addEventListener('orientationchange', () => {
    // Adjust UI for orientation
    setTimeout(() => {
      const webcamContainer = document.getElementById('webcam-container');
      if (webcamContainer) {
        // Use type assertion to access orientation
        const currentOrientation = window.orientation as number;
        if (currentOrientation === 90 || currentOrientation === -90) {
          // Landscape
          webcamContainer.style.height = '80vh';
        } else {
          // Portrait
          webcamContainer.style.height = '60vh';
        }
      }
    }, 300);
  });
});