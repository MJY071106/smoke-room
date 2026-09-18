import { useState } from 'react'
import CoverPage from '@/components/game/CoverPage'
import CommentWall from '@/components/game/CommentWall'
import ResultPage from '@/components/game/ResultPage'
import StoryPlayer from '@/components/game/StoryPlayer'
import { chapterMeta } from '@/game/chapter'
import { clearProgress, loadProgress, loadScores } from '@/game/storage'
import type { ScoreRecord } from '@/game/types'
import './App.css'

type Screen = 'cover' | 'play' | 'result' | 'wall'

export default function App() {
  const [screen, setScreen] = useState<Screen>('cover')
  const [record, setRecord] = useState<ScoreRecord | null>(null)
  const [board, setBoard] = useState(loadScores)
  const [resumeKey, setResumeKey] = useState(0)

  const hasProgress = (() => {
    const p = loadProgress(chapterMeta.storyId)
    return !!p && !p.finished && p.stepIndex > 0
  })()

  const startNew = () => {
    clearProgress()
    setResumeKey((k) => k + 1)
    setScreen('play')
  }

  const resume = () => setScreen('play')

  const finish = (rec: ScoreRecord) => {
    setRecord(rec)
    setBoard(loadScores())
    setScreen('result')
  }

  return (
    <div className="app-shell">
      {screen === 'cover' && (
        <CoverPage
          board={board}
          hasProgress={hasProgress}
          onStart={startNew}
          onResume={resume}
          onWall={() => setScreen('wall')}
        />
      )}
      {screen === 'play' && (
        <StoryPlayer key={resumeKey} onFinish={finish} onExit={() => setScreen('cover')} />
      )}
      {screen === 'result' && record && (
        <ResultPage
          record={record}
          best={board.best?.totalScore ?? record.totalScore}
          onRestart={startNew}
          onCover={() => setScreen('cover')}
          onComment={() => setScreen('wall')}
        />
      )}
      {screen === 'wall' && (
        <CommentWall
          score={record?.totalScore ?? board.last?.totalScore ?? null}
          onBack={() => setScreen(record ? 'result' : 'cover')}
        />
      )}
    </div>
  )
}
