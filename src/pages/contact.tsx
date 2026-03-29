import { Layout } from "../components/layout";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Facebook } from "lucide-react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent Successfully",
        description: "One of our premium sales agents will contact you shortly.",
        variant: "default",
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 px-4 flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/contact-bg.jpg`}
            alt="Contact Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-black text-5xl md:text-6xl text-white uppercase tracking-wider mb-4">
              Get in <span className="text-primary text-glow">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Experience unparalleled service. Contact Auto Assets today.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display font-bold text-3xl text-white uppercase tracking-wider mb-8">
                Dealership <span className="text-white/50">Details</span>
              </h2>

              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Showroom Location</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Johannesburg<br />
                      South Africa
                    </p>
                    <a href="https://maps.google.com/maps?cid=11486238867110412855" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-primary hover:text-white transition-colors text-sm uppercase tracking-wider font-semibold">
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Direct Line</h3>
                    <p className="text-muted-foreground">
                      Sales: +27 (0) 11 000 0000<br />
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Email Address</h3>
                    <p className="text-muted-foreground">info@autoassets.co.za</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Operating Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 08:00 - 17:00<br />
                      Saturday: 09:00 - 13:00<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-bold text-white mb-4">Connect Socially</h3>
                <a 
                  href="https://www.facebook.com/168652086330059" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#1877F2] text-white font-bold rounded hover:bg-[#0C63D4] transition-colors"
                >
                  <Facebook size={20} /> Follow on Facebook
                </a>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-card border border-border p-8 md:p-10 rounded-2xl relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
              
              <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wider mb-8">
                Send an Enquiry
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">First Name</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">Last Name</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">Phone Number</label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                      placeholder="+27..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 uppercase tracking-wider">Message</label>
                  <textarea 
                    required 
                    rows={5}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
                    placeholder="I am interested in..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-sm flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 box-glow-hover disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? "Sending..." : "Submit Enquiry"}
                  {!isSubmitting && <Send size={18} />}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </section>
    </Layout>
  );
}
