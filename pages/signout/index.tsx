import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav>
      {/* Sign-out button */}
      <button onClick={() => signOut({callbackUrl: "/"})}>Sign Out</button>
    </nav>
  );
}
