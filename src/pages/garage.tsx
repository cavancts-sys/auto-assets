import { useState } from "react";
import { Layout } from "../components/layout";
import { CarCard } from "../components/car-card";
import { useCars } from "../hooks/use-cars";
import { motion } from "framer-motion";

export default function Garage() {
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  
  const { data: cars, isLoading } = useCars();
  const filteredCars = cars?.filter(car => filter === "all" || car.status === filter) || [];
  const newCarIds = new Set((cars || []).slice(0, 6).map(c => c.id));

  return (
    <Layout>
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <div className="mb-12 md:flex md:items-end justify-between">
          <div>
            <h1 className="font-display font-black text-5xl text-white uppercase tracking-wider mb-4">
              Our <span className="text-primary">Garage</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg font-light">
              Explore our curated selection of premium vehicles. Every asset is thoroughly inspected to ensure the highest quality.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 flex p-1 bg-card border border-border rounded-lg">
            {(["all", "available", "sold"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-md font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                  filter === f 
                    ? "bg-primary text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[450px] bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCars.length > 0 ? (
              filteredCars.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} isNew={newCarIds.has(car.id)} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground">No vehicles found matching your criteria.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
