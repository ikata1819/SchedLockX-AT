import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import './App.css'
import Header from "./Components/Header";
import CPUS from "./Components/CPUS";
import Deadlock from "./Components/Deadlock";

function App() {
  const [activePanel, setActivePanel] = useState(null);

  const backBtn = () => {
    const toastId = toast.custom(
      (t) => (
        <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-6 flex flex-col items-center space-y-4 max-w-sm mx-auto">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Navigation</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to go back to the home page?
            </p>
            <p className="text-sm font-medium text-red-600 mt-1">
              Process Queue will be emptied!
            </p>
          </div>
          <div className="flex space-x-3 w-full">
            <button
              onClick={() => {
                toast.dismiss(toastId);
                setTimeout(() => {
                  setActivePanel(null);
                  toast.success("Returned to Home. Queue cleared!", {
                    duration: 2000,
                    style: {
                      background: '#10B981',
                      color: '#fff',
                    },
                  });
                }, 300);
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Yes, Go Back
            </button>
            <button
              onClick={() => {
                toast.dismiss(toastId);
                setTimeout(() => {
                  toast("Action cancelled", { 
                    duration: 1500,
                    icon: '❌',
                  });
                }, 300);
              }}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: 'top-center' }
    );
  };

  const getTitleInfo = () => {
    switch(activePanel) {
      case "cpu":
        return {
          title: "CPU Scheduling Algorithms",
          subtitle: "Simulate and analyze different CPU scheduling strategies",
          icon: "🖥️",
          gradient: "from-sky-400 via-blue-400 to-indigo-400"
        };
      case "deadlock":
        return {
          title: "Deadlock Detection & Prevention",
          subtitle: "Analyze resource allocation and prevent system deadlocks",
          icon: "🔒",
          gradient: "from-rose-400 via-pink-400 to-purple-400"
        };
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Sticky Header for Active Panels */}
        {activePanel && (
          <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-50/90 via-white/90 to-slate-50/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Title Section - Centered */}
              <div className="flex justify-center">
                <div className={`bg-gradient-to-r ${getTitleInfo()?.gradient} px-12 py-6 rounded-3xl shadow-lg mx-4`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{getTitleInfo()?.icon}</span>
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-white drop-shadow-md mb-1">
                        {getTitleInfo()?.title}
                      </h1>
                      <p className="text-base text-white/90 font-medium">
                        {getTitleInfo()?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={activePanel ? "pt-8 pb-24 min-h-screen" : ""}>
          {!activePanel && <Header onSelect={setActivePanel} />}
          
          {activePanel === "cpu" && (
            <div className="animate-fadeIn">
              <CPUS />
            </div>
          )}
          
          {activePanel === "deadlock" && (
            <div className="animate-fadeIn">
              <Deadlock />
            </div>
          )}
        </div>

        {/* Fixed Back Button at Bottom Center */}
        {activePanel && (
          <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={backBtn}
              className="flex items-center space-x-3 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* Background Decoration */}
        {!activePanel && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-yellow-600/20 rounded-full blur-3xl"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </>
  );
}

export default App;