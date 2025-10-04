import React, { useState, useEffect } from 'react';

const Bankers = ({ processes, available, resourceTypes }) => {
  const [mode, setMode] = useState('safety'); // 'safety' or 'request'
  const [selectedProcess, setSelectedProcess] = useState('');
  const [requestVector, setRequestVector] = useState([]);
  const [result, setResult] = useState(null);
  const [safeSequence, setSafeSequence] = useState([]);
  const [step, setStep] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (processes.length > 0) {
      setRequestVector(Array(available.length).fill(0));
    }
  }, [processes, available]);

  const validateRequest = (processIndex, request) => {
    const process = processes[processIndex];
    const newWarnings = [];

    request.forEach((req, i) => {
      if (req > process.need[i]) {
        newWarnings.push(
          `Request[${i}] = ${req} exceeds Need[${i}] = ${process.need[i]} for ${process.name}`
        );
      }
      if (req > available[i]) {
        newWarnings.push(
          `Request[${i}] = ${req} exceeds Available[${i}] = ${available[i]}`
        );
      }
    });

    return newWarnings;
  };

  const isSafe = (allocation, need, available) => {
    const n = allocation.length;
    const m = available.length;
    const work = [...available];
    const finish = Array(n).fill(false);
    const safeSeq = [];
    const steps = [];

    let count = 0;
    while (count < n) {
      let found = false;
      
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          let canProceed = true;
          
          // Check if need[i] <= work
          for (let j = 0; j < m; j++) {
            if (need[i][j] > work[j]) {
              canProceed = false;
              break;
            }
          }
          
          if (canProceed) {
            // Add allocation back to work
            for (let j = 0; j < m; j++) {
              work[j] += allocation[i][j];
            }
            
            finish[i] = true;
            safeSeq.push(processes[i].name);
            
            steps.push({
              process: processes[i].name,
              need: [...need[i]],
              allocation: [...allocation[i]],
              work: [...work],
              action: `${processes[i].name} can be satisfied. Work = Work + Allocation`
            });
            
            found = true;
            count++;
            break;
          }
        }
      }
      
      if (!found) {
        return { safe: false, sequence: [], steps: [] };
      }
    }
    
    return { safe: true, sequence: safeSeq, steps: steps };
  };

  const runSafetyAlgorithm = () => {
    setIsLoading(true);
    setWarnings([]);
    
    setTimeout(() => {
      const allocation = processes.map(p => p.allocation);
      const need = processes.map(p => p.need);
      
      const safetyResult = isSafe(allocation, need, available);
      
      setResult(safetyResult.safe ? 'SAFE' : 'UNSAFE');
      setSafeSequence(safetyResult.sequence);
      setStep(safetyResult.steps);
      setIsLoading(false);
    }, 1000);
  };

  const runRequestAlgorithm = () => {
    if (!selectedProcess) {
      setWarnings(['Please select a process']);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const processIndex = processes.findIndex(p => p.name === selectedProcess);
      const validationWarnings = validateRequest(processIndex, requestVector);
      
      if (validationWarnings.length > 0) {
        setWarnings(validationWarnings);
        setResult('INVALID REQUEST');
        setIsLoading(false);
        return;
      }

      // Create new state after granting request
      const newAllocation = processes.map((p, i) => 
        i === processIndex 
          ? p.allocation.map((alloc, j) => alloc + requestVector[j])
          : [...p.allocation]
      );
      
      const newNeed = processes.map((p, i) => 
        i === processIndex 
          ? p.need.map((need, j) => need - requestVector[j])
          : [...p.need]
      );
      
      const newAvailable = available.map((avail, i) => avail - requestVector[i]);
      
      // Check if new state is safe
      const safetyResult = isSafe(newAllocation, newNeed, newAvailable);
      
      setResult(safetyResult.safe ? 'REQUEST GRANTED - SAFE STATE' : 'REQUEST DENIED - UNSAFE STATE');
      setSafeSequence(safetyResult.sequence);
      setStep(safetyResult.steps);
      setWarnings([]);
      setIsLoading(false);
    }, 1000);
  };

  const handleRequestVectorChange = (index, value) => {
    const newRequest = [...requestVector];
    newRequest[index] = parseInt(value) || 0;
    setRequestVector(newRequest);
    // Clear results when request vector changes
    if (result) {
      setResult(null);
      setSafeSequence([]);
      setStep([]);
      setWarnings([]);
    }
  };

  const resetAlgorithm = () => {
    setResult(null);
    setSafeSequence([]);
    setStep([]);
    setWarnings([]);
    setRequestVector(Array(available.length).fill(0));
  };

  if (processes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8 text-gray-500">
        <div className="text-4xl mb-4">🏦</div>
        <h3 className="text-lg font-medium mb-2">No Processes Available</h3>
        <p>Add processes to run Banker's Algorithm</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 " >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center justify-center">
          <span className="mr-2">🏦</span>
          Banker's Algorithm
        </h3>

        {/* Mode Selection */}
        <div className="mb-6 flex justify-center">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => {setMode('safety'); resetAlgorithm();}}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'safety' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Safety Check
            </button>
            <button
              onClick={() => {setMode('request'); resetAlgorithm();}}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === 'request' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Request Check
            </button>
          </div>
        </div>

        {/* Request Mode Inputs */}
        {mode === 'request' && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-3 text-green-700 text-center">Resource Request</h4>
            
            <div className="mb-4">
              <label className="block font-medium mb-2 text-green-600">Select Process</label>
              <select
                value={selectedProcess}
                onChange={(e) => {
                  setSelectedProcess(e.target.value);
                  // Clear request vector and results when process changes
                  setRequestVector(Array(available.length).fill(0));
                  setResult(null);
                  setSafeSequence([]);
                  setStep([]);
                  setWarnings([]);
                }}
                className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Choose a process...</option>
                {processes.map(process => (
                  <option key={process.id} value={process.name}>
                    {process.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2 text-green-600">Request Vector</label>
              <div className="grid grid-cols-3 gap-2">
                {requestVector.map((val, index) => (
                  <div key={index} className="text-center">
                    <label className="block text-xs mb-1">
                      {resourceTypes[index] || `R${index + 1}`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-2 py-1 border border-green-200 rounded text-center focus:outline-none focus:ring-1 focus:ring-green-400"
                      value={val}
                      onChange={(e) => handleRequestVectorChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Show current process need for reference */}
            {selectedProcess && (
              <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200 text-center">
                <h5 className="font-medium text-yellow-700 mb-2">
                  Current Need for {selectedProcess}:
                </h5>
                <div className="flex flex-wrap space-x-3 justify-center">
                  {processes.find(p => p.name === selectedProcess)?.need.map((need, index) => (
                    <span key={index} className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
                      {resourceTypes[index] || `R${index + 1}`}: {need}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <h4 className="font-semibold text-red-700 mb-2 flex items-center justify-center">
              <span className="mr-2">⚠️</span>
              Warnings
            </h4>
            <ul className="text-red-600 text-sm space-y-1">
              {warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Run Button */}
        <div className="mb-6">
          <button
            onClick={mode === 'safety' ? runSafetyAlgorithm : runRequestAlgorithm}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              mode === 'safety' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Algorithm...
              </span>
            ) : (
              `Run ${mode === 'safety' ? 'Safety Check' : 'Request Check'}`
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg text-center ${
              result.includes('SAFE') || result.includes('GRANTED') 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <h4 className={`text-lg font-bold ${
                result.includes('SAFE') || result.includes('GRANTED')
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                {result}
              </h4>
            </div>

            {safeSequence.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2 text-center">Safe Sequence:</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {safeSequence.map((process, index) => (
                    <span key={index} className="inline-flex items-center">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-medium">
                        {process}
                      </span>
                      {index < safeSequence.length - 1 && (
                        <span className="mx-2 text-blue-600">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {step.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <h4 className="font-semibold text-gray-700 mb-3">Algorithm Steps:</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {step.map((s, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-gray-200 text-left">
                      <div className="font-medium text-gray-800 mb-1">
                        Step {index + 1}: {s.process}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{s.action}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Need:</span> [{s.need.join(', ')}]
                        </div>
                        <div>
                          <span className="font-medium">Allocation:</span> [{s.allocation.join(', ')}]
                        </div>
                        <div>
                          <span className="font-medium">Work:</span> [{s.work.join(', ')}]
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bankers;