import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Lobby = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center select-none p-20 text-slate-700 font-semibold">
      <div className="shadow-2xl w-full flex-grow grid grid-cols-[1fr_16rem]">
        <Outlet />
        <Sidebar />
      </div>
    </div>
  );
};

export default Lobby;
