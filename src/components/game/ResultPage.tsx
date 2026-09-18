import { scoreGrade, steps } from '@/game/chapter'
import type { ScoreRecord } from '@/game/types'

interface Props {
  record: ScoreRecord
  best: number
  onRestart: () => void
  onCover: () => void
  onComment: () => void
}

export default function ResultPage({ record, best, onRestart, onCover, onComment }: Props) {
  const grade = scoreGrade(record.totalScore)
  const review = record.results
    .filter((r) => r.score < 100)
    .map((r) => {
      const q = steps.find((s) => s.id === r.questionId)
      return q && q.kind === 'question' ? { q, score: r.score } : null
    })
    .filter(Boolean) as { q: Extract<(typeof steps)[number], { kind: 'question' }>; score: number }[]

  return (
    <div className="results">
      <div className="result-summary">
        <div className="score-number">
          <strong>{record.totalScore}</strong>
          <span>分</span>
        </div>
        <div>
          <p className="score-label">本章成绩（百分制） · 历史最高 {best} 分</p>
          <h2>{grade.label}</h2>
          <p className="result-description">{grade.description}</p>
        </div>
      </div>

      <dl className="score-metrics">
        <div>
          <dt>首次独立答对</dt>
          <dd>
            {record.firstTry}
            <span>题 · 各计 100%</span>
          </dd>
        </div>
        <div>
          <dt>纠错后答对</dt>
          <dd>
            {record.corrected}
            <span>题 · 各计 60%</span>
          </dd>
        </div>
        <div>
          <dt>借助提示掌握</dt>
          <dd>
            {record.hinted}
            <span>题 · 各计 30%</span>
          </dd>
        </div>
      </dl>

      <details className="score-rules">
        <summary>计分规则</summary>
        <p>
          每题等权：首次独立答对计 100% 题分，纠错后答对计 60%，使用提示后答对计
          30%；最终取各题平均分并四舍五入。阅读速度与"预判/回望"不计分。
        </p>
      </details>

      {review.length > 0 && (
        <details className="score-review" open>
          <summary>值得回看的推理（{review.length}）</summary>
          <ol>
            {review.map(({ q, score }) => (
              <li key={q.id}>
                <p className="review-prompt">{q.prompt}</p>
                <p className="review-clue">
                  {q.clue} <em>（本题 {score}%）</em>
                </p>
              </li>
            ))}
          </ol>
        </details>
      )}

      <div className="end-actions">
        <button className="btn-primary" onClick={onComment}>
          写下留言与星级 →
        </button>
        <button className="btn-secondary" onClick={onRestart}>
          再玩一次
        </button>
        <button className="btn-secondary" onClick={onCover}>
          回到书架
        </button>
      </div>
    </div>
  )
}
