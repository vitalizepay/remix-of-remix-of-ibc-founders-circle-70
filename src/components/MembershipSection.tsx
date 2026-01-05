import { BookOpen, Coffee, Mic2, Eye, Crown } from 'lucide-react';

const MembershipSection = () => {
  const benefits = [
    {
      icon: BookOpen,
      title: 'Continuous Learning',
      description: 'IBC conducts six power workshops every year, delivered every alternate month. Topics include leadership, business growth, branding, sales strategy, technology, AI, productivity, and decision-making. Each session is practical, actionable, and relevant to business owners.',
      highlight: '6 Workshops/Year',
    },
    {
      icon: Coffee,
      title: 'Monthly Coffee Networking',
      description: 'Monthly coffee networking meetups encourage meaningful conversations and relationship building. These sessions provide a relaxed environment for business introductions, exploring collaborations, and building trust with fellow founders.',
      highlight: '12 Meetups/Year',
    },
    {
      icon: Mic2,
      title: 'IBC Stories – Indian Business Stories',
      description: 'Authentic Indian business narratives designed to inspire, educate, and strengthen the community. Share your entrepreneur milestones, growth stories, lessons learned, challenges overcome, and leadership insights.',
      highlight: 'Share Your Journey',
    },
    {
      icon: Eye,
      title: 'Member Visibility',
      description: 'IBC ensures members are seen, heard, and remembered. Through business introductions, visibility during workshops and networking sessions, and opportunities to share your journey via IBC Stories. Visibility builds familiarity, familiarity builds trust, and trust creates opportunity.',
      highlight: 'Be Seen & Heard',
    },
    {
      icon: Crown,
      title: 'Inner Circle',
      description: 'The Inner Circle is a private, invite-only group exclusively for Founding Members. It provides direct access to fellow founders and decision-makers, peer-level discussions on growth and challenges, and closed-door conversations built on trust.',
      highlight: 'Founding Members Only',
    },
  ];

  return (
    <section id="membership" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              What You Get
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Inside the Membership
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Membership at IBC is designed to deliver continuous value throughout the year. 
              Members benefit from learning, networking, visibility, and access to opportunities.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`flex flex-col lg:flex-row gap-6 lg:gap-12 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0 lg:w-1/3">
                  <div className="bg-card p-6 rounded-2xl border border-border shadow-premium">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold-dark text-xs font-semibold rounded-full">
                      {benefit.highlight}
                    </span>
                  </div>
                </div>
                <div className="lg:w-2/3 flex flex-col justify-center">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
