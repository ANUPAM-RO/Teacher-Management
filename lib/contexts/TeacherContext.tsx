"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Teacher } from '@/lib/types';
import { mockTeachers } from '@/lib/mockData';

interface TeacherContextType {
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacherPaymentStatus: (teacherId: string, status: Teacher['paymentStatus'], lastPaymentDate?: string) => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);

  const addTeacher = (teacher: Teacher) => {
    setTeachers(prev => [...prev, teacher]);
  };

  const updateTeacher = (teacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === teacher.id ? teacher : t));
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const updateTeacherPaymentStatus = (teacherId: string, status: Teacher['paymentStatus'], lastPaymentDate?: string) => {
    setTeachers(prev => prev.map(t => 
      t.id === teacherId 
        ? { 
            ...t, 
            paymentStatus: status, 
            lastPaymentDate: lastPaymentDate || t.lastPaymentDate 
          }
        : t
    ));
  };

  return (
    <TeacherContext.Provider value={{
      teachers,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      updateTeacherPaymentStatus,
    }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeachers() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeachers must be used within a TeacherProvider');
  }
  return context;
} 