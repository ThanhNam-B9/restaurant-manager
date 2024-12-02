import { Suspense } from "react";

export default function LayoutGuest({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
