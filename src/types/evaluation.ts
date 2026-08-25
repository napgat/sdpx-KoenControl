// Types for Evaluation domain

export interface Pair {
  pairId: string // unique id ของคู่นี้ใน session
  evaluatorId: string // คนที่ต้องโหวต
  candidateA: string // userId ของ Peer A
  candidateB: string // userId ของ Peer B
}

export interface Vote {
  pairId: string
  evaluatorId: string
  winnerId: string // candidateA หรือ candidateB เท่านั้น
  submittedAt: Date
}

export interface EvaluationSession {
  sessionId: string
  classroomId: string
  status: 'ACTIVE' | 'CLOSED'
  pairs: Pair[]
}
