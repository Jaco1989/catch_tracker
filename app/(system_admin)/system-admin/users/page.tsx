// page.tsx
import React from "react";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { getUserTableData } from "./actions";
import { DataTable } from "./_components/DataTable";
import { FilterBar } from "./_components/FilterBar";
import { UserAnalytics } from "./_components/UserAnalytics";
import { user_role } from "@prisma/client";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    role?: string;
    status?: string;
    date?: string;
  };
}

export default async function UserTable({ searchParams }: PageProps) {
  const { user } = await validateRequest();

  if (!user || user.role !== "SystemAdministrator") {
    redirect("/unauthorized");
  }

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const role = (searchParams.role as user_role | "ALL") || "ALL";
  const status =
    (searchParams.status as "active" | "inactive" | "all") || "all";
  const registrationDate = searchParams.date
    ? new Date(searchParams.date)
    : undefined;

  // Create initial filters
  const initialFilters = {
    search,
    role,
    status,
    date: registrationDate,
  };

  // Fetch data with filters
  const initialData = await getUserTableData({
    page,
    pageSize: 10,
    sortBy: "created_at",
    sortOrder: "desc",
    searchTerm: search,
    role: role === "ALL" ? undefined : (role as user_role),
    isActive:
      status === "active" ? true : status === "inactive" ? false : undefined,
    registrationDate,
  });

  if (!initialData.success) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      <UserAnalytics analytics={initialData.data.analytics} />
      <FilterBar initialFilters={initialFilters} />
      <DataTable
        initialData={initialData.data}
        currentFilters={initialFilters}
      />
    </div>
  );
}
