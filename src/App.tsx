import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import HeroCampaignSection from './components/HeroCampaignSection';
import PublishedWorkSection from './components/PublishedWorkSection';
import ContactSection from './components/ContactSection';

export default function App() {
  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ExperienceSection />
      <HeroCampaignSection />
      <PublishedWorkSection />
      <ContactSection />
    </main>
  );
}
