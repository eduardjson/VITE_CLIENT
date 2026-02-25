import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import "../App.css";

export const AppLayout = () => {
  return (
    <>
      <div className="h-screen overflow-hidden flex flex-col">
        <header className="bg-white flex items-center justify-center">
          <Header />
        </header>
        <main className="flex h-full w-full flex-row gap-4 p-4">
          <div className="overflow-auto h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};
