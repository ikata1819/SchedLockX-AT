# SchedLockX-AT 🖥️🔒

**A Comprehensive CPU Scheduling & Deadlock Simulator**

*JU CSE Operating Systems Lab Final Project*

---

## 📖 Overview

**SchedLockX-AT** is an advanced, interactive web-based simulator built with React that provides comprehensive visualization and analysis tools for operating system concepts. This project serves as both an educational tool and a practical simulator for understanding CPU scheduling algorithms and deadlock detection/prevention mechanisms.

The simulator offers real-time Gantt chart generation, process management, and interactive deadlock analysis with the Banker's algorithm implementation.

---

## ✨ Features

### 🖥️ CPU Scheduling Simulator
- **Multiple Scheduling Algorithms**
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Round Robin (RR)
  - Priority Scheduling
  - Multilevel Queue Scheduling
  
- **Task Type Support**
  - **Periodic Tasks**: Recurring processes with fixed periods
  - **Aperiodic Tasks**: One-time execution processes
  
- **Interactive Gantt Charts**
  - Real-time visualization of process execution
  - Color-coded process representation
  - Timeline analysis with detailed metrics
  
- **Performance Metrics**
  - Turnaround Time
  - Waiting Time
  - Response Time
  - CPU Utilization
  - Throughput Analysis

### 🔒 Deadlock Detection & Prevention
- **Banker's Algorithm Implementation**
  - Safety state verification
  - Resource request simulation
  - Safe sequence generation
  
- **Resource Allocation Matrix**
  - Dynamic process queue management
  - Real-time available resource calculation
  - Interactive matrix visualization
  
- **Request Validation**
  - Automatic warning system for invalid requests
  - Need vector calculations
  - Step-by-step algorithm execution display

### 🎨 User Interface
- **Modern, Responsive Design**
  - Clean, intuitive interface
  - Sticky navigation headers
  - Smooth animations and transitions
  
- **Three-Panel Layout**
  - Input panel for process/resource management
  - Visualization panel for matrices and charts
  - Algorithm execution panel for results
  
- **Interactive Components**
  - Toast notifications for user feedback
  - Dynamic form validation
  - Real-time calculations

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SchedLockX-AT.git
   cd SchedLockX-AT
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📊 Usage Guide

### CPU Scheduling Simulation

1. **Select CPU Scheduling** from the main menu
2. **Choose Algorithm**: Select from available scheduling algorithms
3. **Add Processes**: 
   - Enter process details (arrival time, burst time, priority, etc.)
   - Specify if the process is periodic or aperiodic
4. **Configure Parameters**: Set time quantum for Round Robin, priority levels, etc.
5. **Run Simulation**: Generate Gantt chart and view performance metrics

### Deadlock Analysis

1. **Select Deadlock** from the main menu
2. **System Configuration**:
   - Define number and types of resources
   - Set total available resources for each type
3. **Add Processes**:
   - Input allocation vectors (current resource holdings)
   - Define maximum resource requirements
4. **Run Analysis**:
   - **Safety Check**: Verify if current state is safe
   - **Request Simulation**: Test if a resource request can be granted safely

---

## 🛠️ Technical Implementation

### Architecture
- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React useState and useEffect hooks
- **Notifications**: React Hot Toast
- **Charts**: Custom Gantt chart implementation

### Key Components

#### CPU Scheduler
```javascript
// Core scheduling algorithms implementation
- FCFS Algorithm
- SJF/SRTF Implementation
- Round Robin with time quantum
- Priority-based scheduling
- Gantt chart generation engine
```

#### Deadlock Detector
```javascript
// Banker's Algorithm implementation
- Safety algorithm
- Resource request algorithm
- Matrix operations
- Safe sequence generation
```

#### UI Components
```javascript
// Modern React components
- Responsive layout system
- Interactive forms and inputs
- Real-time data visualization
- Toast notification system
```

---

## 📈 Algorithms Implemented

### CPU Scheduling Algorithms

| Algorithm | Type | Preemptive | Best Use Case |
|-----------|------|------------|---------------|
| FCFS | Non-preemptive | No | Simple batch systems |
| SJF | Non-preemptive | No | Known execution times |
| SRTF | Preemptive | Yes | Time-sharing systems |
| Round Robin | Preemptive | Yes | Interactive systems |
| Priority | Both | Configurable | Real-time systems |

### Deadlock Prevention
- **Banker's Algorithm**: Prevents deadlock by ensuring safe state
- **Resource Allocation Graph**: Visual representation of resource dependencies
- **Safe Sequence Detection**: Finds execution order that avoids deadlock

---

## 🎯 Educational Value

This simulator serves as an excellent educational tool for:

- **Operating Systems Courses**: Hands-on experience with scheduling algorithms
- **System Design**: Understanding resource management principles  
- **Algorithm Analysis**: Comparing performance of different approaches
- **Interactive Learning**: Visual feedback enhances comprehension

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Project Structure

```
SchedLockX-AT/
├── src/
│   ├── Components/
│   │   ├── Algorithms.jsx           # Core scheduling algorithms implementation
│   │   ├── AperiodicAlgorithms.jsx  # Aperiodic task scheduling logic
│   │   ├── Bankers.jsx              # Banker's algorithm for deadlock prevention
│   │   ├── CPUS.jsx                 # Main CPU scheduling interface
│   │   ├── Deadlock.jsx             # Deadlock detection and prevention interface
│   │   ├── Header.jsx               # Main navigation and home page
│   │   ├── PeriodicAlgorithms.jsx   # Periodic task scheduling algorithms
│   │   └── ProcessForm.jsx          # Process input and management forms
│   ├── App.jsx                      # Main application component and routing
│   ├── App.css                     # Global styles and animations
│   └── index.js                    # Application entry point
├── public/
├── package.json
└── README.md
```


## 🏆 Academic Context

**Course**: Operating Systems Laboratory  
**Institution**: Jahangirnagar University, Computer Science & Engineering  
**Project Type**: Final Project  
**Academic Year**: 2023-2024

This project demonstrates practical implementation of core operating system concepts taught in academic curriculum, providing hands-on experience with:
- Process scheduling mechanisms
- Resource allocation strategies
- Deadlock detection and prevention
- System performance analysis

---


## 👨‍💻 Author

**[Anika Tasnim]**  
Computer Science & Engineering  
Jahangirnagar University  

- GitHub: [@ikata1819](https://github.com/ikata1819)
- Email: anikatasnim1066@gmail.com

---

## 🙏 Acknowledgments

- Operating Systems course instructor
- React.js and Tailwind CSS communities
- Jahangirnagar University CSE Department

---

## 🔮 Future Enhancements

- [ ] Additional scheduling algorithms (MLQ, MLFQ)
- [ ] Process synchronization simulation
- [ ] Memory management visualization
- [ ] Export functionality for results
- [ ] Advanced performance analytics
- [ ] Multi-core CPU simulation
- [ ] Real-time system scheduling

---

*Built with ❤️ for the Operating Systems community*
