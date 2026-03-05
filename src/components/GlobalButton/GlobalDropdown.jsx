import React, { useState, useRef, useEffect, memo } from "react";
import { ChevronDown, Search } from "lucide-react"; // 🌟 เพิ่มไอคอน Search

const GlobalDropdown = memo(({ label, options = [], value, onChange, icon: Icon, className = "", isSearchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 🌟 State สำหรับเก็บคำค้นหา
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // ปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm(""); // ล้างคำค้นหาเมื่อปิด
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🌟 Auto-focus ช่องค้นหาเมื่อเปิด Dropdown
  useEffect(() => {
    if (isOpen && isSearchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isSearchable]);

  // 🌟 กรองข้อมูลตามคำค้นหา (ไม่สนพิมพ์เล็ก-ใหญ่)
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-300 ${
          isOpen ? "border-blue-500 ring-4 ring-blue-500/10 shadow-sm" : "border-gray-100 hover:border-gray-300"
        } ${value ? "text-gray-900 font-bold" : "text-gray-400"}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon size={16} className={isOpen ? "text-blue-500" : "text-gray-400"} />}
          <span className="truncate">{value || label}</span>
        </div>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : "text-gray-400"}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          
          {/* 🌟 กล่องพิมพ์ค้นหา (จะโชว์ก็ต่อเมื่อส่ง props isSearchable=true มา) */}
          {isSearchable && (
            <div className="p-2 border-b border-gray-50 bg-gray-50/50">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="พิมพ์เพื่อค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all focus:ring-2 focus:ring-blue-100 shadow-sm"
                  onClick={(e) => e.stopPropagation()} // ป้องกันการกดแล้ว Dropdown ปิด
                />
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            <button onClick={() => { onChange(""); setIsOpen(false); setSearchTerm(""); }} className="w-full text-left px-3 py-2 text-[10px] font-black text-gray-400 hover:bg-gray-50 rounded-lg transition-colors uppercase tracking-widest">
              Reset {label}
            </button>
            <div className="h-px bg-gray-50 my-1" />
            
            {/* 🌟 โชว์รายการที่ผ่านการกรองแล้ว */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); setSearchTerm(""); }} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all mb-0.5 last:mb-0 ${value === opt ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                  {opt}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                ไม่พบยี่ห้อ "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default GlobalDropdown;