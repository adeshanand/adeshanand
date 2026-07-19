import Nav from './components/sections/Nav.jsx';
import Hero from './components/sections/Hero.jsx';
import AwsSpotlight from './components/sections/AwsSpotlight.jsx';
import Impact from './components/sections/Impact.jsx';
import Experience from './components/sections/Experience.jsx';
import Skills from './components/sections/Skills.jsx';
import Credentials from './components/sections/Credentials.jsx';
import Testimonials from './components/sections/Testimonials.jsx';
import Contact from './components/sections/Contact.jsx';

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <AwsSpotlight />
        <Impact />
        <Experience />
        <Skills />
        <Credentials />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}
