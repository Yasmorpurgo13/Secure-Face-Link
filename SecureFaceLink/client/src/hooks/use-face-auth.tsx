import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useToast } from './use-toast';

export function useFaceAuth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load face detection models');
        toast({
          title: "Error",
          description: "Failed to initialize face detection",
          variant: "destructive"
        });
      }
    };

    loadModels();
  }, [toast]);

  const startVideo = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Failed to access camera');
      toast({
        title: "Error",
        description: "Camera access denied",
        variant: "destructive"
      });
    }
  };

  const detectFace = async (): Promise<Float32Array | null> => {
    if (!videoRef.current) return null;

    try {
      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (!detection) return null;

      const withLandmarks = await detection.withFaceLandmarks();
      const withDescriptor = await withLandmarks.withFaceDescriptor();

      return withDescriptor?.descriptor || null;
    } catch (err) {
      console.error('Face detection error:', err);
      return null;
    }
  };

  return {
    videoRef,
    isLoading,
    error,
    startVideo,
    detectFace
  };
}