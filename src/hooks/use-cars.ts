import { useState, useEffect, useCallback } from "react";
import { type Car } from "../lib/data";
import { fetchCars, inventoryListeners } from "./use-inventory";

function useAllCars(): { cars: Car[]; isLoading: boolean } {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchCars();
      setCars(data);
    } catch {
      // keep state on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    inventoryListeners.add(load);
    return () => { inventoryListeners.delete(load); };
  }, [load]);

  return { cars, isLoading };
}

export function useCars(status?: "available" | "sold") {
  const { cars, isLoading } = useAllCars();
  const filtered = status ? cars.filter(c => c.status === status) : cars;
  return { data: filtered, isLoading };
}

export function useCar(id: number) {
  const { cars, isLoading } = useAllCars();
  const car = id ? (cars.find(c => c.id === id) ?? null) : null;
  const error = !isLoading && id && !car ? new Error("Car not found") : null;
  return { data: car, isLoading, error };
}
