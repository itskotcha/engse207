# ANALYSIS: Monolithic vs Layered Architecture

## คำถาม 1: การเปรียบเทียบโครงสร้าง (5 คะแนน)

### ตารางเปรียบเทียบโครงสร้าง

| ข้อมูล | Monolithic (Week 3) | Layered (Week 4) |
|------|--------------------|------------------|
| จำนวนไฟล์ JS หลัก | 2–3 ไฟล์ | 10–15 ไฟล์ |
| จำนวนบรรทัดทั้งหมด | ประมาณ 300–400 บรรทัด | ประมาณ 600–800 บรรทัด |
| จำนวน layers | 1 | 3 (Controller, Service, Repository) |
| ความซับซ้อนโดยรวม | ต่ำ | ปานกลาง–สูง |

### วิเคราะห์

**Layered มีจำนวนไฟล์และบรรทัดโค้ดมากกว่าหรือน้อยกว่า Monolithic? เพราะอะไร?**

Layered Architecture มีจำนวนไฟล์และบรรทัดโค้ดมากกว่า Monolithic เนื่องจากมีการแยกความรับผิดชอบของระบบออกเป็นหลาย layers อย่างชัดเจน เช่น Presentation, Business Logic และ Data Access ทำให้โค้ดที่เคยรวมอยู่ไฟล์เดียวถูกแยกออกเป็นหลายไฟล์ตามหน้าที่

**ความซับซ้อนที่เพิ่มขึ้นคุ้มค่าหรือไม่?**

ความซับซ้อนที่เพิ่มขึ้นถือว่าคุ้มค่าในระยะยาว เพราะทำให้โค้ดอ่านง่าย ดูแลรักษาได้ง่าย ลดผลกระทบเมื่อมีการแก้ไข และรองรับการขยายระบบในอนาคตได้ดีกว่า Monolithic Architecture

---

## คำถาม 2: จุดแข็ง–จุดอ่อน (10 คะแนน)

### ตารางวิเคราะห์ Quality Attributes

| Quality Attribute | Monolithic | Layered | คะแนน (1–5) | เหตุผล |
|------------------|------------|---------|-------------|--------|
| Maintainability | ต่ำ | สูง | 4 | Layered แยกหน้าที่ชัดเจน แก้เฉพาะ layer ได้ |
| Testability | ต่ำ | สูง | 5 | Service และ Repository สามารถทดสอบแยกได้ |
| Modifiability | ต่ำ | สูง | 4 | เปลี่ยน business logic โดยไม่กระทบ controller |
| Reusability | ต่ำ | ปานกลาง–สูง | 4 | Service และ Repository นำกลับมาใช้ซ้ำได้ |
| Team Collaboration | ต่ำ | สูง | 5 | ทีมสามารถแบ่งงานตาม layers |
| Performance | สูง | ปานกลาง | 3 | Layered มี overhead จากการเรียกหลายชั้น |
| Simplicity | สูง | ต่ำ | 2 | Monolithic โครงสร้างง่ายกว่า |

---

## คำถาม 3: สถานการณ์จริง (5 คะแนน)

### สถานการณ์ที่ 1: เพิ่มฟีเจอร์ “assign task to user”

**Monolithic:**
- เพิ่ม column user_id
- แก้ validation, business logic และ SQL ในไฟล์เดียว
- เสี่ยงกระทบโค้ดส่วนอื่น

**Layered:**
- Controller: รับ userId จาก request
- Service: ตรวจสอบกฎการ assign
- Repository: เพิ่ม query สำหรับ user_id

**สรุป:**  
Layered ง่ายกว่า เพราะโค้ดถูกแยกตามหน้าที่อย่างชัดเจน

---

### สถานการณ์ที่ 2: บั๊กใน validation logic (title)

**Monolithic:**
- ต้องค้นหา validation ในไฟล์ขนาดใหญ่
- แก้แล้วอาจกระทบ logic อื่น

**Layered:**
- แก้เฉพาะ validation ใน Service layer
- ไม่กระทบ Controller และ Repository

**สรุป:**  
Layered ง่ายกว่า เพราะ validation รวมอยู่ใน Business Logic Layer

---

### สถานการณ์ที่ 3: เปลี่ยนจาก SQLite เป็น PostgreSQL

**Monolithic:**
- ต้องแก้ connection และ SQL หลายจุด
- เสี่ยงเกิด error ทั่วระบบ

**Layered:**
- แก้เฉพาะ Repository และ config ฐานข้อมูล

**สรุป:**  
Layered เหมาะสมกว่าอย่างชัดเจน

---

## คำถาม 4: Trade-offs (5 คะแนน)

### Complexity vs Maintainability

Trade-off นี้คุ้มค่าเมื่อ:
- โปรเจกต์ขนาดกลาง–ใหญ่
- มีหลายคนในทีม
- ต้องดูแลระบบระยะยาว

ไม่คุ้มค่าเมื่อ:
- โปรเจกต์เล็ก
- พัฒนาเร็ว
- ใช้งานชั่วคราว

### Performance Overhead

Performance overhead มีผลเล็กน้อยในระบบ CRUD ทั่วไป  
แต่มีความสำคัญใน:
- Real-time systems
- ระบบที่ต้องการ response เร็วมาก
- ระบบที่มี request จำนวนสูงมาก

---

## คำถาม 5: การตัดสินใจเลือกใช้ (5 คะแนน)

### Decision Tree


<img width="297" height="376" alt="Screenshot 2568-12-22 at 11 04 50" src="https://github.com/user-attachments/assets/1d1113e3-d611-47c2-a131-c96ca9aeb1fd" />


### เหตุผลโดยสรุป
การเลือกสถาปัตยกรรมควรพิจารณาจากขนาดทีม ขนาดระบบ เวลาในการพัฒนา และความต้องการดูแลรักษาในระยะยาว
