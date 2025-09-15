import React, { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Algorithms from "./Algorithms";
import ProcessForm from "./ProcessForm";
import AperiodicAlgorithms from './AperiodicAlgorithms';
import PeriodicAlgorithms from './PeriodicAlgorithms';

const CPUS = () => {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [startScheduling, setStartScheduling] = useState(false);
  const [processes, setProcesses] = useState([]); // receive from ProcessForm
  
  const resultsRef = useRef(null); // Ref for results section

  const algoOptions = isPeriodic
    ? [
        { value: "rms", label: "RMS (Rate Monotonic Scheduling)" },
        { value: "edf", label: "EDF (Earliest Deadline First)" },
      ]
    : [
        { value: "fcfs", label: "FCFS (First Come First Serve)" },
        { value: "sjf", label: "SJF (Shortest Job First)" },
        { value: "priority", label: "Priority Scheduling" },
        { value: "rr", label: "RR (Round Robin)" },
      ];

  const handleSchedule = () => {
    if (processes.length === 0) {
      toast.error("Add at least one process before scheduling!");
      return;
    }
    if (!selectedAlgo) {
      toast.error("Please select a scheduling algorithm!");
      return;
    }

    setStartScheduling(true);

    // Scroll to results smoothly
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <div className="flex flex-col items-center px-4 bg-cyan-100">

        {/* Scheduling Type */}
        <div className="w-full max-w-md m-8 mt-15 bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-3">Select Scheduling Type</h2>
          <div className="flex justify-around">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="type"
                value="aperiodic"
                checked={!isPeriodic}
                onChange={() => {
                  setIsPeriodic(false);
                  setSelectedAlgo("");
                  setProcesses([]);
                  setStartScheduling(false);
                }}
              />
              <span>Aperiodic</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="type"
                value="periodic"
                checked={isPeriodic}
                onChange={() => {
                  setIsPeriodic(true);
                  setSelectedAlgo("");
                  setProcesses([]);
                  setStartScheduling(false);
                }}
              />
              <span>Periodic</span>
            </label>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="w-full max-w-md mb-10 bg-white p-6 rounded shadow-md">
          <label htmlFor="cpu-algo" className="block text-lg font-semibold mb-2">
            CPU Scheduling Algorithm
          </label>
          <select
            id="cpu-algo"
            className="py-3 px-4 w-full border border-gray-300 rounded"
            value={selectedAlgo}
            onChange={(e) => {
              setSelectedAlgo(e.target.value);
              setStartScheduling(false);
            }}
          >
            <option value="" disabled>
              — Select an algorithm —
            </option>
            {algoOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Process Input + Table */}
        <ProcessForm
          isPeriodic={isPeriodic}
          onProcessChange={setProcesses}
        />

        {/* Start Scheduling Button */}
        <div className="mt-10 mb-6">
          <button
            onClick={handleSchedule}
            className="bg-blue-800 text-white px-5 py-2 rounded-2xl"
          >
            Start Scheduling
          </button>
        </div>

        {/* Scheduling Results Section */}
        <div ref={resultsRef} className="w-full">
          {startScheduling && processes.length > 0 && selectedAlgo && (
            <>
              {isPeriodic ? (
                <PeriodicAlgorithms 
                  processes={processes}
                  selectedAlgo={selectedAlgo}
                />
              ) : (
                <AperiodicAlgorithms 
                  processes={processes}
                  selectedAlgo={selectedAlgo}
                />
              )}
            </>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default CPUS;
