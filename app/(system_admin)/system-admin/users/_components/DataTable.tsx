// DataTable.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { users, user_role } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { updateUserRole } from "../actions";
import { ChevronDown } from "lucide-react";

interface DataTableProps {
  initialData: {
    users: users[];
    totalCount: number;
    pageSize: number;
    page: number;
  };
  currentFilters: {
    search?: string;
    role?: user_role | "ALL";
    status?: "active" | "inactive" | "all";
    date?: Date;
  };
}

export function DataTable({ initialData, currentFilters }: DataTableProps) {
  const [data, setData] = useState(initialData);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleRoleUpdate = async (userId: number, newRole: user_role) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    // Keep existing filters
    if (currentFilters.search) params.set("search", currentFilters.search);
    if (currentFilters.role && currentFilters.role !== "ALL") {
      params.set("role", currentFilters.role);
    }
    if (currentFilters.status && currentFilters.status !== "all") {
      params.set("status", currentFilters.status);
    }
    if (currentFilters.date) {
      params.set("date", currentFilters.date.toISOString());
    }

    router.push(`?${params.toString()}`);
  };

  const getStatusBadgeColor = (isActive: boolean | null): string => {
    return isActive === true
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getRoleBadgeColor = (role: user_role): string => {
    switch (role) {
      case "SystemAdministrator":
        return "bg-purple-100 text-purple-800";
      case "Monitor":
        return "bg-blue-100 text-blue-800";
      case "Inspector":
        return "bg-yellow-100 text-yellow-800";
      case "RightsHolder":
        return "bg-indigo-100 text-indigo-800";
      case "Skipper":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Never";
    return format(new Date(date), "PPp");
  };

  const availableRoles: user_role[] = [
    "User",
    "SystemAdministrator",
    "SecurityAdministrator",
    "PermitAdministrator",
    "PermitHolder",
    "RightsHolder",
    "Skipper",
    "Inspector",
    "Monitor",
    "Driver",
    "FactoryStockController",
    "LocalOutletController",
    "ExportController",
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Registration Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(user.is_active)}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.last_login)}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Change Role
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[200px] max-h-[300px] overflow-y-auto"
                  >
                    {availableRoles.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => handleRoleUpdate(user.user_id, role)}
                        className="flex items-center justify-between"
                      >
                        {role}
                        {user.role === role && (
                          <Badge className="ml-2 bg-green-100 text-green-800">
                            Current
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4 border-t">
        <div className="text-sm text-gray-500">
          Showing {data.users.length} of {data.totalCount} users
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page <= 1}
            onClick={() => handlePageChange(data.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {data.page} of {Math.ceil(data.totalCount / data.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page * data.pageSize >= data.totalCount}
            onClick={() => handlePageChange(data.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
