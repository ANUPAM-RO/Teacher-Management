import { Teacher } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MoreHorizontal, DollarSign, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export interface TeacherTableProps {
  teachers: Teacher[];
  onPay: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
  onViewDetails?: (teacher: Teacher) => void;
}

const statusVariantMap: Record<
  Teacher["paymentStatus"],
  "default" | "secondary" | "destructive"
> = {
  Paid: "default",
  Pending: "secondary",
  Overdue: "destructive"
};

export const TeacherTable = ({
  teachers,
  onPay,
  onEdit,
  onDelete,
  onViewDetails
}: TeacherTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow
              key={teacher.id}
              className={onViewDetails ? "cursor-pointer transition" : undefined}
              onClick={onViewDetails ? () => onViewDetails(teacher) : undefined}
              role={onViewDetails ? "button" : undefined}
              tabIndex={onViewDetails ? 0 : undefined}
              onKeyPress={onViewDetails ? (e) => { if (e.key === 'Enter') onViewDetails(teacher); } : undefined}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                    <AvatarFallback>
                      {teacher.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{teacher.subject}</TableCell>
              <TableCell>${teacher.salary.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={statusVariantMap[teacher.paymentStatus]}>
                  {teacher.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
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
                        Edit details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={(e) => { e.stopPropagation(); onDelete(teacher); }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
