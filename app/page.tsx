import Navbar from '@/components/Navbar';
import LandingPage from '@/components/landing/LandingPage';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-hidden">
      <div className="relative z-0 w-full h-full">
        <Navbar />
        <LandingPage />
      </div>
    </main>
  );
}
