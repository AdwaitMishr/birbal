import { create } from "zustand";

export const useChatStore = create((set, get) => ({
    chats:[],
    messages:[],
    activeChatId: null,
    triggeredChats:new Set(),

    setChats: (chats) => set({chats}),
    setMessages: (messages) => set({messages}),
    setActiveChatId: (chatId) =>set({activeChatId: chatId}),

    addChat: (chat) => set({ chats: [chat, ...get().chats] }),
    addMessage: (message) => set({ messages: [...get().messages, message] }),
    clearMessages: () => set({ messages: [] }), 
    markChatAsTriggered: (chatId) => {
        const triggered = new Set(get().triggeredChats);
        triggered.add(chatId);
        set({ triggeredChats: triggered });
    },
    hasChatBeenTriggered: (chatId) => {
        return get().triggeredChats.has(chatId);
    },
}))