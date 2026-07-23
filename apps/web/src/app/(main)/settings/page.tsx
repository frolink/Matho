'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@matho/ui';
import { SUPPORTED_LANGUAGES } from '@matho/shared';
import { RequireAuth } from '@/components/RequireAuth';

export default function SettingsPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-xl px-4 py-6">
        <h1 className="mb-4 text-xl font-semibold">Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <span
                key={lang.code}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm dark:border-gray-700"
              >
                {lang.name}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
