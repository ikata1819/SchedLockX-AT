import React from "react";

const Header = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header Section */}
      <div>
        <div className="text-center bg-gradient-to-r from-violet-300 via-indigo-400 to-purple-300 animate-gradient-x font-orbitron p-8 shadow-md">
          <h1 className="text-6xl font-extrabold my-4 text-white drop-shadow-lg">
            CPU-SchedLock-AT
          </h1>
          <h2 className="text-2xl italic text-white drop-shadow">
            A CPU Scheduling & Deadlock Simulator - JU CSE OS Lab Final Project
          </h2>
        </div>

        {/* Button Section */}
        <div className="my-20 flex flex-col items-center gap-10 px-6">
          <button
            onClick={() => onSelect("cpu")}
            className="w-full max-w-md bg-gradient-to-r from-teal-600 to-teal-800 text-white text-2xl font-bold py-5 rounded-2xl shadow-xl border-4 border-teal-300 hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
          >
           🖥️ CPU Scheduler
          </button>
          <button
            onClick={() => onSelect("deadlock")}
            className="w-full max-w-md bg-gradient-to-r from-teal-600 to-teal-800 text-white text-2xl font-bold py-5 rounded-2xl shadow-xl border-4 border-teal-300 hover:scale-105 transition-transform duration-300 hover:shadow-2xl"
          >
           🛑🔄 Deadlock Detection
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-pink-100 text-center text-sm text-gray-700 py-4 mt-auto shadow-inner">
        &copy; 2025 AnikaTasnim | SchedLock-JU_CSE <br />
        Jahangirnagar University, Savar-1342
      </footer>

      {/* Custom animation styling */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 12s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Header;
