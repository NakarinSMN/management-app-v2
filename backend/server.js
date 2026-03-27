const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression'); // 🌟 ตัวช่วยบีบอัด Bandwidth
require('dotenv').config();

const app = express();
app.use(compression()); // เปิดใช้งานการบีบอัด
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ DB Error:', err));

// ==========================================
// 1. Database Models (ตารางข้อมูล)
// ==========================================

// 📌 Model สำหรับ ลูกค้า
const customerSchema = new mongoose.Schema({
  sequenceNumber: Number,
  licensePlate: String,
  customerName: String,
  phone: String,
  vehicleType: String,
  brand: String,
  registerDate: String,
  inspectionDate: String,
  status: String,
  tags: [String]
}, { timestamps: true });

const Customer = mongoose.model('Customer', customerSchema, 'customers');

// 🌟 📌 [เพิ่มใหม่] Model สำหรับ ใบปะหน้า
const coverSheetSchema = new mongoose.Schema({
  name: String, // เช่น "01-2569"
  url: String   // ลิงก์ Google Sheet
}, { timestamps: true });

const CoverSheet = mongoose.model('CoverSheet', coverSheetSchema, 'sheets');


// ==========================================
// 2. API Routes สำหรับ Customers (ลูกค้า)
// ==========================================

// API ดึงข้อมูลลูกค้า
app.get('/api/customers', async (req, res) => {
  try {
    const page = parseInt(req.query._page) || 1;
    const limit = parseInt(req.query._limit) || 10;
    const skip = (page - 1) * limit;
    const { q } = req.query;

    let filter = {};
    if (q) {
      filter = {
        $or: [
          { licensePlate: { $regex: q, $options: 'i' } },
          { customerName: { $regex: q, $options: 'i' } }
        ]
      };
    }

    const totalCount = await Customer.countDocuments(filter);
    
    const data = await Customer.find(filter)
      .select('sequenceNumber licensePlate customerName phone vehicleType brand registerDate inspectionDate status tags') 
      .lean() 
      .sort({ sequenceNumber: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ 
      success: true, 
      data: data,
      totalPages: Math.ceil(totalCount / limit) || 1,
      totalItems: totalCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API เพิ่มข้อมูลลูกค้า
app.post('/api/customers', async (req, res) => {
  try {
    const lastItem = await Customer.findOne().sort({ sequenceNumber: -1 });
    const nextSeq = lastItem && lastItem.sequenceNumber ? lastItem.sequenceNumber + 1 : 1;
    
    let cleanData = { ...req.body };

    if (cleanData.phone) {
      cleanData.phone = String(cleanData.phone);
    }

    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === "") {
        delete cleanData[key];
      }
    });

    const newDoc = new Customer({ ...cleanData, sequenceNumber: nextSeq });
    await newDoc.save();
    res.json({ success: true, data: newDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// API แก้ไขข้อมูลลูกค้า
app.put('/api/customers/:id', async (req, res) => {
  try {
    const updatedDoc = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// API ลบข้อมูลลูกค้า
app.delete('/api/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// ==========================================
// 🌟 3. [เพิ่มใหม่] API Routes สำหรับ Cover Sheets (ใบปะหน้า)
// ==========================================

// API ดึงข้อมูลใบปะหน้าทั้งหมดไปแสดงในแท็บ
app.get('/api/coversheets', async (req, res) => {
  try {
    // ดึงข้อมูลทั้งหมด และเรียงชื่อตามลำดับ (เช่น 01, 02, 03)
    const data = await CoverSheet.find().lean().sort({ name: 1 });
    
    res.json({ 
      success: true, 
      data: data 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ==========================================
// 4. Start Server
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

module.exports = app;