import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Footer from '../components/Footer';

export default function Home({ onBookingClick }) {
  return (
    <div>
      <Header onBookingClick={onBookingClick} />
      <Hero onBookingClick={onBookingClick} />
      <About />
      <Services />
      <Footer />
    </div>
  );
}
