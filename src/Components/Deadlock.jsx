import React, { useState } from "react";
import Bankers from "./Bankers";

const DeadlockDetection = () => {
  const [resourceCount, setResourceCount] = useState(0);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [totalResources, setTotalResources] = useState([]);
  const [processName, setProcessName] = useState("");
  const [allocation, setAllocation] = useState([]);
  const [max, setMax] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [editingProcessId, setEditingProcessId] = useState(null);

  const handleResourceCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setResourceCount(count);
    setResourceTypes(Array(count).fill(""));
    setTotalResources(Array(count).fill(0));
    setAllocation(Array(count).fill(0));
    setMax(Array(count).fill(0));
  };

  const handleResourceTypeChange = (index, value) => {
    const newTypes = [...resourceTypes];
    newTypes[index] = value;
    setResourceTypes(newTypes);
  };

  const handleTotalResourceChange = (index, value) => {
    const newTotal = [...totalResources];
    newTotal[index] = parseInt(value) || 0;
    setTotalResources(newTotal);
  };

  const handleVectorChange = (vectorSetter, vector, index, value) => {
    const newVector = [...vector];
    newVector[index] = parseInt(value) || 0;
    vectorSetter(newVector);
  };

  const calculateNeed = (allocVector, maxVector) => {
    return allocVector.map((a, i) => (maxVector[i] || 0) - a);
  };

  const calculateAvailable = () => {
    const totalAllocation = Array(resourceCount).fill(0);
    processes.forEach((process) => {
      process.allocation.forEach((alloc, index) => {
        totalAllocation[index] += alloc;
      });
    });
    return totalResources.map((total, index) => total - totalAllocation[index]);
  };

  const handleSubmit = () => {
    if (!processName.trim()) {
      alert("Please enter a process name");
      return;
    }

    if (editingProcessId) {
      // Update existing process
      setProcesses(processes.map(p => 
        p.id === editingProcessId 
          ? {
              ...p,
              name: processName,
              allocation: [...allocation],
              max: [...max],
              need: calculateNeed(allocation, max),
            }
          : p
      ));
      setEditingProcessId(null);
    } else {
      // Add new process
      const newProcess = {
        id: Date.now(),
        name: processName,
        allocation: [...allocation],
        max: [...max],
        need: calculateNeed(allocation, max),
      };
      setProcesses([...processes, newProcess]);
    }

    // Reset form
    setProcessName("");
    setAllocation(Array(resourceCount).fill(0));
    setMax(Array(resourceCount).fill(0));
  };

  const handleEditProcess = (process) => {
    setProcessName(process.name);
    setAllocation([...process.allocation]);
    setMax([...process.max]);
    setEditingProcessId(process.id);
    // Scroll to top of left panel
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProcessId(null);
    setProcessName("");
    setAllocation(Array(resourceCount).fill(0));
    setMax(Array(resourceCount).fill(0));
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter((p) => p.id !== id));
    if (editingProcessId === id) {
      handleCancelEdit();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top section with two panels side by side */}
      <div className="flex flex-1 bg-purple-300">
        {/* Left Panel - Input */}
        <div className="w-1/2 p-6 bg-green-200 border-r border-gray-300 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
              Deadlock Detection Input
            </h2>

            {/* Number of Resources */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <label className="block font-semibold mb-2 text-blue-700">
                Number of Resources
              </label>
              <input
                type="number"
                min={0}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={resourceCount}
                onChange={handleResourceCountChange}
              />
            </div>

            {/* Resource Types */}
            {resourceCount > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <label className="block font-semibold mb-3 text-green-700">
                  Resource Types
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {resourceTypes.map((type, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`R${index + 1}`}
                      className="px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={type}
                      onChange={(e) =>
                        handleResourceTypeChange(index, e.target.value)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Total Resources */}
            {resourceCount > 0 && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <label className="block font-semibold mb-3 text-purple-700">
                  Total Resources
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {totalResources.map((total, index) => (
                    <div key={index} className="text-center">
                      <label className="block text-sm font-medium mb-1 text-purple-600">
                        {resourceTypes[index] || `R${index + 1}`}
                      </label>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-center"
                        value={total}
                        onChange={(e) =>
                          handleTotalResourceChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Input */}
            {resourceCount > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-yellow-700">
                    {editingProcessId ? "Edit Process" : "Add Process"}
                  </h3>
                  {editingProcessId && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2 text-yellow-600">
                    Process Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-yellow-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={processName}
                    onChange={(e) => setProcessName(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2 text-yellow-600">
                    Allocation Vector
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {allocation.map((val, index) => (
                      <div key={index} className="text-center">
                        <label className="block text-xs mb-1">
                          {resourceTypes[index] || `R${index + 1}`}
                        </label>
                        <input
                          type="number"
                          className="w-full px-2 py-1 border border-yellow-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          min={0}
                          value={val}
                          onChange={(e) =>
                            handleVectorChange(
                              setAllocation,
                              allocation,
                              index,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2 text-yellow-600">
                    Max Vector
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {max.map((val, index) => (
                      <div key={index} className="text-center">
                        <label className="block text-xs mb-1">
                          {resourceTypes[index] || `R${index + 1}`}
                        </label>
                        <input
                          type="number"
                          className="w-full px-2 py-1 border border-yellow-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                          min={0}
                          value={val}
                          onChange={(e) =>
                            handleVectorChange(
                              setMax,
                              max,
                              index,
                              e.target.value
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block font-medium mb-2 text-yellow-600">
                    Need Vector (Max - Allocation)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {calculateNeed(allocation, max).map((val, index) => (
                      <div key={index} className="text-center">
                        <label className="block text-xs mb-1">
                          {resourceTypes[index] || `R${index + 1}`}
                        </label>
                        <input
                          type="number"
                          readOnly
                          value={val}
                          className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className={`w-full ${
                    editingProcessId 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  } text-white py-2 px-4 rounded-lg transition-colors font-medium`}
                >
                  {editingProcessId ? "Update Process" : "Add Process"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Matrix Display */}
        <div className="w-1/2 p-6 bg-rose-100 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Process Matrix
          </h2>

          {processes.length > 0 ? (
            <div className="space-y-6">
              {/* Process Table */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Process</th>
                        <th className="px-4 py-3 text-center">Allocation</th>
                        <th className="px-4 py-3 text-center">Max</th>
                        <th className="px-4 py-3 text-center">Need</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {processes.map((process) => (
                        <tr 
                          key={process.id} 
                          className={`hover:bg-gray-50 ${
                            editingProcessId === process.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {process.name}
                            {editingProcessId === process.id && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                                Editing
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-1">
                              {process.allocation.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                                >
                                  {val}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-1">
                              {process.max.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                                >
                                  {val}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center space-x-1">
                              {process.need.map((val, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm"
                                >
                                  {val}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleEditProcess(process)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeProcess(process.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Available Resources */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Available Resources
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {calculateAvailable().map((available, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-indigo-50 rounded-lg"
                    >
                      <div className="font-medium text-indigo-600">
                        {resourceTypes[index] || `R${index + 1}`}
                      </div>
                      <div className="text-2xl font-bold text-indigo-800">
                        {available}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Resource Summary
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Total Resources
                    </h4>
                    <div className="space-y-2">
                      {totalResources.map((total, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">
                            {resourceTypes[index] || `R${index + 1}`}:
                          </span>
                          <span className="font-medium">{total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Active Processes
                    </h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {processes.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-medium mb-2">No Processes Added</h3>
              <p>Add processes from the left panel to see the matrix here</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full p-6 bg-sky-100 border-t border-gray-300 flex justify-center items-center">
        <div className="w-full">
          <h2 className="text-xl font-bold text-center text-blue-800 mb-4">
            Banker's Algorithm
          </h2>
          {
            <Bankers
              processes={processes}
              available={calculateAvailable()}
              resourceTypes={resourceTypes}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default DeadlockDetection;