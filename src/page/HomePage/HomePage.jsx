import { useState, useEffect } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { Home } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าหลัก..." Icon={Home} />;
  }
  return <div className="p-8 text-center">HomePage</div>;
}
