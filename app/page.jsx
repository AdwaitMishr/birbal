import { currentUser } from "@/modules/authtentication/actions";
import UserButton from "@/modules/authtentication/components/user-button";

export default async function Home() {
  const user = currentUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <UserButton user={user}/>
    </div>
  );
}
