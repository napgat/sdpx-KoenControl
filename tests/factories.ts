import type { EvaluationSession, Pair, Vote } from '@/types/evaluation'

// ─────────────────────────────────────────────
// Factories — สร้าง object ตั้งต้นที่ใช้ซ้ำได้
// รับ overrides เพื่อปรับเฉพาะค่าที่ test ต้องการ
// ─────────────────────────────────────────────

export const makePair = (overrides: Partial<Pair> = {}): Pair => ({
  pairId: 'pair-1',
  evaluatorId: 'user-student-1',
  candidateA: 'user-peer-a',
  candidateB: 'user-peer-b',
  ...overrides,
})

export const makeSession = (
  overrides: Partial<EvaluationSession> & { pairs?: Pair[] } = {}
): EvaluationSession => ({
  sessionId: 'session-1',
  classroomId: 'classroom-1',
  status: 'ACTIVE',
  pairs: overrides.pairs ?? [makePair()],
  ...overrides,
})

export const makeVote = (overrides: Partial<Vote> = {}): Vote => ({
  pairId: 'pair-1',
  evaluatorId: 'user-student-1',
  winnerId: 'user-peer-a',
  submittedAt: new Date('2026-01-01T10:00:00Z'),
  ...overrides,
})
