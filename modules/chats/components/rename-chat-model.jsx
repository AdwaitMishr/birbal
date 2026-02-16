"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRenameChat } from "../hooks/chat";
import { Input } from "@/components/ui/input";
import Model from "./model";

const RenameChatModel = ({ isOpen, onClose, chatId, currentTitle }) => {
  const { mutateAsync, isPending } = useRenameChat();
  const [title, setTitle] = useState(currentTitle || "");

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || "");
    }
  }, [isOpen, currentTitle]);

  const handleRename = async () => {
    if (!title.trim()) {
      toast.error("Chat title cannot be empty");
      return;
    }

    try {
      await mutateAsync({ chatId, title });
      toast.success("Chat Renamed Successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to Rename Chat");
      console.error("Failed ", error);
    }
  };

  return (
    <Model
      title="Rename Chat"
      description="Enter a new name for this conversation."
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleRename}
      submitText={isPending ? "Saving..." : "Save"}
      submitVariant="default"
    >
      <div className="py-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chat Title"
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
          }}
          autoFocus
        />
      </div>
    </Model>
  );
};

export default RenameChatModel;
