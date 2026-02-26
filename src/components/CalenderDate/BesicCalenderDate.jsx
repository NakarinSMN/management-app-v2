import { useState, useEffect, lazy, Suspense } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { RotateCcw, CalendarDays, Calculator, ChevronRight } from "lucide-react";

// Lazy loading ตัวลูก
const Historyfeed = lazy(() => import('./Historyfeed'));
const Summery = lazy(() => import('./Summery'));

dayjs.locale("th");

export default function CalenderDate() {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, "year"));
  const [duration, setDuration] = useState(endDate.diff(dayjs(), "day"));
  const [confirmedDates, setConfirmedDates] = useState(null);

  // State สำหรับเก็บประวัติ
  const [historyList, setHistoryList] = useState(() => {
    const savedData = localStorage.getItem("app_history");
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem("app_history", JSON.stringify(historyList));
  }, [historyList]);

  const getThaiYear = (date) => date.year() + 543;

  const handleStartDateChange = (newStart) => {
    setStartDate(newStart);
    setEndDate(newStart.add(duration, "day"));
  };

  const handleEndDateChange = (newEnd) => {
    setEndDate(newEnd);
    setDuration(newEnd.diff(startDate, "day"));
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setDuration(value);
    setEndDate(startDate.add(value, "day"));
  };

  const handleReset = () => {
    const initialStart = dayjs();
    const initialEnd = dayjs().add(1, "year");
    setStartDate(initialStart);
    setEndDate(initialEnd);
    setDuration(initialEnd.diff(initialStart, "day"));
    setConfirmedDates(null);
  };

  const handleCalculate = () => {
    setConfirmedDates({ start: startDate, end: endDate });
    const newEntry = {
      id: Date.now(),
      type: "advanced",
      title: "คำนวณเบี้ย พ.ร.บ.",
      subject: `${startDate.format("DD/MM/YY")} - ${endDate.format("DD/MM/YY")} (${duration} วัน)`,
      date: dayjs().format("D MMM"),
    };
    setHistoryList([newEntry, ...historyList].slice(0, 7));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* ฝั่งซ้าย: ปฏิทิน */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">

          <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100 border-dashed">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <CalendarDays size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">กำหนดระยะเวลา</h2>
            </div>
            <button onClick={handleReset} className="group flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-all">
              <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
              รีเซ็ตค่า
            </button>
          </div>

          <div className="mb-10 flex justify-center">
            <div className="flex items-center gap-3 group">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Duration</span>
              <input
                type="number"
                value={duration}
                onChange={handleDurationChange}
                className="w-20 bg-transparent text-center text-2xl font-black text-gray-900 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Days</span>
            </div>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
            <div className="flex flex-wrap justify-around gap-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-blue-50/50 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-bold text-blue-700">เริ่มคุ้มครอง ({getThaiYear(startDate)})</span>
                </div>
                <DateCalendar value={startDate} onChange={handleStartDateChange} views={['year', 'month', 'day']} />
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 px-4 py-1 bg-green-50/50 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-xs font-bold text-green-700">สิ้นสุดคุ้มครอง ({getThaiYear(endDate)})</span>
                </div>
                <DateCalendar value={endDate} onChange={handleEndDateChange} views={['year', 'month', 'day']} minDate={startDate} />
              </div>
            </div>
          </LocalizationProvider>

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleCalculate}
              className="group flex items-center gap-3 px-10 py-3 border border-gray-200 bg-white text-gray-700 rounded-2xl font-bold text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 active:scale-95 transition-all duration-300"
            >
              <Calculator size={18} className="text-gray-400 group-hover:text-blue-500" />
              คำนวณเบี้ยประกัน
              <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ส่วนแสดงผล Summery */}
        <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-gray-100 min-h-[200px]">
          {confirmedDates ? (
            <Suspense fallback={<p className="loading-screen animate-pulse text-blue-400 text-center py-10">กำลังสร้างสรุปข้อมูล...</p>}>
              <Summery startDate={confirmedDates.start} endDate={confirmedDates.end} />
            </Suspense>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-gray-300 gap-3">
              <div className="p-4 bg-gray-50 rounded-full">
                <Calculator size={32} strokeWidth={1} />
              </div>
              <p className="text-sm font-medium italic">รอการคำนวณ...</p>
            </div>
          )}
        </div>
      </div>

      {/* ฝั่งขวา: History Feed */}
      <div className="lg:col-span-4 h-fit sticky top-10">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <Suspense fallback={<p className="loading-screen text-center animate-pulse">Loading History...</p>}>
            {/* ส่ง historyList ไปให้ลูก */}
            <Historyfeed historyList={historyList} setHistoryList={setHistoryList} />
          </Suspense>
        </div>
      </div>

    </div>
  );
}