"use client";

import { useState, useEffect, useRef } from "react";
import { Teacher, Gender, BankDetails, UpiDetails } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Building2, CreditCard, Shield, Upload, X, Camera } from "lucide-react";

interface TeacherFormProps {
  teacher?: Teacher | null;
  isSubmitting: boolean;
  onSubmit: (teacher: Teacher) => void;
  submitButtonText: string;
  submitButtonLoadingText: string;
  onCancel?: () => void;
  cancelButtonText?: string;
}

export function TeacherForm({
  teacher,
  isSubmitting,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText,
  onCancel,
  cancelButtonText = "Cancel"
}: TeacherFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    subject: "",
    salary: 0,
    avatarUrl: "",
    dob: "",
    gender: "Male" as Gender,
    address: "",
    
    // Professional Information
    joiningDate: "",
    qualification: "",
    experience: 0,
    
    // Bank Details
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfscCode: "",
    bankName: "",
    bankBranch: "",
    
    // UPI Details
    upiId: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
  });

  // Load teacher data for editing
  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        subject: teacher.subject || "",
        salary: teacher.salary || 0,
        avatarUrl: teacher.avatarUrl || "",
        dob: teacher.dob || "",
        gender: teacher.gender || "Male",
        address: teacher.address || "",
        joiningDate: teacher.joiningDate || "",
        qualification: teacher.qualification || "",
        experience: teacher.experience || 0,
        bankAccountName: teacher.bankDetails?.accountName || "",
        bankAccountNumber: teacher.bankDetails?.accountNumber || "",
        bankIfscCode: teacher.bankDetails?.ifscCode || "",
        bankName: teacher.bankDetails?.bankName || "",
        bankBranch: teacher.bankDetails?.branch || "",
        upiId: teacher.upiDetails?.upiId || "",
        emergencyContactName: teacher.emergencyContact?.name || "",
        emergencyContactPhone: teacher.emergencyContact?.phone || "",
        emergencyContactRelationship: teacher.emergencyContact?.relationship || "",
      });
      
      // Set existing image if available
      if (teacher.avatarUrl) {
        setUploadedImage(teacher.avatarUrl);
      }
    }
  }, [teacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "salary" || name === "experience" ? Number(value) : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bankDetails: BankDetails = {
      accountName: formData.bankAccountName,
      accountNumber: formData.bankAccountNumber,
      ifscCode: formData.bankIfscCode,
      bankName: formData.bankName,
      branch: formData.bankBranch,
    };

    const upiDetails: UpiDetails = {
      upiId: formData.upiId,
    };

    const teacherData: Teacher = {
      id: teacher?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      salary: formData.salary,
      avatarUrl: uploadedImage || formData.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
      dob: formData.dob,
      gender: formData.gender,
      address: formData.address,
      joiningDate: formData.joiningDate,
      qualification: formData.qualification,
      experience: formData.experience,
      bankDetails,
      upiDetails,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship,
      },
      paymentStatus: teacher?.paymentStatus || "Pending",
      lastPaymentDate: teacher?.lastPaymentDate || "",
    };

    onSubmit(teacherData);
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "professional", label: "Professional", icon: Shield },
    { id: "banking", label: "Banking", icon: Building2 },
    { id: "emergency", label: "Emergency", icon: CreditCard },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Basic Information Tab */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (₹) *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary amount"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex items-center gap-4">
                {/* Image Preview */}
                <div className="relative">
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCameraCapture}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Address *</Label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Information Tab */}
      {activeTab === "professional" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date *</Label>
              <Input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Experience (Years) *</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Enter years of experience"
                required
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="qualification">Qualification *</Label>
              <textarea
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Enter educational qualifications"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banking Information Tab */}
      {activeTab === "banking" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Bank Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Account Holder Name *</Label>
                <Input
                  id="bankAccountName"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  placeholder="Enter account holder name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankIfscCode">IFSC Code *</Label>
                <Input
                  id="bankIfscCode"
                  name="bankIfscCode"
                  value={formData.bankIfscCode}
                  onChange={handleChange}
                  placeholder="Enter IFSC code"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bankBranch">Branch *</Label>
                <Input
                  id="bankBranch"
                  name="bankBranch"
                  value={formData.bankBranch}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                UPI Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID *</Label>
                <Input
                  id="upiId"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="Enter UPI ID (e.g., name@bank)"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Emergency Contact Tab */}
      {activeTab === "emergency" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Emergency Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Contact Name *</Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Enter emergency contact name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">Contact Phone *</Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="Enter emergency contact phone"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
              <Input
                id="emergencyContactRelationship"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                placeholder="Enter relationship (e.g., Spouse, Father)"
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2.5 h-10"
          >
            {cancelButtonText}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-2.5 h-10 min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitButtonLoadingText}
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
} 