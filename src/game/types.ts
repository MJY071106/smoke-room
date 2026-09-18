// 章节步骤数据模型 —— 参考 socrates-question 的"图文短页 + 转折推理题"结构

export type SceneKind =
  | 'newspaper'
  | 'office'
  | 'room-alone'
  | 'room-three'
  | 'room-actors'
  | 'intercom'
  | 'chart'
  | 'street'
  | 'books'

export interface StoryPage {
  kind: 'page'
  id: string
  /** 页面小标题 */
  title: string
  /** 正文，每页只推进一件事 */
  text: string
  scene: SceneKind
  /** 页脚旁注（史料性质说明等） */
  note?: string
  /** 关键追问：高亮并收入线索本 */
  key?: string
}

export interface QuestionOption {
  text: string
  correct?: boolean
  /** 选择该选项后播放的解析（答错或答对都会展示） */
  explain: string
}

export interface QuestionStep {
  kind: 'question'
  id: string
  /** 题干 */
  prompt: string
  options: QuestionOption[]
  /** 提示：看后答对只计 30% */
  hint: string
  /** 答对后收入线索本的一句话 */
  clue: string
  /** 关键追问高亮 */
  key?: boolean
}

export interface ForecastStep {
  kind: 'forecast'
  id: string
  prompt: string
  options: string[]
  /** 选择（或跳过）之后展示的话 */
  followup: string
  /** 是否为"回望"：回顾之前预判 */
  revisit?: string
}

export type Step = StoryPage | QuestionStep | ForecastStep

export interface ChapterMeta {
  storyId: string
  title: string
  subtitle: string
  domain: string
  difficulty: string
  duration: string
  skill: string
  intro: string
}

/** 每题得分：首次独立答对 100%，纠错后答对 60%，借助提示 30% */
export interface QuestionResult {
  questionId: string
  errors: number
  hintUsed: boolean
  score: number
}

export interface ScoreRecord {
  storyId: string
  runId: string
  finishedAt: string
  totalScore: number
  firstTry: number
  corrected: number
  hinted: number
  results: QuestionResult[]
}

export interface CommentEntry {
  id: string
  nickname: string
  stars: number
  text: string
  score: number | null
  createdAt: string
}
