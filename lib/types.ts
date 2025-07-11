export type PaymentStatus = "Paid" | "Pending" | "Overdue";

export interface Teacher {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  subject: string;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string; // ISO 8601 date string
  salary: number;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
}
