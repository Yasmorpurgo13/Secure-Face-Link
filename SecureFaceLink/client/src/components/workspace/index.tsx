import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';

export function Workspace() {
  const { logoutMutation } = useAuth();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shared Workspace</h1>
        <Button
          variant="ghost"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <p className="text-muted-foreground">
            No documents shared yet
          </p>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Devices</h2>
          <p className="text-muted-foreground">
            No devices connected
          </p>
        </Card>
      </div>
    </div>
  );
}
