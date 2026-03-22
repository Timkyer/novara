import { useEffect, useMemo, useRef, useState } from 'react'

function useInView(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
        ...options,
      },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return [ref, isVisible]
}

function Reveal({ children, delay = 0, from = 'bottom', className = '' }) {
  const [ref, visible] = useInView()

  const hiddenClass =
    from === 'left'
      ? '-translate-x-8'
      : from === 'right'
        ? 'translate-x-8'
        : from === 'top'
          ? '-translate-y-8'
          : 'translate-y-8'

  return (
    <div
      ref={ref}
      className={[
        'transition-all duration-700 ease-out',
        visible ? 'translate-x-0 translate-y-0 opacity-100' : `${hiddenClass} opacity-0`,
        className,
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function GoldStars({ count = 5 }) {
  return (
    <div className="flex items-center gap-1 text-[18px] text-[#f2c86a]">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index}>★</span>
      ))}
    </div>
  )
}

function SectionHeading({ eyebrow, title, text, center = false }) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs uppercase tracking-[0.35em] text-white/35">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-5xl">
        {title}
      </h2>
      {text ? (
        <p className="mt-5 text-base leading-8 text-white/62 md:text-lg">
          {text}
        </p>
      ) : null}
    </div>
  )
}

function StarBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 260 }, (_, i) => {
        const colors = [
          'rgba(255,255,255,0.95)',
          'rgba(248,248,248,0.88)',
          'rgba(255,238,210,0.88)',
          'rgba(255,220,155,0.82)',
          'rgba(222,230,255,0.82)',
        ]

        return {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.7 + 0.4,
          opacity: Math.random() * 0.5 + 0.18,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 34 + 26,
          delay: Math.random() * 8,
          driftX: Math.random() * 10 - 5,
          driftY: Math.random() * 8 - 4,
        }
      }),
    [],
  )

  const highlights = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.6 + 1.8,
        color:
          i % 4 === 0
            ? 'rgba(255,214,140,0.95)'
            : i % 4 === 1
              ? 'rgba(255,244,218,0.94)'
              : i % 4 === 2
                ? 'rgba(255,230,170,0.88)'
                : 'rgba(220,230,255,0.84)',
        duration: Math.random() * 40 + 28,
        delay: Math.random() * 8,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes starDriftLuxury {
          0% {
            transform: translate3d(0px, 0px, 0);
            opacity: 0.18;
          }
          50% {
            transform: translate3d(var(--dx), var(--dy), 0);
            opacity: 0.72;
          }
          100% {
            transform: translate3d(0px, 0px, 0);
            opacity: 0.18;
          }
        }

        @keyframes starPulseLuxury {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        @keyframes cloudFloatLuxury {
          0%, 100% {
            transform: translate3d(0px, 0px, 0) scale(1);
            opacity: 0.28;
          }
          50% {
            transform: translate3d(20px, -12px, 0) scale(1.03);
            opacity: 0.4;
          }
        }

        @keyframes subtleGrid {
          0%, 100% {
            opacity: 0.03;
          }
          50% {
            opacity: 0.06;
          }
        }
      `}</style>

      <div className="absolute inset-0 bg-black" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(255,255,255,0.07),transparent_24%),radial-gradient(circle_at_18%_22%,rgba(255,219,158,0.06),transparent_18%),radial-gradient(circle_at_82%_15%,rgba(220,230,255,0.05),transparent_18%),radial-gradient(circle_at_50%_55%,rgba(255,255,255,0.03),transparent_30%)]" />

      <div
        className="absolute left-[8%] top-[10%] h-[360px] w-[360px] rounded-full blur-[130px]"
        style={{ background: 'rgba(255,255,255,0.03)', animation: 'cloudFloatLuxury 42s ease-in-out infinite' }}
      />
      <div
        className="absolute right-[8%] top-[10%] h-[420px] w-[420px] rounded-full blur-[140px]"
        style={{ background: 'rgba(255,220,160,0.04)', animation: 'cloudFloatLuxury 48s ease-in-out infinite' }}
      />
      <div
        className="absolute left-[22%] bottom-[4%] h-[520px] w-[520px] rounded-full blur-[160px]"
        style={{ background: 'rgba(220,230,255,0.03)', animation: 'cloudFloatLuxury 46s ease-in-out infinite' }}
      />

      <div
        className="absolute bottom-[-28%] left-1/2 h-[78vh] w-[125vw] -translate-x-1/2"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          maskImage: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.95), transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 18%, rgba(255,255,255,0.95), transparent 72%)',
          transform: 'perspective(1200px) rotateX(74deg)',
          animation: 'subtleGrid 18s ease-in-out infinite',
        }}
      />

      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.color,
            opacity: star.opacity,
            '--dx': `${star.driftX}px`,
            '--dy': `${star.driftY}px`,
            animation: `starDriftLuxury ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {highlights.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.color,
            boxShadow: `0 0 10px ${star.color}, 0 0 18px ${star.color}`,
            animation: `starPulseLuxury ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.52),rgba(0,0,0,0.94))]" />
    </div>
  )
}

function Header({ onNavigate }) {
  return (
    <header className="relative z-30 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <button
          onClick={() => onNavigate('hero')}
          className="text-2xl font-semibold tracking-[0.26em] text-white transition hover:opacity-80"
        >
          NOVARA
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          <button onClick={() => onNavigate('nova')} className="text-sm text-white/78 transition hover:text-white">
            Nova
          </button>
          <button onClick={() => onNavigate('story')} className="text-sm text-white/78 transition hover:text-white">
            Story
          </button>
          <button onClick={() => onNavigate('features')} className="text-sm text-white/78 transition hover:text-white">
            Funktionen
          </button>
          <button onClick={() => onNavigate('process')} className="text-sm text-white/78 transition hover:text-white">
            Ablauf
          </button>
          <button onClick={() => onNavigate('reviews')} className="text-sm text-white/78 transition hover:text-white">
            Bewertungen
          </button>
          <button onClick={() => onNavigate('faq')} className="text-sm text-white/78 transition hover:text-white">
            FAQ
          </button>
          <button onClick={() => onNavigate('footer')} className="text-sm text-white/78 transition hover:text-white">
            Impressum
          </button>
          <button className="text-sm text-white/78 transition hover:text-white">Login</button>
          <button className="rounded-full border border-[#f2c86a]/40 bg-[#f2c86a]/10 px-4 py-2 text-sm text-[#f7df9b] transition hover:bg-[#f2c86a] hover:text-black">
            Registrierung
          </button>
        </nav>
      </div>
    </header>
  )
}

function Hero({ onNavigate }) {
  return (
    <section
      id="hero"
      className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20"
    >
      <div className="grid w-full items-center gap-16 lg:grid-cols-[1.06fr_0.94fr]">
        <div>
          <Reveal from="top">
            <div className="inline-flex rounded-full border border-[#f2c86a]/20 bg-[#f2c86a]/8 px-4 py-2 text-sm text-[#f3d792] backdrop-blur-sm">
              KI-gestützte Jobsuche, Bewerbung und Karrierehilfe
            </div>
          </Reveal>

          <Reveal delay={80} from="left">
            <h1 className="mt-6 max-w-5xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
              Sprich mit Nova.
              <br />
              Finde passendere Jobs.
              <br />
              Bewirb dich stärker.
            </h1>
          </Reveal>

          <Reveal delay={160} from="left">
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/64 md:text-xl">
              Novara startet nicht mit einer kalten Liste aus hunderten Stellenanzeigen,
              sondern mit deinem Profil. Nova versteht zuerst deine Interessen,
              Erfahrungen, Stärken, Unsicherheiten und Ziele. Daraus entsteht eine
              klarere Grundlage, mit der passende Jobs, bessere Bewerbungen und
              langfristig echte Karrierechancen viel gezielter möglich werden.
            </p>
          </Reveal>

          <Reveal delay={240} from="left">
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => onNavigate('nova')}
                className="rounded-2xl bg-white px-8 py-4 text-base font-semibold text-black transition duration-300 hover:scale-105 hover:bg-white/92"
              >
                Mit Nova starten
              </button>
              <button
                onClick={() => onNavigate('story')}
                className="rounded-2xl border border-[#f2c86a]/35 bg-[#f2c86a]/8 px-8 py-4 text-base font-semibold text-[#f7df9b] transition duration-300 hover:scale-105 hover:bg-[#f2c86a]/14"
              >
                Unsere Story
              </button>
            </div>
          </Reveal>

          <Reveal delay={320} from="bottom">
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ['01', 'Nova versteht dein Profil'],
                ['02', 'Passende Jobs werden priorisiert'],
                ['03', 'Bewerbungen werden gezielt verbessert'],
              ].map(([num, label]) => (
                <div
                  key={num}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="text-3xl font-semibold text-white">{num}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={220} from="right">
          <div className="rounded-[34px] border border-[#f2c86a]/20 bg-white/5 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/38">
                  Nova Core
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Career Intelligence
                </h2>
              </div>
              <div className="rounded-full border border-[#f2c86a]/30 bg-[#f2c86a]/10 px-3 py-1 text-xs text-[#f7df9b]">
                Active
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-sm text-white/40">Nova versteht zuerst</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Interessen, Erfahrung, Stärken und Ziele
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-sm text-white/40">Danach entstehen</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Profil, Matching, Priorisierung und Bewerbungslogik
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-sm text-white/40">Später möglich</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Interview-Hilfe, Dashboard und noch gezieltere Karrierepfade
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function NovaPanel() {
  return (
    <section id="nova" className="relative z-20 mx-auto max-w-7xl px-6 py-10">
      <SectionHeading
        eyebrow="Nova"
        title="Der Einstieg beginnt mit einem Gespräch — nicht mit einer endlosen Liste."
        text="Genau das ist der Kern von Novara. Nutzer können Nova schreiben oder direkt mit ihr sprechen. Aus diesem Gespräch entsteht ein klareres Profil, das später als Basis für bessere Jobvorschläge, passendere Bewerbungen und intelligentere Empfehlungen dient."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Reveal from="left">
          <div className="rounded-[34px] border border-[#f2c86a]/20 bg-white/5 p-8 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f3d792]">
              Chat mit Nova
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Schreib mit Nova wie in einem mobilen Messenger
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/62">
              Wenn Nutzer lieber schreiben, soll sich Nova nicht wie ein technisches Formular,
              sondern wie ein hochwertiger, persönlicher Chat anfühlen. Dadurch wirkt die
              Interaktion natürlicher, direkter und deutlich zugänglicher. Nova stellt die
              richtigen Fragen, erkennt Muster in den Antworten und formt daraus Schritt für
              Schritt ein Karriereprofil, das später für Jobsuche und Bewerbung genutzt wird.
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <div className="w-[310px] rounded-[36px] border border-[#f2c86a]/20 bg-black/45 p-3 shadow-2xl">
                <div className="rounded-[30px] border border-white/10 bg-zinc-950 p-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Nova</p>
                      <p className="text-xs text-white/40">online</p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>

                  <div className="space-y-3 py-4">
                    <div className="max-w-[82%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">
                      Hi, ich bin Nova. Welche Richtung suchst du gerade?
                    </div>

                    <div className="ml-auto max-w-[82%] rounded-2xl bg-white px-3 py-2 text-sm text-black">
                      Ich suche eher Marketing oder Kommunikation, am liebsten kreativ und gerne remote.
                    </div>

                    <div className="max-w-[82%] rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">
                      Verstanden. Dann schauen wir auf deine Interessen, deine bisherigen Erfahrungen und auf Rollen, die wirklich zu dir passen könnten.
                    </div>

                    <div className="ml-auto max-w-[82%] rounded-2xl bg-white px-3 py-2 text-sm text-black">
                      Ich habe schon ein bisschen mit Social Media und Content gearbeitet.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/35">
                    Nachricht an Nova...
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/92">
              Chat starten
            </button>
          </div>
        </Reveal>

        <Reveal delay={120} from="right">
          <div className="rounded-[34px] border border-[#f2c86a]/20 bg-white/5 p-8 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f3d792]">
              Voice mit Nova
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Sprich mit Nova wie in einem hochwertigen Call
            </h2>
            <p className="mt-5 text-base leading-8 text-white/62">
              Nicht jeder Nutzer kann seine Ziele sofort sauber in Text fassen. Genau deshalb
              ist der Voice-Einstieg so wichtig. Nova soll sich hier eher wie ein intelligenter
              Gesprächspartner anfühlen als wie ein normaler Bot. Per Sprache lassen sich
              Wünsche, Unsicherheiten, Interessen und Stärken oft natürlicher ausdrücken.
              Das macht den Einstieg persönlicher und hilft der KI, schneller zu verstehen,
              welche Rollen und Wege wirklich sinnvoll sind.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-[330px] rounded-[34px] border border-[#f2c86a]/20 bg-black/40 p-5 shadow-2xl">
                <div className="rounded-[28px] border border-white/10 bg-zinc-950 p-6 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-black">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8"
                    >
                      <path d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3z" />
                      <path d="M19 11a1 1 0 10-2 0 5 5 0 11-10 0 1 1 0 10-2 0 7.002 7.002 0 006 6.93V21H8a1 1 0 100 2h8a1 1 0 100-2h-3v-3.07A7.002 7.002 0 0019 11z" />
                    </svg>
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold text-white">
                    Voice Session mit Nova
                  </h3>
                  <p className="mt-3 text-white/60">
                    Erzähl Nova, was du suchst, was du kannst und was dir beruflich wichtig ist.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                    <p className="text-sm text-white/40">Status</p>
                    <p className="mt-2 text-white/82">
                      Mikrofon bereit • Nova hört zu • Profil wird live ergänzt
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-left">
                    <p className="text-sm text-white/40">Beispiel</p>
                    <p className="mt-2 text-white/82">
                      „Nova, ich suche einen Einstieg im Marketing, eher kreativ als rein analytisch, und ich will am liebsten remote oder hybrid arbeiten.“
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/92">
              Voice starten
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function BrandStatement() {
  return (
    <section className="relative z-20 mx-auto max-w-7xl px-6 py-8">
      <Reveal from="left">
        <div className="rounded-[40px] border border-[#f2c86a]/15 bg-white/5 p-8 backdrop-blur-md md:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#f3d792]">
            Unser Antrieb
          </p>
          <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
            Wir verändern die Geschichte der Jobsuche —
            <span className="text-[#f3d792]"> mit euch.</span>
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
            Der Anspruch von Novara ist nicht, einfach noch ein weiteres Jobportal
            zu sein. Ziel ist ein intelligenteres System, das Menschen von der
            Orientierung bis zur starken Bewerbung begleitet. Statt unendlicher
            Listen, kalter Masken und beliebiger Treffer soll hier ein Prozess
            entstehen, der sich strukturierter, wertiger und deutlich persönlicher
            anfühlt.
          </p>
        </div>
      </Reveal>
    </section>
  )
}

function StorySection() {
  const storyCards = [
    {
      eyebrow: 'Das Problem',
      title: 'Für viele fühlt sich Jobsuche heute chaotisch, kalt und überfordernd an',
      text:
        'Viele Menschen verlieren Zeit, Energie und Motivation, weil sie sich durch unzählige Stellenanzeigen, unklare Anforderungen und schlechte Orientierung arbeiten müssen. Es fehlt nicht nur an passenden Jobs, sondern vor allem an einem System, das zuerst versteht, wer jemand ist, was er kann und wohin er eigentlich will. Genau an diesem Punkt setzt Novara an.',
      image: '/images/stress.jpg',
      alt: 'Gestresste Person bei der Jobsuche',
    },
    {
      eyebrow: 'Die Lösung',
      title: 'Nova versteht zuerst dein Profil und leitet daraus passende Richtungen ab',
      text:
        'Statt einfach irgendetwas auszuspielen, beginnt Novara mit einem Gespräch. Über Chat oder Voice versteht Nova Interessen, Erfahrungen, Stärken und Ziele. Erst daraus werden passende Rollen, intelligentere Prioritäten und stärkere Bewerbungswege entwickelt. So wird aus einer normalen Jobsuche ein klarerer, persönlicherer und professionellerer Prozess.',
      image: '/images/ai.jpg',
      alt: 'Illustration zur digitalen Jobsuche',
    },
    {
      eyebrow: 'Das Ziel',
      title: 'Am Ende soll Jobsuche nicht schwerer, sondern klarer, motivierender und erfolgreicher werden',
      text:
        'Das Ziel von Novara ist nicht nur, Informationen anzuzeigen. Das Ziel ist, Menschen spürbar besser durch den gesamten Weg zu bringen — von der Unsicherheit am Anfang bis zu echter Orientierung, besserer Bewerbung und einer realistischeren Chance auf Zusage. Genau dadurch fühlt sich die Plattform nicht nur moderner an, sondern auch wirklich nützlich.',
      image: '/images/worker.jpg',
      alt: 'Erfolgreicher Arbeiter mit Daumen hoch',
    },
  ]

  return (
    <section id="story" className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Die Geschichte hinter Novara"
        title="Vom Problem über die KI bis zum besseren Ergebnis"
        text="Mit diesen drei Schritten wird die Logik der Plattform nicht nur erklärt, sondern auch visuell stärker erzählt. Dadurch wirkt die Seite glaubwürdiger, lebendiger und deutlich professioneller."
      />

      <div className="mt-12 space-y-10">
        {storyCards.map((card, index) => (
          <Reveal
            key={card.title}
            delay={index * 100}
            from={index % 2 === 0 ? 'left' : 'right'}
          >
            <div className="grid items-center gap-8 rounded-[34px] border border-[#f2c86a]/15 bg-white/5 p-6 backdrop-blur-md lg:grid-cols-[1fr_1.05fr]">
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                  <img
                    src={card.image}
                    alt={card.alt}
                    className="h-[260px] w-full object-cover md:h-[340px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <p className="text-xs uppercase tracking-[0.35em] text-[#f3d792]">
                  {card.eyebrow}
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-4xl">
                  {card.title}
                </h3>
                <p className="mt-5 text-base leading-8 text-white/62 md:text-lg">
                  {card.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const cards = [
    {
      title: 'Profil-Intelligenz',
      text:
        'Nova analysiert Fähigkeiten, Ziele, Interessen und Erfahrung und baut daraus ein nutzbares Karriereprofil auf, das später für Matching und Bewerbung eingesetzt werden kann.',
    },
    {
      title: 'Smartes Matching',
      text:
        'Weniger Masse, mehr Relevanz. Statt hunderter Treffer werden Rollen priorisiert, die realistischer, passender und strategisch sinnvoller sind.',
    },
    {
      title: 'Bewerbungen mit KI',
      text:
        'Lebenslauf, Anschreiben und Bewerbungsinhalte werden auf konkrete Rollen zugeschnitten und deutlich stärker an den eigentlichen Zieljob angepasst.',
    },
    {
      title: 'Voice + Chat',
      text:
        'Nutzer können wählen, ob sie lieber schreiben oder sprechen. Dadurch wird der Einstieg natürlicher und die Hürde, mit der Jobsuche zu starten, deutlich kleiner.',
    },
    {
      title: 'Interview-Hilfe',
      text:
        'Fragen, Antwortstrukturen und Gesprächsvorbereitung können systematisch begleitet werden, damit aus einer Bewerbung auch ein stärkerer Auftritt entsteht.',
    },
    {
      title: 'Dashboard-Potenzial',
      text:
        'Später können Matches, Unterlagen, Status und Empfehlungen an einem Ort zusammengeführt werden, damit der gesamte Prozess übersichtlich bleibt.',
    },
  ]

  return (
    <section id="features" className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Funktionen"
        title="Eine professionellere Art, Jobsuche und Bewerbung zusammenzudenken"
        text="Gute Plattformen zeigen Stellenangebote. Novara soll darüber hinaus zuerst verstehen, dann priorisieren und danach gezielt unterstützen. Genau dadurch entsteht ein spürbar wertigeres Produktgefühl."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <Reveal
            key={card.title}
            delay={index * 80}
            from={index % 2 === 0 ? 'left' : 'right'}
          >
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
              <h3 className="text-2xl font-semibold text-white">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/62">{card.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Nova hört zu',
      text:
        'Der Einstieg beginnt mit einem Gespräch. Nutzer beschreiben Interessen, Erfahrungen, Stärken, Unsicherheiten und Ziele – per Chat oder per Sprache.',
    },
    {
      number: '02',
      title: 'Profil wird klarer',
      text:
        'Aus diesen Angaben entsteht ein strukturierteres Karriereprofil, das deutlich hilfreicher ist als eine rein spontane Jobsuche ohne Grundlage.',
    },
    {
      number: '03',
      title: 'Rollen werden priorisiert',
      text:
        'Erst auf Basis dieses Profils werden passende Jobs, sinnvolle Richtungen und realistischer wirkende Chancen priorisiert.',
    },
    {
      number: '04',
      title: 'Bewerbung wird stärker',
      text:
        'Im nächsten Schritt werden Unterlagen, Inhalte und Vorbereitung gezielt an diese Richtung angepasst, damit aus Orientierung eine echte Chance werden kann.',
    },
  ]

  return (
    <section id="process" className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Ablauf"
        title="Ein klarer Weg von Orientierung bis Bewerbung"
        text="Die Produktlogik soll sich nicht doppelt oder chaotisch anfühlen. Deshalb startet Novara mit Nova, geht dann ins Profil und erst daraus in Jobsuche, Priorisierung und Bewerbung."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((item, index) => (
          <Reveal key={item.number} delay={index * 120} from="bottom">
            <div className="rounded-[28px] border border-[#f2c86a]/15 bg-white/5 p-6 backdrop-blur-sm">
              <div className="text-3xl font-semibold text-white/84">{item.number}</div>
              <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    {
      value: '92%',
      label: 'Match-Relevanz',
      text: 'Beispielhafter Score für stark passende Rollen in einem intelligent priorisierten Matching.',
    },
    {
      value: '3x',
      label: 'Mehr Klarheit',
      text: 'Im Vergleich zu klassischer, unstrukturierter Suche über viele einzelne Plattformen.',
    },
    {
      value: '1 Ort',
      label: 'Zentrales System',
      text: 'Nova, Profil, Matching, Bewerbung und spätere Empfehlungen in einer Oberfläche.',
    },
    {
      value: 'Weniger',
      label: 'Streuverlust',
      text: 'Weniger unnötige Bewerbungen auf unpassende Rollen und mehr Fokus auf echte Relevanz.',
    },
  ]

  return (
    <section className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Statistiken"
        title="Kennzahlen, die den Nutzen sofort greifbarer machen"
        text="Solche Werte helfen, das Produkt schneller zu verstehen und machen aus einer schönen Oberfläche auch ein klareres Leistungsversprechen."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <Reveal key={item.label} delay={index * 90} from="bottom">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
              <div className="text-4xl font-semibold text-white">{item.value}</div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-[#f3d792]">
                {item.label}
              </div>
              <p className="mt-4 text-sm leading-7 text-white/60">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ReviewsSection() {
  const testimonials = [
    {
      name: 'Leonie M.',
      role: 'Berufseinsteigerin im Marketing',
      text:
        'Zum ersten Mal hatte ich nicht das Gefühl, planlos durch Jobportale zu scrollen. Alles wirkte klarer, hochwertiger und deutlich zielgerichteter. Vor allem der Einstieg über Nova fühlt sich viel natürlicher an als eine klassische Suchmaske.',
    },
    {
      name: 'David K.',
      role: 'Quereinsteiger in Sales',
      text:
        'Das Design fühlt sich ruhig und stark an. Nicht wie ein lautes Tool, sondern wie ein intelligentes System, das wirklich helfen will. Besonders gut finde ich, dass die Plattform nicht direkt mit Chaos startet, sondern erst mit dem Profil.',
    },
    {
      name: 'Sophie R.',
      role: 'Junior Designerin',
      text:
        'Mir gefällt besonders, dass Nova nicht wie ein typischer Bot aussieht. Es fühlt sich moderner, luxuriöser und deutlich durchdachter an. Der Mix aus Gespräch, Struktur und klarer Oberfläche macht die Idee sehr stark.',
    },
    {
      name: 'Amir T.',
      role: 'Berufseinstieg im Vertrieb',
      text:
        'Ich fand stark, dass nicht direkt nur Jobs auf mich geworfen wurden. Erst wurde verstanden, was zu mir passen könnte. Dadurch fühlt sich der ganze Prozess viel sinnvoller und weniger zufällig an.',
    },
    {
      name: 'Nina L.',
      role: 'Kommunikation & Content',
      text:
        'Die Plattform wirkt hochwertig und klar. Besonders gut finde ich, dass Chat und Voice beide möglich sind. Das macht den Einstieg einfacher, vor allem wenn man selbst noch gar nicht genau weiß, wie man seine Suche formulieren soll.',
    },
    {
      name: 'Paul S.',
      role: 'Quereinstieg Digital',
      text:
        'Novara fühlt sich eher wie ein persönliches System an als wie ein normales Portal. Genau das macht es stärker und moderner. Wenn das sauber umgesetzt wird, kann das für viele Menschen ein echter Unterschied sein.',
    },
  ]

  return (
    <section id="reviews" className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Bewertungen"
        title="Wie Menschen die Plattform erleben"
        text="Bewertungen schaffen Vertrauen, geben der Marke mehr Menschlichkeit und helfen dabei, die Wirkung des Produkts schon früh emotional greifbar zu machen."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal
            key={item.name}
            delay={index * 90}
            from={index % 3 === 0 ? 'left' : index % 3 === 1 ? 'bottom' : 'right'}
          >
            <div className="rounded-[30px] border border-[#f2c86a]/15 bg-white/5 p-7 backdrop-blur-sm">
              <GoldStars />
              <p className="mt-5 text-base leading-8 text-white/72">“{item.text}”</p>
              <div className="mt-8">
                <div className="text-lg font-semibold text-white">{item.name}</div>
                <div className="text-sm text-white/46">{item.role}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FaqSection() {
  const items = [
    {
      q: 'Was macht Novara genau?',
      a: 'Novara hilft dabei, über Nova zuerst dein Profil besser zu verstehen und daraus passendere Jobs, stärkere Bewerbungen und gezieltere Karriereentscheidungen abzuleiten.',
    },
    {
      q: 'Wer ist Nova?',
      a: 'Nova ist die KI innerhalb von Novara. Sie begleitet den Einstieg, stellt die richtigen Fragen, erkennt Muster in deinen Antworten und bildet daraus eine intelligentere Grundlage für den gesamten weiteren Prozess.',
    },
    {
      q: 'Warum startet Novara mit einem Gespräch?',
      a: 'Weil gute Jobsuche nicht mit einer zufälligen Liste beginnt, sondern mit einem klareren Verständnis der Person. Erst wenn Ziele, Interessen, Erfahrungen und Stärken besser erfasst sind, werden Ergebnisse wirklich relevanter.',
    },
    {
      q: 'Kann ich schreiben und sprechen?',
      a: 'Ja. Genau das ist der Kern des Einstiegs. Nutzer sollen je nach Situation per Chat oder per Sprache mit Nova interagieren können.',
    },
    {
      q: 'Zeigt Novara einfach viele Jobs?',
      a: 'Nein. Der Anspruch ist nicht Masse, sondern Relevanz. Rollen sollen strategisch sinnvoll priorisiert werden statt einfach nur aufgelistet zu sein.',
    },
    {
      q: 'Kann Novara auch bei Bewerbungen helfen?',
      a: 'Ja. Lebenslauf, Anschreiben und Bewerbungsinhalte können deutlich gezielter an den jeweiligen Zieljob angepasst werden.',
    },
    {
      q: 'Ist Novara nur für Berufseinsteiger?',
      a: 'Nein. Die Plattform kann für Berufseinsteiger, Quereinsteiger und auch für Menschen mit Erfahrung sinnvoll sein, wenn sie klarer und intelligenter durch den Prozess geführt werden wollen.',
    },
    {
      q: 'Was passiert später noch?',
      a: 'Später kann das System um Dashboard, Interview-Hilfe, stärkere Personalisierung und weitere Karrierefunktionen erweitert werden, ohne dass der klare Einstieg über Nova verloren geht.',
    },
  ]

  return (
    <section id="faq" className="relative z-20 mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="FAQ"
        title="Häufige Fragen"
        text="Dieser Bereich gibt Orientierung, räumt Missverständnisse aus dem Weg und macht das Produktversprechen noch verständlicher."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <Reveal
            key={item.q}
            delay={index * 70}
            from={index % 2 === 0 ? 'left' : 'right'}
          >
            <div className="rounded-[26px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white">{item.q}</h3>
              <p className="mt-3 leading-8 text-white/62">{item.a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FinalCta({ onNavigate }) {
  return (
    <section className="relative z-20 mx-auto max-w-7xl px-6 py-16">
      <Reveal from="bottom">
        <div className="rounded-[40px] border border-[#f2c86a]/18 bg-white/5 p-8 text-center backdrop-blur-md md:p-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#f3d792]">
            Nächster Schritt
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            Starte mit Novara
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/62">
            Beginne mit einer klareren, hochwertigeren und intelligenteren Form
            der Jobsuche — mit Nova als Einstieg statt mit einer endlosen Liste.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-105 hover:bg-white/92">
              Kostenlos starten
            </button>
            <button
              onClick={() => onNavigate('nova')}
              className="rounded-2xl border border-[#f2c86a]/35 bg-[#f2c86a]/8 px-8 py-4 font-semibold text-[#f7df9b] transition hover:bg-[#f2c86a]/14"
            >
              Erst mit Nova sprechen
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer({ onNavigate }) {
  return (
    <footer
      id="footer"
      className="relative z-20 border-t border-white/10 bg-black/25 backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="text-2xl font-semibold tracking-[0.26em] text-white">
            NOVARA
          </div>
          <p className="mt-4 text-sm leading-7 text-white/54">
            KI-gestützte Plattform für moderne Jobsuche, Bewerbung und Karrierehilfe.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white/38">
            Navigation
          </h4>
          <div className="mt-4 space-y-3 text-white/70">
            <button onClick={() => onNavigate('hero')} className="block hover:text-white">
              Start
            </button>
            <button onClick={() => onNavigate('nova')} className="block hover:text-white">
              Nova
            </button>
            <button onClick={() => onNavigate('story')} className="block hover:text-white">
              Story
            </button>
            <button onClick={() => onNavigate('features')} className="block hover:text-white">
              Funktionen
            </button>
            <button onClick={() => onNavigate('reviews')} className="block hover:text-white">
              Bewertungen
            </button>
            <button onClick={() => onNavigate('faq')} className="block hover:text-white">
              FAQ
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white/38">
            Rechtliches
          </h4>
          <div className="mt-4 space-y-3 text-white/70">
            <button className="block hover:text-white">Impressum</button>
            <button className="block hover:text-white">Datenschutz</button>
            <button className="block hover:text-white">AGB</button>
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white/38">
            Account
          </h4>
          <div className="mt-4 space-y-3 text-white/70">
            <button className="block hover:text-white">Login</button>
            <button className="block hover:text-white">Registrierung</button>
            <button className="block hover:text-white">Kontakt</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) section.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <StarBackground />
      <Header onNavigate={scrollToSection} />
      <Hero onNavigate={scrollToSection} />
      <NovaPanel />
      <BrandStatement />
      <StorySection />
      <Features />
      <ProcessSection />
      <StatsSection />
      <ReviewsSection />
      <FaqSection />
      <FinalCta onNavigate={scrollToSection} />
      <Footer onNavigate={scrollToSection} />
    </div>
  )
}