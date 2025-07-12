import { useState } from "react";
import { Teacher } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical, DollarSign, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export interface TeacherCardProps {
  teacher: Teacher;
  onPay: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
  onViewDetails?: () => void;
}

const statusVariantMap: Record<
  Teacher["paymentStatus"],
  "default" | "secondary" | "destructive"
> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive"
};

export const TeacherCard = ({
  teacher,
  onPay,
  onEdit,
  onDelete,
  onViewDetails
}: TeacherCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(teacher);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onViewDetails}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter' && onViewDetails) onViewDetails(); }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">{teacher.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/teachers/${teacher.id}/payment`} onClick={(e) => e.stopPropagation()}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Make Payment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/teachers/${teacher.id}/edit`} onClick={(e) => e.stopPropagation()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
              <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">{teacher.subject}</p>
              <p className="text-sm text-muted-foreground">{teacher.email}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant={statusVariantMap[teacher.paymentStatus]}>
              {teacher.paymentStatus}
            </Badge>
            <div className="text-right">
              <p className="text-lg font-semibold">
                ${teacher.salary.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Salary</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${teacher.name}?`}
        description="Are you sure you want to delete this teacher? This action cannot be undone."
      />
    </div>
  );
};
