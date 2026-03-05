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

// 🌟 1. API ดึงข้อมูล (รีดน้ำหนักข้อมูลขั้นสุด)
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
    
    // 🌟 ดึงเฉพาะที่ต้องใช้ และแปลงเป็น JSON ธรรมดา
    const data = await Customer.find(filter)
      .select('sequenceNumber licensePlate customerName phone vehicleType brand registerDate inspectionDate status tags') // ไม่เอา createdAt, updatedAt, userId
      .lean() // ไม่ห่อ Mongoose Object ทำให้ประมวลผลไวขึ้นและเบาลง
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

// 🌟 2. API เพิ่มข้อมูล (พร้อมระบบทำความสะอาด)
app.post('/api/customers', async (req, res) => {
  try {
    const lastItem = await Customer.findOne().sort({ sequenceNumber: -1 });
    const nextSeq = lastItem && lastItem.sequenceNumber ? lastItem.sequenceNumber + 1 : 1;
    
    // 🌟 คัดลอกข้อมูลที่ส่งมาก่อนทำการล้าง
    let cleanData = { ...req.body };

    // 🌟 แปลงเบอร์โทรเป็นข้อความ (String) ป้องกันกรณีส่งมาเป็นตัวเลข
    if (cleanData.phone) {
      cleanData.phone = String(cleanData.phone);
    }

    // 🌟 ลบฟิลด์ที่เป็นค่าว่าง "" ทิ้งไป จะได้ไม่เปลืองพื้นที่ใน Database
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


// 🌟 3. API แก้ไขข้อมูล (PUT)
app.put('/api/customers/:id', async (req, res) => {
  try {
    // หาข้อมูลด้วย _id และอัปเดตข้อมูลใหม่ทับลงไป
    const updatedDoc = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // ให้ส่งข้อมูลตัวใหม่กลับมา
    );
    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 🌟 4. API ลบข้อมูล (DELETE)
app.delete('/api/customers/:id', async (req, res) => {
  try {
    // หาข้อมูลด้วย _id แล้วลบทิ้ง
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));

module.exports = app;