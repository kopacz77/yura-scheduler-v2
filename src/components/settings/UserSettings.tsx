import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function UserSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Update your personal information and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <p className="text-sm text-muted-foreground">{session.user.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Role</label>
          <p className="text-sm text-muted-foreground">
            {session.user.role?.toLowerCase()}
          </p>
        </div>
      </div>
    </div>
  );
}