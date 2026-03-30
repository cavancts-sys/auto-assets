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

export const CARS: Car[] = [
  {
    id: 1,
    year: 2012,
    make: "Nissan",
    model: "370Z",
    price: 359900,
    mileage: "89,760 km",
    serviceHistory: "Partial Service History — Recently Serviced",
    colour: "Black Cherry Metallic",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-19%20at%2019.30.50.jpeg"],
    bodyType: "Coupe",
    engine: "3.7L V6",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 2,
    year: 1999,
    make: "Nissan",
    model: "1400",
    price: 129900,
    mileage: "Unknown",
    serviceHistory: "Unknown",
    colour: "Orange",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-17%20at%2016.42.48.jpeg"],
    bodyType: "Bakkie",
    engine: "1.4L",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 3,
    year: 2015,
    make: "Nissan",
    model: "GT-R",
    price: 1599900,
    mileage: "70,000 km",
    serviceHistory: "Full Service History",
    colour: "White/Wrapped",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-02-05%20at%2011.09.07.jpeg"],
    bodyType: "Coupe",
    engine: "3.8L Twin-Turbo V6",
    transmission: "DCT",
    fuelType: "Petrol"
  },
  {
    id: 4,
    year: 2017,
    make: "Volkswagen",
    model: "Touareg V6 TDI Luxury",
    price: 459900,
    mileage: "134,800 km",
    serviceHistory: "Full Service History",
    colour: "Silver",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-19%20at%2015.39.1111.jpeg"],
    bodyType: "SUV",
    engine: "3.0L V6 TDI",
    transmission: "Automatic",
    fuelType: "Diesel"
  },
  {
    id: 5,
    year: 2009,
    make: "Subaru",
    model: "Impreza 2.5 WRX Sedan",
    price: 189900,
    mileage: "141,000 km",
    serviceHistory: "Full Service History",
    colour: "Blue",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-01-14%20at%2010.08.12.jpeg"],
    bodyType: "Sedan",
    engine: "2.5L Turbocharged Flat-4",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 6,
    year: 2004,
    make: "Nissan",
    model: "350Z Coupe Widebody",
    price: 239900,
    mileage: "83,390 km",
    serviceHistory: "Partial Service History",
    colour: "Red",
    status: "available",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202025-11-15%20at%2020.49.53.jpeg"],
    bodyType: "Coupe",
    engine: "3.5L V6",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 7,
    year: 2010,
    make: "Lexus",
    model: "IS F",
    price: null,
    mileage: "153,000 km",
    serviceHistory: "Full Service History",
    colour: "White",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.28.0611.jpeg"],
    bodyType: "Sedan",
    engine: "5.0L V8",
    transmission: "Automatic",
    fuelType: "Petrol"
  },
  {
    id: 8,
    year: 2013,
    make: "MINI",
    model: "Cooper GP2",
    price: null,
    mileage: "54,500 km",
    serviceHistory: "Full Service History",
    colour: "Thunder Grey",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.32.14.jpeg"],
    bodyType: "Hatchback",
    engine: "1.6L Turbocharged",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 9,
    year: 2019,
    make: "BMW",
    model: "M140i",
    price: 1599900,
    mileage: "89,500 km",
    serviceHistory: "Full Service History",
    colour: "White",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.28.06.jpeg"],
    bodyType: "Hatchback",
    engine: "3.0L B58 Turbocharged",
    transmission: "Automatic",
    fuelType: "Petrol"
  },
  {
    id: 10,
    year: 2015,
    make: "MINI",
    model: "Cooper S",
    price: null,
    mileage: "115,600 km",
    serviceHistory: "Full Service History",
    colour: "Grey",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.28.05.jpeg"],
    bodyType: "Hatchback",
    engine: "2.0L Turbocharged",
    transmission: "Manual",
    fuelType: "Petrol"
  },
  {
    id: 11,
    year: 2016,
    make: "BMW",
    model: "220i",
    price: null,
    mileage: "98,000 km",
    serviceHistory: "Full Service History",
    colour: "White",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.28.061.jpeg"],
    bodyType: "Coupe",
    engine: "2.0L Turbocharged",
    transmission: "Automatic",
    fuelType: "Petrol"
  },
  {
    id: 12,
    year: 2012,
    make: "Nissan",
    model: "GT-R",
    price: null,
    mileage: "35,000 km",
    serviceHistory: "Full Service History",
    colour: "Wrapped",
    status: "sold",
    images: ["https://img1.wsimg.com/isteam/ip/7d0d36e1-eeb3-4d02-9dee-8016a7754840/WhatsApp%20Image%202026-03-26%20at%2008.32.141.jpeg"],
    bodyType: "Coupe",
    engine: "3.8L Twin-Turbo V6",
    transmission: "DCT",
    fuelType: "Petrol"
  }
];

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "POA";
  return `R ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
