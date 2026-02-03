import { currentUser } from "@/modules/authtentication/actions";
import ChatMessageView from "@/modules/chats/components/chat-message-view";

export default async function Home() {
  const user = currentUser();
  return (
    <>
    <div className="flex flex-col h-full overflow-y-auto">
      <ChatMessageView user={user}/>
    </div>
    </>
  );
}
