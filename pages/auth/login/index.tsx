import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Avatar } from "@nextui-org/avatar";
import { Divider } from "@nextui-org/divider";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useState, useMemo } from "react";
import { GoogleIcon, GithubIcon } from "@/components/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LogIn() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [userEmail, setUserEmail] = useState("")
    const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const [userPassword, setUserPassword] = useState("")
    const [error, setError] = useState("");

    const router = useRouter()

    const isInvalid = useMemo(() => {
        if (userEmail === "") return false;
    
        return validateEmail(userEmail) ? false : true;
    }, [userEmail]);

    const credentialsLoginHandler = async () => {
        const email = userEmail
        const password = userPassword

        const result = await signIn("credentials", {
            redirect: false, // Prevent automatic redirect
            email,
            password
        });

        console.log("Result: ", result)

        if (result?.error) {
            setError(result.error); // Set the error if there is one
          } else {
            router.push("/dashboard"); // Redirect to dashboard on successful sign-in
        }
    }

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-7 md:py-[0px]">
                <div className="inline-block max-w-lg text-left justify-center w-[30%]">
                    <h2 className={title({ class: "text-3xl lg:text-4xl" })}>Log In 👋</h2>
                    <Input
                        value={userEmail}
                        onValueChange={setUserEmail}
                        isRequired
                        variant="bordered"
                        type="email"
                        label="Email"
                        labelPlacement="inside"
                        placeholder="Enter your email"
                        className="mt-8"
                        isInvalid={isInvalid}
                        errorMessage="Please enter a valid email"
                    />
                    <Input
                        value={userPassword}
                        onValueChange={setUserPassword}
                        label="Password"
                        isRequired
                        variant="bordered"
                        placeholder="Enter your password"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        type={isVisible ? "text" : "password"}
                        className="mt-1"
                    />
                    {error && <p className="text-red-700 w-full flex justify-center items-center mt-2">{error}</p>}
                    <Button color="primary" className="mt-5 w-full" onClick={credentialsLoginHandler}>
                        Log In
                    </Button>
                    <div className="mt-5 flex space-x-4 justify-center items-center">
                        <Divider className="w-[150px]"/>
                        <Avatar name="OR" className="bg-transparent text-[15px] text-slate-400"/>
                        <Divider className="w-[150px]"/>
                    </div>
                    <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="mt-4 w-full" color="default" variant="bordered" startContent={<GoogleIcon/>}>Continue with Google</Button>
                    <Button onClick={() => signIn('github', { callbackUrl: '/dashboard' })} className="mt-1 w-full" color="default" variant="bordered" startContent={<GithubIcon/>}>Continue with GitHub</Button>
                    <Link size="sm" href="/auth/signup" className="mt-5 w-full flex justify-center items-center">Don't have an account? Sign Up</Link>
                </div>
            </section>
        </DefaultLayout>
    );
}
