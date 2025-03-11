import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useDevicePair } from '@/hooks/use-device-pair';
import { Loader2, Smartphone } from 'lucide-react';
import { useState } from 'react';

export function DevicePair() {
  const { isPairing, pairingCode, initiateDevicePair, confirmPair } = useDevicePair();
  const [inputCode, setInputCode] = useState('');

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Device Pairing</h3>
      </CardHeader>
      <CardContent>
        {isPairing ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-xl font-bold mb-2">{pairingCode}</p>
            <p className="text-sm text-muted-foreground">
              Enter this code on your other device
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={initiateDevicePair}
              className="w-full"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Start Pairing
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Input
              placeholder="Enter pairing code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <Button
              onClick={() => confirmPair(inputCode)}
              className="w-full"
              disabled={!inputCode}
            >
              Confirm Pairing
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
