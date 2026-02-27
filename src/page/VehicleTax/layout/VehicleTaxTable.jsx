import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Tag, ExternalLink, Phone, CalendarCheck, ClipboardCheck, Loader2, Info } from "lucide-react";

// 🌟 เพิ่ม instantUpdate เข้ามาใน Props แล้วครับ!
export default function VehicleTaxTable({ isAuthenticated, refreshTrigger, searchQuery, onEditClick, instantUpdate }) {
  const headers = ["ลำกับ", "ทะเบียนรถ", "ประเภท / ยี่ห้อ", "ชื่อลูกค้า / เบอร์โทร", "วันจดทะเบียน", "วันตรวจ ตรอ.", "สถานะ", "เพิ่มเติม"];

  const [currentItems, setCurrentItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // ฟังก์ชันคำนวณสถานะอัจฉริยะ (Real-time Date Logic)
  const getDynamicStatus = (dateStr) => {
    if (!dateStr || dateStr.trim() === "" || dateStr === "-") {
      return { text: "รอข้อมูลวันที่", dotColor: "bg-gray-300", textColor: "text-gray-400", subTag: "ตรวจสอบ" };
    }

    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      return { text: "รูปแบบวันที่ผิด", dotColor: "bg-red-400", textColor: "text-red-500", subTag: "แก้ไข (วว/ดด/ปปปป)" };
    }

    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parseInt(parts[2], 10);

    if (y > 2500) y -= 543;

    const targetDate = new Date(y, m, d);
    targetDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: "ครบกำหนดวันนี้", dotColor: "bg-red-500 animate-pulse", textColor: "text-red-600", subTag: "ด่วนที่สุด!" };
    } else if (diffDays > 0 && diffDays <= 90) {
      return { text: `ครบกำหนดในอีก ${diffDays} วัน`, dotColor: "bg-orange-400 animate-pulse", textColor: "text-orange-500", subTag: "รอติดต่อลูกค้า" };
    } else if (diffDays > 90) {
      return { text: "ต่อภาษีแล้ว", dotColor: "bg-green-400", textColor: "text-green-500", subTag: "เรียบร้อย" };
    } else {
      return { text: "เกินกำหนด", dotColor: "bg-red-600", textColor: "text-red-600", subTag: `เลยกำหนดมา ${Math.abs(diffDays)} วัน` };
    }
  };

  // 🌟 ดึงข้อมูลจากเซิร์ฟเวอร์
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
        const response = await fetch(`http://localhost:5000/vehicleTax`);
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data)) {
          setCurrentItems(data.data);
          setTotalPages(data.pages || Math.ceil(data.items / itemsPerPage));
        } else {
          setCurrentItems(data);
          const totalCount = response.headers.get('X-Total-Count');
          if (totalCount) setTotalPages(Math.ceil(totalCount / itemsPerPage));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);

    // 🌟 ลบ refreshTrigger ออกจากตรงนี้ เพื่อไม่ให้มันไป fetch API ซ้ำซ้อนตอนที่เราจะทำ Real-time Update
  }, [currentPage, searchQuery]);

  // 🌟 จัดการอัปเดตข้อมูลบนหน้าจอทันที (Optimistic UI)
  useEffect(() => {
    if (!instantUpdate) return;

    if (instantUpdate.action === "ADD") {
      // เอาข้อมูลใหม่ไว้บนสุด แล้วตัดให้เหลือ 10 ตัว
      setCurrentItems(prev => {
        const newData = [instantUpdate.payload, ...prev];
        return newData.slice(0, itemsPerPage);
      });
    }
    else if (instantUpdate.action === "EDIT") {
      // หาตัวที่แก้ แล้วแทนที่ด้วยข้อมูลใหม่
      setCurrentItems(prev => prev.map(item =>
        item.id === instantUpdate.payload.id ? instantUpdate.payload : item
      ));
    }
    else if (instantUpdate.action === "DELETE") {
      // กรองเอาตัวที่ถูกลบออกไป
      setCurrentItems(prev => prev.filter(item => item.id !== instantUpdate.payload));
    }

    // 🌟 ไม่ต้องไปสั่ง fetch API ใหม่อีกรอบ!
  }, [instantUpdate]); // ทำงานเฉพาะตอน instantUpdate เปลี่ยนเท่านั้น

  const goToNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const goToPrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageInput, setPageInput] = useState(currentPage);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName.toLowerCase() === "input") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrevPage(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); goToNextPage(); }
      else if (e.key === "Home") { e.preventDefault(); setCurrentPage(1); }
      else if (e.key === "End") { e.preventDefault(); setCurrentPage(totalPages); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const newPage = parseInt(pageInput, 10);
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    else setPageInput(currentPage);
    setIsEditingPage(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">

      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/30">
              {headers.map((head, i) => (
                <th key={i} className={`px-5 py-3 text-[12px] font-black text-gray-500 uppercase tracking-widest ${i === 0 ? 'text-center' : ''} ${i === 7 ? 'text-right' : ''}`}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {

                // เรียกใช้ฟังก์ชันแปลงสถานะ
                const statusInfo = getDynamicStatus(item.registerDate);

                return (
                  <tr key={item.id} className="border-b h-18 border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-2 text-center text-[14px] text-gray-500">
                      {item.sequenceNumber ? String(item.sequenceNumber).padStart(2, '0') : String(indexOfFirstItem + index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-gray-900 leading-tight font-bold">{item.licensePlate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-blue-500">{item.vehicleType || "-"}</span>
                        <span className="text-[12px] text-gray-500 uppercase tracking-tighter">{item.brand || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="text-gray-700 text-[14px] leading-tight font-bold">{item.customerName}</span>
                        <span className="text-[12px] text-gray-500 flex items-center gap-1 font-medium mt-0.5">
                          <Phone size={10} className="text-[12px] text-gray-400" /> {item.phone || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <CalendarCheck size={12} className="text-gray-300" />
                        <span className="text-[14px] font-medium">{item.registerDate || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <ClipboardCheck size={12} className="text-gray-300" />
                        <span className="text-[14px] font-medium">{item.inspectionDate || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col items-start gap-1">

                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dotColor}`} />
                          <span className={`text-[12px] font-black uppercase tracking-tighter ${statusInfo.textColor}`}>
                            {statusInfo.text}
                          </span>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                          <span className="flex gap-1 items-center px-1.5 py-0.5 rounded bg-gray-100 text-[9px] text-gray-500 font-bold tracking-tight">
                            <Info size={11} />
                            {statusInfo.subTag}
                          </span>
                          {(item.tags && item.tags.length > 0) && (
                            item.tags.map((tag, i) => (
                              <span key={i} className="flex gap-1 items-center px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50 text-[9px] text-blue-500 font-bold tracking-tight uppercase">
                                <Tag size={11} />
                                {tag}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right">
                      {isAuthenticated && (
                        <button
                          onClick={() => onEditClick(item)} // 🌟 ส่งข้อมูล item ทั้งก้อนออกไป
                          className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <ExternalLink size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-gray-400 text-sm font-medium">
                  {!isLoading && "ไม่มีข้อมูล หรือไม่พบคำค้นหา"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-50 select-none">
        <div className="flex flex-col items-start">
          <button onClick={goToPrevPage} disabled={currentPage === 1 || isLoading} className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-colors ${(currentPage === 1 || isLoading) ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-500'}`}>
            <ArrowLeft size={14} strokeWidth={2.5} /> Prev
          </button>
          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-1 hidden sm:block">Key: ← / Home</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Page</span>
          {isEditingPage ? (
            <form onSubmit={handlePageSubmit} className="inline-block">
              <input type="number" autoFocus min={1} max={totalPages} value={pageInput} onChange={(e) => setPageInput(e.target.value)} onBlur={handlePageSubmit} className="w-10 text-center text-[12px] font-black text-blue-600 bg-blue-50 border border-blue-200 rounded-md py-0.5 outline-none no-spinners" />
            </form>
          ) : (
            <button onClick={() => { setPageInput(currentPage); setIsEditingPage(true); }} className="text-[12px] font-black text-gray-900 mx-1 px-2 py-0.5 hover:bg-gray-100 rounded-md transition-colors cursor-text" title="คลิกเพื่อพิมพ์เลขหน้า">
              {currentPage}
            </button>
          )}
          <span className="text-gray-200 font-black">/</span>
          <span className="text-[12px] font-bold text-gray-400 mx-1">{totalPages || 1}</span>
        </div>

        <div className="flex flex-col items-end">
          <button onClick={goToNextPage} disabled={currentPage === totalPages || isLoading} className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-colors ${(currentPage === totalPages || isLoading) ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-blue-500'}`}>
            <ArrowRight size={14} strokeWidth={2.5} /> Next
          </button>
          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-1 hidden sm:block">Key: → / End</span>
        </div>
      </div>
    </div>
  );
}