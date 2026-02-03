import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Code, GraduationCap, Newspaper, Sparkles } from "lucide-react";
import React, { useState } from "react";

export const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Draft a screenplay scene involving a time-loop paradox",
      "Generate a color palette for a cyberpunk-themed website",
      "Write a haiku about a server crashing on Friday evening",
      "Design a magic system based on musical instruments",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Explain the Fermi Paradox and possible solutions",
      "History of the first computer bug (the actual moth)",
      "Best ergonomic chairs for programmers in 2026",
      "How do noise-canceling headphones actually work?",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Create a reusable Modal component using Tailwind CSS",
      "How do I optimize database queries in Prisma?",
      "Explain the difference between 'interface' and 'type' in TypeScript",
      "Generate a Docker Compose file for a PostgreSQL container",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Explain Quantum Entanglement like I'm five",
      "A roadmap for learning System Design for seniors",
      "What is the difference between SQL and NoSQL databases?",
      "How does the browser rendering engine work?",
    ],
  },
];

const ChatWelcomeTabs = ({ userName, onMessageSelect }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-3xl space-y-10">
        <h1 className="text-4xl font-bold tracking-tight">
          How can I help you,{" "}
          <span className="text-secondary">
            {(userName || "User").split(" ")[0]}
          </span>
          ?
        </h1>

        <div className="flex flex-wrap gap-3">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className="h-10 px-5 text-sm font-medium transition-all duration-200"
            >
              {tab.icon}
              <span className="ml-2">{tab.tabName}</span>
            </Button>
          ))}
        </div>

        <div className="space-y-2 min-h-60">
          {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
            <div key={index}>
              <button
                onClick={() => onMessageSelect(message)}
                className="w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 py-3 px-4 rounded-lg -mx-4"
              >
                {message}
              </button>
              {index < CHAT_TAB_MESSAGE[activeTab].messages.length - 1 && (
                <Separator className="my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;