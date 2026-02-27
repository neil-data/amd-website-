import dynamic from 'next/dynamic';
import HeroSection from '@/components/landing/HeroSection';

const TrustCrisisSection = dynamic(() => import('@/components/landing/TrustCrisisSection'));
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'));
const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'));
const ChallengesPreviewSection = dynamic(() => import('@/components/landing/ChallengesPreviewSection'));
const LeaderboardPreviewSection = dynamic(() => import('@/components/landing/LeaderboardPreviewSection'));
const RecruitersSection = dynamic(() => import('@/components/landing/RecruitersSection'));
const SiteFooter = dynamic(() => import('@/components/landing/SiteFooter'));
const ScrollProgress = dynamic(() => import('@/components/landing/ScrollProgress'), { ssr: false });
const MouseSpotlight = dynamic(() => import('@/components/landing/MouseSpotlight'), { ssr: false });

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
