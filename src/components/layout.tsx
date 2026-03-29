import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, MapPin, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Garage", path: "/garage" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "glass-panel py-3 shadow-lg shadow-black/50" 
            : "bg-gradient-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 group">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Auto Assets Logo" 
              className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`text-sm font-semibold tracking-wider uppercase transition-colors duration-200 relative ${
                  location === link.path ? "text-primary" : "text-white hover:text-primary"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-primary box-glow transition-opacity duration-200 ${location === link.path ? "opacity-100" : "opacity-0"}`} />
              </Link>
            ))}
            <Link 
              href="/contact"
              className="ml-4 px-6 py-2.5 bg-primary text-black font-bold text-sm tracking-wider uppercase rounded-sm hover:bg-white transition-all duration-300 box-glow-hover"
            >
              Book Test Drive
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`text-2xl font-display font-bold uppercase tracking-wider ${
                    location === link.path ? "text-primary" : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <Link 
                href="/contact"
                className="w-full py-4 text-center bg-primary text-black font-bold uppercase tracking-wider rounded-sm"
              >
                Book Test Drive
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="Auto Assets" 
                className="h-12 w-auto mb-6"
              />
              <p className="text-muted-foreground max-w-sm">
                Elevate your drive with our premium selection of exceptional vehicles in South Africa.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/168652086330059" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://maps.google.com/maps?cid=11486238867110412855" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors">
                  <MapPin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-wider text-white">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-lg mb-6 uppercase tracking-wider text-white">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="text-primary mt-1 shrink-0" size={18} />
                  <span>Johannesburg, South Africa</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="text-primary shrink-0" size={18} />
                  <span>+27 (0) 11 000 0000</span>
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="text-primary shrink-0" size={18} />
                  <span>info@autoassets.co.za</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Auto Assets. All rights reserved.
            </p>
            <p className="text-sm font-display tracking-widest text-primary font-semibold">
              ELEVATE YOUR DRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
