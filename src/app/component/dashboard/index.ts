// src/types/index.ts

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  imageUrl: string;
  status: "active" | "in-progress" | "quote-ready" | "incomplete";
  monthlyFee: number | null;
  nextBilling: string | null;
}

export interface ActivityItem {
  id: string;
  type: "payment" | "activation" | "quote" | "plan";
  title: string;
  description: string;
  date: string;
}

export interface Message {
  id: string;
  sender: "admin" | "user";
  content: string;
  time: string;
  planCard?: {
    planName: string;
    price: number;
  };
}

export interface MessageThread {
  id: string;
  title: string;
  preview: string;
  date: string;
}

export interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}
