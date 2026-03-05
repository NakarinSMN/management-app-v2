import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { CodeXml } from "lucide-react";


export default function DevPage() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าผู้พัฒนา..." Icon={CodeXml} />;
  }


  return (
    <div>
      DevPage
    </div>
  )
}
