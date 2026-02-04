"use client";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIModels } from "@/modules/ai-models/hooks/ai-models";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";
import { useCreateChat } from "../hooks/chat";
import { toast } from "sonner";

const ChatMessageForm = ({ initialMessage, onMessageChange }) => {
  const [message, setMessage] = useState("");
  const { data: models, isPending } = useAIModels();
  const [selectedModel, setSelectedModel] = useState(models?.models[0].id);
  const { mutateAsync, isPending: isChatPending } = useCreateChat();
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await mutateAsync({ content: message, model: selectedModel });
      toast.success("Message Sent Successfully");
    } catch (error) {
      console.log(error);
      toast.error("Erron in sending message");
    } finally {
      setMessage("");
    }
  };
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
            {isPending ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className={"ml-1"}
                />
              </>
            )}
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-105"
              disabled={!message.trim() || isChatPending}
            >
              {" "}
              {isChatPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;
