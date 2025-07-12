"use client";

import { useState } from "react";
import { Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useTeachers } from "@/lib/contexts/TeacherContext";
import { TeacherForm } from "@/components/features/teacher/TeacherForm";

export default function AddTeacherPage() {
  const router = useRouter();
  const { addTeacher } = useTeachers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (teacher: Teacher) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add teacher to global state
      addTeacher(teacher);
      
      toast.success("Teacher added successfully!", {
        description: `${teacher.name} has been added to the system.`
      });
      
      router.push("/teachers");
    } catch (error) {
      toast.error("Failed to add teacher. Please try again.");
      console.error('Add teacher error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <User className="w-5 h-5 text-primary" />
              <span className="font-medium">Add New Teacher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Add New Teacher</h1>
            <p className="text-muted-foreground">
              Fill in the teacher's information across all sections to create their profile.
            </p>
          </div>
          
          <TeacherForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitButtonText="Add Teacher"
            submitButtonLoadingText="Adding Teacher..."
            onCancel={() => router.push("/teachers")}
            cancelButtonText="Cancel"
          />
        </div>
      </div>
    </div>
  );
} 