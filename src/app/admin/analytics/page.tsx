"use client";

import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { useBusinesses } from "@/hooks/swrHooks";
import { StatCard } from "@/components/ui/AnalyticsComponents/StatCard";
import { PieChartWidget } from "@/components/ui/AnalyticsComponents/PieChartWidget";
import { BarChartWidget } from "@/components/ui/AnalyticsComponents/BarChartWidget";
import { LineChartWidget } from "@/components/ui/AnalyticsComponents/LineChartWidget";
import { useTranslations } from "next-intl";

export default function AdminAnalyticsPage() {
  const t = useTranslations();
  const { businesses = [], isLoading } = useBusinesses();

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading businesses...</p>
      </div>
    );
  }

  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  const newBusinesses = businesses.filter((b) => {
    const start = new Date(b.membershipStartDate);
    return start >= oneYearAgo;
  });

  const renewedBusinesses = businesses.filter((b) => {
    if (!b.lastPayDate) return false;
    const start = new Date(b.membershipStartDate);
    const pay = new Date(b.lastPayDate);
    return start < oneYearAgo && pay >= oneYearAgo;
  });

  const ORG_TYPES = ["Nonprofit", "Community", "Business"];
  const BUSINESS_SCALE = ["Corporate", "Small Business"];
  const EMPLOYEE_RANGE = ["1-10", "11-20", "21-50", "51-99", "100+"];
  const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say", "Other"];
  const BUSINESS_TYPES = [
    "Food",
    "Housing",
    "Banking/Finance",
    "Retail shops",
    "Wedding/Events",
    "Automotive",
    "Education",
    "Technology",
    "Marketing",
    "Other",
  ];

  const orgTypeData = ORG_TYPES.map((type) => ({
    name: type,
    value: businesses.filter((b) => b.organizationType === type).length,
  })).filter((d) => d.value > 0);

  const businessScaleData = BUSINESS_SCALE.map((scale) => ({
    name: scale,
    value: businesses.filter((b) => b.businessScale === scale).length,
  })).filter((d) => d.value > 0);

  const employeeRangeData = EMPLOYEE_RANGE.map((range) => ({
    name: range,
    value: businesses.filter((b) => b.numberOfEmployees === range).length,
  })).filter((d) => d.value > 0);

  const genderData = GENDER_OPTIONS.map((gender) => ({
    name: gender,
    value: businesses.filter((b) => b.gender === gender).length,
  })).filter((d) => d.value > 0);

  const businessTypeData = BUSINESS_TYPES.map((type) => ({
    name: type,
    value: businesses.filter((b) => b.businessType === type).length,
  })).filter((d) => d.value > 0);

  const getBusinessGrowthData = () => {
    const dates = businesses.map((b) => new Date(b.membershipStartDate)).filter((d) => !isNaN(d.valueOf()));

    if (dates.length === 0) return [];

    const startYear = Math.min(...dates.map((d) => d.getFullYear()));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    return years.map((year) => ({
      year: year.toString(),
      total: dates.filter((d) => d.getFullYear() <= year).length,
    }));
  };

  const growthData = getBusinessGrowthData();

  return (
    <ResponsiveLayout title={t("analytics")}>
      <div className="p-6 space-y-6">
        <h1 className="text-lg sm:text-xl font-semibold text-center mb-6">{t("analytics")}</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard label={t("businesses")} value={businesses.length} />
          <StatCard label={t("newBusinessesPastYear")} value={newBusinesses.length} />
          <StatCard label={t("renewedBusinessesPastYear")} value={renewedBusinesses.length} />
        </div>

        {/* Trend chart */}
        {growthData.length > 0 && <LineChartWidget title={t("bizGrowthOverTime")} data={growthData} />}

        {/* Pie chart section */}
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-center mb-6">{t("businessComposition")}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PieChartWidget title={t("organizationType")} data={orgTypeData} />
            <PieChartWidget title={t("businessScale")} data={businessScaleData} />
            <PieChartWidget title={t("numberOfEmployees")} data={employeeRangeData} />
            <PieChartWidget title={t("gender")} data={genderData} />
          </div>
        </div>

        <div className="mt-8">
          <BarChartWidget title={t("businessTypeChart")} data={businessTypeData} />
        </div>
      </div>
    </ResponsiveLayout>
  );
}
