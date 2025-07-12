"use client";

import { useState, useEffect } from "react";
import { Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, User, Edit } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useTeachers } from "@/lib/contexts/TeacherContext";
import { TeacherForm } from "@/components/features/teacher/TeacherForm";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const { teachers, updateTeacher } = useTeachers();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const teacherId = params.id as string;
    const foundTeacher = teachers.find(t => t.id === teacherId);
    
    if (foundTeacher) {
      setTeacher(foundTeacher);
    } else {
      toast.error("Teacher not found");
      router.push("/teachers");
    }
    setIsLoading(false);
  }, [params.id, teachers, router]);

  const handleSubmit = async (updatedTeacher: Teacher) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update teacher in global state
      updateTeacher(updatedTeacher);
      
      toast.success("Teacher updated successfully!", {
        description: `${updatedTeacher.name}'s information has been updated.`
      });
      
      router.push("/teachers");
    } catch (error) {
      toast.error("Failed to update teacher. Please try again.");
      console.error('Update teacher error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading teacher information...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/teachers">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Teachers
                </Button>
              </Link>
          
            </div>
            <div className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-primary" />
              <span className="font-medium">Edit Teacher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Teacher</h1>
            <p className="text-muted-foreground">
              Update {teacher.name}'s information across all sections.
            </p>
          </div>
          
          <TeacherForm
            teacher={teacher}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitButtonText="Update Teacher"
            submitButtonLoadingText="Updating Teacher..."
            onCancel={() => router.push("/teachers")}
            cancelButtonText="Cancel"
          />
        </div>
      </div>
    </div>
  );
} 