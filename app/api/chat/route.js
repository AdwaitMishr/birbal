import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { MessageRole, MessageType } from "@prisma/client";
import { convertToModelMessages, streamText } from "ai";

const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function extractPartsAsJSON(message) {
  if (message.parts && Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  const content = message.content || "";
  return JSON.stringify([{ type: "text", text: content }]);
}

function convertStoreMessageToUI(msg) {
  try {
    const parts = JSON.parse(msg.content);
    const validParts = parts.filter((part) => part.type === "text");
    if (validParts.length === 0) return null;
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: validParts,
      createdAt: msg.createAt,
    };
  } catch (error) {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createAt,
    };
  }
}

export async function POST(req) {
  try {
    const {
      chatId,
      messages: newMessages,
      model,
      skipUserMessage,
    } = await req.json();
    const previousMessages = chatId
      ? await db.message.findMany({
          where: {
            chatId: chatId,
          },
          orderBy: {
            createAt: "asc",
          },
        })
      : [];
    const uiMessage = previousMessages
      .map(convertStoreMessageToUI)
      .filter((msg) => msg !== null);
    const normalisedMessages = Array.isArray(newMessages)
      ? newMessages
      : [newMessages];
    const allMessages = [...uiMessage, ...normalisedMessages];

    let modelMessages;

    try {
      modelMessages = convertToModelMessages(allMessages);
    } catch (conversionError) {
      modelMessages = allMessages
        .map((msg) => ({
          role: msg.role,
          content: msg.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("\n"),
        }))
        .filter((m) => m.content);
    }
    const result = streamText({
      model: provider.chat(model),
      messages: modelMessages,
      system: CHAT_SYSTEM_PROMPT,
    });
    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allMessages,
      onFinish: async ({ responseMessage }) => {
        try {
          const messageToSave = [];
          if (!skipUserMessage) {
            const lastestUserMessage =
              normalisedMessages[normalisedMessages.length - 1];
            if (lastestUserMessage?.role === "user") {
              const userPartsJSON = extractPartsAsJSON(lastestUserMessage);
              messageToSave.push({
                chatId,
                content: userPartsJSON,
                messageRole: MessageRole.USER,
                model,
                messageType: MessageType.NORMAL,
              });
            }
          }
          if (responseMessage?.parts && responseMessage.parts.length > 0) {
            const assistantPartsJSON = extractPartsAsJSON(responseMessage);
            messageToSave.push({
              chatId,
              content: assistantPartsJSON,
              messageRole: MessageRole.ASSISTANT,
              model,
              messageType: MessageType.NORMAL,
            });
          }
          if (messageToSave.length > 0) {
            await db.message.createMany({
              data: messageToSave,
            });
          }
        } catch (error) {
          console.error("Error saving Message: ", error);
        }
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
