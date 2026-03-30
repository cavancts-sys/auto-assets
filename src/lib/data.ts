export interface Car {
  id: number;
  year: number;
  make: string;
  model: string;
  price: number | null;
  wasPrice?: number | null;
  mileage: string;
  serviceHistory: string;
  colour: string;
  status: "available" | "sold";
  images: string[];
  bodyType: string;
  engine: string;
  transmission: string;
  fuelType: string;
  autoTraderUrl?: string;
  description?: string;
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "POA";
  return `R ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
