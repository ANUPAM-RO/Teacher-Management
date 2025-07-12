"use client"; // Required for hooks and event handlers

import { Teacher } from "@/lib/types";
import { TeacherCard } from "@/components/features/teacher/TeacherCard";
import { TeacherTable } from "@/components/features/teacher/TeacherTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { useRouter } from "next/navigation";
import { useTeachers } from "@/lib/contexts/TeacherContext";

export default function TeacherManagementPage() {
  const { teachers, deleteTeacher } = useTeachers();
  const router = useRouter();

  const handleEditTeacher = (teacher: Teacher) => {
    router.push(`/teachers/${teacher.id}/edit`);
  };

  const handleDeleteTeacher = (teacherToDelete: Teacher) => {
    deleteTeacher(teacherToDelete.id);
  };

  const handleViewDetails = (teacher: Teacher) => {
     router.push(`/teachers/${teacher.id}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Teacher Management
          </h1>
          <p className="text-muted-foreground">
            View, manage, and pay your teaching staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push('/teachers/add')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Teacher
          </Button>
          <ModeToggle />
        </div>
      </header>

      <main>
        {/* Responsive Views */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onPay={() => {}} // No longer needed as we use dynamic routes
                onEdit={handleEditTeacher}
                onDelete={handleDeleteTeacher}
                onViewDetails={() => handleViewDetails(teacher)}
              />
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <TeacherTable
            teachers={teachers}
            onPay={() => {}} // No longer needed as we use dynamic routes
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>


    </div>
  );
}
