"use client";

import { useState, useEffect } from "react";
import { Teacher } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onSave: (teacher: Teacher & {
    phone?: string;
    dob?: string;
    gender?: string;
    address?: string;
  }) => void;
}

export function EditTeacherModal({
  isOpen,
  onClose,
  teacher,
  onSave
}: EditTeacherModalProps) {
  const [formData, setFormData] = useState<any>({
    id: "",
    name: "",
    email: "",
    subject: "",
    salary: 0,
    avatarUrl: "",
    paymentStatus: "Pending",
    lastPaymentDate: "",
    phone: "",
    dob: "",
    gender: "",
    address: ""
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (teacher) {
      setFormData({
        ...teacher,
        phone: teacher.phone || "",
        dob: teacher.dob || "",
        gender: teacher.gender || "",
        address: teacher.address || ""
      });
      setAvatarPreview(teacher.avatarUrl || "");
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "salary" ? Number(value) : value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setFormData((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 bg-gradient-to-br from-background to-muted shadow-2xl rounded-2xl">
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="relative flex flex-col items-center w-full">
              {avatarPreview && (
                <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-lg -mt-12 mb-2 bg-background" />
              )}
              <CardTitle className="text-2xl font-bold mt-2">Edit Teacher</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 flex flex-col gap-4">
                <div>
                  <Label htmlFor="avatarUpload" className="mb-1">Profile Picture</Label>
                  <Input
                    id="avatarUpload"
                    name="avatarUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="bg-background/80"
                  />
                </div>
                <div>
                  <Label htmlFor="name" className="mb-1">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-background/80 text-lg mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-background/80 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="mb-1">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background/80 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="salary" className="mb-1">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    className="bg-background/80 mt-1"
                  />
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-4">
                <div>
                  <Label htmlFor="phone" className="mb-1">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-background/80 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dob" className="mb-1">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="bg-background/80 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="mb-1">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-2 bg-background/80 mt-1"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="address" className="mb-1">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="bg-background/80 mt-1"
                  />
                </div>
              </div>
              <div className="col-span-full h-px bg-border my-2" />
              <div className="col-span-full flex justify-end gap-4 mt-2">
                <Button variant="outline" onClick={onClose} type="button" className="px-6 py-2 rounded-lg text-base">
                  Cancel
                </Button>
                <Button type="submit" className="px-6 py-2 rounded-lg text-base font-semibold shadow-md">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
