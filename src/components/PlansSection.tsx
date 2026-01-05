import { Check, X, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlansSection = () => {
  const scrollToApply = () => {
    const element = document.querySelector('#apply');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const plans = [
    {
      name: 'Founding Membership',
      badge: 'Limited',
      price: 'AED 1,500',
      period: 'Year 1',
      renewal: 'AED 1,080 lifetime renewal',
      featured: true,
      features: [
        { text: '6 Annual Workshops Included', included: true },
        { text: '3 Free Workshops per Year', included: true },
        { text: '3 Workshops at 25% Discount', included: true },
        { text: '12 Monthly Coffee Meetups', included: true },
        { text: 'Priority Seating at Workshops', included: true },
        { text: 'Priority Registration for All Events', included: true },
        { text: 'Founding Member Badge (Lifetime)', included: true },
        { text: 'Premium Business Listing', included: true },
        { text: 'Annual Business Showcase', included: true },
        { text: '15% Discount on CEO Dinners & Events', included: true },
        { text: "Access to 'Founders Only' Inner Circle", included: true },
        { text: 'VIP Check-in at Events', included: true },
        { text: 'Early-Bird Partner Event Invitations', included: true },
        { text: 'Special Rates for Sponsorships', included: true },
        { text: 'Priority Networking Spotlight', included: true },
      ],
    },
    {
      name: 'Annual Membership',
      badge: null,
      price: 'AED 1,200',
      period: 'per Year',
      renewal: 'Standard renewal annually',
      featured: false,
      features: [
        { text: '6 Annual Workshops Included', included: true },
        { text: '1 Free Workshop per Year', included: true },
        { text: 'Discounted Workshops', included: false },
        { text: '12 Monthly Coffee Meetups', included: true },
        { text: 'Priority Seating at Workshops', included: false },
        { text: 'Priority Registration for All Events', included: false },
        { text: 'Founding Member Badge', included: false },
        { text: 'Standard Business Listing', included: true },
        { text: 'Annual Business Showcase', included: false },
        { text: '5% Discount on Paid IBC Events', included: true },
        { text: "Access to 'Founders Only' Inner Circle", included: false },
        { text: 'VIP Check-in at Events', included: false },
        { text: 'Limited Partner Event Invitations', included: true },
        { text: 'Standard Sponsorship Rates', included: true },
        { text: 'Normal Rotation Networking Spotlight', included: true },
      ],
    },
  ];

  return (
    <section id="plans" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold-dark text-sm font-medium rounded-full mb-4">
              Choose Your Path
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Membership Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Membership is curated to maintain quality and relevance. All applications are reviewed before confirmation.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.featured
                    ? 'bg-primary text-primary-foreground shadow-emerald'
                    : 'bg-background border border-border shadow-premium'
                }`}
              >
                {/* Featured Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold text-foreground text-xs font-bold rounded-full shadow-gold">
                      <Crown className="w-3 h-3" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="font-display text-2xl font-bold mb-2 flex items-center gap-2">
                    {plan.featured && <Star className="w-5 h-5 text-gold" />}
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {plan.renewal}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.featured ? 'bg-primary-foreground/20' : 'bg-primary/10'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.featured ? 'text-primary-foreground' : 'text-primary'}`} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={`text-sm ${
                        !feature.included 
                          ? plan.featured ? 'text-primary-foreground/50' : 'text-muted-foreground'
                          : ''
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  variant={plan.featured ? 'gold' : 'hero'}
                  size="lg"
                  className="w-full"
                  onClick={scrollToApply}
                >
                  Apply for {plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            * Founding Membership is limited. All memberships are subject to application approval.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
