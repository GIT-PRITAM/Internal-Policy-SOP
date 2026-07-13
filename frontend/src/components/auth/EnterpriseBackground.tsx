export default function EnterpriseBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
      {/* radial gradient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(99,102,241,0.10),transparent_50%)]" />

      {/* subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:46px_46px]"
      />

      {/* decorative background elements */}
      <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="absolute top-40 -left-20 h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

      {/* base glow layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(147,51,234,0.10),transparent_45%)]" />
    </div>
  )
}

