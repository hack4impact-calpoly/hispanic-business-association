"use client";

import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import ContactInfoCard from "@/components/ui/ContactInfoCard";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";

export default function Page() {
  return (
    <ResponsiveLayout title="Dashboard">
      <div className="flex flex-col md:flex-row md:justify-center md:items-end min-h-[calc(100vh-200px)] bg-gray-100 gap-6 md:gap-x-28 p-4 md:pb-20">
        <BusinessInfoCard />
        <ContactInfoCard />
      </div>
    </ResponsiveLayout>
  );
}
