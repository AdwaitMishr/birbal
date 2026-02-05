import { headers } from 'next/headers'
import React from 'react'
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChatSidebar from '@/modules/chats/components/chat-sidebar';
import { currentUser } from '@/modules/authtentication/actions';
import Header from '@/modules/chats/components/header';
import { getAllChats } from '@/modules/chats/actions';

const layout = async ({ children }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const user = await currentUser();
    if(!session) return redirect("/sign-in");
    const {data: chats} = await getAllChats();

  return (
    <div className='flex h-screen overflow-hidden'>
     <ChatSidebar user={user} chats={chats}/>
      <main className='flex-1 overflow-hidden'>
        <Header/>
        {children}
      </main>
    </div>
  )
}

export default layout
