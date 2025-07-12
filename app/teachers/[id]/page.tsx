"use client";

import { useParams } from "next/navigation";
import { Teacher } from "@/lib/types";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft, Copy, Check, CreditCard, Smartphone, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTeachers } from "@/lib/contexts/TeacherContext";
import { TeachingProgressChart } from "@/components/features/teacher/TeachingProgressChart";

export default function TeacherDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { teachers } = useTeachers();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const teacher: Teacher | undefined = useMemo(
    () => teachers.find((t) => t.id === id),
    [id, teachers]
  );

  const availability = [
    { day: "Monday", time: "9:00 AM - 3:00 PM" },
    { day: "Wednesday", time: "9:00 AM - 3:00 PM" },
    { day: "Friday", time: "9:00 AM - 1:00 PM" },
  ];

  // Sample teaching progress data
  const teachingProgressData = {
    totalStudents: 24,
    completedLessons: 18,
    totalLessons: 25,
    averageScore: 87,
    attendanceRate: 0.92,
    monthlyProgress: [
      { month: "Jan", students: 20, lessons: 15, score: 82 },
      { month: "Feb", students: 22, lessons: 18, score: 85 },
      { month: "Mar", students: 24, lessons: 20, score: 87 },
      { month: "Apr", students: 23, lessons: 22, score: 89 },
      { month: "May", students: 25, lessons: 24, score: 91 },
      { month: "Jun", students: 24, lessons: 18, score: 87 },
    ],
  };



  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!teacher) {
    return <div className="p-8 text-center">Teacher not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <button
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        onClick={() => router.push("/teachers")}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Teachers
      </button>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Personal Info */}
        <Card className="w-full lg:w-1/3 p-6 flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <img src={teacher.avatarUrl} alt={teacher.name} />
          </Avatar>
          <h2 className="text-2xl font-bold">{teacher.name}</h2>
          <Badge>{teacher.subject}</Badge>
          <div className="text-muted-foreground">{teacher.email}</div>
          <Button asChild className="mt-4 w-full">
            <Link href={`/teachers/${teacher.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Link>
          </Button>
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2">Personal Info</h3>
            <ul className="space-y-1">
              <li><span className="font-medium">Phone:</span> {teacher.phone || "-"}</li>
              <li><span className="font-medium">DOB:</span> {teacher.dob || "-"}</li>
              <li><span className="font-medium">Gender:</span> {teacher.gender || "-"}</li>
            </ul>
          </div>
          <div className="mt-4 w-full">
            <h3 className="font-semibold mb-2">Address</h3>
            <div>{teacher.address || "-"}</div>
          </div>
        </Card>

        {/* Right: Details Sections */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Bank Details Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Banking Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bank Account Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Bank Account
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bank Name:</span>
                    <span className="text-sm">{teacher.bankDetails?.bankName || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {teacher.bankDetails?.accountNumber || "-"}
                      </span>
                      {teacher.bankDetails?.accountNumber && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(teacher.bankDetails!.accountNumber, 'account')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedField === 'account' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IFSC Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {teacher.bankDetails?.ifscCode || "-"}
                      </span>
                      {teacher.bankDetails?.ifscCode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(teacher.bankDetails!.ifscCode, 'ifsc')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedField === 'ifsc' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Name:</span>
                    <span className="text-sm">{teacher.bankDetails?.accountName || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Branch:</span>
                    <span className="text-sm">{teacher.bankDetails?.branch || "-"}</span>
                  </div>
                </div>
              </div>

              {/* UPI Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  UPI Payment
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">UPI ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {teacher.upiDetails?.upiId || "-"}
                      </span>
                      {teacher.upiDetails?.upiId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(teacher.upiDetails!.upiId, 'upi')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedField === 'upi' ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Card>

          {/* Availability Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Availability</h3>
            <ul className="space-y-1">
              {availability.map((slot) => (
                <li key={slot.day}>
                  <span className="font-medium">{slot.day}:</span> {slot.time}
                </li>
              ))}
            </ul>
          </Card>

          {/* Teaching Progress Section */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Teaching Progress</h3>
            <TeachingProgressChart data={teachingProgressData} />
          </Card>
        </div>
      </div>

    </div>
  );
} 