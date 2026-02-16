"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const StarryBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const particles = [];
    const particleCount = 50;
    const connectionDistance = 140;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.1})`; // Gold dust
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Right Side Background: The "Void" (Pure Black to Deep Navy)
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#050a14");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        for (let j = index + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsLoading("google");
    await signIn.social({ provider: "google", callbackURL: "/" });
  };

  const handleGitHubSignIn = async () => {
    setIsLoading("github");
    await signIn.social({ provider: "github", callbackURL: "/" });
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 lg:px-12 relative z-10 bg-[#0a1e36] text-[#fdfbf7] border-r border-[#d4af37]/20 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--tw-gradient-stops))] from-[#112240] via-[#0a1e36] to-[#050d18] pointer-events-none"></div>

        <div className="w-full max-w-sm space-y-12 relative">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative group cursor-default">
              <div className="absolute -inset-8 bg-[#d4af37]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <Image
                src="/logo.svg"
                alt="Birbal Logo"
                width={180}
                height={180}
                className="relative drop-shadow-2xl transform group-hover:scale-105 transition duration-500"
                priority
              />
            </div>

            <div className="space-y-3">
              <h1 className="text-5xl font-serif font-medium tracking-tight text-[#d4af37] drop-shadow-sm">
                Welcome, Traveler.
              </h1>
              <p className="text-[#a0b0c5] text-lg font-light">
                The royal court is now in session.
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <Button
              variant="outline"
              className="w-full h-14 text-base font-medium text-[#fdfbf7] bg-white/5 border border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-300 shadow-lg relative overflow-hidden group"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-300" />
              {isLoading === "google" ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#d4af37]" />
              ) : (
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                  className="mr-3 opacity-90"
                />
              )}
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full h-14 text-base font-medium text-[#fdfbf7] bg-white/5 border border-[#d4af37]/30 hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition-all duration-300 shadow-lg relative overflow-hidden group"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-[#d4af37] opacity-0 group-hover:opacity-100 transition-all duration-300" />
              {isLoading === "github" ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#d4af37]" />
              ) : (
                <Image
                  src="/github.svg"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className="mr-3 invert opacity-90"
                />
              )}
              Continue with GitHub
            </Button>
          </div>

          <div className="pt-8 text-center mt-4">
            <p className="text-xs text-[#5a6a7a] tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity cursor-default">
              Secure Royal Archive Access
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-black">
        <StarryBackground />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 z-10 pointer-events-none">
          <div className="bg-[#050d18]/60 backdrop-blur-xl border border-[#d4af37]/20 p-10 rounded-xl max-w-lg text-center mx-12 shadow-2xl">
            <p className="text-[#e5d5b7] text-2xl font-serif italic font-light tracking-wide leading-relaxed">
              "Intelligence is not just knowing the path, but walking it with
              wit."
            </p>
            <div className="w-16 h-px bg-[#d4af37]/50 mx-auto my-6" />
            <p className="text-[#d4af37] text-xs tracking-[0.3em] font-bold uppercase opacity-80">
              — Birbal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
