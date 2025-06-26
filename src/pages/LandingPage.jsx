import NavBar from '../components/landing/NavBar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16">
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;