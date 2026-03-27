// src/store/useCoverSheetStore.js
import { create } from 'zustand';

export const useCoverSheetStore = create((set) => ({
  // 1. กำหนด State เริ่มต้น
  sheetData: [],
  isLoading: true,
  activeTab: '01-2569', 
  error: null,

  // 2. Action สำหรับเปลี่ยนแท็บ
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 3. Action สำหรับดึงข้อมูลจาก MongoDB
  fetchCoverSheets: async () => {
    set({ isLoading: true, error: null }); // เริ่มโหลด
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_URL}/coversheets`);
      const result = await response.json();

      if (result.success) {
        // จัดรูปแบบข้อมูลให้ตรงกับที่ UI ต้องการ
        const formattedData = result.data.map(item => ({
          id: item.name,
          title: `ยอดภาษี ท่าอิฐ ${item.name}`,
          url: item.url
        }));
        
        // อัปเดต State เมื่อดึงข้อมูลสำเร็จ
        set({ sheetData: formattedData, isLoading: false });
      } else {
        set({ error: result.error || 'ดึงข้อมูลไม่สำเร็จ', isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching sheets:", error);
      set({ error: error.message, isLoading: false });
    }
  }
}));