import type { Metadata } from "next";
import { RegisterPage } from "@/components/pages/register-page";

export const metadata: Metadata = {
  title: "Register - Pagu",
  description: "Join the Pagu community. Curated, safe spaces for FLINTA* people.",
};

export default function Page() {
  return <RegisterPage />;
}
