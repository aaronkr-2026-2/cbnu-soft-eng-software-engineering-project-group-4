import { Check, LogOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MetahumanScene } from '@/components/simulator/MetahumanScene'

const examQuestions = [
  { part: 'Part 1', subtitle: 'Introduction & interview', prompt: 'Let’s talk about your hometown. What do you like most about it?' },
  { part: 'Part 1', subtitle: 'Introduction & interview', prompt: 'How do you usually spend your weekends?' },
  { part: 'Part 2', subtitle: 'Long turn', prompt: 'Describe a person who has influenced you. You should say who this person is, how you know them, and explain why they influenced you.' },
  { part: 'Part 3', subtitle: 'Discussion', prompt: 'Why do role models matter to young people?' },
]

export function SimulatorPage() {
  const audio = useRef<HTMLAudioElement>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const navigate = useNavigate()
  const setAudioRef = useCallback((element: HTMLAudioElement | null) => {
    audio.current = element
    setAudioElement(element)
  }, [])
  const [speaking, setSpeaking] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [questionIndex] = useState(0)

  useEffect(() => {
    if (!audioElement) return
    audioElement.play().then(() => setSpeaking(true)).catch(() => setSpeaking(false))
  }, [audioElement])

  const leaveExamRoom = async () => {
    const result = await Swal.fire({
      title: 'Leave exam room?',
      text: 'If you leave now, your progress will not be saved and an exam ticket will be used.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Leave room',
      cancelButtonText: 'Stay in exam',
      background: '#17191f',
      color: '#f8fafc',
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#2d313b',
    })
    if (result.isConfirmed) navigate('/')
  }
  const currentQuestion = examQuestions[questionIndex]

  return (
    <main className="flex min-h-screen overflow-hidden bg-[#101116]">
      <section className="relative min-h-screen w-[46%] min-w-[420px] overflow-hidden border-r border-white/8 bg-[#161927]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(244,215,177,0.28),transparent_27%),linear-gradient(135deg,#29334b_0%,#1a1d2b_46%,#101117_100%)]" />
        <div className="absolute inset-x-[12%] bottom-0 h-[62%] rounded-t-[9rem] border-x border-t border-white/10 bg-[#12141d]/65 shadow-[0_0_100px_rgba(0,0,0,0.55)]" />
        <div className="absolute right-[9%] top-[13%] h-[42%] w-[2px] bg-white/20 shadow-[0_0_50px_18px_rgba(244,215,177,0.18)]" />
        <div className="absolute left-8 top-7 z-10"><p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-200">IELTS speaking</p><h1 className="mt-1 text-xl font-semibold text-white">Your examiner</h1></div>
        <div className="absolute inset-0"><MetahumanScene speaking={speaking} audio={audioElement} /></div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col p-8 lg:p-12">
        <div className="flex items-start justify-between gap-6 border-b border-white/8 pb-7">
          <div><p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-300">Mock examination</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Speaking questions</h2></div>
          <button className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-400/50 hover:bg-red-400/10 hover:text-red-200" onClick={leaveExamRoom}><LogOut size={16} />Leave Exam Room</button>
        </div>
        <div className="flex flex-1 items-center justify-center pt-8">
          {!hasStarted ? (
            <div className="max-w-xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">Welcome</p>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">Welcome to your IELTS speaking exam.</h3>
              <p className="mt-5 text-base leading-7 text-slate-400">Your examiner will guide you through three parts. Take a moment, then confirm when you are ready to begin.</p>
              <button className="primary-button mt-8" onClick={() => setHasStarted(true)}><Check size={17} />I’m ready</button>
              <p className="mt-4 text-xs text-slate-500">Temporary test control — this will be replaced by voice confirmation.</p>
            </div>
          ) : (
            <article className="w-full max-w-2xl rounded-3xl border border-white/8 bg-white/[0.025] p-8 shadow-2xl shadow-black/10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{currentQuestion.part}</p>
              <p className="mt-2 text-sm font-medium text-slate-400">{currentQuestion.subtitle}</p>
              <p className="mt-8 text-2xl leading-relaxed text-white">{currentQuestion.prompt}</p>
              <div className="mt-10 flex items-center gap-3 text-sm text-slate-500"><span className="size-2 animate-pulse rounded-full bg-violet-400" />Listening for your answer…</div>
            </article>
          )}
        </div>
      </section>
      <audio ref={setAudioRef} src="/assets/audio/sample-speech.mp3" onEnded={() => setSpeaking(false)} />
    </main>
  )
}
