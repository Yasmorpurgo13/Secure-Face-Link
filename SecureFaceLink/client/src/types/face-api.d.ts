declare module 'face-api.js' {
  export const nets: {
    tinyFaceDetector: {
      loadFromUri(path: string): Promise<void>;
    };
    faceLandmark68Net: {
      loadFromUri(path: string): Promise<void>;
    };
    faceRecognitionNet: {
      loadFromUri(path: string): Promise<void>;
    };
  };

  export class TinyFaceDetectorOptions {
    constructor();
  }

  export function detectSingleFace(
    input: HTMLVideoElement | HTMLImageElement,
    options: TinyFaceDetectorOptions
  ): Promise<{
    withFaceLandmarks(): {
      withFaceDescriptor(): Promise<{
        descriptor: Float32Array;
      } | undefined>;
    };
  }>;
}
