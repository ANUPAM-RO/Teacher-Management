import { Teacher } from "./types";

export const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Doe",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "john.doe@example.com",
    subject: "Mathematics",
    paymentStatus: "Paid",
    lastPaymentDate: "2024-05-15T10:00:00Z",
    salary: 5000
  },
  {
    id: "2",
    name: "Jane Smith",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    email: "jane.smith@example.com",
    subject: "English Literature",
    paymentStatus: "Pending",
    lastPaymentDate: "2024-04-20T11:30:00Z",
    salary: 5200
  },
  {
    id: "3",
    name: "Sam Wilson",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    email: "sam.wilson@example.com",
    subject: "History",
    paymentStatus: "Overdue",
    lastPaymentDate: "2024-03-10T09:00:00Z",
    salary: 4800
  },
  {
    id: "4",
    name: "Alice Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
    email: "alice.j@example.com",
    subject: "Science",
    paymentStatus: "Paid",
    lastPaymentDate: "2024-05-18T14:00:00Z",
    salary: 5500
  },
  {
    id: "5",
    name: "Michael Brown",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    email: "michael.b@example.com",
    subject: "Physical Education",
    paymentStatus: "Pending",
    lastPaymentDate: "2024-04-25T16:00:00Z",
    salary: 4700
  }
];
