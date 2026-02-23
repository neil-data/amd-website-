import HeroSection from '@/components/landing/HeroSection';
import TrustCrisisSection from '@/components/landing/TrustCrisisSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ChallengesPreviewSection from '@/components/landing/ChallengesPreviewSection';
import LeaderboardPreviewSection from '@/components/landing/LeaderboardPreviewSection';
import RecruitersSection from '@/components/landing/RecruitersSection';
import SiteFooter from '@/components/landing/SiteFooter';
import ScrollProgress from '@/components/landing/ScrollProgress';
import MouseSpotlight from '@/components/landing/MouseSpotlight';

export default function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <MouseSpotlight />
      <HeroSection />
      <TrustCrisisSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ChallengesPreviewSection />
      <LeaderboardPreviewSection />
      <RecruitersSection />
      <SiteFooter />
    </>
  );
}
