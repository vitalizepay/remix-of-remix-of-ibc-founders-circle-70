const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold">IBC</span>
            <span className="text-primary-foreground/70 text-sm">
              Indian Business Circle
            </span>
          </div>

          {/* Tagline */}
          <p className="text-primary-foreground/60 text-sm font-display italic">
            Meet. Connect. Grow.
          </p>

          {/* Copyright */}
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} IBC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
