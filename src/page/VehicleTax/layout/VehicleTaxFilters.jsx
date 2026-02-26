import React, { useState } from "react";
import { Search, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import GlobalDropdown from "../../../components/GlobalButton/GlobalDropdown";
import VehicleTaxAdvancedFilters from "./VehicleTaxAdvancedFilters"; // Import ตัวที่เราเพิ่งสร้าง

export default function VehicleTaxFilters() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  // รวบ State ของ Filter ไว้ที่เดียวเพื่อให้จัดการง่าย (Clean State)
  const [filters, setFilters] = useState({
    status: "",
    month: "",
    type: "",
    year: "",
    province: "",
    agent: "",
    plateNumber: ""
  });

  return (
    <div className="flex flex-col gap-3">
      {/* --- ตัวกรองหลัก (Main Filters) --- */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><Search size={16} /></div>
          <input type="text" placeholder="ค้นหาข้อมูล..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-transparent rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-all" />
        </div>

        {/* เรียกใช้ GlobalDropdown ปกติ */}
        <GlobalDropdown 
          label="สถานะ" 
          options={["รอต่อภาษี", "เสร็จสิ้น"]} 
          value={filters.status} 
          onChange={(val) => setFilters({...filters, status: val})}
          className="md:w-40" 
        />

        {/* ปุ่มเปิด/ปิด Advanced Filter */}
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
            ${isAdvancedOpen ? "bg-gray-900 text-white" : "bg-white border border-gray-100 text-gray-600 hover:border-gray-300"}
          `}
        >
          <SlidersHorizontal size={16} />
          <span>กรองขั้นสูง</span>
          {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* --- ส่วนกรองขั้นสูง (Advanced Filters Component) --- */}
      <VehicleTaxAdvancedFilters 
        isExpanded={isAdvancedOpen} 
        filters={filters} 
        setFilters={setFilters} 
      />
    </div>
  );
}