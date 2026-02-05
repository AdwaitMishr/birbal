"use client";

const { toast } = require("sonner");
const { useDeleteChat } = require("../hooks/chat");
const { default: Model } = require("./model");

const DeleteChatModel = ({ isModelOpen, setIsModelOpen, chatId }) => {
  const { mutateAsync, isPending } = useDeleteChat(chatId);
  const handleDelete = async () => {
    try {
      await mutateAsync();
      toast.success("Chat Deleted Successfully");
      setIsModelOpen(false);
    } catch (error) {
      toast.error("Failed to Delete Chat");
      console.error("Failed ", error);
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
