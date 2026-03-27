import React, { useEffect } from 'react';
import DashboardLoader from '../../components/Loading/DashboardLoader';
import { FileSpreadsheet, Calendar, Plus, Sheet, X, Inbox } from 'lucide-react';
import GlobalDropdown from '../../components/GlobalButton/GlobalDropdown';

// 🌟 Import Store ที่เราเพิ่งสร้าง (แก้ Path ให้ตรงกับโปรเจกต์คุณด้วยนะครับ)
import { useCoverSheetStore } from '../../store/useCoverSheetStore';

export default function TaxCoverSheet() {
  // 🌟 ดึง State และ Actions ออกมาจาก Zustand
  const { 
    sheetData, 
    isLoading, 
    activeTab, 
    setActiveTab, 
    fetchCoverSheets 
  } = useCoverSheetStore();

  const tabs = ['01-2569', '02-2569', '03-2569', '04-2569', '05-2569', '06-2569', '07-2569', '08-2569', '09-2569', '10-2569', '11-2569', '12-2569'];

  const hasActiveSheet = sheetData.some(sheet => sheet.id === activeTab);

  // 🌟 สั่งให้ดึงข้อมูลจาก API แค่ครั้งเดียวตอนเปิดหน้าเว็บ
  useEffect(() => {
    fetchCoverSheets();
  }, [fetchCoverSheets]);

  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าใบปะหน้า..." Icon={Sheet} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="text-blue-500 mt-1">
            <FileSpreadsheet size={32} strokeWidth={2.2} />
          </div>
          <div>
            <div className='flex flex-wrap gap-4 items-center mb-1.5'>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                ใบปะหน้าปี
              </h1>
              <div className="w-40">
                <GlobalDropdown
                  label="ปีภาษี (พ.ศ.)"
                  icon={Calendar}
                  options={["2567", "2568", "2569"]}
                />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">
              รายงานสรุปยอดชำระภาษีรถยนต์และค่าธรรมเนียมประจำปี 2569
            </p>
          </div>
        </div>

        <button className="flex items-center gap-3 px-6 py-3 bg-gray-950 text-white rounded-3xl shadow-md hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap flex-none">
          <Plus size={18} strokeWidth={3} />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold leading-tight">เพิ่มใบปะหน้า</span>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Add Cover Sheet</span>
          </div>
        </button>
      </div>

      {/* Navbar / Tabs Area */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 pb-3 text-sm transition-all whitespace-nowrap -mb-[2px] ${
              activeTab === tab
                ? 'text-gray-900 font-bold border-b-2 border-gray-900'
                : 'text-gray-400 font-medium border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="p-0.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <X size={14} strokeWidth={2.5} />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 min-h-[120vh] flex flex-col">
        <h2 className="text-sm font-bold text-gray-800 mb-4 px-2 border-b border-gray-100 pb-3">
          ยอดภาษี ท่าอิฐ {activeTab}
        </h2>

        <div className="flex-grow flex flex-col relative">
          {sheetData.map((sheet) => (
            <div
              key={sheet.id}
              className={activeTab === sheet.id ? "flex-grow flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden relative" : "hidden"}
            >
              <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gray-50/50">
                <span className="text-xs font-bold text-gray-400 animate-pulse">กำลังโหลดตาราง...</span>
              </div>
              <iframe
                src={sheet.url}
                frameBorder="0"
                title={sheet.title}
                loading="lazy"
                allowFullScreen
                className="w-full h-full absolute top-0 left-0"
              ></iframe>
            </div>
          ))}

          {!hasActiveSheet && !isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 min-h-[50vh]">
              <Inbox size={40} className="mb-3 opacity-20" />
              <p className="text-sm font-bold tracking-widest uppercase">ไม่มีข้อมูลใบปะหน้าสำหรับเดือน {activeTab}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}