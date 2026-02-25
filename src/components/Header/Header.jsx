import { LogInIcon } from "lucide-react";

export default function Header() {
  return (
    <div className="relative h-14 w-full flex items-center px-2 overflow-hidden border-b border-amber-900/50 group">
      {/* 1. รูปพื้นหลังเกม TS Online */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url('https://notebookspec.com/web/wp-content/uploads/2018/10/TS-Online-Mobile-4102018-22-1024x576.jpg')`, // หรือใส่ path รูปในเครื่องคุณ
          filter: "brightness(0.6)", // ปรับให้รูปมืดลงนิดนึง ตัวหนังสือจะได้เด่น
        }}
      />

      {/* 2. เนื้อหา Header */}
      <div className="relative z-10 flex items-center flex-1 overflow-hidden">
        <div className="whitespace-nowrap py-2 w-full">
          <span className="animate-marquee text-xl text-amber-400 tracking-tighter">
            ยินดีต้อนรับสู่ TS-ONLINE —
            เข้าร่วมการผจญภัยในตำนานสามก๊กได้แล้ววันนี้! —
            ระบบสมัครสมาชิกเปิดใช้งานปกติ
          </span>
        </div>
      </div>
    </div>
  );
}
