"use client";
import { useState, useMemo } from "react";
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
    DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserButton from "@/modules/authtentication/components/user-button";
    import { cn } from "@/lib/utils";
import { PlusIcon, SearchIcon, MenuIcon, EllipsisIcon, Trash } from "lucide-react";


const ChatSidebar = ({user}) => {
    const [ searchQuery, setSearchQuery ] = useState("");
    
    const handleSeacrhQuery = (e) => {
        setSearchQuery(e.target.value);
    }
  return (
    <div className="flex h-full w-72 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
            <div className="flex items-center gap-2">
                <Image src={"/logo.svg"} alt="logo" width={120} height={120}/>
            </div>
        </div>

        <div className="p-4">
            <Link href={"/"}>
            <Button className={"w-full h-11 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"}>
                <PlusIcon className="mr-2 h-5 w-5"/> New Chat
            </Button>
            </Link>
        </div>

        <div className="px-4 pb-4">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                <Input placeholder="Search your chat..." 
                className={"pl-10 h-10 bg-sidebar-accent border-sidebar-border transition-all duration-200 focus:bg-background"}
                value={searchQuery}
                onChange={handleSeacrhQuery}
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3">
            <div className="text-center text-sm text-muted-foreground py-12">
                No Chats Yet...
            </div>
        </div>

        <div className="p-4 flex items-center gap-3 border-t border-sidebar-border bg-sidebar-accent/50">
            <UserButton user={user} />
        </div>
    </div>
  )
}

export default ChatSidebar
