import Nav from './components/sections/Nav.jsx';
import Hero from './components/sections/Hero.jsx';
import Impact from './components/sections/Impact.jsx';
import Experience from './components/sections/Experience.jsx';
import Skills from './components/sections/Skills.jsx';
import Credentials from './components/sections/Credentials.jsx';
import Contact from './components/sections/Contact.jsx';
import Footer from './components/sections/Footer.jsx';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Impact />
        <Experience />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
