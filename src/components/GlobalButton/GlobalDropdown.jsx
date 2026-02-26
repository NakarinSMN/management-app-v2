import React, { useState, useRef, useEffect, memo } from "react";
import { ChevronDown } from "lucide-react";

const GlobalDropdown = memo(({ label, options = [], value, onChange, icon: Icon, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            <button onClick={() => { onChange(""); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-[10px] font-black text-gray-400 hover:bg-gray-50 rounded-lg transition-colors uppercase tracking-widest">
              Reset {label}
            </button>
            <div className="h-px bg-gray-50 my-1" />
            {options.map((opt) => (
              <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all mb-0.5 last:mb-0 ${value === opt ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default GlobalDropdown;