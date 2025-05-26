import { Card, CardContent } from "@/components/ui/shadcnComponents/card";

export type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="w-full p-4">
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
