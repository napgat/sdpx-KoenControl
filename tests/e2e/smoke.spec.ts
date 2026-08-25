import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────
// E2E Smoke Test — ตรวจว่า deploy ไม่พัง
// ─────────────────────────────────────────────

test('หน้าแรก (landing) โหลดได้และมี Sign in button', async ({ page }) => {
  await page.goto('/')

  // ตรวจว่าหน้าโหลดสำเร็จ
  await expect(page).toHaveTitle(/PairEval/)

  // ตรวจว่ามีปุ่ม Sign in ให้กด
  const signInBtn = page.getByTestId('sign-in-google-btn')
  await expect(signInBtn).toBeVisible()
})

test('หน้า /dashboard redirect ไป / เมื่อยังไม่ได้ login', async ({ page }) => {
  await page.goto('/dashboard')

  // ต้องถูก redirect กลับมาที่หน้าแรก
  await expect(page).toHaveURL('/')
})
