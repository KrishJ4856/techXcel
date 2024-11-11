// import { title } from "@/components/primitives";
// import DefaultLayout from "@/layouts/default";
// import { signIn } from "next-auth/react";

// export default function SignIn() {
//   return (
//     <DefaultLayout>
//       <div>
//       <h1>Sign In to RoadmapZen</h1>
//       <button onClick={() => signIn("github")}>Sign in with GitHub</button>
//     </div>
//     </DefaultLayout>
//   );
// }


// pages/auth/index.tsx
import { GetServerSideProps } from 'next';

const AuthIndex = () => {
  return null; // This component will never render due to the redirect
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: '/auth/login', // Redirect to /auth/login
      permanent: false, // Set to true for a permanent redirect (301)
    },
  };
};

export default AuthIndex;
