import { Outlet } from "react-router-dom";
import { UserHeader, UserSidebar } from "../components/user";

export default function UserLayout() {
  // const ls = localStorage.getItem("_at57")
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col bg-gray-100 w-full">
        <UserHeader />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
