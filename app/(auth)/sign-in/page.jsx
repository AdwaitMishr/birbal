"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import React, { useState } from "react";

const Page = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleGoogleSignIn = () => {
		signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	};

	const handleGitHubSignIn = () => {
		signIn.social({
			provider: "github",
			callbackURL: "/",
		});
	};

	return (
		<div className="flex min-h-screen">
			<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-background">
				<div className="w-full max-w-md space-y-8">
					<div className="flex flex-col items-center space-y-4">
						<Image src="/logo.svg" alt="Birbal Logo" width={160} height={160} />
						<div className="text-center space-y-2">
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								{isSignUp ? "Create your account" : "Welcome back"}
							</h1>
							<p className="text-muted-foreground">
								{isSignUp
									? "Start your journey with Birbal"
									: "Sign in to continue to Birbal"}
							</p>
						</div>
					</div>

					<div className="space-y-3">
						<Button
							variant="outline"
							className="w-full h-12 text-base font-medium transition-all duration-200 hover:bg-accent hover:shadow-md"
							onClick={handleGoogleSignIn}
						>
							<Image
								src="/google.svg"
								alt="Google"
								width={20}
								height={20}
								className="mr-3"
							/>
							Continue with Google
						</Button>

						<Button
							variant="outline"
							className="w-full h-12 text-base font-medium transition-all duration-200 hover:bg-accent hover:shadow-md"
							onClick={handleGitHubSignIn}
						>
							<Image
								src="/github.svg"
								alt="GitHub"
								width={20}
								height={20}
								className="mr-3"
							/>
							Continue with GitHub
						</Button>
					</div>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-4 text-muted-foreground">
								Or continue with email
							</span>
						</div>
					</div>
					<form className="space-y-4">
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-sm font-medium text-foreground"
							>
								Email address
							</label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-12 text-base"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="password"
								className="text-sm font-medium text-foreground"
							>
								Password
							</label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 text-base"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-12 text-base font-semibold transition-all duration-200 hover:shadow-lg"
						>
							{isSignUp ? "Create Account" : "Sign In"}
						</Button>
					</form>

					<p className="text-center text-sm text-muted-foreground">
						{isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
						<button
							type="button"
							onClick={() => setIsSignUp(!isSignUp)}
							className="font-semibold text-primary hover:text-primary/80 transition-colors"
						>
							{isSignUp ? "Sign in" : "Sign up"}
						</button>
					</p>
				</div>
			</div>

			<div className="hidden lg:flex flex-1 items-center justify-center bg-linear-to-br from-primary via-primary/90 to-secondary/30 relative overflow-hidden">
				
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.3)_0%,transparent_50%)]" />
				</div>

				<div className="relative w-full h-full flex items-center justify-center">
		
					<div className="absolute w-64 h-64 animate-float">
						<div className="w-full h-full bg-linear-to-br from-secondary/80 to-secondary/40 rotate-45 rounded-3xl shadow-2xl backdrop-blur-sm border border-secondary/30" />
					</div>

					<div className="absolute top-1/4 right-1/4 w-32 h-32 animate-float-delayed">
						<div className="w-full h-full bg-linear-to-br from-white/20 to-white/5 rounded-full shadow-xl backdrop-blur-sm border border-white/20" />
					</div>

					<div
						className="absolute bottom-1/4 left-1/4 w-24 h-24 animate-float"
						style={{ animationDelay: "1s" }}
					>
						<div className="w-full h-full bg-linear-to-br from-secondary/60 to-secondary/20 rotate-45 rounded-2xl shadow-lg backdrop-blur-sm border border-secondary/20" />
					</div>
					<div className="absolute top-1/3 left-1/3 w-16 h-16 animate-pulse-glow">
						<div className="w-full h-full bg-linear-to-br from-white/30 to-transparent rounded-full shadow-lg" />
					</div>

					<div
						className="absolute bottom-1/3 right-1/3 w-20 h-20 animate-pulse-glow"
						style={{ animationDelay: "2s" }}
					>
						<div className="w-full h-full bg-linear-to-br from-secondary/40 to-transparent rounded-full shadow-lg" />
					</div>

					<div className="absolute w-px h-48 bg-linear-to-b from-transparent via-white/30 to-transparent top-1/4 left-1/3" />
					<div className="absolute w-48 h-px bg-linear-to-r from-transparent via-secondary/50 to-transparent bottom-1/3 right-1/4" />
				</div>

				<div className="absolute bottom-12 left-12 right-12 text-center">
					<p className="text-white/80 text-lg font-medium italic">
						"Your intelligent companion for every question"
					</p>
					<p className="text-secondary/80 text-sm mt-2">— Birbal</p>
				</div>
			</div>
		</div>
	);
};

export default Page;
