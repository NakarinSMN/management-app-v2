import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useVehicleStore = create((set, get) => ({
  customers: [],    // 🌟 เก็บแค่ 10 ตัวพอ! เครื่องไม่หน่วงแน่นอน
  isLoading: false,
  totalPages: 1,
  currentPage: 1,

  // 1. ดึงข้อมูลจาก Backend ที่ทำการตัดหน้ามาให้แล้ว
  fetchCustomers: async (page = 1, query = '') => {
    set({ isLoading: true, currentPage: page });
    try {
      const qParam = query ? `&q=${encodeURIComponent(query)}` : '';
      const res = await fetch(`${API_URL}/customers?_page=${page}&_limit=10${qParam}`);
      const result = await res.json();
      
      if (result.success) {
        set({ 
          customers: result.data,        // รับมา 10 โชว์ 10
          totalPages: result.totalPages, // รับจำนวนหน้ามาจาก DB
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      set({ isLoading: false });
    }
  },

  // 2. เพิ่มข้อมูล (Optimistic Update)
  addLocal: (newDoc) => set((state) => {
    // เอาข้อมูลใหม่ไว้บนสุด แล้วตัดตัวที่ 11 ทิ้งไป
    return { customers: [newDoc, ...state.customers].slice(0, 10) };
  }),

  // 3. แก้ไขข้อมูล (แทนที่ตัวเดิมใน 10 ตัวที่แสดงอยู่)
  editLocal: (updatedDoc) => set((state) => ({
    customers: state.customers.map(c => c._id === updatedDoc._id ? updatedDoc : c)
  })),

  // 4. ลบข้อมูล (ลบทิ้ง แล้วแอบสั่งให้ไปดึงข้อมูลใหม่มาเติมให้เต็ม 10 บรรทัด)
  deleteLocal: (id) => {
    set((state) => ({
      customers: state.customers.filter(c => c._id !== id)
    }));
    // 🌟 Pro Tip: สั่งให้ดึงข้อมูลหน้าเดิมซ้ำ เพื่อเอาตัวใหม่มาเติมตารางให้เต็ม 10 แถว
    get().fetchCustomers(get().currentPage);
  }
}));