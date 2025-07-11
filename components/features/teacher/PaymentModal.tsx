import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Teacher } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const paymentSchema = z.object({
  amount: z.coerce
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  note: z.string().optional()
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacher: Teacher | null;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  teacher
}: PaymentModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'upi'>('bank');
  const [upiId, setUpiId] = useState('');

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: teacher?.salary || 0,
      note: ""
    }
  });

  // When the modal opens with a new teacher, reset the form values
  if (teacher && form.getValues().amount !== teacher.salary) {
    form.reset({ amount: teacher.salary, note: "" });
  }

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting payment:", data);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    toast.success("Payment Successful!", {
      description: `$${data.amount} has been sent to ${teacher?.name}.`
    });
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-gradient-to-br from-background to-muted shadow-2xl rounded-2xl">
        <Card className="bg-transparent shadow-none border-none">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="relative flex flex-col items-center w-full">
              {teacher?.avatarUrl && (
                <Avatar className="w-20 h-20 mb-2">
                  <img src={teacher.avatarUrl} alt={teacher.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary shadow-lg bg-background" />
                </Avatar>
              )}
              <CardTitle className="text-xl font-bold mt-2">Payment to {teacher?.name}</CardTitle>
              <div className="text-muted-foreground text-sm">{teacher?.email}</div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="accent-primary"
                  />
                  <span className="font-medium">Bank Transfer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-primary"
                  />
                  <span className="font-medium">UPI</span>
                </label>
              </div>
              {paymentMethod === 'upi' && (
                <div className="flex flex-col gap-2 bg-muted/60 rounded-lg p-4 border">
                  <label htmlFor="upiId" className="font-medium mb-1">UPI ID</label>
                  <input
                    id="upiId"
                    type="text"
                    placeholder="example@upi"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="bg-background/80 border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-16 h-16 bg-border rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                      QR
                    </div>
                    <span className="text-xs text-muted-foreground">Scan to pay via UPI</span>
                  </div>
                </div>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6 mt-4"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1">Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            value={field.value as number | undefined}
                            className="bg-background/80 text-lg mt-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-1">Note (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., May Salary" {...field} className="bg-background/80 mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-end gap-4 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg text-base"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-base font-semibold shadow-md">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      paymentMethod === 'upi' ? 'Pay via UPI' : 'Confirm Payment'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
