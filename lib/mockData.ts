import { Teacher } from "./types";

export const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "John Doe",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    subject: "Mathematics",
    paymentStatus: "Paid",
    lastPaymentDate: "2024-05-15T10:00:00Z",
    salary: 5000,
    dob: "1985-03-15",
    gender: "Male",
    address: "123 Main Street, Bangalore, Karnataka 560001",
    joiningDate: "2020-06-01",
    qualification: "M.Sc. Mathematics, B.Ed",
    experience: 8,
    bankDetails: {
      accountName: "John Doe",
      accountNumber: "1234567890123456",
      ifscCode: "SBIN0001234",
      bankName: "State Bank of India",
      branch: "Koramangala Branch"
    },
    upiDetails: {
      upiId: "johndoe@sbicard"
    },
    emergencyContact: {
      name: "Sarah Doe",
      phone: "+91 98765 43211",
      relationship: "Spouse"
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    email: "jane.smith@example.com",
    phone: "+91 98765 43212",
    subject: "English Literature",
    paymentStatus: "Pending",
    lastPaymentDate: "2024-04-20T11:30:00Z",
    salary: 5200,
    dob: "1988-07-22",
    gender: "Female",
    address: "456 Park Avenue, Mumbai, Maharashtra 400001",
    joiningDate: "2019-08-15",
    qualification: "M.A. English Literature, B.Ed",
    experience: 6,
    bankDetails: {
      accountName: "Jane Smith",
      accountNumber: "9876543210987654",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Andheri West Branch"
    },
    upiDetails: {
      upiId: "janesmith@hdfcbank"
    },
    emergencyContact: {
      name: "Robert Smith",
      phone: "+91 98765 43213",
      relationship: "Father"
    }
  },
  {
    id: "3",
    name: "Sam Wilson",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    email: "sam.wilson@example.com",
    phone: "+91 98765 43214",
    subject: "History",
    paymentStatus: "Overdue",
    lastPaymentDate: "2024-03-10T09:00:00Z",
    salary: 4800,
    dob: "1982-11-08",
    gender: "Male",
    address: "789 Oak Street, Delhi, Delhi 110001",
    joiningDate: "2018-03-10",
    qualification: "M.A. History, B.Ed",
    experience: 10,
    bankDetails: {
      accountName: "Sam Wilson",
      accountNumber: "1122334455667788",
      ifscCode: "ICIC0001234",
      bankName: "ICICI Bank",
      branch: "Connaught Place Branch"
    },
    upiDetails: {
      upiId: "samwilson@icici"
    },
    emergencyContact: {
      name: "Mary Wilson",
      phone: "+91 98765 43215",
      relationship: "Sister"
    }
  },
  {
    id: "4",
    name: "Alice Johnson",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
    email: "alice.j@example.com",
    phone: "+91 98765 43216",
    subject: "Science",
    paymentStatus: "Paid",
    lastPaymentDate: "2024-05-18T14:00:00Z",
    salary: 5500,
    dob: "1990-04-12",
    gender: "Female",
    address: "321 Pine Road, Chennai, Tamil Nadu 600001",
    joiningDate: "2021-01-20",
    qualification: "M.Sc. Physics, B.Ed",
    experience: 4,
    bankDetails: {
      accountName: "Alice Johnson",
      accountNumber: "9988776655443322",
      ifscCode: "AXIS0001234",
      bankName: "Axis Bank",
      branch: "T Nagar Branch"
    },
    upiDetails: {
      upiId: "alicejohnson@axisbank"
    },
    emergencyContact: {
      name: "David Johnson",
      phone: "+91 98765 43217",
      relationship: "Brother"
    }
  },
  {
    id: "5",
    name: "Michael Brown",
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026708d",
    email: "michael.b@example.com",
    phone: "+91 98765 43218",
    subject: "Physical Education",
    paymentStatus: "Pending",
    lastPaymentDate: "2024-04-25T16:00:00Z",
    salary: 4700,
    dob: "1987-09-30",
    gender: "Male",
    address: "654 Elm Street, Hyderabad, Telangana 500001",
    joiningDate: "2022-07-01",
    qualification: "B.P.Ed, M.P.Ed",
    experience: 3,
    bankDetails: {
      accountName: "Michael Brown",
      accountNumber: "5544332211009988",
      ifscCode: "KOTAK0001234",
      bankName: "Kotak Mahindra Bank",
      branch: "Banjara Hills Branch"
    },
    upiDetails: {
      upiId: "michaelbrown@kotak"
    },
    emergencyContact: {
      name: "Lisa Brown",
      phone: "+91 98765 43219",
      relationship: "Wife"
    }
  }
];
