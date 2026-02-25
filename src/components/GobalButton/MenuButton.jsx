import { ChevronDown, ChevronRight } from "lucide-react";

export default function MenuButton({
  icon: Icon,
  title,
  subtitle,
  isActive = false,
  onClick,
  isMenuOpen,
}) {
  return (
   <button
  onClick={onClick}
  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
    ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
        : "text-slate-500 hover:bg-white hover:text-blue-600 border border-transparent hover:shadow-sm"
    }`}
>
  <div className="flex items-center">
    {/* Main Menu Icon */}
    {Icon && (
      <Icon
        size={20}
        className={`mr-3 transition-colors duration-300 ${
          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"
        }`}
      />
    )}

    <div className="flex flex-col text-left">
      <span className={`font-semibold text-sm ${isActive ? "text-blue-700" : "text-slate-700"}`}>
        {title}
      </span>
      <span className={`text-[10px] uppercase leading-tight font-medium ${isActive ? "text-blue-400" : "text-slate-400"}`}>
        {subtitle}
      </span>
    </div>
  </div>

  {/* --- Dynamic Icon Container: นุ่มนวลกว่าด้วยการ Rotate & Fade --- */}
  <div className="relative w-5 h-5 flex items-center justify-center">
    {/* Icon Plus: จะหมุน 90 องศาแล้วจางหายเมื่อ Active */}
    <ChevronRight
      size={16}
      className={`absolute transition-all duration-500 ease-in-out transform ${
        isMenuOpen 
          ? "opacity-0 rotate-90 scale-50" 
          : "text-slate-400 opacity-100 rotate-0 scale-100 group-hover:text-blue-500"
      }`}
    />
    
    {/* Icon Minus: จะหมุนจาก -90 องศากลับมาตรงแล้วชัดขึ้นเมื่อ Active */}
    <ChevronDown
      size={16}
      className={`absolute transition-all duration-500 ease-in-out transform ${
        isMenuOpen 
          ? "text-blue-600 opacity-100 rotate-0 scale-100" 
          : "opacity-0 -rotate-90 scale-50"
      }`}
    />
  </div>
</button>
  );
}
