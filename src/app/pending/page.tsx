import type { Metadata } from "next";
import { PendingPage } from "@/components/pages/pending-page";

export const metadata: Metadata = {
  title: "Pending Approval - Pagu",
  description:
    "Your registration request is pending referral approval before full access can continue.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const { status } = await searchParams;

  return <PendingPage status={status} />;
}
