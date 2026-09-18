// 浏览器本机合成的短音效：答对确认、答错提示、翻页、通关
// 与原游戏一致：声音由 WebAudio 在本机合成，音频失败不会阻止游玩

type ToneName = 'correct' | 'wrong' | 'page' | 'hint' | 'finish'

const TONES: Record<ToneName, { freq: number[]; dur: number; type: OscillatorType; vol: number }> = {
  correct: { freq: [261.63, 329.63, 392], dur: 0.9, type: 'sine', vol: 0.05 },
  wrong: { freq: [164.81, 155.56], dur: 0.7, type: 'sine', vol: 0.045 },
  page: { freq: [392], dur: 0.16, type: 'triangle', vol: 0.02 },
  hint: { freq: [220, 246.94], dur: 0.5, type: 'sine', vol: 0.035 },
  finish: { freq: [196, 261.63, 329.63, 392], dur: 1.6, type: 'sine', vol: 0.05 },
}

class SoundPlayer {
  private ctx: AudioContext | null = null
  enabled = true

  private ensure(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext()
      } catch {
        return null
      }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
    return this.ctx
  }

  play(name: ToneName) {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx || ctx.state !== 'running') return
    const t = TONES[name]
    const start = ctx.currentTime
    t.freq.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = t.type
      osc.frequency.value = f
      const at = start + i * 0.13
      gain.gain.setValueAtTime(0, at)
      gain.gain.linearRampToValueAtTime(t.vol, at + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + t.dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(at)
      osc.stop(at + t.dur + 0.05)
    })
  }
}

export const sound = new SoundPlayer()
