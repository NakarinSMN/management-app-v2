import { create } from 'zustand';


export const useNotificationStore = create((set) => ({
    notifications: [],
    isLoading: false,
    error: null,

    fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
            // เปลี่ยน URL มาชี้ที่ Backend จำลองของเรา
            const response = await fetch('http://localhost:3000/notifications');

            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลได้');

            // json-server จะส่ง array ของ notifications กลับมาตรงๆ เลย
            const result = await response.json();

            set({ notifications: result, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },
}));