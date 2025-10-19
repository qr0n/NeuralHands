/**
 * Pure JavaScript implementation of MLP model for ASL recognition
 * Loads weights from JSON and performs inference without TensorFlow.js
 */

interface LayerWeights {
  kernel: number[][];
  bias: number[];
}

interface MLPWeights {
  dense: LayerWeights;
  dense_1: LayerWeights;
  dense_2: LayerWeights;
}

export interface PredictionResult {
  label: string;
  confidence: number;
  probabilities: number[];
}

const CLASS_LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'del', 'nothing'
];

export class MLPModel {
  private weights: MLPWeights | null = null;
  private isLoaded = false;

  /**
   * Load model weights from JSON file
   */
  async loadWeights(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/models/mlp_weights.json');
      if (!response.ok) {
        throw new Error(`Failed to load weights: ${response.statusText}`);
      }
      
      this.weights = await response.json();
      this.isLoaded = true;
      
      console.log('✅ MLP model loaded successfully');
      console.log('  - Input: 63 features');
      console.log('  - Hidden 1: 128 neurons');
      console.log('  - Hidden 2: 64 neurons');
      console.log('  - Output: 28 classes');
    } catch (error) {
      console.error('❌ Failed to load MLP weights:', error);
      throw error;
    }
  }

  /**
   * Predict ASL sign from MediaPipe landmarks
   * @param landmarks - Array of 63 values (21 landmarks × 3 coords)
   * @returns Prediction with label and confidence
   */
  predict(landmarks: number[]): PredictionResult {
    if (!this.weights || !this.isLoaded) {
      throw new Error('Model weights not loaded. Call loadWeights() first.');
    }

    if (landmarks.length !== 63) {
      throw new Error(`Expected 63 features, got ${landmarks.length}`);
    }

    // Forward pass through the network
    let output = landmarks;

    // Layer 1: Dense(128) + ReLU
    output = this.dense(output, this.weights.dense);
    output = this.relu(output);

    // Layer 2: Dense(64) + ReLU
    output = this.dense(output, this.weights.dense_1);
    output = this.relu(output);

    // Layer 3: Dense(28) + Softmax
    output = this.dense(output, this.weights.dense_2);
    output = this.softmax(output);

    // Get prediction
    const classIndex = output.indexOf(Math.max(...output));
    const confidence = output[classIndex];

    return {
      label: CLASS_LABELS[classIndex],
      confidence,
      probabilities: output
    };
  }

  /**
   * Dense layer: output = input · kernel + bias
   */
  private dense(input: number[], weights: LayerWeights): number[] {
    const { kernel, bias } = weights;
    const outputSize = bias.length;
    const inputSize = input.length;

    const output = new Array(outputSize);

    for (let i = 0; i < outputSize; i++) {
      let sum = bias[i];
      for (let j = 0; j < inputSize; j++) {
        sum += input[j] * kernel[j][i];
      }
      output[i] = sum;
    }

    return output;
  }

  /**
   * ReLU activation: max(0, x)
   */
  private relu(input: number[]): number[] {
    return input.map(x => Math.max(0, x));
  }

  /**
   * Softmax activation: normalize to probability distribution
   */
  private softmax(input: number[]): number[] {
    // Subtract max for numerical stability
    const max = Math.max(...input);
    const exp = input.map(x => Math.exp(x - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  }

  /**
   * Check if model is loaded
   */
  isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Get list of supported labels
   */
  getLabels(): string[] {
    return [...CLASS_LABELS];
  }
}

/**
 * Extract and normalize landmarks from MediaPipe results
 * @param landmarks - MediaPipe hand landmarks (21 points)
 * @param handedness - 'Left' or 'Right'
 * @returns Array of 63 normalized features
 */
export function extractLandmarkFeatures(
  landmarks: Array<{ x: number; y: number; z: number }>,
  handedness: string
): number[] {
  const features: number[] = [];

  // Flatten x, y, z coordinates
  for (const lm of landmarks) {
    features.push(lm.x, lm.y, lm.z);
  }

  // Mirror right hand to match training data (left hand)
  if (handedness === 'Right') {
    for (let i = 0; i < features.length; i += 3) {
      features[i] = 1 - features[i]; // Mirror x coordinate
    }
  }

  return features;
}

/**
 * Singleton instance for easy access
 */
let modelInstance: MLPModel | null = null;

export function getMLPModel(): MLPModel {
  if (!modelInstance) {
    modelInstance = new MLPModel();
  }
  return modelInstance;
}
