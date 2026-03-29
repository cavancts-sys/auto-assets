import { Layout } from "../components/layout";
import { CarCard } from "../components/car-card";
import { useCars } from "../hooks/use-cars";
import { motion } from "framer-motion";
import { ArrowRight, Star, Quote } from "lucide-react";
import { Link } from "wouter";

const REVIEWS = [
  {
    name: "Lishan Naidoo",
    date: "2026/03/11",
    text: "Absolute class from JC and Nathan. Their integrity hones...",
    rating: 5
  },
  {
    name: "Jessica De Jager",
    date: "2026/02/02",
    text: "Auto Assets really is the best dealership I have ever dealt...",
    rating: 5
  },
  {
    name: "Canville Saaiman",
    date: "2026/01/29",
    text: "Good day guys. My experience with auto assets was tops...",
    rating: 5
  }
];

export default function Home() {
  const { data: allCars } = useCars();
  const { data: availableCars, isLoading: loadingAvailable } = useCars("available");
  const { data: soldCars, isLoading: loadingSold } = useCars("sold");
  const newCarIds = new Set((allCars || []).slice(0, 6).map(c => c.id));

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/garage-hero.webp`}
            alt="Premium Automotive" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-white uppercase tracking-[0.1em] mb-6">
              Elevate Your <span className="text-primary text-glow">Drive</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
              South Africa's premier destination for exclusive, high-performance, and luxury vehicles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/garage" 
                className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all duration-300 box-glow-hover"
              >
                View Inventory
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured New Assets */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-display font-bold text-4xl text-white uppercase tracking-wider mb-2">
              New <span className="text-primary">Assets</span>
            </h2>
            <div className="w-20 h-1 bg-primary box-glow"></div>
          </div>
          <Link href="/garage" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:text-white transition-colors uppercase tracking-wider text-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loadingAvailable ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[450px] bg-secondary animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCars?.slice(0, 6).map((car, i) => (
              <CarCard key={car.id} car={car} index={i} isNew={newCarIds.has(car.id)} />
            ))}
          </div>
        )}
        
        <div className="mt-10 sm:hidden text-center">
          <Link href="/garage" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-white transition-colors uppercase tracking-wider text-sm">
            View All Inventory <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-white uppercase tracking-wider mb-4">
              Client <span className="text-primary">Experiences</span>
            </h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background p-8 rounded-xl border border-border relative"
              >
                <Quote className="absolute top-6 right-6 text-primary/20" size={40} />
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="text-primary fill-primary" size={18} />
                  ))}
                </div>
                <p className="text-white/90 text-lg mb-8 leading-relaxed font-light italic">
                  "{review.text}"
                </p>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="font-bold text-white tracking-wide">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="https://maps.google.com/maps?cid=11486238867110412855" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors"
            >
              Read more on Google <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Recently Sold */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="font-display font-bold text-4xl text-white uppercase tracking-wider mb-2">
            Recently <span className="text-white/50">Sold</span>
          </h2>
          <div className="w-20 h-1 bg-white/20"></div>
        </div>

        {loadingSold ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-[450px] bg-secondary animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity duration-500">
            {soldCars?.slice(0, 6).map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
