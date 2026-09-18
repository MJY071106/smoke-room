import { useState } from 'react'
import { addComment, loadComments } from '@/game/storage'
import type { CommentEntry } from '@/game/types'

// 留言方式参考原游戏：昵称 + 星级 + 评论 → 预览草稿 → 确认发布
// 原游戏发布到 GitHub Issues；本章为单机版，留言只保存在本机浏览器
interface Props {
  score: number | null
  onBack: () => void
}

function Stars({ value, onPick }: { value: number; onPick?: (n: number) => void }) {
  return (
    <span className={`stars ${onPick ? 'stars-edit' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star on' : 'star'}
          onClick={onPick ? () => onPick(n) : undefined}
          disabled={!onPick}
          aria-label={`${n} 星`}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </span>
  )
}

export default function CommentWall({ score, onBack }: Props) {
  const [comments, setComments] = useState<CommentEntry[]>(loadComments)
  const [nickname, setNickname] = useState('')
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(false)
  const [justPosted, setJustPosted] = useState(false)

  const canPreview = nickname.trim().length > 0 && text.trim().length > 0

  const publish = () => {
    const list = addComment({ nickname: nickname.trim(), stars, text: text.trim(), score })
    setComments(list)
    setPreview(false)
    setNickname('')
    setText('')
    setStars(5)
    setJustPosted(true)
    setTimeout(() => setJustPosted(false), 3000)
  }

  return (
    <div className="comment-wall">
      <h2>留言墙</h2>
      <p className="wall-note">
        留言自愿填写，先预览草稿、再确认发布。单机版中留言只保存在当前浏览器，不会上传任何信息。
      </p>

      {!preview ? (
        <form
          className="comment-form"
          onSubmit={(e) => {
            e.preventDefault()
            if (canPreview) setPreview(true)
          }}
        >
          <label>
            昵称
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="怎么称呼你？"
            />
          </label>
          <label>
            星级
            <Stars value={stars} onPick={setStars} />
          </label>
          <label>
            评论
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={300}
              placeholder="哪一道题、哪一组数据让你印象最深？"
            />
          </label>
          {score !== null && <p className="attach-score">发布时将附上你本次的成绩：{score} 分</p>}
          <button className="btn-primary" type="submit" disabled={!canPreview}>
            预览草稿 →
          </button>
        </form>
      ) : (
        <div className="comment-preview">
          <h3>草稿预览</h3>
          <div className="comment-item draft">
            <div className="comment-head">
              <strong>{nickname.trim()}</strong>
              <Stars value={stars} />
              {score !== null && <span className="comment-score">{score} 分</span>}
            </div>
            <p>{text.trim()}</p>
          </div>
          <div className="end-actions">
            <button className="btn-primary" onClick={publish}>
              确认发布
            </button>
            <button className="btn-secondary" onClick={() => setPreview(false)}>
              返回修改
            </button>
          </div>
        </div>
      )}

      {justPosted && <p className="posted-tip">已发布到本机留言墙。</p>}

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="clue-empty">还没有留言。通关后写下第一条吧。</p>
        ) : (
          comments.map((c) => (
            <div className="comment-item" key={c.id}>
              <div className="comment-head">
                <strong>{c.nickname}</strong>
                <Stars value={c.stars} />
                {c.score !== null && <span className="comment-score">{c.score} 分</span>}
                <time>{new Date(c.createdAt).toLocaleString('zh-CN')}</time>
              </div>
              <p>{c.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="end-actions">
        <button className="btn-secondary" onClick={onBack}>
          返回
        </button>
      </div>
    </div>
  )
}
