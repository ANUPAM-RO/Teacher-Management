"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Loader2, 
  CreditCard, 
  Building2, 
  QrCode, 
  Copy, 
  CheckCircle, 
  Banknote, 
  Shield, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Mail,
  ChevronDown,
  ArrowLeft,
  Home
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useTeachers } from "@/lib/contexts/TeacherContext";

const paymentSchema = z.object({
  amount: z.coerce
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .min(1, "Amount must be at least $1")
    .max(1000000, "Amount cannot exceed $1,000,000")
    .refine((val) => val <= 1000000, {
      message: "Amount cannot exceed $1,000,000"
    })
    .refine((val) => val >= 1, {
      message: "Amount must be at least $1"
    }),
  note: z.string()
    .max(200, "Note cannot exceed 200 characters")
    .min(0, "Note cannot be negative")
    .optional()
    .transform((val) => val?.trim() || "")
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;
  const { teachers, updateTeacherPaymentStatus } = useTeachers();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi'>('bank');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<PaymentFormValues | null>(null);



  // Find teacher from context
  const teacher = useMemo(() => {
    return teachers.find(t => t.id === teacherId) || null;
  }, [teacherId, teachers]);

  // Calculate payment status based on teacher's paymentStatus field
  const paymentStatus = useMemo(() => {
    if (!teacher) return null;
    
    const now = new Date();
    const lastPaymentDate = teacher.lastPaymentDate ? new Date(teacher.lastPaymentDate) : null;
    const joiningDate = teacher.joiningDate ? new Date(teacher.joiningDate) : null;
    
    // Use the teacher's paymentStatus field as the primary source
    const teacherPaymentStatus = teacher.paymentStatus;
    
    // Calculate additional info for display
    const daysSinceLastPayment = lastPaymentDate ? 
      Math.floor((now.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24)) : 
      (joiningDate ? Math.floor((now.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24)) : 0);
    
    // Check if already paid this month (for UI logic)
    const isPaidThisMonth = lastPaymentDate && 
      lastPaymentDate.getMonth() === now.getMonth() && 
      lastPaymentDate.getFullYear() === now.getFullYear();
    
    return {
      status: teacherPaymentStatus.toLowerCase() as 'paid' | 'pending' | 'overdue',
      isPaidThisMonth,
      daysSinceLastPayment,
      lastPaymentDate,
      teacherPaymentStatus
    };
  }, [teacher]);

  // Redirect if teacher not found
  useEffect(() => {
    if (!teacher) {
      toast.error("Teacher not found");
      router.push("/teachers");
    }
  }, [teacher, router]);

  // Memoize bank and UPI details to prevent unnecessary re-renders
  const bankDetails = useMemo(() => {
    if (!teacher?.bankDetails) {
      return {
        accountName: teacher?.name || "Not provided",
        accountNumber: "Not provided",
        ifscCode: "Not provided",
        bankName: "Not provided",
        branch: "Not provided"
      };
    }
    return teacher.bankDetails;
  }, [teacher?.bankDetails, teacher?.name]);

  const upiDetails = useMemo(() => {
    if (!teacher?.upiDetails) {
      return {
        upiId: "Not provided",
        qrCode: undefined
      };
    }
    return teacher.upiDetails;
  }, [teacher?.upiDetails]);

  // Check if payment details are available
  const hasBankDetails = useMemo(() => {
    return teacher?.bankDetails && 
           teacher.bankDetails.accountNumber !== "Not provided" &&
           teacher.bankDetails.ifscCode !== "Not provided";
  }, [teacher?.bankDetails]);

  const hasUpiDetails = useMemo(() => {
    return teacher?.upiDetails && 
           teacher.upiDetails.upiId !== "Not provided";
  }, [teacher?.upiDetails]);

  // Auto-select payment method based on available details
  useEffect(() => {
    if (hasBankDetails && !hasUpiDetails) {
      setPaymentMethod('bank');
    } else if (hasUpiDetails && !hasBankDetails) {
      setPaymentMethod('upi');
    } else if (hasBankDetails && hasUpiDetails) {
      setPaymentMethod('bank'); // Default to bank
    }
  }, [hasBankDetails, hasUpiDetails]);

  const copyToClipboard = useCallback(async (text: string, field: string) => {
    if (text === "Not provided") {
      toast.error("No data available to copy");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
      console.error('Copy failed:', err);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      note: ""
    },
    mode: "onChange"
  });

  // Watch form values for real-time validation
  const watchedValues = form.watch();
  const formErrors = form.formState.errors;

  // Reset form when teacher changes
  useEffect(() => {
    if (teacher) {
      form.reset({
        amount: teacher.salary || 0,
        note: ""
      });
      setShowQRCode(false);
      setCopiedField(null);
      setIsMobileMenuOpen(false);
    }
  }, [teacher, form]);

  // Additional validation functions
  const validatePaymentAmount = useCallback((amount: number) => {
    const errors: string[] = [];
    
    if (amount <= 0) {
      errors.push("Payment amount must be greater than $0");
    }
    
    if (teacher?.salary && amount > teacher.salary * 2) {
      errors.push("Payment amount cannot exceed 2x the teacher's salary");
    }
    
    if (amount > 1000000) {
      errors.push("Payment amount cannot exceed $1,000,000");
    }
    
    return errors;
  }, [teacher?.salary]);

  const validatePaymentMethod = useCallback(() => {
    const errors: string[] = [];
    
    if (paymentMethod === 'bank' && !hasBankDetails) {
      errors.push("Bank transfer details are not available for this teacher");
    }
    
    if (paymentMethod === 'upi' && !hasUpiDetails) {
      errors.push("UPI payment details are not available for this teacher");
    }
    
    return errors;
  }, [paymentMethod, hasBankDetails, hasUpiDetails]);

  const validateForm = useCallback(() => {
    const amount = typeof watchedValues.amount === 'number' ? watchedValues.amount : 0;
    const amountErrors = validatePaymentAmount(amount);
    const methodErrors = validatePaymentMethod();
    const allErrors = [...amountErrors, ...methodErrors];
    
    setValidationErrors(allErrors);
    setIsFormValid(allErrors.length === 0 && form.formState.isValid);
    
    return allErrors.length === 0;
  }, [watchedValues.amount, validatePaymentAmount, validatePaymentMethod, form.formState.isValid]);

  // Validate form on changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const onSubmit = useCallback(async (data: PaymentFormValues) => {
    if (!teacher) {
      toast.error("No teacher selected");
      return;
    }

    // Final validation before submission
    if (!validateForm()) {
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    // Show payment confirmation dialog
    setPendingPaymentData(data);
    setShowPaymentConfirmation(true);
  }, [teacher, validateForm]);

  const handlePaymentConfirm = useCallback(async () => {
    if (!teacher || !pendingPaymentData) {
      toast.error("No teacher or payment data available");
      return;
    }

    setIsSubmitting(true);
    setShowPaymentConfirmation(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update teacher payment status
      updateTeacherPaymentStatus(teacher.id, "Paid", new Date().toISOString());
      
      toast.success("Payment Successful!", {
        description: `$${pendingPaymentData.amount.toLocaleString()} has been sent to ${teacher.name}.`
      });
      
      router.push("/teachers");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error('Payment error:', error);
    } finally {
      setIsSubmitting(false);
      setPendingPaymentData(null);
    }
  }, [teacher, pendingPaymentData, router, updateTeacherPaymentStatus]);

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentConfirmation(false);
    setPendingPaymentData(null);
  }, []);

  // Don't render if no teacher
  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading teacher details...</p>
        </div>
      </div>
    );
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
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                <AvatarFallback className="text-xs">
                  {teacher.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{teacher.name}</p>
                <p className="text-xs text-muted-foreground">{teacher.subject}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Panel - Teacher Info & Payment Method */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 border">
                {/* Teacher Info */}
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="relative mb-4">
                    <Avatar className="w-20 h-20 ring-4 ring-primary/20 shadow-xl">
                      <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                      <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                        {teacher.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold mb-2">{teacher.name}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Mail className="w-4 h-4" />
                    {teacher.email}
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Salary: ${teacher.salary?.toLocaleString()}
                  </Badge>
                  
                  {/* Payment Status Badge */}
                  {paymentStatus && (
                    <div className="mb-4">
                      {paymentStatus.status === 'paid' && (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {paymentStatus.teacherPaymentStatus}
                        </Badge>
                      )}
                      {paymentStatus.status === 'overdue' && (
                        <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {paymentStatus.teacherPaymentStatus} ({paymentStatus.daysSinceLastPayment} days)
                        </Badge>
                      )}
                      {paymentStatus.status === 'pending' && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {paymentStatus.teacherPaymentStatus}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Last Payment: {teacher.lastPaymentDate ? new Date(teacher.lastPaymentDate).toLocaleDateString() : 'Never'}
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Payment Method
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => hasBankDetails && setPaymentMethod('bank')}
                      disabled={!hasBankDetails}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === 'bank'
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-muted hover:border-primary/30 bg-background'
                      } ${!hasBankDetails ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'bank' ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                        }`}>
                          {paymentMethod === 'bank' && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          <span className="font-semibold">Bank Transfer</span>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => hasUpiDetails && setPaymentMethod('upi')}
                      disabled={!hasUpiDetails}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                        paymentMethod === 'upi'
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-muted hover:border-primary/30 bg-background'
                      } ${!hasUpiDetails ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'upi' ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                        }`}>
                          {paymentMethod === 'upi' && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="font-semibold">UPI Payment</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Warning if no payment methods available */}
                  {!hasBankDetails && !hasUpiDetails && (
                    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 mt-4">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800 dark:text-orange-200 text-xs">
                        No payment details available. Please add bank or UPI details to the teacher profile.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Payment Status Alerts */}
                  {paymentStatus && (
                    <>
                      {paymentStatus.status === 'paid' && (
                        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 mt-4">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800 dark:text-green-200 text-xs">
                            Payment status: {paymentStatus.teacherPaymentStatus}. Last payment on {paymentStatus.lastPaymentDate?.toLocaleDateString()}.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {paymentStatus.status === 'overdue' && (
                        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mt-4">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800 dark:text-red-200 text-xs">
                            Payment status: {paymentStatus.teacherPaymentStatus}. {paymentStatus.daysSinceLastPayment} days since last payment.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {paymentStatus.status === 'pending' && (
                        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 mt-4">
                          <Calendar className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-xs">
                            Payment status: {paymentStatus.teacherPaymentStatus}. Payment is pending.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Payment Details & Form */}
            <div className="xl:col-span-2">
              <div className="bg-card rounded-2xl border p-6">
                {/* Payment Details Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    {paymentMethod === 'bank' ? (
                      <>
                        <Building2 className="w-5 h-5 text-primary" />
                        Bank Account Details
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 text-primary" />
                        UPI Payment Details
                      </>
                    )}
                  </h2>

                  {paymentMethod === 'bank' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground font-medium">Account Name</p>
                              <p className="font-semibold text-sm truncate">{bankDetails.accountName}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.accountName, 'Account Name')}
                              className="h-8 w-8 p-0 ml-2 flex-shrink-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                              disabled={bankDetails.accountName === "Not provided"}
                            >
                              {copiedField === 'Account Name' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground font-medium">Account Number</p>
                              <p className="font-mono font-semibold text-sm truncate">{bankDetails.accountNumber}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account Number')}
                              className="h-8 w-8 p-0 ml-2 flex-shrink-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                              disabled={bankDetails.accountNumber === "Not provided"}
                            >
                              {copiedField === 'Account Number' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground font-medium">IFSC Code</p>
                              <p className="font-mono font-semibold text-sm truncate">{bankDetails.ifscCode}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(bankDetails.ifscCode, 'IFSC Code')}
                              className="h-8 w-8 p-0 ml-2 flex-shrink-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                              disabled={bankDetails.ifscCode === "Not provided"}
                            >
                              {copiedField === 'IFSC Code' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground font-medium">Bank & Branch</p>
                              <p className="font-semibold text-sm truncate">{bankDetails.bankName}</p>
                              <p className="text-xs text-muted-foreground truncate">{bankDetails.branch}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`${bankDetails.bankName}, ${bankDetails.branch}`, 'Bank Details')}
                              className="h-8 w-8 p-0 ml-2 flex-shrink-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                              disabled={bankDetails.bankName === "Not provided"}
                            >
                              {copiedField === 'Bank Details' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 border">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-muted-foreground font-medium">UPI ID</p>
                              <p className="font-mono font-semibold text-base truncate">{upiDetails.upiId}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(upiDetails.upiId, 'UPI ID')}
                              className="h-8 w-8 p-0 ml-2 flex-shrink-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110 active:scale-95 disabled:hover:scale-100"
                              disabled={upiDetails.upiId === "Not provided"}
                            >
                              {copiedField === 'UPI ID' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setShowQRCode(!showQRCode)}
                          className="w-full h-10 text-sm font-medium transition-all duration-200 hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                        </Button>
                      </div>
                      
                      {showQRCode && (
                        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-lg border">
                          <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center shadow-lg">
                            <QrCode className="w-16 h-16 text-gray-400" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 text-center">
                            Scan QR code to pay via UPI
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Payment Form */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-primary" />
                    Payment Details
                  </h3>
                  
                  {/* Payment Status Messages */}
                  {paymentStatus?.status === 'paid' && (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                        Payment Already Processed
                      </h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        This teacher's payment status is {paymentStatus.teacherPaymentStatus}. Last payment on {paymentStatus.lastPaymentDate?.toLocaleDateString()}.
                      </p>
                    </div>
                  )}
                  
                  {paymentStatus?.status === 'overdue' && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-6">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Payment Overdue
                      </h4>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        This teacher's payment is {paymentStatus.teacherPaymentStatus}. {paymentStatus.daysSinceLastPayment} days since last payment.
                      </p>
                    </div>
                  )}
                  
                  {paymentStatus?.status === 'pending' && (
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center mb-6">
                      <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        Payment Pending
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        This teacher's payment status is {paymentStatus.teacherPaymentStatus}. Ready for payment processing.
                      </p>
                    </div>
                  )}
                  
                  {/* Validation Errors Display */}
                  {validationErrors.length > 0 && (
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 mb-6">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        <div className="space-y-1">
                          <p className="font-medium">Please fix the following errors:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Amount ($)
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="1"
                                    max="1000000"
                                    {...field}
                                    value={field.value?.toString() || ''}
                                    className={`pl-10 text-lg font-semibold ${
                                      formErrors.amount ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                    placeholder="0.00"
                                    disabled={isSubmitting || paymentStatus?.status === 'paid'}
                                    onBlur={() => {
                                      field.onBlur();
                                      validateForm();
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                              {teacher?.salary && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Teacher's salary: ${teacher.salary.toLocaleString()}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="note"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Note (Optional)
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="e.g., May 2024 Salary" 
                                    {...field} 
                                    disabled={isSubmitting || paymentStatus?.status === 'paid'}
                                    maxLength={200}
                                    className={formErrors.note ? 'border-red-500 focus:border-red-500' : ''}
                                  />
                                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                                    {field.value?.length || 0}/200
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
                        <Link href="/teachers">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-2.5 h-10 text-sm font-medium transition-all duration-200 hover:bg-muted/50"
                          >
                            Cancel
                          </Button>
                        </Link>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting || (!hasBankDetails && !hasUpiDetails) || !isFormValid || validationErrors.length > 0 || paymentStatus?.status === 'paid'} 
                          className="w-full sm:w-auto px-6 py-2.5 h-10 text-sm font-medium min-w-[140px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : paymentStatus?.status === 'paid' ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Already Paid
                            </>
                          ) : paymentStatus?.status === 'overdue' ? (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              {paymentMethod === 'upi' ? 'Pay via UPI (Overdue)' : 'Confirm Payment (Overdue)'}
                            </>
                          ) : paymentStatus?.status === 'pending' ? (
                            <>
                              <Banknote className="mr-2 h-4 w-4" />
                              {paymentMethod === 'upi' ? 'Pay via UPI (Pending)' : 'Confirm Payment (Pending)'}
                            </>
                          ) : (
                            <>
                              <Banknote className="mr-2 h-4 w-4" />
                              {paymentMethod === 'upi' ? 'Pay via UPI' : 'Confirm Payment'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentConfirmation} onOpenChange={setShowPaymentConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Confirm Payment
            </DialogTitle>
            <DialogDescription className="text-left">
              Please review the payment details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          {pendingPaymentData && teacher && (
            <div className="space-y-4">
              {/* Teacher Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback className="text-sm font-bold">
                    {teacher.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.subject}</p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Amount</span>
                  </div>
                  <span className="font-bold text-lg text-primary">
                    ${pendingPaymentData.amount.toLocaleString()}
                  </span>
                </div>

                {pendingPaymentData.note && (
                  <div className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">Note</span>
                    </div>
                    <span className="text-sm text-muted-foreground text-right max-w-[200px]">
                      {pendingPaymentData.note}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'bank' ? (
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">Payment Method</span>
                  </div>
                  <span className="text-sm font-medium">
                    {paymentMethod === 'bank' ? 'Bank Transfer' : 'UPI Payment'}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    This action cannot be undone. Please ensure all details are correct before confirming.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handlePaymentCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 