import { useState } from 'react';
import Home from './pages/Home';
import BookingModal from './components/BookingModal';
import './index.css';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="bg-white">
      <Home onBookingClick={() => setIsBookingOpen(true)} />
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

export default App;
