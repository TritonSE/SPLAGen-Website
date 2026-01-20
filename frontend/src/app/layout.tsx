import type { Metadata } from "next";

import { RootLayoutComponent } from "@/components/RootLayoutComponent";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPLAGen Membership Portal", // TODO: translate this
  description:
    "SPLAGen's internal membership portal for directory and member management and communication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutComponent>{children}</RootLayoutComponent>;
}
