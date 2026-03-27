import { useEffect, useState, lazy, Suspense } from 'react';
import { FileSpreadsheet, Calendar, Plus, Sheet, X, Inbox } from 'lucide-react';


const DashboardLoader = lazy(() => import('../../components/Loading/DashboardLoader'));
const GlobalDropdown = lazy(() => import('../../components/GlobalButton/GlobalDropdown'));
import { useCoverSheetStore } from '../../store/useCoverSheetStore';
const Toast = lazy(() => import('../../components/Notify/Toast'));
const ConfirmDialog = lazy(() => import('../../components/Notify/ConfirmDialog'));
const AddSheets = lazy(() => import('./Modal/AddSheets'));




export default function TaxCoverSheet({ isAuthenticated }) {

  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "", subMessage: "" });

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isDestructive: false, confirmText: "" });

  const {
    sheetData,
    isLoading,
    activeTab,
    setActiveTab,
    fetchCoverSheets,
    deleteCoverSheet
  } = useCoverSheetStore();

  const handleDeleteTab = (e, tabName) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: "ยืนยันการลบ",
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบใบปะหน้าเดือน "${tabName}" ?\nข้อมูลนี้ไม่สามารถกู้คืนได้`,
      isDestructive: true,
      confirmText: "ลบทิ้ง",
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        const res = await deleteCoverSheet(tabName);
        if (res.success) {
          setToast({
            isOpen: true,
            type: "success",
            message: "ลบข้อมูลสำเร็จ!",
            subMessage: `ใบปะหน้าเดือน ${tabName} ถูกลบเรียบร้อยแล้ว`
          });
        } else {
          setToast({
            isOpen: true,
            type: "error",
            message: "เกิดข้อผิดพลาด",
            subMessage: res.error || "ไม่สามารถลบข้อมูลได้ในขณะนี้"
          });
        }
      }
    });
  };

  const hasActiveSheet = sheetData.some(sheet => sheet.id === activeTab);

  const [isModalOpen, setisModalOpen] = useState(false);

  useEffect(() => {
    fetchCoverSheets();
  }, [fetchCoverSheets]);

  if (isLoading) {
    return <DashboardLoader text="กำลังโหลดหน้าใบปะหน้า..." Icon={Sheet} />;
  }

  return (
    <div className="min-h-screen  p-2 md:p-4 font-sans">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-blue-500 mt-1">
            <FileSpreadsheet size={40} strokeWidth={2.2} />
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

        {isAuthenticated && (
          <button
            onClick={() => setisModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-gray-950 text-white rounded-3xl shadow-md hover:bg-gray-800 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap flex-none"
          >
            <Plus size={18} strokeWidth={3} />
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold leading-tight">เพิ่มใบปะหน้า</span>
              <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Add Cover Sheet</span>
            </div>
          </button>
        )}
      </div>


      <div className="flex items-center gap-6 mb-6 border-b border-gray-200 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden">
        {sheetData.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => setActiveTab(sheet.id)}
            className={`relative flex items-center gap-2 pb-3 text-sm transition-all whitespace-nowrap -mb-[2px] ${activeTab === sheet.id
              ? 'text-gray-900 font-bold border-b-2 border-gray-900'
              : 'text-gray-400 font-medium border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'
              }`}
          >
            {sheet.id}

            {/* 🌟 จุดที่ 2: เช็ค isAuthenticated เพื่อโชว์ปุ่ม "กากบาท (ลบ)" */}
            {isAuthenticated && activeTab === sheet.id && (
              <span
                onClick={(e) => handleDeleteTab(e, sheet.id)}
                className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="ลบใบปะหน้านี้"
              >
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
                className="w-full h-[calc(100%+45px)] -top-[45px] left-0 absolute"
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

      <Suspense fallback={null}>


        <AddSheets
          isOpen={isModalOpen}
          onClose={() => setisModalOpen(false)}
        />
      </Suspense>

      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        type={toast.type}
        message={toast.message}
        subMessage={toast.subMessage}
      />



      {/* 🌟 วาง ConfirmDialog ไว้ตรงกลางจอ (ถ้าคุณมี Component นี้แล้ว) */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          isDestructive={true}
        />
      )}

    </div>
  );
}