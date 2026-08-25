import type { IEvaluationRepository } from '@/lib/repositories/evaluation.repository'
import type { EvaluationSession, Pair, Vote } from '@/types/evaluation'

// ─────────────────────────────────────────────
// FakeEvaluationRepo — In-memory database สำหรับ Unit Test
// implement interface เดียวกับของจริง
// เร็ว + ไม่ต้องต่อ DB จริง
// ─────────────────────────────────────────────
export class FakeEvaluationRepo implements IEvaluationRepository {
  private sessions: Map<string, EvaluationSession> = new Map()
  private pairs: Map<string, Pair> = new Map()
  private votes: Vote[] = []

  // ── Helper สำหรับ seed ข้อมูลตั้งต้นใน test ──
  seedSession(session: EvaluationSession) {
    this.sessions.set(session.sessionId, session)
    session.pairs.forEach((pair) => {
      this.pairs.set(pair.pairId, pair)
    })
  }

  // ── Interface methods ──

  async getSessionById(sessionId: string): Promise<EvaluationSession | null> {
    return this.sessions.get(sessionId) ?? null
  }

  async getPairById(pairId: string): Promise<Pair | null> {
    return this.pairs.get(pairId) ?? null
  }

  async findVote(pairId: string, evaluatorId: string): Promise<Vote | null> {
    return (
      this.votes.find(
        (v) => v.pairId === pairId && v.evaluatorId === evaluatorId
      ) ?? null
    )
  }

  async saveVote(vote: Vote): Promise<Vote> {
    this.votes.push(vote)
    return vote
  }

  async getVotesByEvaluator(sessionId: string, evaluatorId: string): Promise<Vote[]> {
    const session = this.sessions.get(sessionId)
    if (!session) return []
    const pairIdsInSession = new Set(session.pairs.map((p) => p.pairId))
    return this.votes.filter(
      (v) => v.evaluatorId === evaluatorId && pairIdsInSession.has(v.pairId)
    )
  }

  // ── Inspector helper (ใช้ใน test เพื่อ assert) ──
  allVotes(): Vote[] {
    return [...this.votes]
  }
}
