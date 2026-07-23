'use client';

import { Avatar, Badge, Button, Card, CardContent } from '@matho/ui';
import { RequireAuth } from '@/components/RequireAuth';
import { usePiAuth } from '@/lib/pi-auth-context';

function ProfileContent() {
  const { user, signOut } = usePiAuth();

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <Card>
        <CardContent className="flex items-center gap-4 py-6">
          <Avatar name={user?.username ?? 'Pioneer'} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{user?.username}</p>
              <Badge variant="success">Pi verified</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Signed in with Pi Network{user?.piUid ? ` · ${user.piUid}` : ''}
            </p>
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" className="mt-4 w-full" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
