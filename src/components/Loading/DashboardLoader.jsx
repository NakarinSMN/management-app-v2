import { CodeXml } from 'lucide-react';
import { useState, useEffect } from 'react';

// 1. รับค่า Icon และ text เข้ามา โดยมี CodeXml และข้อความเดิมเป็นค่าเริ่มต้น
const DashboardLoader = ({ 
  Icon = CodeXml, 
  text = "กำลังเตรียมระบบจัดการ..." 
}) => {
  const [progress, setProgress] = useState(0);

  // จำลองเปอร์เซ็นต์วิ่งขึ้นไปถึง 100%
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.random() * 20; 
        return Math.min(oldProgress + diff, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      
      {/* ส่วนไอคอนเด้งโดด */}
      <div className="relative mb-8">
        {/* 2. นำ Icon ที่รับมาแสดงผล (สังเกตว่าต้องเป็นตัวพิมพ์ใหญ่) */}
        <Icon size={40} className="text-blue-500 animate-bounce relative z-10"/>
        
        {/* เงาด้านล่าง */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-gray-300 rounded-[100%] animate-pulse"></div>
      </div>

      {/* ส่วนหลอดโหลด */}
      <div className="w-full max-w-xs px-4">
        <div className="flex justify-between mb-2">
          {/* 3. นำตัวแปร text มาแสดงผลแทนข้อความตายตัว */}
          <span className="text-sm font-semibold text-blue-600">
            {text}
          </span>
          <span className="text-sm font-bold text-blue-600">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* โครงหลอด */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          {/* สีหลอดที่วิ่งตามเปอร์เซ็นต์ */}
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
    </div>
  );
};

export default DashboardLoader;