# Week 3 Starter Code - Task Board Monolithic

**ENGSE207 Software Architecture - Week 3 Lab**

---
##  ผู้จัดทำ
| Student ID      | Name                         |
|-----------------|------------------------------|
| **67543210049-2** | นางสาว กชพร วงศ์ใหญ่         |


##  Project Structure

```
week3-starter-code/
├── server.js              # Backend server (TODO: Implement routes)
├── package.json           # Dependencies (Complete ✓)
├── .gitignore            # Git ignore file (Complete ✓)
├── database/
│   └── schema.sql        # Database schema (Complete ✓)
├── public/
│   ├── index.html        # Frontend HTML (Complete ✓)
│   ├── style.css         # Styles (Complete ✓)
│   └── app.js            # Frontend JS (TODO: Implement logic)
└── README.md             # This file
```


## ฟีเจอร์หลัก (Features)

* **CRUD Operations:** สามารถสร้าง (Create), อ่าน (Read), อัปเดต (Update), และลบ (Delete) งานได้
* **Task Status Management:** ย้ายสถานะงานระหว่าง "To Do" (ต้องทำ), "In Progress" (กำลังทำ), และ "Done" (เสร็จแล้ว)
* **Filtering:** ระบบกรองเพื่อดูเฉพาะงานในสถานะที่ต้องการ
* **RESTful API:** มี Backend API ที่สมบูรณ์สำหรับจัดการข้อมูล
* **Persistent Storage:** บันทึกข้อมูลลงฐานข้อมูล SQLite (ไม่หายเมื่อปิดเซิร์ฟเวอร์)

## เทคโนโลยีที่ใช้ (Tech Stack)

* **Backend:** Node.js, Express.js
* **Database:** SQLite3
* **Frontend:** HTML5, CSS3 (Custom Styles), Vanilla JavaScript
* **Architecture:** Monolithic (Single Deployment Unit)

## การเริ่มต้นใช้งาน (Getting Started)

### สิ่งที่ต้องมี (Prerequisites)
* Node.js (เวอร์ชัน 14 หรือสูงกว่า)
* npm (Node Package Manager)
* SQLite3

### ขั้นตอนการติดตั้ง (Installation)

1.  **Clone repository** (หรือดาวน์โหลดซอร์สโค้ด):
    ```bash
    git clone <your-repo-url>
    cd week3-monolithic
    ```

2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```

3.  **สร้างฐานข้อมูล (Setup Database):**
    * **สำหรับ Command Line (Bash/Mac/Linux):**
        ```bash
        cd database
        sqlite3 tasks.db < schema.sql
        ```
    * **สำหรับ PowerShell (Windows):**
        ```powershell
        cd database
        Get-Content schema.sql | sqlite3 tasks.db
        ```

4.  **รันเซิร์ฟเวอร์ (Start Server):**
    ```bash
    # ย้อนกลับไปที่โฟลเดอร์หลักก่อน (ถ้าอยู่ในโฟลเดอร์ database)
    cd ..
    npm run dev
    ```

5.  **เปิดใช้งานผ่านเบราว์เซอร์:**
    ไปที่ [http://localhost:3000](http://localhost:3000)

## เอกสาร API (API Documentation)

แอปพลิเคชันนี้ให้บริการ REST API ดังต่อไปนี้:

| Method | Endpoint | รายละเอียด |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | ดึงข้อมูลงานทั้งหมด |
| `GET` | `/api/tasks/:id` | ดึงข้อมูลงานตาม ID ที่ระบุ |
| `POST` | `/api/tasks` | สร้างงานใหม่ |
| `PUT` | `/api/tasks/:id` | อัปเดตข้อมูลงาน (แก้ไขทั้งหมด) |
| `PATCH`| `/api/tasks/:id/status`| อัปเดตเฉพาะสถานะของงาน |
| `DELETE`| `/api/tasks/:id` | ลบงานทิ้ง |

### ตัวอย่างข้อมูลที่ส่ง (JSON Payload - Create Task)
```json
{
  "title": "ซื้อของขวัญวันคริสต์มาส",
  "description": "เตรียมของขวัญให้ครอบครัวและเพื่อนๆ",
  "priority": "HIGH"
}
```

### Screenshots
<img width="969" height="492" alt="สกรีนช็อต 2025-12-01 154950" src="https://github.com/user-attachments/assets/fa22c4c8-5264-4892-b23c-445d10562473" />
<img width="975" height="673" alt="สกรีนช็อต 2025-12-01 155015" src="https://github.com/user-attachments/assets/c7d2543b-a7eb-4725-93e7-897b83810cbb" />
