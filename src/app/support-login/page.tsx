import type { Metadata } from "next";
import { SupportLoginPage } from "@/components/pages/support-login-page";

export const metadata: Metadata = {
  title: "Report a problem - Pagu",
  description: "Tell us what happened so we can help you access your Pagu account.",
};

export default function Page() {
  return <SupportLoginPage />;
}
