import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import SkillsSection from '../components/sections/SkillsSection';
import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProjectsSection limit={3} />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
