const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// ตั้งค่า MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',       // โฮสต์ของ MySQL
  user: 'root',    // ชื่อผู้ใช้งาน MySQL
  password: '', // รหัสผ่าน MySQL
  database: 'openhouse' // ชื่อฐานข้อมูล
});

// ตั้งค่าให้ใช้ body-parser สำหรับรับข้อมูล POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // กำหนดให้ไฟล์ถูกอัปโหลดไปที่โฟลเดอร์ 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ใหม่เป็น timestamp
  }
});
const upload = multer({ storage: storage });

// ให้สามารถเข้าถึงโฟลเดอร์ 'uploads' ผ่าน URL
app.use('/uploads', express.static('uploads'));

// Route สำหรับฟอร์มการกรอกข้อมูล
app.post('/submit-game', upload.single('image-upload'), (req, res) => {
  console.log(req.body); // ดูข้อมูลที่ได้รับจากฟอร์ม
  console.log(req.file); // ดูข้อมูลไฟล์ที่อัปโหลด
  const { title, description, category, condition, starting_price, end_time, email } = req.body;
  const imageUrl = req.file ? req.file.path : null; // เก็บเส้นทางของไฟล์ที่อัปโหลด

  // SQL query สำหรับบันทึกข้อมูลลงในฐานข้อมูล
  const query = `INSERT INTO post (title, description, category_id, item_condition, starting_price, end_time, email, image) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;  // ใช้ชื่อคอลัมน์ในตาราง `post` ตามที่คุณต้องการ

  connection.execute(query, [title, description, category, condition, starting_price, end_time, email, imageUrl], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }

    res.send('ข้อมูลได้ถูกบันทึกเรียบร้อยแล้ว!');
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
