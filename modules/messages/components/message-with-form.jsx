"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Spinner } from "@/components/ui/spinner";
import { useAIModels } from "@/modules/ai-models/hooks/ai-models";
import { ModelSelector } from "@/modules/chats/components/model-selector";
import { useGetChatById } from "@/modules/chats/hooks/chat";
import { useChatStore } from "@/modules/chats/store/chat-store";
import { useChat } from "@ai-sdk/react";
import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

export const MessageWithForm = ({ chatId }) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();
  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];
    return data.data.messages
      .filter((msg) => msg.content && msg.content.trim() !== "" && msg.id)
      .map((msg) => {
        try {
          const parts = JSON.parse(msg.content);
          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: Array.isArray(parts)
              ? parts
              : [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        } catch (error) {
          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        }
      });
  }, [data]);

  const { stop, sendMessage, regenerate, messages, status } = useChat({
    initialMessages: [],
    api: "/api/chat",
  });

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      },
    );

    setInput("");
  };

  const handleRetry = () => {
    regenerate();
  };
  const handleStop = () => {
    stop();
  };

  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";

  useEffect(() => {
    if (data?.data?.model && !selectedModel) setSelectedModel(data.data.model);
  }, [data, selectedModel]);

  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length - 1];

    if (lastMessage.role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId);

    sendMessage(
      { text: null },
      {
        body: {
          model: selectedModel,
          chatId,
          skipUserMessage: true,
        },
      },
    );

    router.replace(`/chat/${chatId}`, { scroll: false });
  }, [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    markChatAsTriggered,
    hasChatBeenTriggered,
    sendMessage,
    router,
  ]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const messageToRender = [...initialMessages, ...messages];

  return (
    <div className="max-w-5xl mx-auto p-4 relative size-full h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-hidden min-h-0">
        <Conversation className="h-full">
          <ConversationContent className="pb-4">
            {messageToRender.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
                <p className="text-lg font-serif">
                  Start a conversation with Birbal...
                </p>
              </div>
            ) : (
              messageToRender.map((msg, idx) => (
                <Fragment key={msg.id || idx}>
                  {msg.parts.map((part, i) => {
                    if (part.type === "text") {
                      return (
                        <Message from={msg.role} key={`${msg.id}-${i}`}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>
                      );
                    }
                    return null;
                  })}
                </Fragment>
              ))
            )}

            {status === "streaming" && (
              <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground animate-pulse">
                <Spinner className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Birbal is thinking...
                </span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="mt-4 pb-4">
        <PromptInput
          onSubmit={handleSubmit}
          className="w-full border rounded-xl bg-background shadow-lg overflow-hidden transition-all focus-within:ring-1 focus-within:ring-primary/30"
        >
          <PromptInputBody className="p-0 relative">
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Birbal and he shall answer..."
              className="w-full min-h-20 max-h-75 p-4 text-base resize-none focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </PromptInputBody>

          <PromptInputFooter className="flex items-center justify-between p-3 bg-muted/20 border-t">
            <PromptInputTools className="flex items-center gap-2">
              {isModelLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ModelSelector
                  models={models?.models || []}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}

              {status === "streaming" ? (
                <PromptInputButton
                  onClick={handleStop}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <StopCircleIcon size={16} />
                  <span className="text-xs font-medium">Stop</span>
                </PromptInputButton>
              ) : (
                messageToRender.length > 0 && (
                  <PromptInputButton
                    onClick={handleRetry}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcwIcon size={16} />
                    <span className="text-xs font-medium">Retry</span>
                  </PromptInputButton>
                )
              )}
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={!input.trim() || status === "streaming"}
              className="ml-auto"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};
