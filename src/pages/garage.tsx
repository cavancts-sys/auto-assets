import { useState, useEffect } from "react";
import { Layout } from "../components/layout";
import { CarCard } from "../components/car-card";
import { useCars } from "../hooks/use-cars";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Filter = "all" | "available" | "sold";
const PAGE_SIZE = 12;

export default function Garage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const { data: cars, isLoading } = useCars();

  const newCarIds = new Set((cars || []).slice(0, 6).map(c => c.id));
  const filteredCars = (cars || []).filter(car => filter === "all" || car.status === filter);
  const totalPages = Math.max(1, Math.ceil(filteredCars.length / PAGE_SIZE));
  const pageCars = filteredCars.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 whenever filter changes
  useEffect(() => { setPage(1); }, [filter]);

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
            {(["all", "available", "sold"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-md font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[450px] bg-card animate-pulse rounded-xl border border-border" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {pageCars.length > 0 ? (
                  pageCars.map((car, i) => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18, delay: i * 0.03 }}
                    >
                      <CarCard car={car} index={i} isNew={newCarIds.has(car.id)} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full py-20 text-center"
                  >
                    <p className="text-xl text-muted-foreground">No vehicles found matching your criteria.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold uppercase tracking-wider transition-all hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                          p === page
                            ? "bg-primary text-black shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-card border border-border text-muted-foreground hover:text-white hover:border-white/30"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-semibold uppercase tracking-wider transition-all hover:border-primary/50 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
