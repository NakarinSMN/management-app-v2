import { Motorbike } from "lucide-react";
import { useEffect, useState } from "react"
import DashboardLoader from "../../components/Loading/DashboardLoader";


export default function MotorcycleBill() {

  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 2500);

  return () => clearTimeout(timer);
}, []);

  if (isLoading) {
    return <DashboardLoader Icon={Motorbike} text="กำลังโหลดหน้าบิลรถจักรยานยนต์..." />;
  }

  return (
    <div>
      MotorcycleBill
    </div>
  )
}
