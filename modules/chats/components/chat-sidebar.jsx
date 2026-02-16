"use client";
import { useState, useMemo, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserButton from "@/modules/authtentication/components/user-button";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  SearchIcon,
  EllipsisIcon,
  Trash,
  Pencil,
  MessageSquare,
} from "lucide-react";
import { useChatStore } from "../store/chat-store";
import DeleteChatModel from "./chat-delete-model";
import RenameChatModel from "./rename-chat-model";

const ChatSidebar = ({ user, chats }) => {
  const { activeChatId } = useChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  const [activeModal, setActiveModal] = useState({
    type: null, // 'delete' | 'rename' | null
    chatId: null,
    title: "",
  });

  const closeModals = () =>
    setActiveModal({ type: null, chatId: null, title: "" });

  const filteredChats = useMemo(() => {
    if (!chats || !Array.isArray(chats)) return [];
    if (!searchQuery.trim()) return chats;

    const query = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title?.toLowerCase().includes(query) ||
        chat.messages?.some((msg) =>
          msg.content?.toLowerCase().includes(query),
        ),
    );
  }, [chats, searchQuery]);

  const groupedChats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    filteredChats?.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);

      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const onOpenDelete = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveModal({ type: "delete", chatId: chat.id, title: chat.title });
  };

  const onOpenRename = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveModal({ type: "rename", chatId: chat.id, title: chat.title });
  };

  const renderChatList = (chatList) => {
    if (chatList.length === 0) return null;

    return chatList.map((chat) => (
      <Fragment key={chat.id}>
        <Link
          href={`/chat/${chat.id}`}
          className={cn(
            "block rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors group relative",
            chat.id === activeChatId && "bg-sidebar-accent",
          )}
        >
          <div className="flex flex-row justify-between items-center gap-2">
            <span className="truncate flex-1">{chat.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10 transition-opacity",
                    chat.id === activeChatId && "opacity-100",
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  <EllipsisIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer gap-2"
                  onClick={(e) => onOpenRename(e, chat)}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex flex-row gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                  onClick={(e) => onOpenDelete(e, chat)}
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>
      </Fragment>
    ));
  };

  const handleSeacrhQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Image src={"/logo.svg"} alt="logo" width={120} height={120} />
        </div>
      </div>

      <div className="p-4">
        <Link href={"/"}>
          <Button
            className={
              "w-full h-11 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            }
          >
            <PlusIcon className="mr-2 h-5 w-5" /> New Chat
          </Button>
        </Link>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your chat..."
            className={
              "pl-10 h-10 bg-sidebar-accent border-sidebar-border transition-all duration-200 focus:bg-background"
            }
            value={searchQuery}
            onChange={handleSeacrhQuery}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {filteredChats?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-3">
            <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {searchQuery ? "No chats found" : "No chats yet"}
              </p>
              <p className="text-xs text-muted-foreground/60 italic mt-1">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Start a new conversation to begin"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {groupedChats.today.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                  Today
                </div>
                {renderChatList(groupedChats.today)}
              </div>
            )}

            {groupedChats.yesterday.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                  Yesterday
                </div>
                {renderChatList(groupedChats.yesterday)}
              </div>
            )}

            {groupedChats.lastWeek.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                  Last 7 Days
                </div>
                {renderChatList(groupedChats.lastWeek)}
              </div>
            )}

            {groupedChats.older.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                  Older
                </div>
                {renderChatList(groupedChats.older)}
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border bg-sidebar-accent/50">
        <UserButton user={user} />
      </div>

      <DeleteChatModel
        chatId={activeModal.chatId}
        isModelOpen={activeModal.type === "delete"}
        setIsModelOpen={closeModals}
      />
      <RenameChatModel
        chatId={activeModal.chatId}
        currentTitle={activeModal.title}
        isOpen={activeModal.type === "rename"}
        onClose={closeModals}
      />
    </div>
  );
};

export default ChatSidebar;
