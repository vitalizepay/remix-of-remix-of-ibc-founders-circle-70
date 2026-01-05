import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';

const MonkPricingSection = () => {
  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 gradient-emerald">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Investment</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6">
            Choose Your Path
          </h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Invest in your leadership journey. IBC members enjoy exclusive pricing.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Standard Price */}
          <div className="bg-background/95 backdrop-blur rounded-2xl p-8 shadow-premium">
            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Standard
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display text-5xl font-bold text-foreground">550</span>
                <span className="text-xl text-muted-foreground">AED</span>
              </div>
              <p className="text-muted-foreground text-sm mt-2">Full program access</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {['6-hour intensive program', 'Dr Subramanian session', 'Program materials', 'Certificate of completion', 'Networking session'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full" 
              size="lg"
              onClick={scrollToRegister}
            >
              Register Now
            </Button>
          </div>

          {/* IBC Member Price */}
          <div className="bg-background rounded-2xl p-8 shadow-gold relative overflow-hidden border-2 border-accent">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-accent text-accent-foreground px-4 py-1 text-sm font-semibold rounded-bl-lg flex items-center gap-1">
                <Star className="w-4 h-4" />
                Best Value
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                IBC Member
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display text-5xl font-bold gradient-gold-text">467</span>
                <span className="text-xl text-muted-foreground">AED</span>
              </div>
              <p className="text-accent text-sm font-medium mt-2">Save 83 AED</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {['6-hour intensive program', 'Dr Subramanian session', 'Program materials', 'Certificate of completion', 'Networking session', 'Priority seating'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
              size="lg"
              onClick={scrollToRegister}
            >
              Register as Member
            </Button>
          </div>
        </div>

        {/* Member Note */}
        <p className="text-center text-primary-foreground/70 text-sm mt-8 max-w-xl mx-auto">
          <span className="text-accent">*</span> Member pricing applies only to verified IBC members. 
          Membership will be verified upon registration.
        </p>
      </div>
    </section>
  );
};

export default MonkPricingSection;
