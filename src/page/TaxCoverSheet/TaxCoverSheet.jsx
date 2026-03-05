import React, { useEffect, useState } from 'react'
import DashboardLoader from '../../components/Loading/DashboardLoader';
import { Sheet } from 'lucide-react';

export default function TaxCoverSheet() {
   const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าใบปะหน้า..." Icon={Sheet} />;
  }
  return (
    <div>
      TaxCoverSheet
    </div>
  )
}
