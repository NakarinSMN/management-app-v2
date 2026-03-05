import React from "react";
import { CarFront, Clock, CheckCircle2 } from "lucide-react";

export default function VehicleTaxHeader() {

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
      <div>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">ต่อภาษีประจำปี (Beta)</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">จัดการข้อมูลและติดตามสถานะการต่อภาษีของลูกค้า</p>
      </div>
    </div>
  );
}