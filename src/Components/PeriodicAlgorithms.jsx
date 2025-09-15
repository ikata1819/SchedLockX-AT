import React from "react";

const PeriodicAlgorithms = ({ processes, selectedAlgo }) => {
  if (!selectedAlgo || processes.length === 0) return null;
  if (!["rms", "edf"].includes(selectedAlgo)) return null;

  let ganttChart = [];
  let summary = [];

  // Helpers
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const lcmPeriods = processes.reduce((acc, p) => lcm(acc, p.period), 1);

  // Generate all process instances up to LCM
  const processInstances = [];
  processes.forEach((process) => {
    const instanceCount = lcmPeriods / process.period;
    for (let i = 0; i < instanceCount; i++) {
      processInstances.push({
        ...process,
        name: `${process.name}_${i + 1}`,
        arrival: i * process.period,
        deadline: (i + 1) * process.period,
        remaining: process.burst,
        instance: i + 1,
        originalName: process.name,
      });
    }
  });

  processInstances.sort((a, b) => a.arrival - b.arrival);

  // Tick-based RMS / EDF
  let time = 0;
  const readyQueue = [];
  const remaining = [...processInstances];
  let current = null;

  while (time < lcmPeriods) {
    // Add arrivals
    while (remaining.length && remaining[0].arrival === time) {
      readyQueue.push(remaining.shift());
    }

    // Decide next process
    if (current && current.remaining > 0) {
      readyQueue.push(current);
    }
    if (readyQueue.length > 0) {
      if (selectedAlgo === "rms") {
        readyQueue.sort((a, b) => a.period - b.period); // smaller period → higher priority
      } else if (selectedAlgo === "edf") {
        readyQueue.sort((a, b) => a.deadline - b.deadline); // earlier deadline → higher priority
      }
      current = readyQueue.shift();
    } else {
      current = null;
    }

    // Execute 1 time unit
    if (current) {
      const prev = ganttChart[ganttChart.length - 1];
      if (prev && prev.name === current.originalName && prev.instance === current.instance) {
        prev.end = time + 1;
      } else {
        ganttChart.push({
          name: current.originalName,
          instance: current.instance,
          start: time,
          end: time + 1,
          deadline: current.deadline,
          missed: false,
        });
      }
      current.remaining -= 1;

      // Mark missed if job didn’t finish by deadline
      if (time + 1 === current.deadline && current.remaining > 0) {
        ganttChart[ganttChart.length - 1].missed = true;
      }
    }

    time++;
  }

  // Summary statistics
  processes.forEach((process) => {
    const totalInstances = lcmPeriods / process.period;
    const processExecutions = ganttChart.filter((g) => g.name === process.name);
    const totalExecutionTime = processExecutions.reduce(
      (sum, exec) => sum + (exec.end - exec.start),
      0
    );
    const missedDeadlines = processExecutions.filter((exec) => exec.missed).length;

    summary.push({
      name: process.name,
      period: process.period,
      burstTime: process.burst,
      totalInstances,
      totalExecutionTime,
      missedDeadlines,
      utilizationPercent: ((totalExecutionTime / lcmPeriods) * 100).toFixed(2),
    });
  });

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4 capitalize text-center bg-red-100">
        {selectedAlgo} Result (Periodic - LCM: {lcmPeriods})
      </h2>

      {/* Summary Table */}
      <table className="w-full max-w-[900px] mx-auto border text-center mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Process</th>
            <th className="border px-2 py-1">Period</th>
            <th className="border px-2 py-1">Burst Time</th>
            <th className="border px-2 py-1">Total Instances</th>
            <th className="border px-2 py-1">Total Execution</th>
            <th className="border px-2 py-1">Missed Deadlines</th>
            <th className="border px-2 py-1">Utilization %</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s, i) => (
            <tr key={i} className={s.missedDeadlines > 0 ? "bg-red-100" : ""}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.period}</td>
              <td className="border px-2 py-1">{s.burstTime}</td>
              <td className="border px-2 py-1">{s.totalInstances}</td>
              <td className="border px-2 py-1">{s.totalExecutionTime}</td>
              <td className="border px-2 py-1 font-bold">{s.missedDeadlines}</td>
              <td className="border px-2 py-1">{s.utilizationPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Utilization */}
      <div className="text-center mb-4">
        <span className="text-lg font-semibold">
          Total System Utilization:{" "}
          {summary
            .reduce((sum, s) => sum + parseFloat(s.utilizationPercent), 0)
            .toFixed(2)}
          %
        </span>
      </div>

      {/* Gantt Chart */}
<div className="my-12 bg-white rounded shadow-md p-4 flex flex-col justify-items-center">
  <h3 className="text-lg font-semibold mb-6 text-center">
    Gantt Chart (0 to {lcmPeriods} time units)
  </h3>

  {/* Fixed width container */}
  <div className="w-full max-w-[1100px] mx-auto border rounded-lg overflow-x-auto overflow-y-hidden">
    <div className="flex items-center w-max">
      {ganttChart.map((g, i) => (
        <div
          key={i}
          className={`flex flex-col items-center justify-center text-sm px-2 py-2 border-r border-gray-300 ${
            g.missed ? "border-red-500 border-2" : ""
          }`}
          style={{
            backgroundColor: g.missed ? "#ffcccc" : stringToColor(g.name),
            color: g.missed ? "red" : "white",
            minWidth: `${(g.end - g.start) * 30}px`, // wider per time unit for readability
            flexShrink: 0,
          }}
          title={
            g.missed
              ? `Deadline missed! Deadline: ${g.deadline}`
              : `Deadline: ${g.deadline}`
          }
        >
          <div className="font-semibold text-xs">{g.name}</div>
          <div className="text-xs">({g.instance})</div>
          <div className="flex justify-between w-full text-xs mt-1">
            <span>{g.start}</span>
            <span>{g.end}</span>
          </div>
          {g.missed && <div className="text-xs font-bold">MISSED!</div>}
        </div>
      ))}
    </div>
  </div>
</div>
</div>
  );
};

// Color utilities
const colorCache = {};
const getRandomColor = () => {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
const stringToColor = (str) => {
  if (colorCache[str]) return colorCache[str];
  const newColor = getRandomColor();
  colorCache[str] = newColor;
  return newColor;
};

export default PeriodicAlgorithms;
