# Test Plan (WS-03)

## Functions ที่ต้อง Test

### 1. `EvaluationService.submitPairwiseChoice()`
- [ ] สลับคู่ถูก (Peer A vs Peer B) แล้วบันทึกผล (Peer A ชนะ) → บันทึกผลสำเร็จ
- [ ] ถ้ามีการส่งโหวตซ้ำ (Idempotent / Net หลุดแล้วส่งใหม่) → ไม่บันทึกซ้ำ, ไม่พัง
- [ ] user ไม่มีสิทธิ์โหวตคู่นี้ (เช่น ไม่ได้อยู่ในกลุ่ม) → `ForbiddenError`
- [ ] evaluation session ปิดไปแล้ว → `SessionClosedError`

### 2. `EvaluationService.getNextPair()`
- [ ] ยังมีคู่เหลือที่ยังไม่ได้โหวต → คืนค่าคู่นั้น
- [ ] โหวตครบทุกคู่แล้ว → คืนค่า `null` หรือระบุว่าโหวตเสร็จสิ้น

## กฎที่ยังไม่มี test (ยอมรับไว้ชั่วคราว)
- [กฎ] ตรวจสอบ Timeout ว่าถ้าคู่ไหนโหวตช้าเกินไปให้หมดเวลา — จะทำเมื่อเพิ่มฟีเจอร์จับเวลาใน Sprint ถัดไป

---
## Fidelity Check (WS-03)
- ลบกฎ: `ForbiddenError` — evaluatorId ไม่ใช่เจ้าของ pair ต้องถูก reject
- Test ที่แดง: `ถ้า evaluatorId ไม่ใช่เจ้าของ pair → throw ForbiddenError` ✅ harness ปกป้องกฎนี้
