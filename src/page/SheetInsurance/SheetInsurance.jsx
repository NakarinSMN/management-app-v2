import { useEffect, useState } from "react";
import MainContent from "../../components/CalenderDate/MainContent";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { Calculator } from "lucide-react";

export default function SheetInsurance() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าปรับรอบ..." Icon={Calculator} />;
  }

  return (
    <div>
      <MainContent />
    </div>
  );
}
