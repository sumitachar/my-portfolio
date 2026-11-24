import { useState } from 'react';
import SmoothScroll from './components/site/SmoothScroll';
import Preloader from './components/site/Preloader';
import Cursor from './components/site/Cursor';
import Backdrop from './components/site/Backdrop';
import Navbar from './components/layout/Navbar';
import Hero from './components/site/Hero';
import Marquee from './components/site/Marquee';
import About from './components/site/About';
import Services from './components/site/Services';
import TrustBar from './components/site/TrustBar';
import Process from './components/site/Process';
import FAQ from './components/site/FAQ';
import CtaBand from './components/site/CtaBand';
import ChatAssistant from './components/site/ChatAssistant';
import AdminGate from './components/admin/AdminGate';
import Projects from './components/site/Projects';
import Experience from './components/site/Experience';
import Skills from './components/site/Skills';
import Contact from './components/site/Contact';
import Footer from './components/layout/Footer';

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <SmoothScroll>
      <div className="noise relative min-h-screen">
        <Preloader onDone={() => setReady(true)} />
        <Cursor />
        {/* layers: calm backdrop (z-0) → content (z-2) */}
        <Backdrop />
        <Navbar ready={ready} />
        <main className="relative z-[2]">
          <Hero ready={ready} />
          <TrustBar />
          <Marquee />
          <Services />
          <Projects />
          <Process />
          <About />
          <Experience />
          <Skills />
          <CtaBand />
          <FAQ />
          <Contact />
        </main>
        <div className="relative z-[2]"><Footer /></div>
        <ChatAssistant />
        <AdminGate />
      </div>
    </SmoothScroll>
  );
}
