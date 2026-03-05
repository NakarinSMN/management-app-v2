import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { Ellipsis } from "lucide-react";



export default function OrtherBill() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardLoader Icon={Ellipsis} text="กำลังโหลดหน้าบิลอื่นๆ..." />;
  }

  return (
    <div>
      OrtherBill
    </div>
  )
}
