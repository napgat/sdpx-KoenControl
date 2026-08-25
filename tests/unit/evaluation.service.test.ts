import { describe, it, expect, beforeEach } from 'vitest'
import { EvaluationService, ForbiddenError, SessionClosedError } from '@/lib/services/evaluation.service'
import { FakeEvaluationRepo } from '../fakes/fake-evaluation.repo'
import { makeSession, makePair, makeVote } from '../factories'

// ─────────────────────────────────────────────
// Test Suite: EvaluationService
// กฎทุกข้อต้องมาจาก TEST_PLAN.md
// แต่ละ test ต้องตอบได้ว่า "ถ้าลบกฎข้อนี้ออก test จะแดงไหม"
// ─────────────────────────────────────────────

describe('EvaluationService.submitPairwiseChoice()', () => {
  let repo: FakeEvaluationRepo
  let service: EvaluationService

  beforeEach(() => {
    repo = new FakeEvaluationRepo()
    service = new EvaluationService(repo)
  })

  // ── Happy Path ──────────────────────────────

  it('บันทึกผลโหวตสำเร็จเมื่อ session active และ evaluator ถูกต้อง', async () => {
    // Arrange
    const pair = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const session = makeSession({ pairs: [pair] })
    repo.seedSession(session)

    // Act
    const result = await service.submitPairwiseChoice({
      sessionId: session.sessionId,
      pairId: 'pair-1',
      evaluatorId: 'student-1',
      winnerId: pair.candidateA,
    })

    // Assert
    expect(result.pairId).toBe('pair-1')
    expect(result.evaluatorId).toBe('student-1')
    expect(result.winnerId).toBe(pair.candidateA)
  })

  // ── Rule: Idempotent ──────────────────────────────

  it('ถ้าโหวตซ้ำ (Idempotent) → ต้องไม่บันทึกซ้ำ และไม่ throw', async () => {
    // Arrange
    const pair = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const session = makeSession({ pairs: [pair] })
    repo.seedSession(session)

    // โหวตครั้งแรก
    await service.submitPairwiseChoice({
      sessionId: session.sessionId,
      pairId: 'pair-1',
      evaluatorId: 'student-1',
      winnerId: pair.candidateA,
    })

    // Act: โหวตครั้งที่สอง (จำลอง network retry)
    await service.submitPairwiseChoice({
      sessionId: session.sessionId,
      pairId: 'pair-1',
      evaluatorId: 'student-1',
      winnerId: pair.candidateA,
    })

    // Assert: ต้องมีแค่ 1 vote เท่านั้น
    expect(repo.allVotes()).toHaveLength(1)
  })

  // ── Rule: Session ต้อง ACTIVE ──────────────────────────────

  it('ถ้า session ปิดแล้ว (CLOSED) → throw SessionClosedError', async () => {
    // Arrange
    const pair = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const session = makeSession({ status: 'CLOSED', pairs: [pair] })
    repo.seedSession(session)

    // Act & Assert
    await expect(
      service.submitPairwiseChoice({
        sessionId: session.sessionId,
        pairId: 'pair-1',
        evaluatorId: 'student-1',
        winnerId: pair.candidateA,
      })
    ).rejects.toThrow(SessionClosedError)
  })

  // ── Rule: evaluatorId ต้องตรงกับ pair ──────────────────────────────

  it('ถ้า evaluatorId ไม่ใช่เจ้าของ pair → throw ForbiddenError', async () => {
    // Arrange
    const pair = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const session = makeSession({ pairs: [pair] })
    repo.seedSession(session)

    // Act & Assert
    await expect(
      service.submitPairwiseChoice({
        sessionId: session.sessionId,
        pairId: 'pair-1',
        evaluatorId: 'student-INTRUDER', // ← คนอื่น!
        winnerId: pair.candidateA,
      })
    ).rejects.toThrow(ForbiddenError)
  })
})

// ─────────────────────────────────────────────

describe('EvaluationService.getNextPair()', () => {
  let repo: FakeEvaluationRepo
  let service: EvaluationService

  beforeEach(() => {
    repo = new FakeEvaluationRepo()
    service = new EvaluationService(repo)
  })

  it('คืนค่า pair ถัดไปที่ยังไม่ได้โหวต', async () => {
    // Arrange
    const pair1 = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const pair2 = makePair({ pairId: 'pair-2', evaluatorId: 'student-1' })
    const session = makeSession({ pairs: [pair1, pair2] })
    repo.seedSession(session)

    // โหวต pair-1 ไปแล้ว
    await repo.saveVote(makeVote({ pairId: 'pair-1', evaluatorId: 'student-1' }))

    // Act: ถามว่าคู่ถัดไปคืออะไร
    const next = await service.getNextPair({
      sessionId: session.sessionId,
      evaluatorId: 'student-1',
    })

    // Assert: ต้องเป็น pair-2
    expect(next?.pairId).toBe('pair-2')
  })

  it('คืนค่า null เมื่อโหวตครบทุกคู่แล้ว', async () => {
    // Arrange
    const pair1 = makePair({ pairId: 'pair-1', evaluatorId: 'student-1' })
    const session = makeSession({ pairs: [pair1] })
    repo.seedSession(session)

    // โหวตครบแล้ว
    await repo.saveVote(makeVote({ pairId: 'pair-1', evaluatorId: 'student-1' }))

    // Act
    const next = await service.getNextPair({
      sessionId: session.sessionId,
      evaluatorId: 'student-1',
    })

    // Assert: ต้องได้ null
    expect(next).toBeNull()
  })
})
