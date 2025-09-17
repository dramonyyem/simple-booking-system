export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-purple-50">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm z-0"
        style={{
          backgroundImage:
            'url("https://thumbs.dreamstime.com/b/phnom-penh-cambodia-aug-cambodian-japanese-friendship-bridge-chroy-changvar-south-east-asia-crossing-tonle-sap-river-233622413.jpg")',
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-pink-500/40 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex justify-center items-center h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
