import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FlywheelSection from '@/components/FlywheelSection';
import MembershipSection from '@/components/MembershipSection';
import PlansSection from '@/components/PlansSection';
import WhoItsForSection from '@/components/WhoItsForSection';
import PublicInquiryForm from '@/components/PublicInquiryForm';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyApplyButton from '@/components/StickyApplyButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FlywheelSection />
        <MembershipSection />
        <PlansSection />
        <WhoItsForSection />
        <PublicInquiryForm />
        <ContactSection />
      </main>
      <Footer />
      <StickyApplyButton />
    </div>
  );
};

export default Index;
