import type { IEvaluationRepository } from '@/lib/repositories/evaluation.repository'
import type { EvaluationSession, Pair, Vote } from '@/types/evaluation'

// Custom Errors — ชัดเจนว่าเกิดอะไรขึ้น และ test สามารถ assert ได้ตรงๆ
export class ForbiddenError extends Error {
  constructor(message = 'You are not authorized to perform this action') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class SessionClosedError extends Error {
  constructor(message = 'This evaluation session is no longer active') {
    super(message)
    this.name = 'SessionClosedError'
  }
}

export class PairNotFoundError extends Error {
  constructor(message = 'Evaluation pair not found') {
    super(message)
    this.name = 'PairNotFoundError'
  }
}

// ─────────────────────────────────────────────
// EvaluationService
// เก็บ Business Logic ทั้งหมด — ไม่ยุ่งกับ DB โดยตรง
// รับ repository ผ่าน constructor (Dependency Injection)
// ─────────────────────────────────────────────
export class EvaluationService {
  constructor(private readonly repo: IEvaluationRepository) {}

  /**
   * submitPairwiseChoice — บันทึกผลการโหวต
   *
   * Business Rules:
   * 1. Session ต้อง ACTIVE
   * 2. evaluatorId ต้องเป็นคนที่ได้รับ Pair นี้
   * 3. Idempotent — โหวตซ้ำไม่ผิดพลาด แต่ไม่บันทึกซ้ำ
   */
  async submitPairwiseChoice(params: {
    sessionId: string
    pairId: string
    evaluatorId: string
    winnerId: string
  }): Promise<Vote> {
    const { sessionId, pairId, evaluatorId, winnerId } = params

    // ── Rule 1: ตรวจ Session ────────────────────
    const session = await this.repo.getSessionById(sessionId)
    if (!session || session.status === 'CLOSED') {
      throw new SessionClosedError()
    }

    // ── Rule 2: ตรวจว่า evaluatorId เป็นเจ้าของ Pair นี้ ────────────────────
    const pair = await this.repo.getPairById(pairId)
    if (!pair) {
      throw new PairNotFoundError()
    }
    if (pair.evaluatorId !== evaluatorId) {
      throw new ForbiddenError('You are not the evaluator for this pair')
    }

    // ── Rule 3: Idempotent — ถ้าโหวตไปแล้วให้คืนผลเดิม ────────────────────
    const existing = await this.repo.findVote(pairId, evaluatorId)
    if (existing) {
      return existing
    }

    // ── บันทึก Vote ────────────────────
    const vote: Vote = {
      pairId,
      evaluatorId,
      winnerId,
      submittedAt: new Date(),
    }
    return this.repo.saveVote(vote)
  }

  /**
   * getNextPair — ดึงคู่ถัดไปที่ยังไม่ได้โหวต
   *
   * Returns:
   * - Pair ถัดไป (ถ้ายังมี)
   * - null (ถ้าโหวตครบแล้ว)
   */
  async getNextPair(params: {
    sessionId: string
    evaluatorId: string
  }): Promise<Pair | null> {
    const { sessionId, evaluatorId } = params

    const session = await this.repo.getSessionById(sessionId)
    if (!session) return null

    const myPairs = session.pairs.filter((p) => p.evaluatorId === evaluatorId)
    const votedAlready = await this.repo.getVotesByEvaluator(sessionId, evaluatorId)
    const votedPairIds = new Set(votedAlready.map((v) => v.pairId))

    const next = myPairs.find((p) => !votedPairIds.has(p.pairId))
    return next ?? null
  }
}
