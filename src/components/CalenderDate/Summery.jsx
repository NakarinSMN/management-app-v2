import React from "react";
// นำเข้า Icon จาก lucide-react เพื่อใช้ตกแต่ง
import { CalendarDays, ArrowRight, Car, Truck, Bike, ShieldCheck } from "lucide-react";

// ข้อมูลตั้งต้น: แนบ Icon ให้ตรงกับประเภทรถ
const vehicleTypes = [
  { name: "รย.1 (รถยนต์นั่ง)", basePrice: 645.41, icon: Car },
  { name: "รย.2 (รถโดยสาร)", basePrice: 1182.55, icon: Car },
  { name: "รย.2 (เชิงพาณิชย์)", basePrice: 2493.30, icon: Truck },
  { name: "รย.3 (กระบะ)", basePrice: 967.48, icon: Truck },
  { name: "รย.3 (น้ำหนักเกิน 3-6 ตัน)", basePrice: 1310.95, icon: Truck },
  { name: "รย.3 (น้ำหนักเกิน 6-12 ตัน)", basePrice: 1408.32, icon: Truck },
  { name: "รย.3 (น้ำหนักเกิน 12 ตัน)", basePrice: 1826.69, icon: Truck },
  { name: "รย.12 (ขนาดไม่เกิน 75 ซีซี)", basePrice: 161.77, icon: Bike },
  { name: "รย.12 (ขนาดเกิน 75-125 ซีซี)", basePrice: 323.34, icon: Bike },
  { name: "รย.12 (ขนาดเกิน 125-150 ซีซี)", basePrice: 430.34, icon: Bike },
  { name: "รย.12 (ขนาดเกิน 150 ซีซี)", basePrice: 645.41, icon: Bike },
];

export default function Summery({ startDate, endDate }) {
  const diffDays = endDate.diff(startDate, "day");
  const validDays = diffDays > 0 ? diffDays : 0;

  const calculatePrice = (basePrice) => {
    const price = (validDays / 365) * basePrice;
    return price.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full">
      
      {/* 1. ส่วนแสดงวันที่ (แบบคลีน ไร้กรอบทึบ) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200 border-dashed">
        
        {/* กลุ่มวันที่พร้อม Icon */}
        <div className="flex items-center gap-3 text-gray-800">
          <CalendarDays className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-800">
            {startDate.format("DD MMM YYYY")}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-300" />
          <span className="font-medium text-gray-800">
            {endDate.format("DD MMM YYYY")}
          </span>
        </div>

        {/* ป้ายกำกับจำนวนวันแบบ Capsule มินิมอล */}
        <div className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">
          {validDays} วัน
        </div>
      </div>

      {/* หัวข้อลิสต์ */}
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-gray-700" />
        <h2 className="text-base font-bold text-gray-800">อัตราเบี้ยประกัน</h2>
      </div>

      {/* 2. ลิสต์รายการรถและราคา */}
      <div className="flex flex-col">
        {vehicleTypes.map((vehicle, index) => {
          // ดึง Icon ของแต่ละคันออกมา
          const VehicleIcon = vehicle.icon;

          return (
            <div 
              key={index} 
              className={`flex items-center justify-between py-3.5 group transition-colors hover:bg-gray-50/50 ${
                index !== vehicleTypes.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* ฝั่งซ้าย: Icon + ชื่อประเภทรถ */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-gray-700 group-hover:bg-gray-100 transition-colors">
                  <VehicleIcon className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {vehicle.name}
                </span>
              </div>

              {/* ฝั่งขวา: ราคา */}
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">
                  {calculatePrice(vehicle.basePrice)}
                </span>
                <span className="text-xs text-gray-400 ml-1">บาท</span>
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  );
}