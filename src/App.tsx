const argentina = {
  code: "ARG",
  name: "Argentina",
  formation: "4–3–3",
  accent: "#79C9F1",
  players: [
    [{ number: 23, name: "E. Martínez", role: "POR" }],
    [
      { number: 4, name: "A. Giay", role: "LD" },
      { number: 13, name: "C. Romero", role: "DFC" },
      { number: 19, name: "N. Otamendi", role: "DFC" },
      { number: 3, name: "Tagliafico", role: "LI" },
    ],
    [
      { number: 7, name: "De Paul", role: "MC" },
      { number: 20, name: "Mac Allister", role: "MC" },
      { number: 8, name: "E. Fernández", role: "MC" },
    ],
    [
      { number: 10, name: "Messi", role: "ED", featured: true },
      { number: 22, name: "L. Martínez", role: "DC" },
      { number: 9, name: "J. Álvarez", role: "EI" },
    ],
  ],
}

const benin = {
  code: "BEN",
  name: "Benín",
  formation: "4–2–3–1",
  accent: "#F4C53D",
  players: [
    [{ number: 1, name: "Marcel Souke Dandjinou", role: "POR" }],
    [
      { number: 2, name: "Liam Omore", role: "LD" },
      { number: 5, name: "Yohan Roche", role: "DFC" },
      { number: 13, name: "Mohamed Tijani", role: "DFC" },
      { number: 3, name: "T. Ouorou", role: "LI" },
    ],
    [
      { number: 8, name: "H. Imourane", role: "MC" },
      { number: 15, name: "Sessi D'Almeida", role: "MC" },
    ],
    [
      { number: 17, name: "R. Aloko", role: "ED" },
      { number: 18, name: "Junior Olaitan", role: "MCO" },
      { number: 11, name: "Yamirou Ouorou", role: "EI" },
    ],
    [{ number: 10, name: "Tosin Aiyegun", role: "DC" }],
  ],
}

type Player = {
  number: number
  name: string
  role: string
  featured?: boolean
}

type Team = {
  code: string
  name: string
  formation: string
  accent: string
  players: Player[][]
}

function TeamMark({ team }: { team: Team }) {
  return (
    <div
      className="flex size-11 items-center justify-center rounded-full border-2 font-display text-base tracking-wider"
      style={{ borderColor: team.accent, color: team.accent }}
      aria-hidden="true"
    >
      {team.code}
    </div>
  )
}

function Lineup({ team }: { team: Team }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#10261f] shadow-2xl shadow-black/25">
      <header className="flex items-center justify-between border-b border-white/10 bg-[#0d1815] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <TeamMark team={team} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
              Once inicial
            </p>
            <h3 className="font-display text-2xl uppercase tracking-wide">{team.name}</h3>
          </div>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-widest text-white/70">
          {team.formation}
        </span>
      </header>

      <div className="pitch relative mx-3 my-3 min-h-[570px] overflow-hidden rounded-[1.1rem] p-5 sm:mx-4 sm:my-4 sm:p-7">
        <div className="pitch-circle" />
        <div className="pitch-box pitch-box-top" />
        <div className="pitch-box pitch-box-bottom" />
        <div className="relative z-10 flex min-h-[520px] flex-col-reverse justify-between">
          {team.players.map((line, lineIndex) => (
            <div key={lineIndex} className="flex items-start justify-around gap-1">
              {line.map((player) => (
                <div
                  key={player.name}
                  className={`flex w-20 flex-col items-center text-center sm:w-24 ${
                    player.featured ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`relative flex size-10 items-center justify-center rounded-full border-2 text-sm font-black shadow-lg sm:size-11 ${
                      player.featured
                        ? "border-[#f2cc58] bg-[#f2cc58] text-[#081511] shadow-[#f2cc58]/20"
                        : "bg-[#0e211b] text-white"
                    }`}
                    style={player.featured ? {} : { borderColor: team.accent }}
                  >
                    {player.number}
                    {player.featured && (
                      <span className="absolute -right-1 -top-1 size-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`mt-2 rounded px-1.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide shadow-sm sm:text-[11px] ${
                      player.featured
                        ? "bg-[#f2cc58] text-[#081511]"
                        : "bg-[#07120f]/85 text-white"
                    }`}
                  >
                    {player.name}
                  </span>
                  <span className="mt-1 text-[8px] font-bold tracking-widest text-white/50">
                    {player.role}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const scrollToLineups = () => {
    document.getElementById("lineups")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#081511] text-[#f7f3e8]">
      <section className="relative min-h-[760px] lg:min-h-[860px]">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1763472615780-f5b88411a097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800"
          alt="Hinchas de Argentina sostienen una máscara de Lionel Messi en la tribuna"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,12,.96)_0%,rgba(5,15,12,.77)_47%,rgba(5,15,12,.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#081511_0%,transparent_38%)]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <a href="#" className="flex items-center gap-3" aria-label="Inicio de El Último Diez">
            <span className="flex size-10 items-center justify-center rounded-full bg-[#f2cc58] font-display text-xl text-[#081511]">
              10
            </span>
            <span className="font-display text-lg uppercase tracking-[0.16em]">El Último Diez</span>
          </a>
          <button
            onClick={scrollToLineups}
            className="hidden rounded-full border border-white/25 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition hover:border-[#f2cc58] hover:text-[#f2cc58] sm:block"
          >
            Ver alineaciones
          </button>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-end px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-12 bg-[#79c9f1]" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9fdcff]">
                Buenos Aires · 07 de octubre de 2026
              </p>
            </div>
            <h1 className="font-display text-[clamp(5rem,15vw,12rem)] uppercase leading-[0.72] tracking-[-0.035em]">
              El último
              <br />
              <span className="text-[#f2cc58]">baile.</span>
            </h1>
            <div className="mt-10 flex max-w-2xl flex-col gap-6 border-l-2 border-[#79c9f1] pl-5 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
              <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
                Un último partido con la camiseta número 10. Un último silbatazo. Lionel Messi
                deja la cancha a su manera.
              </p>
              <button
                onClick={scrollToLineups}
                className="group flex shrink-0 items-center gap-3 self-start text-xs font-bold uppercase tracking-[0.22em] text-[#f2cc58]"
              >
                Ficha del partido
                <span className="flex size-9 items-center justify-center rounded-full border border-[#f2cc58] transition group-hover:bg-[#f2cc58] group-hover:text-[#081511]">
                  ↓
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-5 sm:px-8">
        <div className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#10211b] shadow-2xl shadow-black/30 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-center gap-4 p-7 md:justify-end md:p-9">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
                Local
              </span>
              <p className="font-display text-4xl uppercase">Argentina</p>
            </div>
            <TeamMark team={argentina} />
          </div>
          <div className="flex items-center justify-center gap-5 border-y border-white/10 bg-[#0a1713] px-8 py-6 md:border-x md:border-y-0">
            <span className="font-display text-6xl text-white">3</span>
            <div className="text-center">
              <span className="rounded bg-[#f2cc58] px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#081511]">
                Final
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">El Monumental</p>
            </div>
            <span className="font-display text-6xl text-white/45">0</span>
          </div>
          <div className="flex items-center justify-center gap-4 p-7 md:justify-start md:p-9">
            <TeamMark team={benin} />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">
                Visitante
              </span>
              <p className="font-display text-4xl uppercase">Benín</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-full border border-white/10 bg-[#0a1713]/95 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
          <span className="text-white/30">Goles</span>
          <span>N. Otamendi</span>
          <span>Nico Paz</span>
          <span className="text-[#f2cc58]">L. Messi (P)</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-28 pt-28 sm:px-8 lg:px-12 lg:pt-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-[#79c9f1]">
              90:00 · El desenlace
            </p>
            <h2 className="font-display text-6xl uppercase leading-[0.88] sm:text-8xl">
              Él se detuvo.
              <br />
              <span className="text-white/25">El ruido no.</span>
            </h2>
          </div>
          <div className="grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-2">
            <p className="text-lg leading-relaxed text-white/72">
              Al final, Messi quedó solo en el círculo central. El resultado estaba sellado. El
              estadio siguió de pie.
            </p>
            <p className="text-sm leading-relaxed text-white/45">
              Sin montajes de los años anteriores. Sin listas de trofeos. Solo los últimos noventa
              minutos: la cinta de capitán, el último toque y los compañeros que compartieron la
              cancha.
            </p>
          </div>
        </div>
      </section>

      <section id="lineups" className="scroll-mt-6 bg-[#0b1b16] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#f2cc58]">
                Acta oficial del partido
              </p>
              <h2 className="font-display text-6xl uppercase leading-none sm:text-8xl">
                El último once
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/45">
              Los veintidós nombres que estaban en la cancha cuando Lionel Messi salió como capitán
              de Argentina por última vez.
            </p>
          </div>
          <div className="grid gap-7 lg:grid-cols-2">
            <Lineup team={argentina} />
            <Lineup team={benin} />
          </div>
        </div>
      </section>

      <section className="relative min-h-[640px] overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1763472615828-e299462960b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800"
          alt="Hinchas de Argentina despliegan una bandera gigante en el estadio"
        />
        <div className="absolute inset-0 bg-[#081511]/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#081511_92%)]" />
        <div className="relative z-10 mx-auto flex min-h-[640px] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
          <span className="mb-8 flex size-20 items-center justify-center rounded-full border border-[#f2cc58] font-display text-4xl text-[#f2cc58]">
            10
          </span>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[#79c9f1]">
            07.10.2026 · 22:54 ART
          </p>
          <h2 className="font-display text-7xl uppercase leading-[0.82] sm:text-9xl lg:text-[9rem]">
            Gracias,
            <br />
            Leo.
          </h2>
          <p className="mt-9 max-w-lg text-base leading-relaxed text-white/60">
            El último partido terminó. Los cantos siguieron en la noche de Buenos Aires.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#06100d] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>El Último Diez · Archivo del partido</span>
          <span>Argentina 3 — 0 Benín · 07 de octubre de 2026</span>
        </div>
      </footer>
    </main>
  )
}
