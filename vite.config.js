import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { // 🌟 แก้ตรงนี้เป็นวงเล็บปีกกา { 
    watch: {
      // สั่งให้ Vite ไม่ต้องรีเฟรชหน้าเว็บเวลาไฟล์ db.json เปลี่ยนแปลง
      ignored: ['**/db.json'], 
    },
  }, // 🌟 ปิดด้วยวงเล็บปีกกา }
})