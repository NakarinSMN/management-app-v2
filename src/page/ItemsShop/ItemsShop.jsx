import { useEffect, useState } from "react";
import DashboardLoader from "../../components/Loading/DashboardLoader";
import { ShoppingBasket } from "lucide-react";


export default function ItemsShop() {

   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าราคาบริการ..." Icon={ShoppingBasket} />;
  }

  return (
    <div>
      ItemsShop
    </div>
  )
}
