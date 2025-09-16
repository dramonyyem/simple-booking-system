export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center bg-purple-600 text-black h-screen">
      {children}
    </div>
  );
}
