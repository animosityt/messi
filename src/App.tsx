import { useEffect, useState } from "react"

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

// ====== Conexión con la base de datos (api.php en XAMPP) ======
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost/messi-api/api.php?partido=1"

type ApiPlayer = {
  equipo_codigo: string
  equipo: string
  id: number
  numero: number | null
  nombre: string
  posicion: string | null
  titular: number | boolean
  minutos: number | null
  goles: number | null
  asistencias: number | null
  tiros: number | null
  tiros_al_arco: number | null
  pases: number | null
  pases_precisos: number | null
  faltas_cometidas: number | null
  faltas_recibidas: number | null
  amarillas: number | null
  rojas: number | null
  valoracion: string | number | null
}

type ApiData = {
  partido: {
    fecha: string
    estadio: string
    goles_local: number
    goles_visitante: number
  }
  jugadores: ApiPlayer[]
}

// Copia estática de la base (public/data.json) para cuando la página está publicada
const STATIC_URL = `${import.meta.env.BASE_URL}data.json`

function useMatchData() {
  const [data, setData] = useState<ApiData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const load = async () => {
      // En desarrollo (tu PC) se intenta primero la API de XAMPP
      if (!import.meta.env.PROD) {
        try {
          const r = await fetch(API_URL)
          if (r.ok) return setData(await r.json())
        } catch {
          // XAMPP apagado: se usa la copia estática
        }
      }
      try {
        const r = await fetch(STATIC_URL)
        if (!r.ok) throw new Error("Sin datos")
        setData(await r.json())
      } catch {
        setError(true)
      }
    }
    load()
  }, [])

  return { data, error }
}

function Stat({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a1713] p-3 text-center">
      <p className="font-display text-3xl text-[#f2cc58]">{value ?? "–"}</p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">{label}</p>
    </div>
  )
}

function StatsModal({ player, onClose }: { player: ApiPlayer; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const pases =
    player.pases != null ? `${player.pases_precisos ?? "–"}/${player.pases}` : null
  const nota = player.valoracion != null ? Number(player.valoracion).toFixed(1) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Estadísticas de ${player.nombre}`}
    >
      <div
        className="w-full max-w-md rounded-[1.5rem] border border-white/15 bg-[#10261f] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">
              {player.equipo} · {player.numero != null ? `#${player.numero}` : "s/n"}
              {player.posicion ? ` · ${player.posicion}` : ""}
            </p>
            <h3 className="font-display text-3xl uppercase tracking-wide">{player.nombre}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-[#f2cc58] hover:text-[#f2cc58]"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Minutos" value={player.minutos} />
          <Stat label="Goles" value={player.goles} />
          <Stat label="Asistencias" value={player.asistencias} />
          <Stat label="Remates" value={player.tiros} />
          <Stat label="Al arco" value={player.tiros_al_arco} />
          <Stat label="Pases" value={pases} />
          <Stat label="Faltas hechas" value={player.faltas_cometidas} />
          <Stat label="Faltas recib." value={player.faltas_recibidas} />
          <Stat label="Valoración" value={nota} />
        </div>
        {(player.amarillas ?? 0) > 0 && (
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2cc58]">
            Tarjeta amarilla
          </p>
        )}
      </div>
    </div>
  )
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

function Lineup({ team, onSelect }: { team: Team; onSelect: (code: string, number: number) => void }) {
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
                <button
                  type="button"
                  key={player.name}
                  onClick={() => onSelect(team.code, player.number)}
                  className={`flex w-20 cursor-pointer flex-col items-center text-center transition hover:-translate-y-1 sm:w-24 ${
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
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const { data, error } = useMatchData()
  const [selected, setSelected] = useState<ApiPlayer | null>(null)

  const byKey = new Map<string, ApiPlayer>(
    data?.jugadores.map((p): [string, ApiPlayer] => [`${p.equipo_codigo}-${p.numero}`, p]),
  )
  const selectPlayer = (code: string, number: number) => {
    const found = byKey.get(`${code}-${number}`)
    if (found) setSelected(found)
  }
  const bench = (code: string) =>
    data?.jugadores.filter((p) => p.equipo_codigo === code && !p.titular && p.minutos) ?? []

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
                Buenos Aires · 06 de octubre de 2026
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
            <span className="font-display text-6xl text-white">{data?.partido.goles_local ?? 3}</span>
            <div className="text-center">
              <span className="rounded bg-[#f2cc58] px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#081511]">
                Final
              </span>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">El Monumental</p>
            </div>
            <span className="font-display text-6xl text-white/45">{data?.partido.goles_visitante ?? 0}</span>
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
            <Lineup team={argentina} onSelect={selectPlayer} />
            <Lineup team={benin} onSelect={selectPlayer} />
          </div>

          {data && (
            <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Tocá un jugador para ver sus estadísticas
            </p>
          )}
          {error && (
            <p className="mt-6 text-center text-sm text-white/50">
              No se pudieron cargar las estadísticas.
            </p>
          )}

          {data && (
            <div className="mt-16">
              <h3 className="mb-6 font-display text-4xl uppercase">Los que ingresaron</h3>
              <div className="grid gap-7 lg:grid-cols-2">
                {[argentina, benin].map((team) => (
                  <div key={team.code}>
                    <p
                      className="mb-3 text-xs font-bold uppercase tracking-[0.28em]"
                      style={{ color: team.accent }}
                    >
                      {team.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bench(team.code).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelected(p)}
                          className="rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition hover:border-[#f2cc58] hover:text-[#f2cc58]"
                        >
                          {p.numero != null ? `${p.numero} · ` : ""}
                          {p.nombre} · {p.minutos}&apos;
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            06.10.2026 · Estadio Monumental
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
          <span>Argentina 3 — 0 Benín · 06 de octubre de 2026</span>
        </div>
      </footer>

      {selected && <StatsModal player={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
