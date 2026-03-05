import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { Car } from "lucide-react";


export default function CarBill() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoader Icon={Car} text="กำลังโหลดหน้าบิลรถยนต์..." />;
  }

  return (
    <div>
      CarBill
    </div>
  )
}
