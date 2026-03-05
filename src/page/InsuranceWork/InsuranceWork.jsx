import { useEffect, useState } from 'react'
import DashboardLoader from '../../components/Loading/DashboardLoader';
import {  BriefcaseBusiness } from 'lucide-react';

export default function InsuranceWork() {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าประกันภัย..." Icon={BriefcaseBusiness} />;
  }
  return (
    <div>
      InsuranceWork
    </div>
  )
}
