import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "../components/layout";
import { useCar } from "../hooks/use-cars";
import { formatPrice } from "../lib/data";
import { resolveColour } from "../lib/colour-utils";
import { MarqueeText } from "../components/marquee-text";
import { ArrowLeft, CheckCircle2, Gauge, Calendar, Settings2, ShieldCheck, Droplet, Car as CarIcon, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] lg:h-[500px] bg-secondary rounded-2xl border border-border flex items-center justify-center text-white/20 text-sm">
        No photos available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-secondary border border-border">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`${alt} - photo ${current + 1}`}
            className="w-full aspect-[4/3] lg:h-[500px] object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-mono">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? "border-white opacity-100" : "border-transparent opacity-50 hover:opacity-75"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CarDetail() {
  const { id } = useParams();
  const { data: car, isLoading, error } = useCar(id ? parseInt(id) : 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-36 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
          <div className="h-8 w-32 bg-secondary animate-pulse rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-[500px] bg-secondary animate-pulse rounded-xl" />
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-secondary animate-pulse rounded" />
              <div className="h-8 w-1/3 bg-secondary animate-pulse rounded" />
              <div className="h-[300px] bg-secondary animate-pulse rounded-xl mt-8" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !car) {
    return (
      <Layout>
        <div className="pt-36 pb-24 px-4 max-w-7xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Vehicle Not Found</h2>
          <p className="text-muted-foreground mb-8">The vehicle you are looking for does not exist or has been removed.</p>
          <Link href="/garage" className="px-6 py-3 bg-primary text-black font-bold uppercase tracking-wider rounded-sm">
            Back to Garage
          </Link>
        </div>
      </Layout>
    );
  }

  const isSold = car.status === "sold";

  const specs = [
    { label: "Year",         value: String(car.year),          icon: <Calendar size={20} /> },
    { label: "Mileage",      value: car.mileage,               icon: <Gauge size={20} /> },
    { label: "Transmission", value: car.transmission,          icon: <Settings2 size={20} /> },
    { label: "Engine",       value: car.engine,                icon: <Settings2 size={20} /> },
    { label: "Fuel Type",    value: car.fuelType,              icon: <Droplet size={20} /> },
    { label: "Body Type",    value: car.bodyType,              icon: <CarIcon size={20} /> },
    { label: "Colour",       value: car.colour,                icon: <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: resolveColour(car.colour) }} /> },
    { label: "History",      value: car.serviceHistory,        icon: <ShieldCheck size={20} /> },
  ];

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen">
        {/* Breadcrumb — clear of sticky nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <Link href="/garage" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">
            <ArrowLeft size={16} /> Back to Inventory
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Column: Gallery */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-28"
              >
                <ImageGallery images={car.images} alt={`${car.year} ${car.make} ${car.model}`} />
              </motion.div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm mb-4 ${
                    isSold ? "bg-destructive text-white" : "bg-primary text-black"
                  }`}>
                    {isSold ? "Sold" : "Available"}
                  </span>
                  <h1 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight">
                    <span className="block text-2xl md:text-3xl font-sans font-light text-white/70 mb-1">{car.year} {car.make}</span>
                    <MarqueeText>{car.model}</MarqueeText>
                  </h1>
                </div>

                <div className="mb-10 pb-10 border-b border-border">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Price</p>
                  {car.wasPrice && !isSold && (
                    <p className="text-sm text-muted-foreground line-through mb-1">
                      WAS {formatPrice(car.wasPrice)}
                    </p>
                  )}
                  <p className={`font-display font-bold text-5xl ${isSold ? 'text-muted-foreground line-through' : 'text-primary text-glow'}`}>
                    {formatPrice(car.price)}
                  </p>
                  {car.wasPrice && !isSold && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider rounded">
                      Price Drop
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl uppercase tracking-wider mb-6 text-white flex items-center gap-3">
                  Vehicle Specs <span className="h-px bg-white/10 flex-1"></span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50">
                      <div className="text-primary/70 shrink-0">{spec.icon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                        <MarqueeText className="text-white font-medium text-sm">{spec.value}</MarqueeText>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="bg-card border border-border p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary box-glow" />
                  <h4 className="font-bold text-xl mb-2 text-white">Interested in this asset?</h4>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Contact our sales team to arrange a viewing or secure this vehicle.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/contact"
                      className={`flex-1 flex justify-center items-center gap-2 py-4 font-bold uppercase tracking-wider rounded-sm transition-all duration-300 ${
                        isSold
                          ? "bg-secondary text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-black hover:bg-white box-glow-hover"
                      }`}
                      onClick={(e) => isSold && e.preventDefault()}
                    >
                      {isSold ? "Vehicle Sold" : "Enquire Now"}
                    </Link>

                    {car.autoTraderUrl ? (
                      <a
                        href={car.autoTraderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex justify-center items-center gap-2 py-4 bg-transparent border border-border text-white font-bold uppercase tracking-wider rounded-sm hover:bg-secondary transition-all duration-300"
                      >
                        <ExternalLink size={16} />
                        More Details
                      </a>
                    ) : (
                      <a
                        href="/contact"
                        className="flex-1 flex justify-center items-center gap-2 py-4 bg-transparent border border-border text-white font-bold uppercase tracking-wider rounded-sm hover:bg-secondary transition-all duration-300"
                      >
                        More Details
                      </a>
                    )}
                  </div>

                  {!isSold && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary/80">
                      <CheckCircle2 size={14} /> Finance options available
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
