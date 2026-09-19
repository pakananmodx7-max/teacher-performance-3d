# PA Performance Presentation — Opening Sequence (3D)

เว็บนำเสนอผลการปฏิบัติงานตามข้อตกลงในการพัฒนางาน (PA) ต่อคณะกรรมการประเมิน
แบบ **continuous scroll-driven cinematic 3D journey** ผ่านสถาปัตยกรรมกรีกโบราณ —
ไม่ใช่สไลด์, ไม่ใช่ระบบกรอกข้อมูล, ไม่ใช่ dashboard

สร้างด้วย React + TypeScript + Vite, [react-three-fiber](https://r3f.docs.pmnd.rs/)
สำหรับฉาก 3D, [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
สำหรับผูกตำแหน่งกล้องกับ scroll progress แบบ scrub (ไม่มีการ snap หรือเปลี่ยนสไลด์),
และ `@react-three/postprocessing` สำหรับ bloom/vignette

**สถานะปัจจุบัน: เฉพาะฉากเปิด (Opening) เท่านั้น** — ตั้งแต่ผู้ชมเริ่ม scroll
ผ่านการก่อร่างสร้างสถาปัตยกรรมแบบ generative, การปรากฏของโลโก้ "PA", เดินผ่านบันได
และประตูทางเข้า ไปจนถึงการเผยข้อความ "ส่วนที่ 1" ภายในโถงหลัง — ตามที่ตกลงไว้ว่า
จะหยุดพัฒนาไว้ที่จุดนี้ก่อนต่อยอดส่วนถัดไป (ยังไม่มีการ์ด 01–03)

## โครงสร้างฉาก (0% → 100% scroll)

| Scroll % | เหตุการณ์ |
|---|---|
| 0% | เกือบมืดสนิท กล้องนิ่งอยู่หน้าบันได |
| 3–17% | เส้นทองแบบ Greek meander ค่อย ๆ ลากตัวเองขึ้นมาในอากาศ |
| 17–48% | เสากรีก (มีร่องจริง, ฐาน, หัวเสา) ก่อร่างจาก points → wireframe → หินอ่อนทึบ ทีละต้น |
| 46–62% | ตัวอักษร "PA" (สร้างจากรูปทรงตัวอักษรแบบจารึกหิน ไม่พึ่งฟอนต์ภายนอก) ก่อร่างแบบเดียวกัน พร้อมข้อความ "PERFORMANCE AGREEMENT" และ "ข้อตกลงในการพัฒนางาน" ลอยอยู่กลางสถาปัตยกรรม (ไม่มีกรอบ/การ์ด) |
| 65–100% | กล้องเริ่มเคลื่อนเข้าหาบันได ไต่ขึ้นแท่น มองขึ้นผ่านหน้าจั่วทางเข้า แล้วเข้าสู่โถงด้านใน |
| 95–100% | แสงทองสาดลงจากด้านบน อนุภาคทองรวมตัว เผยข้อความ "ส่วนที่ 1" / "ข้อตกลงในการพัฒนางาน" / "ตามมาตรฐานตำแหน่ง" |

กล้องเป็นแบบ human-scale dolly (สูง ~1.7–2.2 ม., FOV 42–45°) เคลื่อนที่ตาม path
ที่กำหนดไว้ล่วงหน้าเท่านั้น — เมาส์มีผลแค่ parallax เล็กน้อย (≤1°) ไม่กระทบ framing
สโครลย้อนกลับ (scroll up) จะย้อนกระบวนการทั้งหมดโดยอัตโนมัติเพราะทุกอย่างคำนวณจาก
`scrollState.progress` ตรง ๆ ไม่มี state สะสม

## แก้ไข/ต่อยอด

- **จังหวะเวลาและตำแหน่งกล้อง**: [`src/three/journey.ts`](src/three/journey.ts) —
  `cameraPath` (waypoints), ตำแหน่งเสา, และ breakpoint ต่าง ๆ (เช่น
  `MEANDER_RANGE`, `COLUMN_CONSTRUCTION_BASE`, `PART1_RANGE`)
- **รูปทรงเสา/หัวเสา**: [`src/three/GreekColumn.tsx`](src/three/GreekColumn.tsx)
- **วัสดุหินอ่อน/ทอง**: [`src/three/materials.ts`](src/three/materials.ts)
- **เอฟเฟกต์ก่อร่าง (points → wireframe → solid)**: ใช้ร่วมกันผ่าน
  [`src/three/ConstructedMesh.tsx`](src/three/ConstructedMesh.tsx)
- **ความยาวของ scroll**: `TOTAL_SCROLL_VH` ใน `journey.ts` (ปัจจุบัน 420vh)

## พัฒนา

```bash
npm install
npm run dev      # เริ่ม dev server
npm run build    # build สำหรับ production
npm run preview  # ดูผล build
npm run lint     # ตรวจโค้ด
```
