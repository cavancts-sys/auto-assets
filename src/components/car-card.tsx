import { Link } from "wouter";
import { type Car, formatPrice } from "../lib/data";
import { resolveColour } from "../lib/colour-utils";
import { MarqueeText } from "./marquee-text";
import { motion } from "framer-motion";
import { Gauge, Settings2, Calendar } from "lucide-react";

export function CarCard({ car, index = 0, isNew = false }: { car: Car; index?: number; isNew?: boolean }) {
  const isSold = car.status === "sold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/car/${car.id}`} className="block h-full">
        <div className="h-full bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] relative flex flex-col">
          
          {/* NEW Badge */}
          {isNew && !isSold && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 text-xs font-black uppercase tracking-widest rounded-sm bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                New
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${
              isSold ? "bg-destructive text-white" : "bg-primary text-black"
            }`}>
              {isSold ? "Sold" : "Available"}
            </span>
          </div>

          {/* Image Container */}
          <div className="aspect-[4/3] overflow-hidden relative bg-secondary">
            <img 
              src={car.images[0]} 
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-4 left-4 right-4">
              <span className="block text-sm font-sans font-normal text-white/80 mb-0.5">{car.make}</span>
              <h3 className="font-display font-bold text-2xl text-white leading-tight">
                <MarqueeText>{car.model}</MarqueeText>
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} className="text-primary/70" />
                <span>{car.year}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge size={16} className="text-primary/70" />
                <span>{car.mileage}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Settings2 size={16} className="text-primary/70" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                <div className="w-4 h-4 rounded-full overflow-hidden shrink-0" style={{ background: resolveColour(car.colour), boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }} />
                {car.colour.startsWith("#") ? (
                  <span className="text-sm text-muted-foreground">Custom</span>
                ) : (
                  <MarqueeText className="flex-1 min-w-0 text-sm text-muted-foreground">{car.colour}</MarqueeText>
                )}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Price</p>
                {car.wasPrice && !isSold && (
                  <p className="text-xs text-muted-foreground line-through mb-0.5">
                    WAS {formatPrice(car.wasPrice)}
                  </p>
                )}
                <p className={`font-display font-bold text-xl ${isSold ? 'text-muted-foreground line-through' : 'text-primary text-glow'}`}>
                  {formatPrice(car.price)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
