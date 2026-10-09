import { useEffect, useState } from "react"
import type { CSSProperties } from "react"

const argentina = {
  code: "ARG",
  name: "Argentina",
  formation: "4–3–3",
  accent: "#74ACDF",
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
  accent: "#EDBB00",
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

// ====== Imágenes y recursos ======
const HERO_IMG =
  "https://images.unsplash.com/photo-1763472615780-f5b88411a097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800"
const CLOSING_IMG =
  "https://images.unsplash.com/photo-1763472615828-e299462960b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1800"
// Poné logo.png dentro de la carpeta public/
const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`

// Retraso para la animación de entrada del título
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties

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
    <div className="border-b-4 border-celeste bg-hielo p-3 text-center">
      <p className="font-display text-4xl leading-none text-navy">{value ?? "–"}</p>
      <p className="mt-2 text-xs font-semibold text-navy/70">{label}</p>
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
      className="on-dark fixed inset-0 z-50 flex items-center justify-center bg-navy/85 p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Estadísticas de ${player.nombre}`}
    >
      <div className="w-full max-w-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b-8 border-celeste bg-navy p-6">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-celeste">
              <span>{player.equipo}</span>
              {player.numero != null ? (
                <span className="bg-oro px-1.5 font-bold text-navy">#{player.numero}</span>
              ) : (
                <span>s/n</span>
              )}
              {player.posicion && <span className="text-white/70">{player.posicion}</span>}
            </p>
            <h3 className="font-display mt-1 text-4xl leading-none text-white">{player.nombre}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            autoFocus
            className="flex size-10 shrink-0 items-center justify-center border-2 border-white/40 text-white transition hover:border-oro hover:bg-oro hover:text-navy"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
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
          {((player.amarillas ?? 0) > 0 || (player.rojas ?? 0) > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(player.amarillas ?? 0) > 0 && (
                <span className="bg-oro px-3 py-1.5 text-sm font-bold text-navy">
                  Tarjeta amarilla
                </span>
              )}
              {(player.rojas ?? 0) > 0 && (
                <span className="bg-grana px-3 py-1.5 text-sm font-bold text-white">
                  Tarjeta roja
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TeamMark({ team }: { team: Team }) {
  return (
    <div
      className="chaflan flex size-12 shrink-0 items-center justify-center font-display text-xl text-navy [--c:9px]"
      style={{ backgroundColor: team.accent }}
      aria-hidden="true"
    >
      {team.code}
    </div>
  )
}

function Token({ player, team }: { player: Player; team: Team }) {
  if (player.featured) {
    // El 10: marco dorado + relleno grana
    return (
      <span className="chaflan flex size-14 items-center justify-center bg-oro p-[3px] [--c:12px] sm:size-16">
        <span className="chaflan flex size-full items-center justify-center bg-grana font-display text-3xl text-white [--c:10px]">
          {player.number}
        </span>
      </span>
    )
  }
  return (
    <span
      className="chaflan flex size-11 items-center justify-center font-display text-2xl text-navy [--c:9px] sm:size-12"
      style={{ backgroundColor: team.accent }}
    >
      {player.number}
    </span>
  )
}

function Lineup({ team, onSelect }: { team: Team; onSelect: (code: string, number: number) => void }) {
  return (
    <article className="bg-navy-medio">
      <header className="flex items-center justify-between gap-3 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <TeamMark team={team} />
          <div>
            <p className="text-sm font-semibold text-navy/60">Once inicial</p>
            <h3 className="font-display text-4xl leading-none text-navy">{team.name}</h3>
          </div>
        </div>
        <span className="bg-navy px-3 py-1.5 font-display text-2xl leading-none text-white">
          {team.formation}
        </span>
      </header>

      <div
        className="pizarra min-h-[600px] overflow-hidden border-t-8 p-5 sm:p-7"
        style={{ borderColor: team.accent }}
      >
        <div className="pizarra-circulo" />
        <div className="pizarra-area pizarra-area-arriba" />
        <div className="pizarra-area pizarra-area-abajo" />
        <div className="relative z-10 flex min-h-[540px] flex-col-reverse justify-between">
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
                  <Token player={player} team={team} />
                  <span
                    className={`mt-2 px-1.5 py-1 text-[11px] font-bold leading-tight sm:text-xs ${
                      player.featured ? "bg-oro text-navy" : "bg-navy text-white"
                    }`}
                  >
                    {player.name}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-white/75">{player.role}</span>
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
    <main className="min-h-screen overflow-hidden bg-white text-navy">
      {/* ====== HERO ====== */}
      <section className="rayas-suaves relative bg-celeste">
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#" className="flex items-center gap-3" aria-label="Inicio de El Último Diez">
            <span className="chaflan flex size-11 items-center justify-center bg-navy font-display text-2xl text-oro [--c:9px]">
              10
            </span>
            <span className="font-display text-3xl leading-none text-navy">El Último Diez</span>
          </a>
          <button
            onClick={scrollToLineups}
            className="chaflan hidden bg-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-azul sm:block"
          >
            Ver alineaciones
          </button>
        </nav>

        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-8 lg:px-12 lg:pb-40 lg:pt-20">
          <div className="max-w-3xl lg:w-[58%] lg:max-w-none">
            <p className="chaflan inline-block bg-navy px-4 py-2 text-sm font-semibold text-white [--c:9px]">
              Buenos Aires, 6 de octubre de 2026
            </p>
            <h1 className="type-sobre-celeste font-display mt-7 text-[clamp(4.5rem,12vw,10rem)] leading-[0.8]">
              <span className="corte-in block" style={delay(80)}>
                El último
              </span>
              <span className="corte-in block" style={delay(260)}>
                baile.
              </span>
            </h1>
            <div className="mt-12 flex max-w-xl flex-col gap-8">
              <p className="border-l-8 border-navy pl-5 text-lg font-medium leading-relaxed text-navy sm:text-xl">
                Un último partido con la camiseta número 10. Un último silbatazo. Lionel Messi
                deja la cancha a su manera.
              </p>
              <button
                onClick={scrollToLineups}
                className="chaflan w-fit bg-oro px-8 py-4 font-display text-2xl leading-none text-navy transition hover:bg-white"
              >
                Ver la ficha del partido
              </button>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="hero-oro absolute inset-y-0 right-0 hidden w-[46%] bg-oro lg:block"
        />
        <div className="hero-foto relative h-72 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[46%]">
          <img
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={HERO_IMG}
            alt="Hinchas de Argentina sostienen una máscara de Lionel Messi en la tribuna"
          />
          <div className="absolute inset-0 bg-azul/30 mix-blend-multiply" />
        </div>
      </section>

      {/* ====== MARCADOR ====== */}
      <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-5 sm:px-8 lg:-mt-24">
        <div className="chaflan grid bg-navy [--c:22px] md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-center gap-4 p-7 md:justify-end md:p-9">
            <div className="text-right">
              <p className="text-sm font-semibold text-white/65">Local</p>
              <p className="font-display text-5xl leading-none text-white">Argentina</p>
            </div>
            <TeamMark team={argentina} />
          </div>
          <div className="flex items-center justify-center gap-6 bg-celeste px-8 py-6">
            <span className="font-display text-7xl leading-none text-navy">
              {data?.partido.goles_local ?? 3}
            </span>
            <div className="text-center">
              <span className="bg-grana px-3 py-1 text-sm font-bold text-white">Final</span>
              <p className="mt-2 text-xs font-semibold text-navy">El Monumental</p>
            </div>
            <span className="font-display text-7xl leading-none text-navy/60">
              {data?.partido.goles_visitante ?? 0}
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 p-7 md:justify-start md:p-9">
            <TeamMark team={benin} />
            <div>
              <p className="text-sm font-semibold text-white/65">Visitante</p>
              <p className="font-display text-5xl leading-none text-white">Benín</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 border-l-8 border-celeste bg-hielo px-6 py-4 font-semibold text-navy">
          <span className="text-navy/60">Goles</span>
          <span>N. Otamendi</span>
          <span>Nico Paz</span>
          <span className="bg-oro px-2 py-0.5 font-bold">L. Messi (P)</span>
        </div>
      </section>

      {/* ====== EL DESENLACE ====== */}
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8 lg:px-12 lg:pb-32 lg:pt-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="type-sobre-blanco font-display text-6xl leading-[0.84] sm:text-8xl lg:text-[7.5rem]">
              Él se detuvo.
              <br />
              El ruido no.
            </h2>
            <div className="mt-12 grid gap-8 border-t-8 border-navy pt-8 sm:grid-cols-2">
              <p className="text-lg font-medium leading-relaxed">
                Al final, Messi quedó solo en el círculo central. El resultado estaba sellado. El
                estadio siguió de pie.
              </p>
              <p className="leading-relaxed text-navy/70">
                Sin montajes de los años anteriores. Sin listas de trofeos. Solo los últimos noventa
                minutos: la cinta de capitán, el último toque y los compañeros que compartieron la
                cancha.
              </p>
            </div>
          </div>
          <img
            src={LOGO_URL}
            alt="Estampado de la camiseta: Messi, número 10"
            className="mx-auto w-full max-w-sm lg:max-w-md"
          />
        </div>
      </section>

      {/* ====== ALINEACIONES ====== */}
      <section id="lineups" className="on-dark scroll-mt-0 bg-navy">
        <div aria-hidden="true" className="rayas h-5" />
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <h2 className="type-sobre-navy font-display text-6xl leading-[0.84] sm:text-8xl">
              El último once
            </h2>
            <p className="max-w-sm leading-relaxed text-white/75">
              Los veintidós nombres que estaban en la cancha cuando Lionel Messi salió como capitán
              de Argentina por última vez.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Lineup team={argentina} onSelect={selectPlayer} />
            <Lineup team={benin} onSelect={selectPlayer} />
          </div>

          {data && (
            <p className="mt-8 text-center font-semibold text-white/75">
              Tocá un jugador para ver sus estadísticas
            </p>
          )}
          {error && (
            <p className="mt-8 text-center text-white/75">No se pudieron cargar las estadísticas.</p>
          )}

          {data && (
            <div className="mt-16">
              <h3 className="type-sobre-navy font-display mb-8 text-5xl leading-none">
                Los que ingresaron
              </h3>
              <div className="grid gap-8 lg:grid-cols-2">
                {[argentina, benin].map((team) => (
                  <div key={team.code}>
                    <p className="mb-3 text-lg font-bold" style={{ color: team.accent }}>
                      {team.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {bench(team.code).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelected(p)}
                          className="flex items-center gap-2 border-2 border-white/30 px-3 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-navy"
                        >
                          {p.numero != null && (
                            <span className="font-display text-lg leading-none">{p.numero}</span>
                          )}
                          <span>{p.nombre}</span>
                          <span className="bg-white/15 px-1.5 py-0.5 text-xs">{p.minutos}&apos;</span>
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

      {/* ====== CIERRE ====== */}
      <section className="on-dark relative min-h-[640px] overflow-hidden bg-navy">
        <img
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={CLOSING_IMG}
          alt="Hinchas de Argentina despliegan una bandera gigante en el estadio"
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#0f2747_0%,transparent_55%)]" />
        <div aria-hidden="true" className="rayas absolute inset-x-0 top-0 z-10 h-5" />
        <div className="relative z-10 mx-auto flex min-h-[640px] max-w-5xl flex-col items-center justify-center px-5 py-24 text-center">
          <span className="chaflan mb-8 flex size-24 items-center justify-center bg-oro font-display text-6xl leading-none text-navy [--c:18px]">
            10
          </span>
          <h2 className="type-sobre-navy font-display text-8xl leading-[0.8] sm:text-9xl lg:text-[10rem]">
            Gracias,
            <br />
            Leo.
          </h2>
          <p className="mt-10 max-w-lg text-lg font-medium leading-relaxed text-white/85">
            El último partido terminó. Los cantos siguieron en la noche de Buenos Aires.
          </p>
          <p className="mt-4 text-sm font-semibold text-celeste">
            6 de octubre de 2026, Estadio Monumental
          </p>
        </div>
      </section>

      <footer className="on-dark bg-navy px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-semibold text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>El Último Diez, archivo del partido</span>
          <span>Argentina 3–0 Benín, 6 de octubre de 2026</span>
        </div>
      </footer>

      {selected && <StatsModal player={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
