import flywheel from '@/assets/flywheel.png';

const FlywheelSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Curated Members',
      description: 'Every member is carefully selected to ensure quality and trust. We prioritize decision-makers who value long-term relationships.',
    },
    {
      number: '02',
      title: 'Continuous Learning',
      description: 'Six power workshops annually covering leadership, scaling, branding, technology, AI, and decision-making.',
    },
    {
      number: '03',
      title: 'Meaningful Connections',
      description: 'Monthly coffee networking creates genuine opportunities for business introductions and relationship building.',
    },
    {
      number: '04',
      title: 'IBC Stories',
      description: 'Share your business journey. Real stories of milestones, challenges, and insights that inspire the community.',
    },
    {
      number: '05',
      title: 'Stronger Community',
      description: 'Trust and familiarity compound over time. Active participation strengthens the entire network.',
    },
    {
      number: '06',
      title: 'More Opportunities',
      description: 'A virtuous cycle where quality attracts quality, creating exponential opportunities for all members.',
    },
  ];

  return (
    <section id="flywheel" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold-dark text-sm font-medium rounded-full mb-4">
              How It Works
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              The IBC Value Flywheel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each element reinforces the next, creating a compounding effect 
              that continuously amplifies trust, learning, and opportunities.
            </p>
          </div>

          {/* Flywheel Image */}
          <div className="flex justify-center mb-16">
            <div className="relative max-w-xl">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
              <img
                src={flywheel}
                alt="IBC Value Flywheel - Curated Members, Learning, Connections, Stories, Community, Opportunities"
                className="relative w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-background p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-premium transition-all duration-300"
              >
                <h4 className="font-display text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="font-display text-xl text-foreground italic">
              "Curated members → Learning → Connections → Visibility → Stronger community → More opportunities"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlywheelSection;
