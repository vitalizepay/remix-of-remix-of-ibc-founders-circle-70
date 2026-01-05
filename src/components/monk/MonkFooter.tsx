import { Phone } from 'lucide-react';
import ibcLogo from '@/assets/ibc-logo.png';

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
