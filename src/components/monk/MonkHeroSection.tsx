import { Button } from '@/components/ui/button';
import { ArrowDown, Calendar, Clock } from 'lucide-react';
import monkHeroImage from '@/assets/monk-event-hero.png';

const MonkHeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={monkHeroImage} 
          alt="The Monk - Exponential Leadership" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl">
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent text-sm font-medium mb-6 animate-fade-up">
            <Calendar className="w-4 h-4" />
            February 2026
          </div>

          {/* Main Title */}
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-4 animate-fade-up stagger-1">
            The Monk
          </h1>
          
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-accent mb-8 animate-fade-up stagger-2">
            Exponential Leadership
          </h2>

          {/* Taglines */}
          <div className="space-y-2 mb-10 animate-fade-up stagger-3">
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-light italic">
              Where clarity becomes power.
            </p>
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-light italic">
              Where leaders multiply impact.
            </p>
          </div>

          {/* Program Info */}
          <div className="flex flex-wrap items-center gap-6 mb-10 animate-fade-up stagger-4">
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-medium">Six Hours</span>
            </div>
            <div className="w-px h-6 bg-primary-foreground/30" />
            <span className="text-primary-foreground/80 font-medium">Entrepreneur Accelerator</span>
            <div className="w-px h-6 bg-primary-foreground/30" />
            <span className="text-primary-foreground/80 font-medium">Sharper thinking. Better decisions.</span>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-5">
            <Button
              size="xl"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-gold"
              onClick={() => scrollToSection('register')}
            >
              Register Now
              <ArrowDown className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => scrollToSection('overview')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('overview')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer"
      >
        <span className="text-xs font-medium uppercase tracking-wider">Discover</span>
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};

export default MonkHeroSection;
