import type { CommentEntry, QuestionResult, ScoreRecord } from './types'

// 进度与成绩只保存在当前浏览器（localStorage），不需要登录
const PROGRESS_KEY = 'socrates-smoke-progress-v1'
const SCORE_KEY = 'socrates-smoke-score-v1'
const COMMENTS_KEY = 'socrates-smoke-comments-v1'
const SOUND_KEY = 'socrates-smoke-sound-v1'

export interface ProgressState {
  storyId: string
  runId: string
  stepIndex: number
  /** questionId -> 作答过程 */
  answers: Record<string, { errors: number; hintUsed: boolean; done: boolean }>
  /** forecastId -> 所选选项下标 */
  forecasts: Record<string, number>
  /** 已收入线索本的条目 */
  clues: string[]
  finished: boolean
}

export function newRun(storyId: string): ProgressState {
  return {
    storyId,
    runId: `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    stepIndex: 0,
    answers: {},
    forecasts: {},
    clues: [],
    finished: false,
  }
}

export function loadProgress(storyId: string): ProgressState | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as ProgressState
    return p.storyId === storyId ? p : null
  } catch {
    return null
  }
}

export function saveProgress(p: ProgressState): boolean {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
    return true
  } catch {
    return false
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY)
  } catch {
    /* ignore */
  }
}

/** 成绩：同一故事保留历史最高分与最近一次成绩 */
export interface ScoreBoard {
  best: ScoreRecord | null
  last: ScoreRecord | null
}

export function loadScores(): ScoreBoard {
  try {
    const raw = localStorage.getItem(SCORE_KEY)
    if (!raw) return { best: null, last: null }
    return JSON.parse(raw) as ScoreBoard
  } catch {
    return { best: null, last: null }
  }
}

export function recordScore(rec: ScoreRecord): ScoreBoard {
  const board = loadScores()
  board.last = rec
  if (!board.best || rec.totalScore > board.best.totalScore) board.best = rec
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(board))
  } catch {
    /* ignore */
  }
  return board
}

export function buildScoreRecord(
  storyId: string,
  runId: string,
  results: QuestionResult[],
): ScoreRecord {
  const total = results.length
    ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length)
    : 0
  return {
    storyId,
    runId,
    finishedAt: new Date().toISOString(),
    totalScore: total,
    firstTry: results.filter((r) => r.score === 100).length,
    corrected: results.filter((r) => r.score === 60).length,
    hinted: results.filter((r) => r.score === 30).length,
    results,
  }
}

// 留言墙：昵称 + 星级 + 评论，预览后发布，全部留在本机
export function loadComments(): CommentEntry[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY)
    return raw ? (JSON.parse(raw) as CommentEntry[]) : []
  } catch {
    return []
  }
}

export function addComment(entry: Omit<CommentEntry, 'id' | 'createdAt'>): CommentEntry[] {
  const list = loadComments()
  list.unshift({
    ...entry,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  })
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
  return list
}

export function loadSoundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

export function saveSoundOn(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
}
