import Layout from "@/app/(public)/layout";

function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Layout modal={null}>{children}</Layout>;
}

export default GuestLayout;
