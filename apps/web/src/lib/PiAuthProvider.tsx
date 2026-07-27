'use client';

import { useEffect } from 'react';
import { loginWithPi } from './pi-auth';

export function PiAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {

    const run = async () => {

      const existing =
        localStorage.getItem('pi_user');

      if (existing) return;

      try {

        const auth = await loginWithPi();

        localStorage.setItem(
          'pi_user',
          JSON.stringify(auth)
        );

      } catch (error) {

        console.log(
          'Pi login skipped',
          error
        );

      }

    };


    run();

  }, []);


  return children;
}
