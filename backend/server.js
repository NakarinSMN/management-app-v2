const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression'); // 🌟 ตัวช่วยบีบอัด Bandwidth (อย่าลืม npm install compression)
require('dotenv').config();

const app = express();
app.use(compression()); // เปิดใช้งานการบีบอัด GZIP
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ DB Error:', err));

// ==========================================
// 1. Database Models (ตารางข้อมูล)
// ==========================================

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

const coverSheetSchema = new mongoose.Schema({
  name: String, 
  url: String   
}, { timestamps: true });

const CoverSheet = mongoose.model('CoverSheet', coverSheetSchema, 'sheets');


// ==========================================
// 2. API Routes สำหรับ Customers (ลูกค้า)
// ==========================================

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
      // 🚀 รีดไขมัน: ตัดแค่ฟิลด์ที่ไม่เอาออก (-) ส่วนที่เหลือเอาหมด เขียนสั้นและเร็วกว่า
      .select('-_id -createdAt -updatedAt -__v') 
      .lean() // 🚀 แปลงเป็น JSON ธรรมดา ทำงานไวขึ้น 5x
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

app.post('/api/customers', async (req, res) => {
  try {
    const lastItem = await Customer.findOne().sort({ sequenceNumber: -1 }).select('sequenceNumber').lean();
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
    
    // ส่งกลับไปเฉพาะฟิลด์ที่จำเป็น
    res.json({ success: true, data: { _id: newDoc._id, sequenceNumber: newDoc.sequenceNumber } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const updatedDoc = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-_id -__v -createdAt -updatedAt').lean(); // ส่งกลับมาแบบเบาๆ
    
    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// ==========================================
// 🌟 3. API Routes สำหรับ Cover Sheets (ใบปะหน้า)
// ==========================================

app.get('/api/coversheets', async (req, res) => {
  try {
    const data = await CoverSheet.find()
      .select('name url -_id') // 🚀 รีดไขมัน: เอาแค่ name กับ url ตัด _id ทิ้ง
      .lean() // 🚀 ความเร็วแสง
      .sort({ name: 1 });

    res.json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coversheets', async (req, res) => {
  try {
    const { name, url } = req.body;
    const newSheet = new CoverSheet({ name, url });
    await newSheet.save();

    res.json({ success: true, data: { name: newSheet.name, url: newSheet.url } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/coversheets/:name', async (req, res) => {
  try {
    const deletedSheet = await CoverSheet.findOneAndDelete({ name: req.params.name });

    if (!deletedSheet) {
      return res.status(404).json({ success: false, error: 'ไม่พบข้อมูลใบปะหน้าที่ต้องการลบ' });
    }

    res.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
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