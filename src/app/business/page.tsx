import ContactInfoCard from "@/components/ui/ContactInfoCard";
import BusinessInfoCard from "@/components/ui/BusinessInfoCard";

export default function Page() {
  return (
    <main className="flex justify-center items-end min-h-screen bg-gray-100 gap-x-28 pb-20">
      <BusinessInfoCard />
      <ContactInfoCard />
    </main>
  );
}
