import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Camera } from 'lucide-react';
import { useFaceAuth } from '@/hooks/use-face-auth';

interface FaceCaptureProps {
  onCapture: (descriptor: Float32Array) => void;
}

export function FaceCapture({ onCapture }: FaceCaptureProps) {
  const { videoRef, isLoading, error, startVideo, detectFace } = useFaceAuth();

  useEffect(() => {
    startVideo();
  }, []);

  const handleCapture = async () => {
    const descriptor = await detectFace();
    if (descriptor) {
      onCapture(descriptor);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4">
        {error}
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      </div>
      <Button
        onClick={handleCapture}
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" />
        Capture Face
      </Button>
    </Card>
  );
}
