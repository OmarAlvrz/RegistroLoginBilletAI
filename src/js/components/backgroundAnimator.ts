interface SquareConfig {
  animationDuration: number;
  size: number;
  opacity: number;
  position: {
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
  };
}

export class BackgroundAnimator {
  private containerId: string;
  private squaresCount: number = 11;
  private squareConfigs: SquareConfig[] = [
    {
      animationDuration: 4,
      size: 300,
      opacity: 0.5,
      position: { left: '3%', top: '-21%' }
    },
    {
      animationDuration: 6,
      size: 400,
      opacity: 0.4,
      position: { right: '-5%', top: '-12%' }
    },
    {
      animationDuration: 5,
      size: 200,
      opacity: 0.1,
      position: { left: '-5%', bottom: '0%' }
    },
    {
      animationDuration: 10,
      size: 100,
      opacity: 0.9,
      position: { right: '27%', top: '70%' }
    },
    {
      animationDuration: 6,
      size: 250,
      opacity: 0.1,
      position: { left: '32%', bottom: '29%' }
    },
    {
      animationDuration: 9,
      size: 80,
      opacity: 0.8,
      position: { left: '10%', top: '35%' }
    },
    {
      animationDuration: 3,
      size: 300,
      opacity: 0.1,
      position: { right: '-5%', bottom: '0%' }
    },
    {
      animationDuration: 8,
      size: 150,
      opacity: 0.7,
      position: { left: '20%', top: '50%' }
    },
    {
      animationDuration: 7,
      size: 180,
      opacity: 0.3,
      position: { right: '15%', bottom: '20%' }
    },
    {
      animationDuration: 5,
      size: 120,
      opacity: 0.6,
      position: { left: '60%', top: '25%' }
    },
    {
      animationDuration: 4,
      size: 220,
      opacity: 0.2,
      position: { right: '40%', bottom: '40%' }
    }
  ];

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public initialize(): void {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container with ID ${this.containerId} not found`);
      return;
    }

    // Add the index-page class to the container
    container.classList.add('index-page');

    // Create and append squares
    for (let i = 0; i < this.squaresCount; i++) {
      const square = document.createElement('div');
      square.classList.add('squares', `square${i + 1}`);
      container.appendChild(square);
    }
  }
}