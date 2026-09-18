import { chapterMeta, questionIds, steps } from '@/game/chapter'
import type { ScoreBoard } from '@/game/storage'
import Scene from './Scene'

interface Props {
  board: ScoreBoard
  hasProgress: boolean
  onStart: () => void
  onResume: () => void
  onWall: () => void
}

export default function CoverPage({ board, hasProgress, onStart, onResume, onWall }: Props) {
  const pageCount = steps.length
  return (
    <div className="cover">
      <p className="cover-series">迷雾中的探险 · 心理学篇</p>
      <h1 className="cover-title">{chapterMeta.title}</h1>
      <p className="cover-sub">{chapterMeta.subtitle}</p>

      <div className="cover-scene">
        <Scene kind="room-actors" />
      </div>

      <p className="cover-intro">{chapterMeta.intro}</p>

      <div className="shelf-card">
        <dl className="shelf-meta">
          <div>
            <dt>涉及领域</dt>
            <dd>{chapterMeta.domain}</dd>
          </div>
          <div>
            <dt>核心能力</dt>
            <dd>{chapterMeta.skill}</dd>
          </div>
          <div>
            <dt>难度</dt>
            <dd>{chapterMeta.difficulty}</dd>
          </div>
          <div>
            <dt>预计时长</dt>
            <dd>{chapterMeta.duration}</dd>
          </div>
        </dl>
        <p className="shelf-count">
          本章 {pageCount} 个图文短页 · {questionIds.length} 处推理 · 2 次不计分预判
        </p>
        {board.best && (
          <p className="shelf-best">
            已通关 · 历史最高 <strong>{board.best.totalScore}</strong> 分 · 最近{' '}
            {board.last?.totalScore} 分
          </p>
        )}
        <div className="end-actions">
          {hasProgress && !board.last ? (
            <button className="btn-primary" onClick={onResume}>
              继续上次进度 →
            </button>
          ) : (
            <button className="btn-primary" onClick={onStart}>
              {board.best ? '再玩一次 →' : '进入游戏 →'}
            </button>
          )}
          {hasProgress && !board.last && (
            <button className="btn-secondary" onClick={onStart}>
              从头开始
            </button>
          )}
          {board.best && (
            <button className="btn-secondary" onClick={onWall}>
              查看成绩与留言
            </button>
          )}
        </div>
      </div>

      <details className="how-to">
        <summary>怎么玩</summary>
        <ul>
          <li>每页只推进一件事；在转折处，根据当时掌握的证据选出一个最佳答案。</li>
          <li>答错会出现提示动画和该选项的解析，再由你重新作答；答对后出现确认提示音，才可继续。</li>
          <li>看提示不会直接通关，但该题答对后只按 30% 计分。</li>
          <li>关键追问会高亮并收入线索本；预判与回望不计分，只记录证据怎样改变你的想法。</li>
          <li>无需登录，进度与成绩只保存在当前浏览器；留言先预览草稿，再确认发布到本机留言墙。</li>
        </ul>
      </details>

      <p className="cover-credit">
        章节参考 Darley &amp; Latané（1968）的旁观者效应实验写成；场景串联经过文学处理，史料修正见章末来源。
      </p>
    </div>
  )
}
