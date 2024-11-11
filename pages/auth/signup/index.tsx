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
import { hash } from "bcryptjs";
import User from "@/models/User";
import { useRouter } from "next/router";

export default function SignUp() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [userEmail, setUserEmail] = useState("")
    const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const [userPassword, setUserPassword] = useState({first: "", second: ""})

    const [error, setError] = useState("")

    const router = useRouter()

    const isInvalidEmail = useMemo(() => {
        if (userEmail === "") return false;
    
        return validateEmail(userEmail) ? false : true;
    }, [userEmail]);

    const isInvalidPassword = useMemo(() => {
        if (userPassword.first != userPassword.second) return true
        else return false
    }, [userPassword]);

    const credentialsSignupHandler = async () => {
        const email = userEmail;
        const password = userPassword.first;
    
        // Hash the password before storing it
        const hashedPassword = await hash(password, 10);
    
        // Call your API route to create a new user
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password: hashedPassword }),
        });
    
        if (response.ok) {
            // Instead of signing in immediately, you can wait for the response and then sign in
            const signInResult = await signIn("credentials", { redirect: false, email, password });
            console.log("Sign In Result:", signInResult)
    
            if (signInResult?.error) {
                setError(signInResult.error); // Display error if sign-in failed
            } else {
                // Sign-in successful, redirect to dashboard
                router.push("/topic");
            }
        } else {
            const errorData = await response.json();
            setError(errorData.message || "Sign-up failed. Please try again.");
        }
    };
    

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-7 md:py-[0px]">
                <div className="inline-block max-w-lg text-left justify-center w-[30%]">
                    <h2 className={title({ class: "text-3xl lg:text-4xl" })}>Sign Up 👋</h2>
                    <Input
                        value={userEmail}
                        isRequired
                        variant="bordered"
                        type="email"
                        label="Email"
                        labelPlacement="inside"
                        placeholder="Enter your email"
                        className="mt-8"
                        isInvalid={isInvalidEmail}
                        errorMessage="Please enter a valid email"
                        onValueChange={setUserEmail}
                    />
                    <Input
                        value={userPassword.first}
                        onValueChange={(value: string) => setUserPassword({first: value, second: userPassword.second})}
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
                    <Input
                        value={userPassword.second}
                        onValueChange={(value: string) => setUserPassword({first: userPassword.first, second: value})}
                        label="Confirm Password"
                        isRequired
                        variant="bordered"
                        placeholder="Confirm your password"
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
                        className="mt-3"
                        isInvalid={isInvalidPassword}
                        errorMessage="Password does not match"
                    />
                    {error && <p className="text-red-700 mt-4 w-full flex justify-center items-center">{error}</p>}
                    <Button color="primary" className="mt-3 w-full" onClick={credentialsSignupHandler}>
                        Sign Up
                    </Button>
                    <div className="mt-5 flex space-x-4 justify-center items-center">
                        <Divider className="w-[150px]"/>
                        <Avatar name="OR" className="bg-transparent text-[15px] text-slate-400"/>
                        <Divider className="w-[150px]"/>
                    </div>
                    <Button onClick={() => signIn('google', { callbackUrl: '/topic' })} className="mt-5 w-full" color="default" variant="bordered" startContent={<GoogleIcon/>}>Sign Up with Google</Button>
                    <Button onClick={() => signIn('github', { callbackUrl: '/topic' })} className="mt-1 w-full" color="default" variant="bordered" startContent={<GithubIcon/>}>Sign Up with GitHub</Button>
                    <Link size="sm" href="/auth/login" className="mt-5 w-full flex justify-center items-center">Already have an account? Log In</Link>
                </div>
            </section>
        </DefaultLayout>
    );
}
