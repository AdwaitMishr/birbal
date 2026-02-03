"use client";
import { useState, useEffect } from "react";
import { Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ChatMessageForm = ({ initialMessage, onMessageChange }) => {
    const [message, setMessage] = useState("");
    useEffect(() => {
        if (initialMessage) {
            setMessage(initialMessage);
            onMessageChange?.("");
        }
    }, [initialMessage, onMessageChange])

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            console.log("Message Sent");

        } catch (error) {
            console.log(error);

        }
    }
    return (
        <div className="w-full max-w-3xl mx-auto px-6 pb-8">
            <form onSubmit={handleSubmit}>
                <div className="relative rounded-2xl border border-border bg-card shadow-lg transition-all duration-200 hover:shadow-xl focus-within:shadow-xl focus-within:border-primary/50">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="min-h-20 max-h-50 resize-none border-0 bg-transparent px-5 py-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/50">
                        <Button variant="outline" size="sm" className="h-9 text-sm font-medium">
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Select Model
                        </Button>
                        <Button
                            type="submit"
                            size="icon"
                            className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
                            disabled={!message.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChatMessageForm

