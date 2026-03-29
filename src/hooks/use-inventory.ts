import { useState, useEffect, useCallback } from "react";
import { type Car } from "../lib/data";

const ADMIN_TOKEN = "autoassets2240";

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Token": ADMIN_TOKEN,
  };
}

async function fetchCars(): Promise<Car[]> {
  const res = await fetch("/api/cars");
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json() as Promise<Car[]>;
}

type Listener = () => void;
export const inventoryListeners: Set<Listener> = new Set();

function notifyAll() {
  inventoryListeners.forEach(fn => fn());
}

export function useInventory() {
  const [cars, setCarsState] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    try {
      const data = await fetchCars();
      setCarsState(data);
    } catch {
      // keep existing state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
    inventoryListeners.add(reload);
    return () => { inventoryListeners.delete(reload); };
  }, [reload]);

  const addCar = useCallback(async (car: Omit<Car, "id">) => {
    const res = await fetch("/api/cars", {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(car),
    });
    if (!res.ok) throw new Error("Failed to add car");
    const created = await res.json() as Car;
    setCarsState(prev => [created, ...prev]);
    notifyAll();
    return created;
  }, []);

  const updateCar = useCallback(async (id: number, updates: Partial<Car>) => {
    const existing = cars.find(c => c.id === id);
    if (!existing) return;
    const res = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify({ ...existing, ...updates }),
    });
    if (!res.ok) throw new Error("Failed to update car");
    const updated = await res.json() as Car;
    setCarsState(prev => prev.map(c => c.id === id ? updated : c));
    notifyAll();
  }, [cars]);

  const deleteCar = useCallback(async (id: number) => {
    const res = await fetch(`/api/cars/${id}`, {
      method: "DELETE",
      headers: adminHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete car");
    setCarsState(prev => prev.filter(c => c.id !== id));
    notifyAll();
  }, []);

  const toggleStatus = useCallback(async (id: number) => {
    const res = await fetch(`/api/cars/${id}/toggle`, {
      method: "PATCH",
      headers: adminHeaders(),
    });
    if (!res.ok) throw new Error("Failed to toggle status");
    const updated = await res.json() as Car;
    setCarsState(prev => prev.map(c => c.id === id ? updated : c));
    notifyAll();
  }, []);

  const moveUp = useCallback(async (id: number) => {
    const idx = cars.findIndex(c => c.id === id);
    if (idx <= 0) return;
    const res = await fetch(`/api/cars/${id}/move`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ direction: "up" }),
    });
    if (!res.ok) return;
    const next = [...cars];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setCarsState(next);
    notifyAll();
  }, [cars]);

  const moveDown = useCallback(async (id: number) => {
    const idx = cars.findIndex(c => c.id === id);
    if (idx < 0 || idx >= cars.length - 1) return;
    const res = await fetch(`/api/cars/${id}/move`, {
      method: "PATCH",
      headers: adminHeaders(),
      body: JSON.stringify({ direction: "down" }),
    });
    if (!res.ok) return;
    const next = [...cars];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setCarsState(next);
    notifyAll();
  }, [cars]);

  return { cars, loading, addCar, updateCar, deleteCar, toggleStatus, moveUp, moveDown };
}

export { fetchCars };
