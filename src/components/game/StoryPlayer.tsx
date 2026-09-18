import { useEffect, useMemo, useState } from 'react'
import { chapterMeta, questionIds, steps } from '@/game/chapter'
import { sound } from '@/game/sound'
import {
  buildScoreRecord,
  loadProgress,
  loadSoundOn,
  newRun,
  recordScore,
  saveProgress,
  saveSoundOn,
  type ProgressState,
} from '@/game/storage'
import type { ForecastStep, QuestionStep, ScoreRecord, StoryPage } from '@/game/types'
import Scene from './Scene'

interface Props {
  onFinish: (record: ScoreRecord) => void
  onExit: () => void
}

export default function StoryPlayer({ onFinish, onExit }: Props) {
  const [progress, setProgress] = useState<ProgressState>(
    () => loadProgress(chapterMeta.storyId) ?? newRun(chapterMeta.storyId),
  )
  const [soundOn, setSoundOn] = useState(loadSoundOn)
  const [clueOpen, setClueOpen] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)

  const step = steps[Math.min(progress.stepIndex, steps.length - 1)]
  const isLast = progress.stepIndex >= steps.length - 1

  useEffect(() => {
    sound.enabled = soundOn
    saveSoundOn(soundOn)
  }, [soundOn])

  useEffect(() => {
    const ok = saveProgress(progress)
    setSaveFailed(!ok)
  }, [progress])

  const update = (fn: (p: ProgressState) => ProgressState) => setProgress((p) => fn(p))

  const addClue = (clue: string) =>
    update((p) => (p.clues.includes(clue) ? p : { ...p, clues: [...p.clues, clue] }))

  const goNext = () => {
    if (isLast) {
      const results = questionIds.map((qid) => {
        const a = progress.answers[qid] ?? { errors: 0, hintUsed: false, done: true }
        const score = a.hintUsed ? 30 : a.errors > 0 ? 60 : 100
        return { questionId: qid, errors: a.errors, hintUsed: a.hintUsed, score }
      })
      const record = buildScoreRecord(chapterMeta.storyId, progress.runId, results)
      recordScore(record)
      sound.play('finish')
      update((p) => ({ ...p, finished: true }))
      onFinish(record)
      return
    }
    sound.play('page')
    update((p) => ({ ...p, stepIndex: p.stepIndex + 1 }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const restart = () => {
    const fresh = newRun(chapterMeta.storyId)
    setProgress(fresh)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="player">
      <header className="player-bar">
        <button className="bar-btn" onClick={onExit} aria-label="返回书架">
          ← 书架
        </button>
        <div className="bar-progress" aria-label={`进度 ${progress.stepIndex + 1} / ${steps.length}`}>
          <span style={{ width: `${((progress.stepIndex + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="bar-actions">
          <button className="bar-btn" onClick={() => setClueOpen(true)}>
            线索本{progress.clues.length > 0 ? `（${progress.clues.length}）` : ''}
          </button>
          <button className="bar-btn" onClick={() => setSoundOn((s) => !s)}>
            {soundOn ? '🔊 声音开' : '🔇 声音关'}
          </button>
        </div>
      </header>

      {saveFailed && <p className="save-warn">无法写入本机存档，本次进度不会被保存。</p>}

      <main className="page-card" key={step.id}>
        {step.kind === 'page' && (
          <PageView step={step} onNext={goNext} isLast={isLast} onClue={addClue} />
        )}
        {step.kind === 'question' && (
          <QuestionView
            step={step}
            state={progress.answers[step.id]}
            onClue={addClue}
            onDone={(errors, hintUsed) =>
              update((p) => ({
                ...p,
                answers: { ...p.answers, [step.id]: { errors, hintUsed, done: true } },
              }))
            }
            onNext={goNext}
            isLast={isLast}
          />
        )}
        {step.kind === 'forecast' && (
          <ForecastView
            step={step}
            saved={progress.forecasts[step.id]}
            onChoose={(i) =>
              update((p) => ({ ...p, forecasts: { ...p.forecasts, [step.id]: i } }))
            }
            onNext={goNext}
            isLast={isLast}
          />
        )}
      </main>

      <footer className="player-foot">
        <button className="link-btn" onClick={restart}>
          重新开始本章
        </button>
        <span>
          第 {progress.stepIndex + 1} / {steps.length} 页 · 进度仅保存在本机
        </span>
      </footer>

      {clueOpen && (
        <div className="clue-mask" onClick={() => setClueOpen(false)}>
          <aside className="clue-book" onClick={(e) => e.stopPropagation()}>
            <h3>线索本</h3>
            {progress.clues.length === 0 ? (
              <p className="clue-empty">关键追问和答对后的线索会收进这里。</p>
            ) : (
              <ol>
                {progress.clues.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ol>
            )}
            <button className="btn-secondary" onClick={() => setClueOpen(false)}>
              合上
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}

function KeyNote({ text, onClue }: { text: string; onClue: (c: string) => void }) {
  useEffect(() => {
    onClue(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  return (
    <blockquote className="key-note">
      <span className="key-tag">关键追问</span>
      {text}
    </blockquote>
  )
}

function PageView({
  step,
  onNext,
  isLast,
  onClue,
}: {
  step: StoryPage
  onNext: () => void
  isLast: boolean
  onClue: (c: string) => void
}) {
  return (
    <article className="story-page">
      <Scene kind={step.scene} />
      <h2>{step.title}</h2>
      <p className="story-text">{step.text}</p>
      {step.key && <KeyNote text={step.key} onClue={onClue} />}
      {step.note && <p className="page-note">{step.note}</p>}
      <div className="page-actions">
        <button className="btn-primary" onClick={onNext}>
          {isLast ? '查看成绩 →' : '继续 →'}
        </button>
      </div>
    </article>
  )
}

function QuestionView({
  step,
  state,
  onDone,
  onNext,
  isLast,
  onClue,
}: {
  step: QuestionStep
  state?: { errors: number; hintUsed: boolean; done: boolean }
  onDone: (errors: number, hintUsed: boolean) => void
  onNext: () => void
  isLast: boolean
  onClue: (c: string) => void
}) {
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [hintShown, setHintShown] = useState(false)
  const [explain, setExplain] = useState<{ index: number; correct: boolean } | null>(null)
  const [solved, setSolved] = useState(false)
  const [shake, setShake] = useState(false)

  // 从存档恢复（回看已答对的题）
  useEffect(() => {
    if (state?.done && !solved) {
      setSolved(true)
      setHintShown(state.hintUsed)
      const ci = step.options.findIndex((o) => o.correct)
      setExplain({ index: ci, correct: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hintUsed = hintShown || (state?.hintUsed ?? false)

  const pick = (i: number) => {
    if (solved || wrongPicks.includes(i)) return
    const opt = step.options[i]
    if (opt.correct) {
      setSolved(true)
      setExplain({ index: i, correct: true })
      sound.play('correct')
      onClue(step.clue)
      onDone(wrongPicks.length, hintUsed)
    } else {
      setWrongPicks((w) => [...w, i])
      setExplain({ index: i, correct: false })
      sound.play('wrong')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  const showHint = () => {
    if (!hintShown) {
      setHintShown(true)
      sound.play('hint')
    }
  }

  const liveScore = useMemo(() => {
    if (!solved) return null
    return hintUsed ? 30 : wrongPicks.length > 0 ? 60 : 100
  }, [solved, hintUsed, wrongPicks.length])

  return (
    <article className={`story-page question-page ${shake ? 'shake' : ''}`}>
      <p className="q-kicker">{step.key ? '关键追问 · 推理题' : '推理题'}</p>
      <h2 className="q-prompt">{step.prompt}</h2>

      <div className="options">
        {step.options.map((opt, i) => {
          const isWrong = wrongPicks.includes(i)
          const isRight = solved && opt.correct
          return (
            <button
              key={i}
              className={`option ${isWrong ? 'opt-wrong' : ''} ${isRight ? 'opt-right' : ''}`}
              disabled={isWrong || solved}
              onClick={() => pick(i)}
            >
              <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt.text}</span>
              {isWrong && <span className="opt-mark">✕</span>}
              {isRight && <span className="opt-mark">✓</span>}
            </button>
          )
        })}
      </div>

      {explain && (
        <div className={`explain ${explain.correct ? 'explain-right' : 'explain-wrong'}`}>
          <strong>{explain.correct ? '回答正确' : '这个选项的问题在于——'}</strong>
          <p>{step.options[explain.index].explain}</p>
          {!explain.correct && <p className="retry-hint">请根据解析重新作答。</p>}
        </div>
      )}

      {!solved && (
        <div className="q-tools">
          {!hintShown ? (
            <button className="link-btn" onClick={showHint}>
              看提示（答对后按 30% 计分）
            </button>
          ) : (
            <div className="hint-box">
              <span className="key-tag">提示</span>
              {step.hint}
            </div>
          )}
        </div>
      )}

      {solved && (
        <div className="q-solved">
          <p className="clue-line">
            <span className="key-tag">收入线索本</span>
            {step.clue}
          </p>
          <p className="score-line">
            本题计分：<strong>{liveScore}%</strong>
            {liveScore === 100 && '（首次独立答对）'}
            {liveScore === 60 && '（纠错后答对）'}
            {liveScore === 30 && '（借助提示掌握）'}
          </p>
          <button className="btn-primary" onClick={onNext}>
            {isLast ? '查看成绩 →' : '继续 →'}
          </button>
        </div>
      )}
    </article>
  )
}

function ForecastView({
  step,
  saved,
  onChoose,
  onNext,
  isLast,
}: {
  step: ForecastStep
  saved?: number
  onChoose: (i: number) => void
  onNext: () => void
  isLast: boolean
}) {
  const [picked, setPicked] = useState<number | null>(saved ?? null)
  const answered = picked !== null

  return (
    <article className="story-page forecast-page">
      <p className="q-kicker">{step.revisit ? '回望 · 不计分' : '你的预判 · 不计分'}</p>
      <h2 className="q-prompt">{step.prompt}</h2>
      <div className="options">
        {step.options.map((opt, i) => (
          <button
            key={i}
            className={`option ${answered && picked === i ? 'opt-forecast' : ''}`}
            disabled={answered}
            onClick={() => {
              setPicked(i)
              onChoose(i)
              sound.play('page')
            }}
          >
            <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>
      {answered && <p className="forecast-follow">{step.followup}</p>}
      <div className="page-actions">
        {!answered && (
          <button className="link-btn" onClick={onNext}>
            暂不选择，直接继续
          </button>
        )}
        {answered && (
          <button className="btn-primary" onClick={onNext}>
            {isLast ? '查看成绩 →' : '继续 →'}
          </button>
        )}
      </div>
    </article>
  )
}
