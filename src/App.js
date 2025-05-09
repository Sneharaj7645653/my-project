import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import QuizGenerator from './components/QuizGenerator/QuizGenerator';
import NoteEditor from './components/NoteEditor/NoteEditor';
import Timer from './components/Timer/Timer';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Study Assistant</h2>
          </div>
          <nav>
            <NavLink 
              to="/" 
              end  // Add 'end' prop for exact matching of root route
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/quiz" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Quiz Generator
            </NavLink>
            <NavLink 
              to="/notes" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Notes
            </NavLink>
            <NavLink 
              to="/timer" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Timer
            </NavLink>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/notes" element={<NoteEditor />} />
            <Route path="/timer" element={<Timer />} />
            {/* Add a catch-all route for 404 errors if needed */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;