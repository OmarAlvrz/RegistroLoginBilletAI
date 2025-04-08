import '../css/styles.css';
import { BackgroundAnimator } from './components/backgroundAnimator';
import { BillScanner } from './components/billScanner';

// Initialize background animation
const backgroundAnimator = new BackgroundAnimator('background-animation');
backgroundAnimator.initialize();

// Initialize bill scanner
document.addEventListener('DOMContentLoaded', () => {
  const billScanner = new BillScanner({
    modelUrl: "https://teachablemachine.withgoogle.com/models/lomwQ0x-4/",
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
});