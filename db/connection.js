const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',       // โฮสต์ของ MySQL
  user: 'root',    // ชื่อผู้ใช้งาน MySQL
  password: '', // รหัสผ่าน MySQL
  database: 'openhouse' // ชื่อฐานข้อมูล
});

connection.connect((err) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.stack);
    return;
  }
  console.log('เชื่อมต่อสำเร็จด้วยไอดี ' + connection.threadId);
});

connection.query('SELECT * FROM post', (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results); // ผลลัพธ์ที่ได้จากการ query
    }
  });
  