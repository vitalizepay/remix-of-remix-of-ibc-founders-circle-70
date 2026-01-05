import { useEffect } from 'react';
import MonkHeroSection from '@/components/monk/MonkHeroSection';
import MonkOverviewSection from '@/components/monk/MonkOverviewSection';
import MonkPricingSection from '@/components/monk/MonkPricingSection';
import MonkRegistrationForm from '@/components/monk/MonkRegistrationForm';
import MonkFooter from '@/components/monk/MonkFooter';

const TheMonkEvent = () => {
  useEffect(() => {
    // Set page metadata
    document.title = 'The Monk – Exponential Leadership | IBC Dubai';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Join The Monk: Exponential Leadership program by Dr Subramanian. A six-hour entrepreneur accelerator focused on clarity, decision-making, and leadership impact.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Join The Monk: Exponential Leadership program by Dr Subramanian. A six-hour entrepreneur accelerator focused on clarity, decision-making, and leadership impact.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <MonkHeroSection />
      <MonkOverviewSection />
      <MonkPricingSection />
      <MonkRegistrationForm />
      <MonkFooter />
    </main>
  );
};

export default TheMonkEvent;
