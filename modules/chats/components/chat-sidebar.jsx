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
  MenuIcon,
  EllipsisIcon,
  Trash,
} from "lucide-react";
import { useChatStore } from "../store/chat-store";
import DeleteChatModel from "./chat-delete-model";

const ChatSidebar = ({ user, chats }) => {
  const { activeChatId } = useChatStore();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if(!chats || !Array.isArray(chats)) return null;
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

  const onDelete = (e, chatId) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModelOpen(true);
  };

  const renderChatList = (chatList) => {
    if (chatList.length === 0) return null;

    return chatList.map((chat) => (
      <Fragment key={chat.id}>
      <Link
        href={`/chat/${chat.id}`}
        className={cn(
          "block rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          chat.id === activeChatId && "bg-sidebar-accent",
        )}
      >
        <div className="flex felx-row justify-between items-center gap-2">
          <span className="truncate flex-1">{chat.title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10"
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row gap-2 cursor-pointer"
                onClick={(e) => onDelete(e, chat.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
      <DeleteChatModel
      chatId={chat.id}
      isModelOpen={isModelOpen}
      setIsModelOpen={setIsModelOpen}
      />
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
          <div className="text-center text-sm text-muted-foreground py-8">
            {searchQuery ? "No Chats Founds" : "No Chats Yet"}
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
    </div>
  );
};

export default ChatSidebar;
