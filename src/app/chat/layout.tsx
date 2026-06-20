import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-void overflow-hidden">
      <Navbar />
      <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full border-x border-armor-light bg-void overflow-hidden">
        {children}
      </div>
    </div>
  );
}
