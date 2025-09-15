import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ProcessForm = ({ isPeriodic, onProcessChange }) => {
  const [form, setForm] = useState({
    name: "",
    arrival: "",
    burst: "",
    priority: "",
    period: "",
  });

  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    onProcessChange(processes);
  }, [processes, onProcessChange]);

  useEffect(() => {
    setProcesses([]);
    setForm({
      name: "",
      arrival: "",
      burst: "",
      priority: "",
      period: "",
    });
  }, [isPeriodic]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProcess = () => {
    const { name, arrival, burst, priority, period } = form;
    if (
      name.trim() === "" ||
      arrival === "" ||
      burst === "" ||
      priority === "" ||
      (isPeriodic && period === "")
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const duplicate = processes.some(
      (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicate) {
      toast.error("Process name must be unique!");
      return;
    }

    const newProcess = {
      id: Date.now(),
      name,
      arrival: parseInt(arrival),
      burst: parseInt(burst),
      priority: parseInt(priority),
      ...(isPeriodic && { period: parseInt(period) }),
    };

    setProcesses([...processes, newProcess]);
    setForm({ name: "", arrival: "", burst: "", priority: "", period: "" });
    toast.success("Process added!");
  };

  const updateProcess = (id) => {
    const { name, arrival, burst, priority, period } = form;
    if (name || arrival || burst || priority || (isPeriodic && period)) {
      toast.error("Please add the current process first");
      return;
    }

    const p = processes.find((i) => i.id === id);
    setForm(p);
    const newProcesses = processes.filter((item) => item.id !== id);
    setProcesses(newProcesses);
    toast("Editing process: " + p.name, { icon: "✏️" });
  };

  const deleteProcess = (id) => {
    const proc = processes.find((p) => p.id === id);

    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg px-4 py-3 border flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span>
            Are you sure you want to delete <strong>{proc.name}</strong>?
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setProcesses(processes.filter((p) => p.id !== id));
                toast.dismiss(t.id);
                setTimeout(() => {
                  toast.success(`Process "${proc.name}" deleted!`);
                }, 800);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  const clearProcesses = () => {
    if (processes.length === 0) {
      toast.error("No processes to clear!");
      return;
    }

    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg px-4 py-3 border flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span>Are you sure you want to clear the entire queue?</span>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setProcesses([]);
                toast.dismiss(t.id);
                setTimeout(() => {
                  toast.success("Process queue cleared!");
                }, 800);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
      }
    );
  };

  return (
    <>
      {/* Add Process Form */}
      <div className="w-full max-w-md mb-10">
        <h3 className="text-lg font-semibold mb-3">+ Add a Process</h3>
        <div className="bg-black text-white p-5 rounded space-y-4">
          {["name", "arrival", "burst", "priority"].map((field) => (
            <div key={field} className="flex items-center space-x-3">
              <label className="w-24 capitalize text-white">
                {field === "arrival" ? "Arrival Time" : field}
              </label>
              <input
                type={field === "name" ? "text" : "number"}
                name={field}
                value={form[field]}
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1) +
                  (field === "arrival" ? " Time" : "")
                }
                onChange={handleChange}
                className="flex-1 bg-white text-black p-2 rounded"
                min={0}
              />
            </div>
          ))}
          {isPeriodic && (
            <div className="flex items-center space-x-3">
              <label className="w-24 text-white">Period</label>
              <input
                type="number"
                name="period"
                value={form.period}
                placeholder="Period"
                onChange={handleChange}
                className="flex-1 bg-white text-black p-2 rounded"
                min={0}
              />
            </div>
          )}
          <button
            onClick={addProcess}
            className="mt-4 bg-blue-300 hover:bg-blue-400 text-black font-semibold py-2 px-4 rounded w-full"
          >
            Add Process
          </button>
        </div>
      </div>

      {/* Process Table */}
      <div className="w-full max-w-2xl bg-white rounded shadow p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Process Queue</h2>
        {processes.length === 0 ? (
          <p className="text-gray-500 italic">No processes added yet.</p>
        ) : (
          <table className="w-full border border-collapse text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-3 py-1">Name</th>
                <th className="border px-3 py-1">Arrival</th>
                <th className="border px-3 py-1">Burst</th>
                <th className="border px-3 py-1">Priority</th>
                {isPeriodic && <th className="border px-3 py-1">Period</th>}
                <th className="border px-3 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.id}>
                  <td className="border px-3 py-1">{p.name}</td>
                  <td className="border px-3 py-1">{p.arrival}</td>
                  <td className="border px-3 py-1">{p.burst}</td>
                  <td className="border px-3 py-1">{p.priority}</td>
                  {isPeriodic && (
                    <td className="border px-3 py-1">{p.period}</td>
                  )}
                  <td className="border px-3 py-1 space-x-2">
                    <button
                      className="bg-red-400 hover:bg-red-500 px-2 py-1 rounded text-white"
                      onClick={() => deleteProcess(p.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-yellow-300 hover:bg-yellow-400 px-2 py-1 rounded"
                      onClick={() => updateProcess(p.id)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={clearProcesses}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Process Queue
        </button>
      </div>
    </>
  );
};

export default ProcessForm;
