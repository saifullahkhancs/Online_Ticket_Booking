import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import TicketInfo from './pages/TicketInfo';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/ticket" element={<TicketInfo />} />
        <Route path="/ticket/:ref" element={<TicketInfo />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AuthProvider>
  );
}
