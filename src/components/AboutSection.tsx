import { Users, Target, Sparkles, Handshake } from 'lucide-react';

const AboutSection = () => {
  const differences = [
    {
      icon: Users,
      title: 'Curated Members',
      description: 'Every member is carefully selected to ensure quality and trust within the community.',
    },
    {
      icon: Target,
      title: 'Founder-Focused',
      description: 'Built specifically for Indian founders and senior decision-makers in the UAE.',
    },
    {
      icon: Sparkles,
      title: 'Structured Learning',
      description: 'Regular workshops covering leadership, strategy, technology, and business growth.',
    },
    {
      icon: Handshake,
      title: 'Long-term Relationships',
      description: 'Focus on building lasting connections rather than transactional networking.',
    },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Community
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              What is Indian Business Circle?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Indian Business Circle (IBC) is a private, member-led business community built for 
              Indian entrepreneurs and business leaders in the UAE. IBC is not a mass networking group — 
              it is a circle of trust designed to foster meaningful connections, shared learning, 
              and real business growth within the Indian business ecosystem.
            </p>
          </div>

          {/* Philosophy Quote */}
          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-premium mb-16">
            <blockquote className="text-center">
              <p className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed mb-6">
                "Our members value quality conversations, consistent engagement, 
                and relationships that compound over time."
              </p>
              <footer className="text-muted-foreground text-sm font-medium">
                — The IBC Philosophy
              </footer>
            </blockquote>
          </div>

          {/* The IBC Difference */}
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl font-bold text-foreground mb-4">
              The IBC Difference
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              IBC prioritizes small, high-quality interactions over large events and focuses on 
              building long-term relationships rather than one-time meetings.
            </p>
          </div>

          {/* Difference Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differences.map((item, index) => (
              <div
                key={item.title}
                className="group bg-card p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-premium transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
