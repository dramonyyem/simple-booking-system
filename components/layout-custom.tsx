import Menu from "./menu"

export default function CustomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <div className="flex bg-purple-400">
                <div
                    className="absolute inset-0 bg-purple-500/10 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("https://thumbs.dreamstime.com/b/phnom-penh-cambodia-aug-cambodian-japanese-friendship-bridge-chroy-changvar-south-east-asia-crossing-tonle-sap-river-233622413.jpg")`,
                    }}
                >                
                <div className="w-full">
                    <Menu />
                </div>
                {children}
            </div>
        </div>
    )
}