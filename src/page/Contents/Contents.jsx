import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 1. Lazy Import (ถูกต้องแล้ว)
const HomePage = lazy(() => import("../HomePage"));
const VehicleTax = lazy(() => import("../VehicleTax"));
const NotificationBoard = lazy(() => import("../NotificationBoard"));
const InsuranceWork = lazy(() => import("../InsuranceWork"));
const TaxCoverSheet = lazy(() => import("../TaxCoverSheet"));
const CarBill = lazy(() => import("../CarBill"));
const MotorcycleBill = lazy(() => import("../MotorcycleBill"));
const OrtherBill = lazy(() => import("../OrtherBill"));
const ItemsShop = lazy(() => import("../ItemsShop"));
const DevPage = lazy(() => import("../DevPage"));
const SheetInsurance = lazy(() => import("../SheetInsurance"));

export default function Contents() {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar">
      <div className="transition-all duration-300">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center p-20 text-gray-400 animate-pulse">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm">กำลังดึงข้อมูลหน้าเว็บ...</p>
            </div>
          }
        >
          <Routes>
            {/* 3. จัดการด้วย Routes ล้วนๆ ไปเลย */}
            <Route path="/" element={<HomePage />} />
            <Route path="/vehicle-tax" element={<VehicleTax />} />
            <Route path="/notification-board" element={<NotificationBoard />} />
            <Route path="/insurance-work" element={<InsuranceWork />} />
            <Route path="/tax-cover-sheet" element={<TaxCoverSheet />} />
            <Route path="/insurance" element={<SheetInsurance />} />
            <Route path="/car-bill" element={<CarBill />} />
            <Route path="/motorcycle-bill" element={<MotorcycleBill />} />
            <Route path="/orther-bill" element={<OrtherBill />} />
            <Route path="/items" element={<ItemsShop />} />
            <Route path="/developer-page" element={<DevPage />} />

            {/* ถ้าหา URL ไม่เจอ ให้เด้งไปหน้าแรก */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}