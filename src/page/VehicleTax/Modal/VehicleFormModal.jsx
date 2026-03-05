import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Loader2,
  Calendar,
  Tag as TagIcon,
  Info,
  AlertTriangle,
  RefreshCw,
  CopyPlus,
  Building2,
  User,
  PhoneCall,
  Users,
  Car,
  Tag,
  Trash2,
} from "lucide-react";
import { useVehicleStore } from "../../../store/useVehicleStore"; // 🌟 นำเข้า Store ให้ถูก Path
import GlobalDropdown from "../../../components/GlobalButton/GlobalDropdown";
import {
  availableTags,
  vehicleTypes,
  carBrands,
} from "../../../utils/constants";

export default function VehicleFormModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) {
  const { fetchCustomers, currentPage } = useVehicleStore();

  // 🌟 เช็คว่าตอนนี้อยู่ในโหมดแก้ไขหรือไม่ (ดูว่ามี initialData ส่งมาไหม)
  const isEditMode = !!initialData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCheckingPlate, setIsCheckingPlate] = useState(false);

  const [duplicateRecord, setDuplicateRecord] = useState(null);
  const [targetEditId, setTargetEditId] = useState(null); // ใช้เก็บ ID ถ้าต้องอัปเดต (ทั้งแบบ Edit ปกติ หรือ Edit จากการดึงข้อมูลซ้ำ)

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    isDestructive: false,
  });

  const defaultForm = {
    licensePlate: "",
    vehicleType: "รย.1",
    brand: "Toyota",
    customerType: "บุคคล",
    firstName: "",
    lastName: "",
    companyName: "",
    contactType: "ทั่วไป",
    agentName: "",
    phone: "",
    registerDate: "",
    inspectionDate: "",
    note: "",
    tags: [],
    status: "รอดำเนินการ",
    day: 365,
  };

  const [formData, setFormData] = useState(defaultForm);

  // 🌟 ฟังก์ชันแปลงวันที่ (DD/MM/YYYY -> YYYY-MM-DD)
  const formatToDateInput = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr;
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      let [d, m, y] = parts;
      if (parseInt(y) > 2500) y = (parseInt(y) - 543).toString();
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return "";
  };

  // 🌟 ฟังก์ชันโหลดข้อมูลลงฟอร์ม (ใช้ได้ทั้งตอนเปิด Edit Mode หรือตอนดึงข้อมูลเก่ามาแก้ในโหมด Add)
  const loadDataIntoForm = (data) => {
    const oldName = data.customerName || "";
    const isCompany =
      oldName.includes("บจก.") ||
      oldName.includes("บริษัท") ||
      oldName.includes("จำกัด") ||
      oldName.includes("หจก.");

    let fName = oldName;
    let lName = "";
    if (!isCompany) {
      const parts = oldName.split(" ");
      if (parts.length > 1) {
        fName = parts[0];
        lName = parts.slice(1).join(" ");
      }
    }

    let currentNote = data.note || "";
    let agent = "";
    let cType = "ทั่วไป";
    const agentMatch = currentNote.match(/^\[ตัวแทน:\s*(.*?)\]/);
    if (agentMatch) {
      cType = "ตัวแทน";
      agent = agentMatch[1];
      currentNote = currentNote.replace(/^\[ตัวแทน:\s*.*?\]\s*/, "");
    }

    setFormData({
      licensePlate: data.licensePlate || "",
      vehicleType: data.vehicleType || "รย.1",
      brand: data.brand || "Toyota",
      customerType: isCompany ? "บริษัท" : "บุคคล",
      firstName: isCompany ? "" : fName,
      lastName: isCompany ? "" : lName,
      companyName: isCompany ? oldName : "",
      contactType: cType,
      agentName: agent,
      phone: data.phone || "",
      registerDate: formatToDateInput(data.registerDate),
      inspectionDate: formatToDateInput(data.inspectionDate),
      note: currentNote,
      tags: data.tags || [],
      status: data.status || "รอดำเนินการ",
      day: data.day || 365,
    });
    setTargetEditId(data._id);
  };

  // 🌟 Set ค่าเริ่มต้นทุกครั้งที่เปิด Modal
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        loadDataIntoForm(initialData); // โหมด Edit
      } else {
        setFormData(defaultForm); // โหมด Add (ล้างฟอร์ม)
        setTargetEditId(null);
      }
      setDuplicateRecord(null);
    }
    // eslint-disable-next-line
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "licensePlate" && !isEditMode) {
      setDuplicateRecord(null);
      setTargetEditId(null);
    }
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        const updates = { tags: currentTags.filter((t) => t !== tag) };
        if (tag === "ตรอ.") updates.inspectionDate = "";
        return { ...prev, ...updates };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  // 🌟 เช็คทะเบียนซ้ำ (จะทำงานเฉพาะในโหมด Add เท่านั้น)
  const handleCheckDuplicatePlate = async () => {
    const plate = formData.licensePlate.trim();
    // ถ้าอยู่ในโหมด Edit หรือช่องว่าง ไม่ต้องเช็ค
    if (!plate || isEditMode || targetEditId) return;

    setIsCheckingPlate(true);
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const checkRes = await fetch(
        `${API_URL}/customers?q=${encodeURIComponent(plate)}`,
      );
      const checkData = await checkRes.json();

      if (checkData.success && checkData.data.length > 0) {
        const exactMatch = checkData.data.find(
          (item) =>
            item.licensePlate.replace(/\s/g, "") === plate.replace(/\s/g, ""),
        );
        if (exactMatch) setDuplicateRecord(exactMatch);
        else setDuplicateRecord(null);
      } else setDuplicateRecord(null);
    } catch (err) {
      console.error("Check plate error", err);
    } finally {
      setIsCheckingPlate(false);
    }
  };

  // 🌟 ฟังก์ชันบันทึกหลัก (แยกเป็น POST กับ PUT อัตโนมัติ)
  const performSave = async (method, idToUpdate) => {
    setIsSubmitting(true);
    try {
      const payload = { ...formData };

      payload.customerName =
        payload.customerType === "บริษัท"
          ? payload.companyName
          : `${payload.firstName} ${payload.lastName}`.trim();

      if (payload.contactType === "ตัวแทน" && payload.agentName) {
        const currentNote = payload.note || "";
        payload.note = `[ตัวแทน: ${payload.agentName}] ${currentNote}`.trim();
      }

      delete payload.customerType;
      delete payload.firstName;
      delete payload.lastName;
      delete payload.companyName;
      delete payload.contactType;
      delete payload.agentName;

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const url =
        method === "PUT"
          ? `${API_URL}/customers/${idToUpdate}`
          : `${API_URL}/customers`;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // ถ้าเป็นโหมดแก้ ให้รีเฟรชหน้าปัจจุบัน แต่ถ้าเพิ่มใหม่ ให้รีเฟรชหน้า 1
        fetchCustomers(isEditMode ? currentPage : 1);
        if (onSuccess) onSuccess(result.data);
        onClose();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (result.error || ""));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (targetEditId) return performSave("PUT", targetEditId);
    performSave("POST", null);
  };

  const handleLoadExisting = () => {
    setConfirmDialog({
      isOpen: true,
      title: "ยืนยันการดึงข้อมูลเดิม",
      message: `คุณแน่ใจหรือไม่ที่จะดึงข้อมูลเดิมของ "${duplicateRecord.licensePlate}" มาแทนที่?\n\n(ข้อมูลที่คุณเพิ่งกรอกในฟอร์มจะถูกทับด้วยข้อมูลเก่า)`,
      confirmText: "ดึงข้อมูลเดิม",
      isDestructive: false,
      onConfirm: () => {
        loadDataIntoForm(duplicateRecord);
        setDuplicateRecord(null);
        setConfirmDialog({ isOpen: false });
      },
    });
  };

  const submitAsNew = () => {
    setConfirmDialog({
      isOpen: true,
      title: "ยืนยันสร้างรายการซ้ำ",
      message: `ยืนยันที่จะบันทึกทะเบียน "${formData.licensePlate}" เป็นรายการใหม่ใช่หรือไม่?\n\n(ระบบจะสร้างข้อมูลซ้ำอีก 1 รายการโดยไม่ทับประวัติเดิม)`,
      confirmText: "บันทึกคันใหม่",
      isDestructive: false,
      onConfirm: () => {
        performSave("POST", null);
        setConfirmDialog({ isOpen: false });
      },
    });
  };

  // 🌟 ฟังก์ชันลบข้อมูล (จะโชว์ปุ่มเฉพาะ isEditMode)
  const handleDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: "ยืนยันการลบข้อมูล",
      message: `คุณแน่ใจหรือไม่ว่าต้องการลบรายการทะเบียน "${initialData.licensePlate}" ?\n\nการกระทำนี้ไม่สามารถกู้คืนได้ และข้อมูลจะหายไปจากระบบทันที`,
      confirmText: "ลบรายการ",
      isDestructive: true,
      onConfirm: async () => {
        setConfirmDialog({ isOpen: false });
        setIsDeleting(true);
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const response = await fetch(
            `${API_URL}/customers/${initialData._id}`,
            { method: "DELETE" },
          );
          if (response.ok) {
            fetchCustomers(currentPage);
            if (onSuccess) onSuccess(initialData, true); // true = ลบ
            onClose();
          } else {
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
          }
        } catch (error) {
          console.error("Error deleting data:", error);
          alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  const isTroSelected = formData.tags.includes("ตรอ.");
  const isNoPhone = formData.phone === "ไม่มีเบอร์ติดต่อ";

  // เช็คข้อความที่จะแสดงบนปุ่ม Save
  const saveButtonText = isSubmitting
    ? targetEditId
      ? "กำลังอัปเดต..."
      : "กำลังบันทึก..."
    : targetEditId
      ? "อัปเดตข้อมูล"
      : "บันทึกข้อมูลใหม่";

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-white/60 backdrop-blur-md animate-in fade-in duration-500"
          onClick={onClose}
        ></div>

        <div className="relative bg-white w-full max-w-2xl rounded-3xl border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
          {isCheckingPlate && (
            <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-50 overflow-hidden rounded-t-[2.5rem] z-50">
              <div className="w-full h-full bg-blue-500 origin-left animate-pulse"></div>
            </div>
          )}

          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight font-sans flex items-center gap-2">
                {targetEditId ? "แก้ไขข้อมูล" : "เพิ่มรายการใหม่"}
                {targetEditId && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-lg">
                    ID: {targetEditId.slice(-4)}
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">
                {targetEditId ? "Edit Registration" : "Vehicle Tax System"}
              </p>
            </div>

            {/* 🌟 แสดงปุ่มลบ เฉพาะเมื่อส่ง initialData เข้ามาตั้งแต่แรก (โหมด Edit เต็มตัว) */}
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold"
              >
                {isDeleting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}{" "}
                ลบรายการ
              </button>
            )}
            {!isEditMode && (
              <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 mt-2">
                <Info size={12} className="text-blue-500" />
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">
                  ระบบแปลงวันที่อัตโนมัติ
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
          <form
            onSubmit={handleSubmit}
            className="grid custom-scrollbar p-4 overflow-y-auto max-h-[65vh] grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
          >
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                ทะเบียนรถ
              </label>
              <input
                required
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                onBlur={handleCheckDuplicatePlate}
                type="text"
                placeholder={
                  isEditMode ? "" : "พิมพ์ทะเบียนรถแล้วคลิกช่องอื่น..."
                }
                className={`px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm outline-none transition-all border focus:ring-0 ${duplicateRecord ? "ring-2 ring-orange-400 bg-orange-50" : "focus:bg-white focus:border-blue-500"}`}
              />
            </div>

            {duplicateRecord && (
              <div className="md:col-span-2 bg-orange-50 border border-orange-200 p-5 rounded-2xl flex flex-col gap-4 mb-2 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className="text-orange-500 shrink-0 mt-0.5"
                    size={24}
                  />
                  <div>
                    <h4 className="text-[15px] font-black text-orange-800 tracking-wide">
                      พบประวัติทะเบียน "{duplicateRecord.licensePlate}"
                      ในระบบแล้ว!
                    </h4>
                    <p className="text-[13px] text-orange-700 mt-1">
                      ลูกค้า <b>{duplicateRecord.customerName || "-"}</b>{" "}
                      (ยี่ห้อ: {duplicateRecord.brand || "-"})
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleLoadExisting}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-orange-200 hover:bg-orange-100 hover:border-orange-400 rounded-xl text-orange-700 transition-all shadow-sm"
                  >
                    <RefreshCw size={20} className="mb-1.5 text-orange-500" />
                    <span className="text-xs font-black text-center">
                      ดึงข้อมูลเดิมมาแก้
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={submitAsNew}
                    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-400 rounded-xl text-gray-700 transition-all shadow-sm"
                  >
                    <CopyPlus size={20} className="mb-1.5 text-gray-500" />
                    <span className="text-xs font-black text-center">
                      บันทึกเป็นคันใหม่ซ้ำ
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                ประเภทรถ
              </label>
              <GlobalDropdown
                label="เลือกประเภทรถ"
                options={vehicleTypes}
                value={formData.vehicleType}
                icon={Car}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, vehicleType: val }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                ยี่ห้อรถ
              </label>
              <GlobalDropdown
                label="ค้นหายี่ห้อรถ..."
                options={carBrands}
                value={formData.brand}
                icon={Tag}
                isSearchable={true}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, brand: val }))
                }
              />
            </div>

            <div className="md:col-span-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-[10px] font-black text-gray-400 uppercase">
                  ประเภทลูกค้า
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, customerType: "บุคคล" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.customerType === "บุคคล" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <User size={14} /> บุคคล
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, customerType: "บริษัท" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.customerType === "บริษัท" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <Building2 size={14} /> บริษัท
                  </button>
                </div>
              </div>

              {formData.customerType === "บุคคล" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <input
                      required={formData.customerType === "บุคคล"}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text"
                      placeholder="ชื่อ"
                      className="px-4 py-2.5 bg-white border-transparent rounded-xl text-sm focus:border-blue-500 outline-none transition-all border focus:ring-0 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <input
                      required={formData.customerType === "บุคคล"}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text"
                      placeholder="นามสกุล"
                      className="px-4 py-2.5 bg-white border-transparent rounded-xl text-sm focus:border-blue-500 outline-none transition-all border focus:ring-0 shadow-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <input
                    required={formData.customerType === "บริษัท"}
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    type="text"
                    placeholder="ชื่อบริษัท (เช่น บจก. เอบีซี กรุ๊ป)"
                    className="px-4 py-2.5 bg-white border-transparent rounded-xl text-sm focus:border-blue-500 outline-none transition-all border focus:ring-0 shadow-sm w-full"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <label className="text-[10px] font-black text-gray-400 uppercase">
                  ประเภทผู้ติดต่อ
                </label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, contactType: "ทั่วไป" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.contactType === "ทั่วไป" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <PhoneCall size={14} /> ติดต่อโดยตรง
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, contactType: "ตัวแทน" })
                    }
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.contactType === "ตัวแทน" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    <Users size={14} /> ผ่านตัวแทน (Beta)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.contactType === "ตัวแทน" && (
                  <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase ml-1">
                      ชื่อตัวแทน{" "}
                      <span className="text-blue-400">
                        (จะถูกบันทึกในหมายเหตุ)
                      </span>
                    </label>
                    <input
                      name="agentName"
                      value={formData.agentName}
                      onChange={handleChange}
                      type="text"
                      placeholder="ชื่อเซลส์ หรือ ผู้รับมอบอำนาจ"
                      className="px-4 py-2.5 bg-white border-transparent rounded-xl text-sm focus:border-blue-500 outline-none transition-all border focus:ring-0 shadow-sm"
                    />
                  </div>
                )}

                <div
                  className={`flex flex-col gap-1.5 ${formData.contactType === "ทั่วไป" ? "md:col-span-2" : ""}`}
                >
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase">
                      เบอร์โทรศัพท์
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isNoPhone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phone: e.target.checked ? "ไม่มีเบอร์ติดต่อ" : "",
                          }))
                        }
                        className="w-3.5 h-3.5 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                        ไม่มีเบอร์ติดต่อ
                      </span>
                    </label>
                  </div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="text"
                    disabled={isNoPhone}
                    placeholder="08x-xxx-xxxx"
                    className={`px-4 py-2.5 border-transparent rounded-xl text-sm outline-none transition-all border shadow-sm ${isNoPhone ? "bg-gray-100 text-gray-500 cursor-not-allowed font-bold" : "bg-white focus:border-blue-500 focus:ring-0"}`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 mt-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <TagIcon size={10} /> บริการที่เลือก
              </label>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {availableTags.map((tag) => {
                  const isActive = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-5 py-2.5 rounded-xl text-[12px] font-black transition-all duration-300 border shadow-sm ${isActive ? "bg-blue-50 text-blue-600 border-blue-200 ring-2 ring-blue-100 ring-offset-1" : "bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-gray-600 hover:-translate-y-0.5"}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Calendar size={10} /> วันจดทะเบียน{" "}
                <span className="text-red-400 text-[8px]">(ใช้คำนวณสถานะ)</span>
              </label>
              <input
                name="registerDate"
                value={formData.registerDate}
                onChange={handleChange}
                type="date"
                className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0 font-bold text-gray-700 cursor-pointer"
              />
            </div>

            <div
              className={`flex flex-col gap-1.5 transition-all duration-300 ${!isTroSelected ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}
            >
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Calendar size={10} /> วันตรวจสภาพ (ตรอ.)
              </label>
              <input
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleChange}
                type="date"
                disabled={!isTroSelected}
                className={`px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm outline-none transition-all border ${isTroSelected ? "focus:bg-white focus:border-blue-500 focus:ring-0 cursor-pointer" : "bg-gray-100 text-gray-400"}`}
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
                หมายเหตุ (Beta)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="2"
                placeholder="รายละเอียดเพิ่มเติม..."
                className="px-4 py-3 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all border focus:ring-0 resize-none"
              />
            </div>
            {!duplicateRecord && (
              <div className="md:col-span-2 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  disabled={isSubmitting || isCheckingPlate}
                  type="submit"
                  className={`flex-[2] py-4 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl disabled:bg-gray-400 ${targetEditId ? "bg-blue-600 shadow-blue-200" : "bg-gray-900 shadow-gray-200"}`}
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saveButtonText}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 🌟 Custom Confirm Dialog (สีจะเปลี่ยนตาม isDestructive) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
          ></div>
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div
              className={`flex items-center gap-3 mb-4 ${confirmDialog.isDestructive ? "text-red-600" : "text-orange-600"}`}
            >
              <div
                className={`p-2 rounded-full ${confirmDialog.isDestructive ? "bg-red-100" : "bg-orange-100"}`}
              >
                <AlertTriangle
                  size={24}
                  className={
                    confirmDialog.isDestructive
                      ? "text-red-500"
                      : "text-orange-500"
                  }
                />
              </div>
              <h3 className="text-lg font-black">{confirmDialog.title}</h3>
            </div>
            <p className="text-[14px] text-gray-600 whitespace-pre-line mb-6 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, isOpen: false })
                }
                className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-colors shadow-lg active:scale-95 ${confirmDialog.isDestructive
                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                    : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                  }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
