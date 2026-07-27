'use client';

export async function initPi() {
  if (typeof window === 'undefined') return null;

  const Pi = (window as any).Pi;

  if (!Pi) {
    console.log('Pi SDK belum tersedia');
    return null;
  }

  await Pi.init({
    version: '2.0',
    sandbox: true,
  });

  return Pi;
}


export async function loginWithPi() {
  const Pi = await initPi();

  if (!Pi) {
    throw new Error('Pi SDK belum aktif');
  }

  const auth = await Pi.authenticate(
    ['username'],
    () => {
      console.log('Incomplete payment callback');
    }
  );

  return auth;
}
