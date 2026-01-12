export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-teal-50 via-white to-pink-50 min-h-screen">
      {children}
    </div>
  );
}
