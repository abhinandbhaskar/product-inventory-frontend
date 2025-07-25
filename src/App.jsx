import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // adjust path based on your structure
import Dashboard from './pages/Dashboard';
const App = () => {
  return (
    <Routes>
      <Route path="/home" element={<Dashboard/>} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;

