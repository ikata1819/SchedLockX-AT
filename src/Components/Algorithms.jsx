import React from "react";

const Algorithms = ({ processes, selectedAlgo }) => {
  if (!selectedAlgo || processes.length === 0) return null;

  let result = [];
  let ganttChart = [];

  const sortedByArrival = [...processes].sort((a, b) => a.arrival - b.arrival);

  if (selectedAlgo === "fcfs") {
    let currentTime = 0;
    result = sortedByArrival.map((p) => {
      const start = Math.max(currentTime, p.arrival);
      const end = start + p.burst;
      currentTime = end;
      ganttChart.push({ name: p.name, start, end });
      return {
        ...p,
        start,
        end,
        waiting: start - p.arrival,
        turnaround: end - p.arrival,
      };
    });
  } else if (selectedAlgo === "sjf") {
    let time = 0;
    const readyQueue = [];
    const remaining = [...sortedByArrival];
    result = [];

    while (remaining.length || readyQueue.length) {
      while (remaining.length && remaining[0].arrival <= time) {
        readyQueue.push(remaining.shift());
      }

      if (readyQueue.length === 0) {
        time = remaining[0].arrival;
        continue;
      }

      readyQueue.sort((a, b) => a.burst - b.burst);
      const p = readyQueue.shift();
      const start = time;
      const end = start + p.burst;
      time = end;
      ganttChart.push({ name: p.name, start, end });
      result.push({
        ...p,
        start,
        end,
        waiting: start - p.arrival,
        turnaround: end - p.arrival,
      });
    }
  } else if (selectedAlgo === "priority") {
    let time = 0;
    const readyQueue = [];
    const remaining = [...sortedByArrival];
    result = [];

    while (remaining.length || readyQueue.length) {
      while (remaining.length && remaining[0].arrival <= time) {
        readyQueue.push(remaining.shift());
      }

      if (readyQueue.length === 0) {
        time = remaining[0].arrival;
        continue;
      }

      readyQueue.sort((a, b) => a.priority - b.priority);
      const p = readyQueue.shift();
      const start = time;
      const end = start + p.burst;
      time = end;
      ganttChart.push({ name: p.name, start, end });
      result.push({
        ...p,
        start,
        end,
        waiting: start - p.arrival,
        turnaround: end - p.arrival,
      });
    }
  } else if (selectedAlgo === "rr") {
    const quantum = 2;
    let time = 0;
    const queue = [];
    const remaining = processes.map((p) => ({ ...p, remaining: p.burst }));
    result = [];
    ganttChart = [];

    while (remaining.length > 0 || queue.length > 0) {
      while (remaining.length > 0 && remaining[0].arrival <= time) {
        queue.push(remaining.shift());
      }

      if (queue.length === 0) {
        time = remaining[0].arrival;
        continue;
      }

      const p = queue.shift();
      const start = time;
      const execTime = Math.min(quantum, p.remaining);
      const end = start + execTime;
      p.remaining -= execTime;
      time = end;

      ganttChart.push({ name: p.name, start, end });

      if (p.remaining > 0) {
        // Re-add to queue only after checking new arrivals
        while (remaining.length > 0 && remaining[0].arrival <= time) {
          queue.push(remaining.shift());
        }
        queue.push(p);
      } else {
        const waiting = end - p.arrival - p.burst;
        const turnaround = end - p.arrival;
        result.push({
          ...p,
          start: p.arrival, // original arrival
          end,
          waiting,
          turnaround,
        });
      }
    }
  } else if (selectedAlgo === "edf") {
    let time = 0;
    const readyQueue = [];
    const remaining = [...sortedByArrival];
    result = [];

    while (remaining.length || readyQueue.length) {
      while (remaining.length && remaining[0].arrival <= time) {
        readyQueue.push(remaining.shift());
      }

      if (readyQueue.length === 0) {
        time = remaining[0].arrival;
        continue;
      }

      readyQueue.sort((a, b) => a.deadline - b.deadline);
      const p = readyQueue.shift();
      const start = time;
      const end = start + p.burst;
      time = end;

      ganttChart.push({ name: p.name, start, end });

      result.push({
        ...p,
        start,
        end,
        waiting: start - p.arrival,
        turnaround: end - p.arrival,
      });
    }
  } else if (selectedAlgo === "rms") {
    let time = 0;
    const readyQueue = [];
    const remaining = [...sortedByArrival];
    result = [];

    while (remaining.length || readyQueue.length) {
      while (remaining.length && remaining[0].arrival <= time) {
        readyQueue.push(remaining.shift());
      }

      if (readyQueue.length === 0) {
        time = remaining[0].arrival;
        continue;
      }

      readyQueue.sort((a, b) => a.period - b.period); // Lower period = higher priority
      const p = readyQueue.shift();
      const start = time;
      const end = start + p.burst;
      time = end;

      ganttChart.push({ name: p.name, start, end });

      result.push({
        ...p,
        start,
        end,
        waiting: start - p.arrival,
        turnaround: end - p.arrival,
      });
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2 capitalize">
        {selectedAlgo} Result
      </h2>
      <table className="w-full max-w-[900px] mx-auto border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Process</th>
            <th className="border px-2 py-1">Arrival</th>
            <th className="border px-2 py-1">Burst</th>
            <th className="border px-2 py-1">Start</th>
            <th className="border px-2 py-1">End</th>
            <th className="border px-2 py-1">Waiting</th>
            <th className="border px-2 py-1">Turnaround</th>
          </tr>
        </thead>
        <tbody>
          {result.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{r.name}</td>
              <td className="border px-2 py-1">{r.arrival}</td>
              <td className="border px-2 py-1">{r.burst}</td>
              <td className="border px-2 py-1">{r.start}</td>
              <td className="border px-2 py-1">{r.end}</td>
              <td className="border px-2 py-1">{r.waiting}</td>
              <td className="border px-2 py-1">{r.turnaround}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
      {/* Gantt Chart */}
      <div className="my-12 bg-white rounded shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">Gantt Chart</h3>
        <div className="overflow-x-auto">
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-full min-w-[600px]">
            {ganttChart.map((g, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-sm px-3 py-2 border-r border-gray-300"
                style={{
                  backgroundColor: stringToColor(g.name),
                  color: "white",
                  minWidth: `${(g.end - g.start) * 30}px`,
                  flexShrink: 0,
                }}
              >
                <div className="font-semibold">{g.name}</div>
                <div className="flex justify-between w-full text-xs mt-1">
                  <span>{g.start}</span>
                  <span>{g.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Assign consistent color to process name
const colorCache = {};

const getRandomColor = () => {
  // Generate a random hex color with good brightness
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const stringToColor = (str) => {
  if (colorCache[str]) {
    return colorCache[str];
  }
  const newColor = getRandomColor();
  colorCache[str] = newColor;
  return newColor;
};

export default Algorithms;
