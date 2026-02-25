
import HomePage from "../Pages/HomePage";
import VehicleTax from "../Pages/VehicleTax";
import NotificationBoard from "../Pages/NotificationBoard";
import InsuranceWork from "../Pages/InsuranceWork";
import TaxCoverSheet from "../Pages/TaxCoverSheet";
import Insurance from "../Pages/insurance";
import CarBill from "../Pages/CarBill";
import MotorcycleBill from "../Pages/MotorcycleBill";
import OrtherBill from "../Pages/OrtherBill";
import ItemsShop from "../Pages/ItemsShop";
import DevPage from "../Pages/DevPage";

// 1. Import คอมโพเนนต์จากไฟล์ภายนอกเข้ามา

export default function Contents({ activeTab }) {

  const pages = {
    "home": <HomePage />,
    "vehicle-tax": <VehicleTax />,
    "notification-board": <NotificationBoard />,
    "insurance-work": <InsuranceWork />,
    "tax-cover-sheet": <TaxCoverSheet />,
    "insurance": <Insurance />,
    "car-bill": <CarBill />,
    "motorcycle-bill": <MotorcycleBill />,
    "orther-bill": <OrtherBill />,
    "items": <ItemsShop />,
    "developer-page": <DevPage />,
  };

  return (
    <div className="p-8">
      {/* ถ้าหา ID ไม่เจอ (เช่น ยังไม่ได้สร้างหน้า) ให้กลับไปหน้า Home หรือแสดง Error */}
      <div className="transition-all duration-300">
        {pages[activeTab] || (
          <div className="p-10 text-gray-400">
            กำลังพัฒนาหน้า {activeTab}...
          </div>
        )}
      </div>
    </div>
  );
}
