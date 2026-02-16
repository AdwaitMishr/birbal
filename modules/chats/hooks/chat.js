import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import {
  createChatWithMessage,
  deleteChat,
  getChatById,
  renameChat,
} from "../actions";
import { toast } from "sonner";

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (values) => createChatWithMessage(values),
    onSuccess: (res) => {
      if (res.success && res.data) {
        const chat = res.data;
        queryClient.invalidateQueries(["chats"]);
        router.push(`/chat/${chat.id}?autoTrigger=true`);
      }
    },
    onError: (error) => {
      console.error("Chat error: ", error);
      toast.error("Failed to create chat");
    },
  });
};

export const useDeleteChat = (chatId) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  return useMutation({
    mutationFn: () => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries(["chats"]);
      toast.success("Chat deleted successfully");
      // Redirect to home if the deleted chat was the active one
      if (pathname?.includes(chatId)) {
        router.replace("/");
      }
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });
};

export const useGetChatById = (chatId) => {
  return useQuery({
    queryKey: ["chats", chatId],
    queryFn: () => getChatById(chatId),
  });
};

export const useRenameChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => renameChat(payload),
    onMutate: async ({ chatId, title }) => {
      await queryClient.cancelQueries(["chats"]);
      const previousChats = queryClient.getQueryData(["chats"]);
      queryClient.setQueryData(["chats"], (old) => {
        if (!old?.success) return old;
        return {
          ...old,
          data: old.data.map((chat) =>
            chat.id === chatId ? { ...chat, title: title } : chat,
          ),
        };
      });
      return { previousChats };
    },
    onError: (err, newChat, context) => {
      queryClient.setQueryData(["chats"], context.previousChats);
      toast.error("Failed to rename chat");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["chats"]);
    },

    onSuccess: (res) => {
      if (res.success) {
        toast.success("Chat renamed");
      }
    },
  });
};
