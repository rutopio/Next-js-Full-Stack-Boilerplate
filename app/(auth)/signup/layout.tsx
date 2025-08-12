import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return children;
}
