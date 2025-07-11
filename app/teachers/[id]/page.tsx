"use client";

import { useParams } from "next/navigation";
import { mockTeachers } from "@/lib/mockData";
import { Teacher } from "@/lib/types";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditTeacherModal } from "@/components/features/teacher/EditTeacherModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const teacher: Teacher | undefined = useMemo(
    () => teachers.find((t) => t.id === id),
    [id, teachers]
  );

  // Mock address, personal info, and availability
  const address = "123 Main St, Springfield";
  const personalInfo = {
    phone: "+1 555-123-4567",
    dob: "1985-06-15",
    gender: "Male",
  };
  const availability = [
    { day: "Monday", time: "9:00 AM - 3:00 PM" },
    { day: "Wednesday", time: "9:00 AM - 3:00 PM" },
    { day: "Friday", time: "9:00 AM - 1:00 PM" },
  ];

  const handleSave = (updatedTeacher: Teacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? { ...t, ...updatedTeacher } : t))
    );
    setIsEditModalOpen(false);
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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Personal Info */}
        <Card className="w-full md:w-1/3 p-6 flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <img src={teacher.avatarUrl} alt={teacher.name} />
          </Avatar>
          <h2 className="text-2xl font-bold">{teacher.name}</h2>
          <Badge>{teacher.subject}</Badge>
          <div className="text-muted-foreground">{teacher.email}</div>
          <Button className="mt-4 w-full" onClick={() => setIsEditModalOpen(true)}>
            Edit Details
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
        {/* Right: Availability and Progress (chart placeholder) */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Availability</h3>
            <ul className="space-y-1">
              {availability.map((slot) => (
                <li key={slot.day}>
                  <span className="font-medium">{slot.day}:</span> {slot.time}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Teaching Progress</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {/* Chart will go here */}
              Chart coming soon...
            </div>
          </Card>
        </div>
      </div>
      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={teacher}
        onSave={handleSave}
      />
    </div>
  );
} 