"use client";

import { authenticatePi } from "@/lib/pi-auth";

export default function PiLoginButton(){

async function login(){

try{

const auth = await authenticatePi();

console.log(auth);

localStorage.setItem(
"pi_user",
JSON.stringify(auth)
);

}catch(e){

console.error(e);

}

}


return (
<button
onClick={login}
className="rounded-xl bg-black px-5 py-3 text-white"
>
Sign in with Pi
</button>
);

}
