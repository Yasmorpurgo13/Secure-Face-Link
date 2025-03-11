import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export function useDevicePair() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PAIR_REQUEST') {
          setPairingCode(data.code);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish device pairing connection",
        variant: "destructive"
      });
    };

    setWs(websocket);

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [toast]);

  const initiateDevicePair = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      toast({
        title: "Connection Error",
        description: "No active connection to pair devices",
        variant: "destructive"
      });
      return;
    }

    setIsPairing(true);
    const code = Math.random().toString(36).substr(2, 6);
    setPairingCode(code);
    ws.send(JSON.stringify({ type: 'PAIR_REQUEST', code }));
  };

  const confirmPair = async (code: string) => {
    try {
      const deviceId = `device_${Date.now()}`;
      const response = await fetch('/api/pair-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to pair device');
      }

      setIsPairing(false);
      setPairingCode(null);
      toast({
        title: "Success",
        description: "Device paired successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to pair device",
        variant: "destructive"
      });
    }
  };

  return {
    isPairing,
    pairingCode,
    initiateDevicePair,
    confirmPair
  };
}