// Define interfaces for Teachable Machine types
interface TMImage {
  load: (modelURL: string, metadataURL: string) => Promise<TMModel>;
  Webcam: new (width: number, height: number, flip: boolean) => TMWebcam;
}

interface TMModel {
  getTotalClasses: () => number;
  predict: (image: HTMLCanvasElement) => Promise<TMPrediction[]>;
}

interface TMWebcam {
  canvas: HTMLCanvasElement;
  setup: (options: { facingMode: string }) => Promise<void>;
  play: () => Promise<void>;
  stop: () => void;
  update: () => void;
  flip: () => Promise<void>;
}

interface TMPrediction {
  className: string;
  probability: number;
}

// Declare the global tmImage variable
declare global {
  interface Window {
    tmImage: TMImage;
    // Remove the conflicting orientation declaration
    // orientation?: number; 
  }
}

interface BillScannerConfig {
  modelUrl: string;
  webcamContainerId: string;
  labelContainerId: string;
  startButtonId: string;
  flipButtonId: string;
}

export class BillScanner {
  private modelUrl: string;
  private webcamContainerId: string;
  private labelContainerId: string;
  private startButtonId: string;
  private flipButtonId: string;
  
  private model: TMModel | null = null;
  private webcam: TMWebcam | null = null;
  private labelContainer: HTMLElement | null = null;
  private maxPredictions: number = 0;
  private facingMode: string = "user";
  private isInitialized: boolean = false;
  private animationFrameId: number | null = null;
  private useSpeechSynthesis: boolean = false;
  private lastDetectedClass: string = "";

  constructor(config: BillScannerConfig) {
    this.modelUrl = config.modelUrl;
    this.webcamContainerId = config.webcamContainerId;
    this.labelContainerId = config.labelContainerId;
    this.startButtonId = config.startButtonId;
    this.flipButtonId = config.flipButtonId;
  }
  
  // Add the loop method declaration
  private async loop(): Promise<void> {
    if (this.webcam) {
      this.webcam.update();
      await this.predict();
      this.animationFrameId = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('Scanner is already initialized');
      return;
    }

    try {
      const modelURL = this.modelUrl + "model.json";
      const metadataURL = this.modelUrl + "metadata.json";

      // Load the model
      this.model = await window.tmImage.load(modelURL, metadataURL);
      this.maxPredictions = this.model.getTotalClasses();

      // Setup webcam with dimensions similar to tfjs.html example
      const flip = true;
      this.webcam = new window.tmImage.Webcam(400, 400, flip); // Match size from tfjs.html
      await this.webcam.setup({ facingMode: this.facingMode });
      await this.webcam.play();
      
      // Start prediction loop
      this.animationFrameId = window.requestAnimationFrame(this.loop.bind(this));

      // Add webcam to DOM
      const webcamContainer = document.getElementById(this.webcamContainerId);
      if (webcamContainer && this.webcam) {
        webcamContainer.innerHTML = ''; // Clear any existing content
        webcamContainer.appendChild(this.webcam.canvas);
        
        // Center the webcam canvas
        this.webcam.canvas.style.display = 'block';
        this.webcam.canvas.style.margin = '0 auto';
        this.webcam.canvas.style.maxWidth = '100%';
        this.webcam.canvas.style.maxHeight = '100%';
        
        // Add accessibility attributes
        this.webcam.canvas.setAttribute('aria-hidden', 'true');
      }

      // Get label container
      this.labelContainer = document.getElementById(this.labelContainerId);
      
      // Add speech synthesis for accessibility
      if ('speechSynthesis' in window) {
        this.useSpeechSynthesis = true;
      }

      // Disable start button
      const startButton = document.getElementById(this.startButtonId);
      if (startButton) {
        startButton.setAttribute('disabled', 'true');
        startButton.textContent = 'Cámara Activa';
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing scanner:', error);
      
      // Show error message
      if (this.labelContainer) {
        this.labelContainer.innerHTML = "Error al iniciar la cámara";
      }
    }
  }

  private async predict(): Promise<void> {
    if (!this.model || !this.webcam || !this.labelContainer) return;

    try {
      const predictions = await this.model.predict(this.webcam.canvas);
      
      let highestProbability = 0;
      let detectedClass = "";
      let isDetected = false;

      // Find the class with the highest probability
      for (let i = 0; i < this.maxPredictions; i++) {
        const classPrediction = predictions[i];
        if (classPrediction.probability > highestProbability) {
          highestProbability = classPrediction.probability;
          detectedClass = classPrediction.className;
        }
      }

      // Mostrar todas las predicciones para depuración
      console.log("Predicciones:", predictions.map(p => `${p.className}: ${Math.round(p.probability * 100)}%`));

      // Usar un umbral más bajo como en tfjs.html
      if (highestProbability > 0.40) {  // Umbral más bajo para ver más predicciones
        // Update the display with large, readable text and colorful background
        const percentage = Math.round(highestProbability * 100);
        this.labelContainer.innerHTML = `
          <div style="background: linear-gradient(45deg, #ba54f5, #e14eca); padding: 15px; border-radius: 8px; font-size: 2rem; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
            <strong>${detectedClass}</strong>
            <div style="font-size: 1.2rem; opacity: 0.9;">${percentage}% seguridad</div>
          </div>
        `;
        
        // Speak the result for accessibility (only when it changes)
        if (this.useSpeechSynthesis && this.lastDetectedClass !== detectedClass) {
          this.speakResult(detectedClass);
          this.lastDetectedClass = detectedClass;
        }
        
        isDetected = true;
      }

      if (!isDetected) {
        this.labelContainer.innerHTML = `
          <div style="background: rgba(0,0,0,0.7); padding: 15px; border-radius: 8px; font-size: 1.8rem; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
            Centrando billete...
          </div>
        `;
        this.lastDetectedClass = "";
      }
    } catch (error) {
      console.error('Error during prediction:', error);
    }
  }
  
  // Add speech synthesis for accessibility
  private speakResult(text: string): void {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }

  public async flipCamera(): Promise<void> {
    if (!this.webcam || !this.isInitialized) return;

    try {
      // Toggle facing mode
      this.facingMode = this.facingMode === "user" ? "environment" : "user";
      
      // Stop current animation frame
      if (this.animationFrameId !== null) {
        window.cancelAnimationFrame(this.animationFrameId);
      }

      // Flip camera
      await this.webcam.flip();
      this.webcam.stop();
      await this.webcam.setup({ facingMode: this.facingMode });
      await this.webcam.play();
      
      // Restart animation frame
      this.animationFrameId = window.requestAnimationFrame(this.loop.bind(this));
    } catch (error) {
      console.error('Error flipping camera:', error);
    }
  }

  public cleanup(): void {
    if (this.animationFrameId !== null) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.webcam) {
      this.webcam.stop();
    }

    this.isInitialized = false;
  }
}