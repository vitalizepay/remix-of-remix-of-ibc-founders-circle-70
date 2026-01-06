import { Phone, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import ibcLogo from '@/assets/ibc-logo.png';

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/ibcgulf', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/ibcgulf', label: 'Instagram' },
  { icon: Twitter, href: 'https://x.com/ibcgulf', label: 'X (Twitter)' },
  { icon: Linkedin, href: 'https://linkedin.com/company/ibcgulf', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@ibcgulf', label: 'YouTube' },
  { icon: MessageCircle, href: 'https://wa.me/971585570593', label: 'WhatsApp' },
];

const MonkFooter = () => {
  return (
    <footer className="bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Presented By */}
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/70 text-sm">Presented by</span>
            <img 
              src={ibcLogo} 
              alt="Indian Business Circle Dubai" 
              className="h-12 object-contain bg-white rounded-lg p-2"
            />
          </div>

          {/* Contact */}
          <div className="flex items-center gap-6">
            <a 
              href="tel:+971585570593" 
              className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">+971 58 557 0593</span>
            </a>
          </div>

          {/* Website */}
          <div>
            <a 
              href="https://ibcgulf.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors font-medium"
            >
              Visit ibcgulf.com
            </a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-9 h-9 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors group"
            >
              <social.icon className="w-4 h-4 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
            </a>
          ))}
          {/* Reddit */}
          <a
            href="https://reddit.com/r/ibcgulf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddit"
            className="w-9 h-9 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors group"
          >
            <svg 
              className="w-4 h-4 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
            </svg>
          </a>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} Indian Business Circle (IBC) – Dubai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MonkFooter;
