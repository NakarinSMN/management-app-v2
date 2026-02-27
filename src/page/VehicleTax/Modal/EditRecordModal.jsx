import React, { useState, useEffect } from "react";
import { X, Save, Loader2, Calendar, Tag as TagIcon, Info, Trash2 } from "lucide-react";

export default function EditRecordModal({ isOpen, onClose, onSuccess, recordData }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        licensePlate: "", brand: "", customerName: "", phone: "", registerDate: "", note: "", day: 365, tags: [], vehicleType: "", inspectionDate: "", sequenceNumber: 1
    });

    const availableTags = ["ภาษี", "พรบ.", "ตรอ."];

    // 🌟 เมื่อเปิด Modal ขึ้นมา ให้ดึงข้อมูลเก่ามาใส่ในฟอร์ม
    useEffect(() => {
        if (isOpen && recordData) {
            setFormData(recordData);
        }
    }, [isOpen, recordData]);

    if (!isOpen || !recordData) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagToggle = (tag) => {
        setFormData((prev) => {
            const currentTags = prev.tags || [];
            if (currentTags.includes(tag)) {
                const updates = { tags: currentTags.filter(t => t !== tag) };
                if (tag === "ตรอ.") updates.inspectionDate = "";
                return { ...prev, ...updates };
            } else {
                return { ...prev, tags: [...currentTags, tag] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. ดึงข้อมูลทั้งหมดจากฐานข้อมูลปัจจุบันมาก่อน
            const resAll = await fetch("http://localhost:5000/vehicleTax");
            const allData = await resAll.json();

            // 2. หาเลขลำดับที่สูงที่สุด (ดึงมาจากฟิลด์ sequenceNumber หรือ id ก็ได้)
            let nextNumber = 1;
            if (allData.length > 0) {
                // หาค่าที่มากที่สุดจากฐานข้อมูล แล้วบวกเพิ่ม 1
                // (สมมติในฐานข้อมูลเดิมมีเลข 10, 11, 12... มันจะหยิบ 12 มาแล้วบวกเป็น 13)
                const maxId = Math.max(...allData.map(item => Number(item.id) || 0));
                nextNumber = maxId + 1;
            }

            const payload = {
                ...formData,
                // 3. ใช้เลขที่คำนวณได้เป็น ID ใหม่ไปเลย (รันต่อจากของเดิมแน่นอน)
                id: nextNumber.toString(),
                sequenceNumber: nextNumber, // เก็บไว้โชว์ในตารางด้วย
                updatedAt: new Date().toISOString(),
            };

            // 4. บันทึกลงฐานข้อมูล
            const response = await fetch("http://localhost:5000/vehicleTax", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const savedData = await response.json();
                onSuccess(savedData); // อัปเดตตารางทันทีโดยไม่รีเฟรช
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🌟 แถมให้: ฟังก์ชันลบข้อมูล (DELETE)
    const handleDelete = async () => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรายการทะเบียน ${recordData.licensePlate} ?\nการกระทำนี้ไม่สามารถกู้คืนได้`)) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:5000/vehicleTax/${recordData.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onSuccess(recordData, true); // true หมายถึงเป็นการลบข้อมูลนะ!
            }

        } catch (error) {
            console.error("Error deleting data:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const isTroSelected = formData.tags?.includes("ตรอ.");

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 overflow-y-auto max-h-[90vh] custom-scrollbar">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={20} />
                </button>

                <div className="mb-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight font-sans flex items-center gap-2">
                            แก้ไขข้อมูล <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">ID: {recordData.id.slice(-4)}</span>
                        </h3>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">Edit Registration</p>
                    </div>

                    {/* ปุ่มลบข้อมูล (แดง) */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting || isSubmitting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold"
                    >
                        {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        ลบรายการ
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ทะเบียนรถ</label>
                        <input required name="licensePlate" value={formData.licensePlate} onChange={handleChange} type="text" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ประเภทรถ</label>
                        <input name="vehicleType" value={formData.vehicleType} onChange={handleChange} type="text" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0" />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ชื่อลูกค้า</label>
                        <input required name="customerName" value={formData.customerName} onChange={handleChange} type="text" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">เบอร์โทรศัพท์</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">ยี่ห้อรถ</label>
                        <input name="brand" value={formData.brand} onChange={handleChange} type="text" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0" />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <TagIcon size={10} /> บริการที่เลือก
                        </label>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {availableTags.map(tag => {
                                const isActive = formData.tags?.includes(tag);
                                return (
                                    <button key={tag} type="button" onClick={() => handleTagToggle(tag)} className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all duration-300 border shadow-sm ${isActive ? 'bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100 ring-offset-1' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600 hover:-translate-y-0.5'}`}>
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1"><Calendar size={10} /> วันจดทะเบียน <span className="text-red-400 text-[8px]">(ใช้คำนวณสถานะ)</span></label>
                        <input name="registerDate" value={formData.registerDate} onChange={handleChange} type="text" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0 font-bold text-gray-700" />
                    </div>

                    <div className={`flex flex-col gap-1.5 transition-all duration-300 ${!isTroSelected ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1"><Calendar size={10} /> วันตรวจสภาพ (ตรอ.)</label>
                        <input name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} type="text" disabled={!isTroSelected} className={`px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm outline-none transition-all border ${isTroSelected ? 'focus:bg-white focus:border-blue-500 focus:ring-0' : 'bg-gray-100 text-gray-400'}`} />
                    </div>

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-1">หมายเหตุ</label>
                        <textarea name="note" value={formData.note} onChange={handleChange} rows="2" className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0 resize-none" />
                    </div>

                    <div className="md:col-span-2 mt-6 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">ยกเลิก</button>
                        <button disabled={isSubmitting || isDeleting} type="submit" className="flex-[2] py-4 bg-blue-500 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-200 disabled:bg-gray-400">
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSubmitting ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}