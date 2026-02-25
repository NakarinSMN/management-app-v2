import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ type = "success", message, subMessage, isOpen, onClose }) {
  
  // กำหนดสีและไอคอนตามประเภท
  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="text-emerald-500" size={22} />,
      barColor: "bg-emerald-500",
      lightBg: "bg-emerald-50/20",
      borderColor: "border-emerald-100",
    },
    info: {
      icon: <Info className="text-blue-500" size={22} />,
      barColor: "bg-blue-500",
      lightBg: "bg-blue-50/20",
      borderColor: "border-blue-100",
    },
    warning: {
      icon: <AlertTriangle className="text-amber-500" size={22} />,
      barColor: "bg-amber-500",
      lightBg: "bg-amber-50/20",
      borderColor: "border-amber-100",
    },
    error: {
      icon: <AlertCircle className="text-red-500" size={22} />,
      barColor: "bg-red-500",
      lightBg: "bg-red-50/20",
      borderColor: "border-red-100",
    }
  };

  const config = typeConfig[type] || typeConfig.success;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-5 right-5 z-[1000] animate-in fade-in slide-in-from-right-5 duration-500">
      <div className={`bg-white shadow-xl shadow-slate-200/50 border ${config.borderColor} rounded-2xl p-4 flex items-start gap-3 min-w-[340px] relative overflow-hidden`}>
        
        {/* Icon ตาม Type */}
        <div className="mt-0.5 animate-in zoom-in duration-300">
          {config.icon}
        </div>

        <div className="flex flex-col gap-0.5">
          <h4 className="text-[15px] font-bold text-slate-800 leading-tight">
            {message}
          </h4>
          <p className="text-[13px] text-slate-500 font-medium">
            {subMessage}
          </p>
        </div>

        <button 
          onClick={onClose}
          className="ml-auto p-1 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Loading Bar สีตาม Type */}
        <div className={`absolute bottom-0 left-0 h-1 ${config.lightBg} w-full`}>
          <div className={`h-full ${config.barColor} animate-progress origin-left`} />
        </div>
      </div>
    </div>
  );
}

// การเรียกใช้
// <Toast // ตัวอย่างสถานะ Success (เหมือนรูปที่คุณส่งมา)
{/* 

<Toast 
  isOpen={showToast} 
  onClose={() => setShowToast(false)}
  type="success"
  message="Successfully saved!"
  subMessage="Anyone with a link can now view this file."
/>

// ตัวอย่างสถานะ Warning
<Toast 
  isOpen={showWarning} 
  onClose={() => setShowWarning(false)}
  type="warning"
  message="Permission Denied"
  subMessage="You don't have access to this section."
/>

// ตัวอย่างสถานะ Info
<Toast 
  isOpen={showInfo} 
  onClose={() => setShowInfo(false)}
  type="info"
  message="Update Available"
  subMessage="A new version is ready to install."
/> 

*/}