import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Tag,
  ExternalLink,
  Phone,
  CalendarCheck,
  ClipboardCheck,
  Loader2,
  Info,
} from "lucide-react";
import { useVehicleStore } from "../../../store/useVehicleStore"; // 🌟 ตรวจสอบ Path ให้ตรงกับโฟลเดอร์จริงของคุณ

export default function VehicleTaxTable({
  isAuthenticated,
  searchQuery,
  onEditClick,
}) {
  // 🌟 ปรับชื่อหัวข้อให้สื่อความหมายชัดเจนขึ้น
  const headers = [
    "ลำดับ",
    "ทะเบียนรถ",
    "ประเภท / ยี่ห้อ",
    "ชื่อลูกค้า / เบอร์โทร",
    "วันสิ้นอายุภาษี", // เปลี่ยนจากวันจดทะเบียน
    "วันตรวจ ตรอ.",
    "สถานะ",
    "แก้ไข",
  ];

  const { customers, isLoading, totalPages, fetchCustomers } =
    useVehicleStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // 🌟 ฟังก์ชันช่วยจัดรูปแบบวันที่ให้แสดงเป็น DD/MM/YYYY เสมอ
  const formatDisplayDate = (dateStr) => {
    if (!dateStr || dateStr === "-") return "-";
    if (dateStr.includes("-")) {
      const [y, m, d] = dateStr.split("-");
      return `${d}/${m}/${y}`;
    }
    return dateStr;
  };

  const [jumpValue, setJumpValue] = useState("");

  // 🌟 2. ฟังก์ชันช่วยคำนวณลำดับเลขหน้า (1 2 ... 10 11)
  const getVisiblePages = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, "...", total];
    if (current >= total - 2)
      return [1, "...", total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  // 🌟 3. ฟังก์ชันสำหรับจัดการการ Jump หน้า
  const handleJump = (e) => {
    if (e.key === "Enter" || e.type === "blur") {
      const page = parseInt(jumpValue);
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
      setJumpValue(""); // ล้างค่าหลังกด
    }
  };

  const getDynamicStatus = (dateStr) => {
    if (!dateStr || dateStr === "-" || dateStr.trim() === "") {
      return {
        text: "รอข้อมูล",
        dotColor: "bg-gray-300",
        textColor: "text-gray-400",
        subTag: "กรุณาลงวันที่ชำระล่าสุด",
      };
    }

    let expiryDate;
    try {
      let baseDate;
      if (dateStr.includes("-")) {
        const [y, m, d] = dateStr.split("-").map(Number);
        baseDate = new Date(y, m - 1, d);
      } else if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        let d = parseInt(parts[0], 10),
          m = parseInt(parts[1], 10) - 1,
          y = parseInt(parts[2], 10);
        if (y > 2500) y -= 543;
        baseDate = new Date(y, m, d);
      }
      if (isNaN(baseDate.getTime())) throw new Error();

      // บวก 1 ปีเสมอ เพื่อหาความจริง
      expiryDate = new Date(baseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } catch (error) {
      return {
        text: "รูปแบบผิด",
        dotColor: "bg-red-400",
        textColor: "text-red-500",
        subTag: "ตรวจสอบปี",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 90) {
      return {
        text: "ต่อภาษีแล้ว",
        dotColor: "bg-green-400",
        textColor: "text-green-500",
        subTag: `หมดอายุ ${expiryDate.getFullYear() + 543}`,
      };
    } else if (diffDays > 0 && diffDays <= 90) {
      return {
        text: `เหลืออีก ${diffDays} วัน`,
        dotColor: "bg-orange-400 animate-pulse",
        textColor: "text-orange-600",
        subTag: "เริ่มแจ้งเตือน",
      };
    } else if (diffDays === 0) {
      return {
        text: "ครบกำหนดวันนี้",
        dotColor: "bg-red-500 animate-pulse",
        textColor: "text-red-600",
        subTag: "ต้องรีบไปจ่าย!",
      };
    } else {
      return {
        text: "เกินกำหนด",
        dotColor: "bg-red-700",
        textColor: "text-red-700",
        subTag: `เลยมาแล้ว`,
      };
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(currentPage, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, fetchCustomers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      )}

      <div className="max-h-[65vh] overflow-y-auto no-scrollbar border border-gray-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-20">
         
            {/* 2. ล็อกหัวตารางไว้บนสุด */}
            <tr className="bg-gray-50">
          
              {/* 3. ใส่สีพื้นหลังให้แถวหัวตาราง */}
              {headers.map((head, i) => (
                <th
                  key={i}
                  className={`
              px-5 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider
              bg-gray-50/95 backdrop-blur-sm border-b border-gray-100
              ${i === 0 ? "text-center" : ""} 
              ${i === 7 ? "text-right" : ""}
            `}
                  // 4. สำคัญ: ต้องใส่ bg-gray-50 ที่ th ด้วยเพื่อไม่ให้เนื้อหาข้างล่างทะลุมาเห็น
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm ">
            {customers.length > 0 ? (
              customers.map((item, index) => {
                const statusInfo = getDynamicStatus(item.registerDate);
                return (
                  <tr
                    key={item._id}
                    className="border-b h-12   border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-4 py-2 text-center text-[14px] text-gray-500 font-medium">
                      
                      {item.sequenceNumber
                        ? String(item.sequenceNumber).padStart(2, "0")
                        : String(indexOfFirstItem + index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {item.licensePlate}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-blue-600">
                          {item.vehicleType || "-"}
                        </span>
                        <span className="text-[11px] text-gray-400 uppercase">
                          {item.brand || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span
                          className="text-gray-700  max-w-[200px] truncate"
                          title={item.customerName}
                        >
                          {item.customerName}
                        </span>
                        <span
                          className={`text-[12px] flex items-center gap-1 mt-0.5 ${item.phone === "ไม่มีเบอร์ติดต่อ" ? "text-red-400" : "text-gray-500"}`}
                        >
                          <Phone size={10} /> {item.phone || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      <CalendarCheck
                        size={12}
                        className="inline mr-1 text-gray-300"
                      />
                      {formatDisplayDate(item.registerDate)}
                    </td>
                    <td className="px-4 py-2  text-gray-900">
                      <ClipboardCheck
                        size={12}
                        className="inline mr-1 text-gray-300"
                      />
                      {formatDisplayDate(item.inspectionDate)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor}`}
                          />
                          <span
                            className={`text-[11px] font-black uppercase ${statusInfo.textColor}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-500 font-bold flex items-center gap-1">
                            <Info size={10} /> {statusInfo.subTag}
                          </span>
                          {item.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50 text-[9px] text-blue-500 font-bold flex items-center gap-1"
                            >
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {isAuthenticated && (
                        <button
                          onClick={() => onEditClick(item)}
                          className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-10 text-center text-gray-400"
                >
                  ไม่มีข้อมูลที่ค้นหา
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🌟 Advanced Pagination UI */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-5 bg-white border-t border-gray-50 gap-6 select-none">
        {/* ส่วนซ้าย: Jump to Page & Info */}
        <div className="flex items-center gap-4 order-2 lg:order-1">
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <span className="text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">
              Jump to
            </span>
            <input
              type="number"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              onKeyDown={handleJump}
              onBlur={handleJump}
              placeholder={currentPage}
              className="w-12 h-8 bg-white border border-gray-200 rounded-xl text-center text-xs font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
            Page <span className="text-gray-900">{currentPage}</span> of{" "}
            <span className="text-gray-900">{totalPages || 1}</span>
          </p>
        </div>

        {/* ส่วนขวา: Navigation Buttons */}
        <div className="flex items-center gap-2 order-1 lg:order-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1 || isLoading}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:text-gray-200 transition-all hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 disabled:hover:bg-transparent disabled:hover:border-transparent"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5">
            {getVisiblePages(currentPage, totalPages).map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="w-8 h-10 flex items-center justify-center text-gray-300 font-black">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => !isLoading && setCurrentPage(page)}
                    className={`min-w-[40px] h-10 px-2 flex items-center justify-center rounded-2xl text-[13px] font-black transition-all duration-300 border ${
                      currentPage === page
                        ? "bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200 scale-105"
                        : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={
              currentPage >= totalPages || isLoading || totalPages === 0
            }
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 disabled:text-gray-200 transition-all hover:bg-blue-50 rounded-2xl border border-transparent hover:border-blue-100 disabled:hover:bg-transparent disabled:hover:border-transparent"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
