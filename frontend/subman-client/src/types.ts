// Raw type returned by the FastAPI (camelCase aliases)
export interface SubscriptionAPI {
  id: number;
  userId: string;
  name: string;
  pricePerCycle: number;
  currency: string;
  payCycle: string;
  renewalDate: string; // ISO string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Display type used within UI components
export interface Subscription {
  id?: number;
  service: string;
  price: string;       // "$XX.XX"
  payCycle: string;    // "Monthly" | "Yearly"
  renewalDate: string; // "DD/MM/YYYY"
  status: string;      // "Active" | "Expired"
}