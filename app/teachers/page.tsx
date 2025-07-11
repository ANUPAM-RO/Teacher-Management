"use client"; // Required for hooks and event handlers

import { useState } from "react";
import { mockTeachers } from "@/lib/mockData";
import { Teacher } from "@/lib/types";
import { TeacherCard } from "@/components/features/teacher/TeacherCard";
import { TeacherTable } from "@/components/features/teacher/TeacherTable";
import { PaymentModal } from "@/components/features/teacher/PaymentModal";
import { AddTeacherModal } from "@/components/features/teacher/AddTeacherModal";
import { EditTeacherModal } from "@/components/features/teacher/EditTeacherModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { useRouter } from "next/navigation";

export default function TeacherManagementPage() {
  // In a real app, this would come from an API call (e.g., useSWR or React Query)
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const router = useRouter();

  const handleOpenPaymentModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handlePaymentSuccess = () => {
    if (selectedTeacher) {
      // Update the teacher's status in the local state
      setTeachers((prevTeachers) =>
        prevTeachers.map((t) =>
          t.id === selectedTeacher.id
            ? {
                ...t,
                paymentStatus: "Paid",
                lastPaymentDate: new Date().toISOString()
              }
            : t
        )
      );
    }
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    router.push(`/teachers/${teacher.id}`);
  };

  const handleSaveTeacher = (updatedTeacher: Teacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    setIsEditTeacherModalOpen(false);
  };

  const handleDeleteTeacher = (teacherToDelete: Teacher) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((t) => t.id !== teacherToDelete.id)
    );
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
          <Button onClick={() => setIsAddTeacherModalOpen(true)}>
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
                onPay={handleOpenPaymentModal}
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
            onPay={handleOpenPaymentModal}
            onEdit={handleEditTeacher}
            onDelete={handleDeleteTeacher}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handlePaymentSuccess}
        teacher={selectedTeacher}
      />
      <AddTeacherModal
        isOpen={isAddTeacherModalOpen}
        onClose={() => setIsAddTeacherModalOpen(false)}
        onAddTeacher={handleAddTeacher}
      />
      <EditTeacherModal
        isOpen={isEditTeacherModalOpen}
        onClose={() => setIsEditTeacherModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleSaveTeacher}
      />
    </div>
  );
}
