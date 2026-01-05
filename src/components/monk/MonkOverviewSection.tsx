import { Target, Brain, Users, TrendingUp } from 'lucide-react';

const MonkOverviewSection = () => {
  const outcomes = [
    {
      icon: Brain,
      title: 'Sharper Thinking',
      description: 'Develop mental clarity and focus that cuts through complexity.'
    },
    {
      icon: Target,
      title: 'Better Decisions',
      description: 'Master frameworks for high-stakes decision making under pressure.'
    },
    {
      icon: TrendingUp,
      title: 'Multiplied Impact',
      description: 'Learn to scale your influence and leadership exponentially.'
    },
    {
      icon: Users,
      title: 'Executive Network',
      description: 'Connect with like-minded leaders and entrepreneurs.'
    }
  ];

  return (
    <section id="overview" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Program Overview</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            An Entrepreneur Accelerator
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A transformative six-hour intensive designed for founders, CEOs, and senior executives 
            who seek clarity in chaos and want to multiply their leadership impact.
          </p>
        </div>

        {/* Speaker Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-premium">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-emerald-dark flex items-center justify-center flex-shrink-0">
                <span className="font-display text-4xl font-bold text-primary-foreground">DS</span>
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Dr Subramanian
                </h3>
                <p className="text-accent font-medium text-lg mb-4">Leadership Strategist</p>
                <p className="text-muted-foreground leading-relaxed">
                  A renowned leadership strategist with decades of experience transforming 
                  how executives think, decide, and lead. Dr Subramanian brings a unique blend 
                  of ancient wisdom and modern business acumen to help leaders achieve clarity 
                  and exponential growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Outcomes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((outcome, index) => (
            <div 
              key={index}
              className="bg-background rounded-xl p-6 shadow-premium hover:shadow-emerald transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <outcome.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-display text-xl font-semibold text-foreground mb-2">
                {outcome.title}
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MonkOverviewSection;
