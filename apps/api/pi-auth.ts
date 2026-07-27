export async function initPi() {
  if (typeof window === "undefined") return;

  const Pi = (window as any).Pi;

  if (!Pi) {
    console.log("Pi SDK belum tersedia");
    return null;
  }

  await Pi.init({
    version: "2.0",
    sandbox: true,
  });

  return Pi;
}


export async function authenticatePi() {
  const Pi = await initPi();

  if (!Pi) {
    throw new Error("Pi SDK tidak ditemukan");
  }

  const result = await Pi.authenticate(
    ["username"],
    () => {
      console.log("Payment event ignored");
    }
  );

  return result;
}
