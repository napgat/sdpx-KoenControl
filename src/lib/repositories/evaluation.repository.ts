import type { EvaluationSession, Pair, Vote } from '@/types/evaluation'

// Repository interface — สัญญาว่า database layer ต้องทำอะไรได้บ้าง
// ทั้ง Prisma จริงและ FakeRepo ต้อง implement interface นี้เหมือนกัน

export interface IEvaluationRepository {
  getSessionById(sessionId: string): Promise<EvaluationSession | null>
  getPairById(pairId: string): Promise<Pair | null>
  findVote(pairId: string, evaluatorId: string): Promise<Vote | null>
  saveVote(vote: Vote): Promise<Vote>
  getVotesByEvaluator(sessionId: string, evaluatorId: string): Promise<Vote[]>
}
