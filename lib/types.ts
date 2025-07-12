export type PaymentStatus = "Paid" | "Pending" | "Overdue";
export type Gender = "Male" | "Female" | "Other";

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch: string;
}

export interface UpiDetails {
  upiId: string;
  qrCode?: string;
}

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
  gender?: Gender;
  address?: string;
  bankDetails?: BankDetails;
  upiDetails?: UpiDetails;
  joiningDate?: string;
  qualification?: string;
  experience?: number; // in years
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}
