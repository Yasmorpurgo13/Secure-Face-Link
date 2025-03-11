import { DevicePair } from "@/components/device-pair";
import { Workspace } from "@/components/workspace";
import { useAuth } from "@/hooks/use-auth";

export default function WorkspacePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {user?.isPaired ? (
        <Workspace />
      ) : (
        <div className="container mx-auto p-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">
              Complete Device Setup
            </h1>
            <DevicePair />
          </div>
        </div>
      )}
    </div>
  );
}
