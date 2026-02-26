import React, { memo } from "react";
import { Calendar, Hash, UserCircle, MapPin } from "lucide-react";
import GlobalDropdown from "../../../components/GlobalButton/GlobalDropdown";

const VehicleTaxAdvancedFilters = memo(({ 
  isExpanded, 
  filters, 
  setFilters 
}) => {
  // หากไม่ได้กดเปิด (Expanded) จะไม่ Render ส่วนนี้เลย (สายงกทรัพยากร)
  if (!isExpanded) return null;

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 animate-in slide-in-from-top-2 duration-300">
      
      {/* 1. กรองตามช่วงปี พ.ศ. */}
      <GlobalDropdown
        label="ปีภาษี (พ.ศ.)"
        icon={Calendar}
        options={["2567", "2568", "2569"]}
        value={filters.year}
        onChange={(val) => updateFilter("year", val)}
      />

      {/* 2. กรองตามจังหวัดทะเบียน */}
      <GlobalDropdown
        label="จังหวัด"
        icon={MapPin}
        options={["นนทบุรี", "กรุงเทพฯ", "ปทุมธานี"]}
        value={filters.province}
        onChange={(val) => updateFilter("province", val)}
      />

      {/* 3. กรองตามพนักงานที่ดูแล */}
      <GlobalDropdown
        label="พนักงานผู้รับผิดชอบ"
        icon={UserCircle}
        options={["นายบ่าว", "นางสาวมินต์", "นายเก่ง"]}
        value={filters.agent}
        onChange={(val) => updateFilter("agent", val)}
      />

      {/* 4. กรองตามเลขทะเบียน (แบบเลือกช่วง) */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Hash size={16} />
        </div>
        <input
          type="number"
          placeholder="ค้นหาเฉพาะเลขทะเบียน..."
          value={filters.plateNumber}
          onChange={(e) => updateFilter("plateNumber", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
        />
      </div>

    </div>
  );
});

export default VehicleTaxAdvancedFilters;