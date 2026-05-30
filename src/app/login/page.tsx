import type { Metadata } from "next";
import { LoginPage } from "@/components/pages/login-page";

export const metadata: Metadata = {
  title: "Login - Pagu",
  description: "Login to your Pagu community account.",
};

export default function Page() {
  return <LoginPage />;
}
