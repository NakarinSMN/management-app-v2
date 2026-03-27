import { create } from 'zustand';

// ดึง API_URL มาไว้ข้างนอกสุด จะได้ไม่ต้องประกาศซ้ำๆ ในทุกฟังก์ชัน (ประหยัดหน่วยความจำ)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const useCoverSheetStore = create((set, get) => ({
  sheetData: [],
  isLoading: false, // 🚀 เปลี่ยนเป็น false ไว้ก่อน จะได้ไม่โชว์วงล้อหมุนถ้ามี Cache
  activeTab: '01-2569',
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  // 🌟 1. ดึงข้อมูล (อัปเกรดระบบ Cache)
  fetchCoverSheets: async (forceRefresh = false) => {
    // 🚀 Extreme Optimize 1: ถ้ามีข้อมูลอยู่แล้ว และไม่ได้โดนบังคับโหลดใหม่ ให้หยุดทำงานทันที! (เซฟเน็ต 100%)
    if (get().sheetData.length > 0 && !forceRefresh) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/coversheets`);
      const result = await response.json();

      if (result.success) {
        const formattedData = result.data.map(item => ({
          id: item.name,
          title: `ยอดภาษี ท่าอิฐ ${item.name}`,
          url: item.url
        }));

        const firstTab = formattedData.length > 0 ? formattedData[0].id : '';
        set({ sheetData: formattedData, isLoading: false, activeTab: firstTab });
      } else {
        set({ error: result.error || 'ดึงข้อมูลไม่สำเร็จ', isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching sheets:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 🌟 2. เพิ่มข้อมูล (อัปเกรดความเร็วแสง)
  addCoverSheet: async (name, url) => {
    try {
      const response = await fetch(`${API_URL}/coversheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url })
      });
      const result = await response.json();

      if (result.success) {
        // 🚀 Extreme Optimize 2: ไม่ต้องดึง API ใหม่! แค่เอาข้อมูลใหม่ไปต่อท้าย State เดิมเลย
        const newSheet = { id: name, title: `ยอดภาษี ท่าอิฐ ${name}`, url: url };
        
        // เอาของเก่ามาต่อกับของใหม่ แล้วเรียงลำดับให้สวยงาม
        const updatedData = [...get().sheetData, newSheet].sort((a, b) => a.id.localeCompare(b.id));

        // อัปเดตหน้าจอทันที + สลับไปเปิดแท็บใหม่ให้เลย
        set({ sheetData: updatedData, activeTab: name }); 
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error adding sheet:", error);
      return { success: false, error: error.message };
    }
  },

  // 🌟 3. ลบข้อมูล (อัปเกรดความเร็วแสง)
  deleteCoverSheet: async (name) => {
    try {
      const response = await fetch(`${API_URL}/coversheets/${name}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        // 🚀 Extreme Optimize 3: ตัดข้อมูลที่โดนลบออกจาก State สดๆ ไม่ต้องโหลดใหม่
        const remainingTabs = get().sheetData.filter(sheet => sheet.id !== name);
        let nextTab = get().activeTab;

        // ถ้าลบแท็บที่กำลังเปิดอยู่ ให้กระโดดไปแท็บแรก
        if (nextTab === name) {
          nextTab = remainingTabs.length > 0 ? remainingTabs[0].id : '';
        }

        // อัปเดตหน้าจอทันที
        set({ sheetData: remainingTabs, activeTab: nextTab });
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Error deleting sheet:", error);
      return { success: false, error: error.message };
    }
  }

}));