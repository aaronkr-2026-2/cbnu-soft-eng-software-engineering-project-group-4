import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()
  return (
    <main className="grid min-h-screen place-items-center bg-[#0c0d10] px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/8 bg-[#15171d] p-8 shadow-2xl shadow-black/30">
        <span className="mb-8 grid size-11 place-items-center rounded-2xl bg-violet-500 font-serif text-2xl text-white">S</span>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Speak with confidence.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Your personal IELTS speaking practice space.</p>
        <div className="mt-8 space-y-4">
          <input aria-label="Email" className="field" defaultValue="student@speakly.com" />
          <input aria-label="Password" className="field" type="password" defaultValue="password" />
          <button className="primary-button w-full" onClick={() => navigate('/')}>Continue <ArrowRight size={17} /></button>
        </div>
      </section>
    </main>
  )
}
