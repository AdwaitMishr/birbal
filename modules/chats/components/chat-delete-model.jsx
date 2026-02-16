"use client";

import { toast } from "sonner";
import { useDeleteChat } from "../hooks/chat";
import Model from "./model";

const DeleteChatModel = ({ isModelOpen, setIsModelOpen, chatId }) => {
  const { mutateAsync, isPending } = useDeleteChat(chatId);
  const handleDelete = async () => {
    try {
      await mutateAsync();
      setIsModelOpen(false);
    } catch (error) {
      // Error toast is handled by the hook's onError
    }
  };
  return (
    <Model
      title="Delete Chat"
      description="Are you sure you want to delete this Chat? This action cannot be undone."
      isOpen={isModelOpen}
      onClose={() => setIsModelOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
    >
      <p className="text-sm text-zinc-500">
        Once deleted, all requests and data in this Chat will be permanently
        removed.
      </p>
    </Model>
  );
};

export default DeleteChatModel;

