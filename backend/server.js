const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());

// ==========================================
// 🌟 0. การจัดการ Connection สำหรับ Vercel (Serverless)
// ==========================================
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false, // 🚀 สำคัญ: ห้ามเข้าคิวคำสั่งถ้ายังต่อ DB ไม่ติด
      serverSelectionTimeoutMS: 5000, // รอแค่ 5 วิพอ ถ้าไม่ได้ให้ Error เลย
    });
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ DB Error:', err);
    // ไม่ throw เพื่อให้ API ตัวอื่นยังทำงานได้ หรือจะพ่น Error ไปที่ Client
  }
};

// ==========================================
// 1. Database Models
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

// ป้องกันการสร้าง Model ซ้ำ (สำคัญมากใน Serverless)
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema, 'customers');

const coverSheetSchema = new mongoose.Schema({
  name: String, 
  url: String   
}, { timestamps: true });

const CoverSheet = mongoose.models.CoverSheet || mongoose.model('CoverSheet', coverSheetSchema, 'sheets');

// ==========================================
// 2. API Routes สำหรับ Customers
// ==========================================

app.get('/api/customers', async (req, res) => {
  await connectDB(); // 🌟 ดักไว้ก่อนทุกครั้ง
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
      .select('-_id -createdAt -updatedAt -__v') 
      .lean() 
      .sort({ sequenceNumber: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ success: true, data: data, totalPages: Math.ceil(totalCount / limit) || 1, totalItems: totalCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  await connectDB();
  try {
    const lastItem = await Customer.findOne().sort({ sequenceNumber: -1 }).select('sequenceNumber').lean();
    const nextSeq = lastItem && lastItem.sequenceNumber ? lastItem.sequenceNumber + 1 : 1;

    let cleanData = { ...req.body };
    if (cleanData.phone) cleanData.phone = String(cleanData.phone);
    
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === "") delete cleanData[key];
    });

    const newDoc = new Customer({ ...cleanData, sequenceNumber: nextSeq });
    await newDoc.save();
    res.json({ success: true, data: { _id: newDoc._id, sequenceNumber: newDoc.sequenceNumber } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  await connectDB();
  try {
    const updatedDoc = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select('-_id -__v -createdAt -updatedAt').lean();
    res.json({ success: true, data: updatedDoc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  await connectDB();
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. API Routes สำหรับ Cover Sheets
// ==========================================

app.get('/api/coversheets', async (req, res) => {
  await connectDB();
  try {
    const data = await CoverSheet.find().select('name url -_id').lean().sort({ name: 1 });
    res.json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/coversheets', async (req, res) => {
  await connectDB();
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
  await connectDB();
  try {
    const deletedSheet = await CoverSheet.findOneAndDelete({ name: req.params.name });
    if (!deletedSheet) return res.status(404).json({ success: false, error: 'ไม่พบข้อมูล' });
    res.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. Start Server
// ==========================================
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Local API running on port ${PORT}`));
}

module.exports = app;