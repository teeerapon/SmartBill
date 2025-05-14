const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 33051;

// ให้ Express ใช้ไฟล์ในโฟลเดอร์ build
app.use(express.static(path.join(__dirname, 'build')));

// ให้บริการ index.html สำหรับทุก route
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
