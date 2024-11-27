// FilterBar.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { user_role } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";

interface FilterBarProps {
  initialFilters: {
    search?: string;
    role?: user_role | "ALL";
    status?: "active" | "inactive" | "all";
    date?: Date;
  };
}

export function FilterBar({ initialFilters }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialFilters.date,
  );

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "all" ||
        value === "ALL"
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateSearchParams({ search: value });
  };

  const handleRoleChange = (value: user_role | "ALL") => {
    updateSearchParams({ role: value === "ALL" ? undefined : value });
  };

  const handleStatusChange = (value: "active" | "inactive" | "all") => {
    updateSearchParams({ status: value === "all" ? undefined : value });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    updateSearchParams({
      date: date ? date.toISOString() : undefined,
    });
  };

  const resetFilters = () => {
    setSelectedDate(undefined);
    router.push("");
  };

  return (
    <div className="bg-background border rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            defaultValue={initialFilters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm bg-background"
          />
        </div>

        <Select
          defaultValue={initialFilters.role || "ALL"}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="SystemAdministrator">
              System Administrator
            </SelectItem>
            <SelectItem value="Monitor">Monitor</SelectItem>
            <SelectItem value="Inspector">Inspector</SelectItem>
          </SelectContent>
        </Select>

        <Select
          defaultValue={initialFilters.status || "all"}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] bg-background">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Registration Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex items-center bg-background"
        >
          <XIcon className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
