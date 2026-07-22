<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'

import galaxiaImg from './assets/img/sol.webp'
import voandoAltoImg from './assets/img/voando-alto.webp'
import lilianeImg from './assets/img/liliane.webp'
import desenvolvimentoImg from './assets/img/warning.webp'
import stocksysLogo from './assets/img/logo-stocksys-white.webp'
import processBgVideoSrc from './assets/video/background-animation.mp4'
import aboutVideoSrc from './assets/video/world.mp4'

const services = [
  {
    title: 'Sistemas Web',
    text: 'ERPs, CRMs, dashboards e plataformas customizadas para automatizar e escalar seu negócio.',
  },
  {
    title: 'Criação de Sites',
    text: 'Landing pages, e-commerces e portais com design forte, performance e conversão.',
  },
  {
    title: 'Consultoria Tech',
    text: 'Arquitetura, escolha de stack e estratégia digital para acelerar seus resultados.',
  },
  {
    title: 'APIs & Integrações',
    text: 'Conectamos seus sistemas com APIs externas, pagamentos, ERPs e muito mais.',
  },
]

const projectFeatures = [
  'Dashboard em tempo real com KPIs de estoque',
  'Controle de entradas, saídas e transferências',
  'Alertas automáticos de reposição de produtos',
  'Relatórios exportáveis em CSV',
  'Multiusuário com controle de permissões',
]

const otherProjects = [
  {
    category: 'Fotografia',
    title: 'Voando Alto',
    text: 'Ensaios, eventos e produções fotográficas.',
    url: 'https://gsstack.com.br/',
    image: voandoAltoImg,
  },
  {
    category: 'Beleza',
    title: 'Liliane | Estética',
    text: 'Serviços, atendimento e presença.',
    url: 'https://gsstack.com.br/',
    image: lilianeImg,
  },
  {
    category: 'Em desenvolvimento',
    title: 'Site-3',
    text: 'Em desenvolvimento',
    url: 'https://gsstack.com.br/',
    image: desenvolvimentoImg,
  },
  {
    category: 'Em desenvolvimento',
    title: 'Site-4',
    text: 'Em desenvolvimento',
    url: 'https://gsstack.com.br/',
    image: desenvolvimentoImg,
  },
]

const steps = [
  ['Briefing', 'Conversa inicial aonde entendemos o seu projeto e objetivos de negócio.'],
  ['Planejamento', 'Arquitetura, design e roadmap detalhado para sua solução.'],
  ['Desenvolvimento', 'Construímos com tecnologia moderna, ágil e escalável.'],
  ['Entrega & Suporte', 'Lançamento com suporte para o sucesso do produto.'],
]

const heroSection = ref(null)
const servicesWrap = ref(null)
const projectSection = ref(null)
const projectFeaturedBlock = ref(null)
const processSection = ref(null)
const processTrackFill = ref(null)
const servicesTrail = ref(null)
const servicesTrailRect = ref(null)
const projectMockup = ref(null)
const heroCanvas = ref(null)
const galaxyBg = ref(null)
const galaxyCanvas = ref(null)
const aboutSection = ref(null)
const aboutVideoEl = ref(null)

const showFloatingButtons = ref(false)

const projectProgress = ref(0)
const boxRotationProgress = ref(0)
const aboutProgress = ref(0)
const processProgress = ref(0)
const processStepVisibility = ref(steps.map(() => false))
const activeProjectFeatureCount = ref(1)
const brandProgress = ref(0)

const galaxyBgStyle = computed(() => ({
  backgroundImage: `url(${galaxiaImg})`,
}))


const galaxyBrandStyle = computed(() => ({
  opacity: String(1 - brandProgress.value),
  filter: `blur(${brandProgress.value * 18}px)`,
  transform: `scale(${1 + brandProgress.value * 0.12})`,
}))

let revealObserver = null
let rafId = 0
let particles = []
let trailParticles = []
let galaxyParticles = []
let galaxyTrailParticles = []
let animationFrameId = 0
let resizeHandler = null
let heroMouseMoveHandler = null
let heroMouseLeaveHandler = null
let galaxyMouseMoveHandler = null

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1)
}

// Scrub de vídeo via scroll: se a gente seta currentTime de novo enquanto
// o navegador ainda está processando o seek anterior, os pedidos ficam
// enfileirados e o vídeo "atrasa" e depois pula pra alcançar o scroll.
// Aqui a gente guarda só o valor mais recente desejado e aplica assim que
// o seek em andamento terminar (evento 'seeked'), então nunca empilha.
const pendingSeekTime = new WeakMap()

function seekVideoTo(videoEl, time) {
  if (!videoEl || !isFinite(videoEl.duration) || videoEl.duration <= 0) return
  if (videoEl.seeking) {
    pendingSeekTime.set(videoEl, time)
    return
  }
  if (Math.abs(videoEl.currentTime - time) < 0.008) return
  videoEl.currentTime = time
}

function handleVideoSeeked(event) {
  const videoEl = event.target
  const pending = pendingSeekTime.get(videoEl)
  if (pending === undefined) return
  pendingSeekTime.delete(videoEl)
  if (Math.abs(videoEl.currentTime - pending) >= 0.008) {
    videoEl.currentTime = pending
  }
}

const processFillStyle = computed(() => ({
  width: `${processProgress.value * 100}%`,
}))

function resizeCanvasTo(canvas, container) {
  if (!canvas || !container) return
  canvas.width = container.offsetWidth
  canvas.height = container.offsetHeight
}

function resizeCanvases() {
  resizeCanvasTo(heroCanvas.value, heroSection.value)
  resizeCanvasTo(galaxyCanvas.value, galaxyBg.value)
}

function createParticles(canvas) {
  if (!canvas) return []
  const count = window.innerWidth < 768 ? 24 : 52
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + 0.4,
    speed: Math.random() * 0.32 + 0.06,
    alpha: Math.random() * 0.48 + 0.08,
  }))
}

function initParticles() {
  particles = createParticles(heroCanvas.value)
  galaxyParticles = createParticles(galaxyCanvas.value)
}

function createTrailPoint(event, container) {
  const rect = container.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    r: Math.random() * 2 + 1.5,
    alpha: 0.9,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.25 + 0.05),
  }
}

// --- Mouse trail (rastro do mouse na hero section) ---
function handleHeroMouseMove(event) {
  const section = heroSection.value
  if (!section) return
  trailParticles.push(createTrailPoint(event, section))
  if (trailParticles.length > 45) {
    trailParticles.shift()
  }
}

function handleHeroMouseLeave() {
  // Trail só desaparece sozinho, nada pra resetar
}

// --- Mouse trail (rastro do mouse na primeira tela, fundo da galáxia) ---
function handleGalaxyMouseMove(event) {
  const bg = galaxyBg.value
  if (!bg) return
  galaxyTrailParticles.push(createTrailPoint(event, bg))
  if (galaxyTrailParticles.length > 45) {
    galaxyTrailParticles.shift()
  }
}

function drawTrail(ctx, trail) {
  if (trail.length < 2) return trail

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(trail[0].x, trail[0].y)
  for (let i = 1; i < trail.length; i += 1) {
    ctx.lineTo(trail[i].x, trail[i].y)
  }
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.28)'
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.stroke()
  ctx.restore()

  trail.forEach((particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.alpha -= 0.02

    const glow = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.r * 5
    )
    glow.addColorStop(0, `rgba(245, 158, 11, ${Math.max(particle.alpha, 0)})`)
    glow.addColorStop(1, 'rgba(245, 158, 11, 0)')

    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.r * 5, 0, Math.PI * 2)
    ctx.fill()
  })

  return trail.filter((particle) => particle.alpha > 0)
}

function drawField(canvas, fieldParticles, trail) {
  if (!canvas) return trail
  const ctx = canvas.getContext('2d')
  if (!ctx) return trail

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#f59e0b'

  fieldParticles.forEach((particle) => {
    particle.y -= particle.speed
    if (particle.y < -12) {
      particle.y = canvas.height + 12
      particle.x = Math.random() * canvas.width
    }

    ctx.globalAlpha = particle.alpha
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.globalAlpha = 1

  return drawTrail(ctx, trail)
}

function drawParticles() {
  trailParticles = drawField(heroCanvas.value, particles, trailParticles)
  galaxyTrailParticles = drawField(galaxyCanvas.value, galaxyParticles, galaxyTrailParticles)

  animationFrameId = window.requestAnimationFrame(drawParticles)
}

function remapProgress(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0
  return clamp01((value - start) / (end - start))
}

function updateScrollState() {
  rafId = 0

  const vh = window.innerHeight
  brandProgress.value = clamp01(window.scrollY / (vh * 0.6))

  const heroEl = heroSection.value
  if (heroEl) {
    showFloatingButtons.value = heroEl.getBoundingClientRect().top < vh
  }

  const projectEl = projectFeaturedBlock.value
  if (projectEl) {
    const rect = projectEl.getBoundingClientRect()
    const progress = clamp01((vh * 0.85 - rect.top) / (rect.height * 0.7))
    projectProgress.value = progress
    activeProjectFeatureCount.value = Math.max(1, Math.round(progress * projectFeatures.length))

    const boxTotal = rect.height + vh
    const boxRaw = boxTotal > 0 ? clamp01((vh - rect.top) / boxTotal) : 0
    boxRotationProgress.value = remapProgress(boxRaw, 0.1, 0.9)
  }

  const aboutEl = aboutSection.value
  if (aboutEl) {
    const rect = aboutEl.getBoundingClientRect()
    const total = rect.height + vh
    const rawProgress = total > 0 ? clamp01((vh - rect.top) / total) : 0
    aboutProgress.value = remapProgress(rawProgress, 0.1, 0.9)

    seekVideoTo(aboutVideoEl.value, aboutProgress.value * (aboutVideoEl.value?.duration || 0))
  }

  const processEl = processSection.value
  if (processEl) {
    const rect = processEl.getBoundingClientRect()
    processProgress.value = clamp01((vh * 0.85 - rect.top) / (vh * 0.65))
    processStepVisibility.value = steps.map((_, index) => (
      processProgress.value >= (index + 0.2) / steps.length
    ))
  }

  const svg = servicesTrail.value
  const rect = servicesTrailRect.value
  const wrap = servicesWrap.value
  if (svg && rect && wrap) {
    const width = wrap.offsetWidth + 28
    const height = wrap.offsetHeight + 28
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    rect.setAttribute('width', Math.max(width - 30, 0))
    rect.setAttribute('height', Math.max(height - 30, 0))
    const perimeter = 2 * (Math.max(width - 30, 0) + Math.max(height - 30, 0))
    const trailProgress = clamp01((window.innerHeight - wrap.getBoundingClientRect().top) / (wrap.offsetHeight + window.innerHeight))
    rect.style.strokeDasharray = String(perimeter)
    rect.style.strokeDashoffset = String(perimeter * (1 - trailProgress))
  }

  const mockup = projectMockup.value
  if (mockup) {
    mockup.style.transform = `rotateY(${14 - projectProgress.value * 14}deg) rotateX(${8 - projectProgress.value * 8}deg) scale(${0.84 + projectProgress.value * 0.16})`
  }

  const fill = processTrackFill.value
  if (fill) {
    fill.style.width = `${processProgress.value * 100}%`
  }
}

function onScroll() {
  if (rafId) return
  rafId = window.requestAnimationFrame(updateScrollState)
}

onMounted(() => {
  resizeCanvases()
  initParticles()
  drawParticles()

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.14 }
  )

  document.querySelectorAll('.scroll-reveal, .heading-rtl').forEach((element) => {
    revealObserver.observe(element)
  })

  updateScrollState()
  resizeHandler = () => {
    resizeCanvases()
    initParticles()
    onScroll()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', resizeHandler)

  heroMouseMoveHandler = handleHeroMouseMove
  heroMouseLeaveHandler = handleHeroMouseLeave
  heroSection.value?.addEventListener('mousemove', heroMouseMoveHandler)
  heroSection.value?.addEventListener('mouseleave', heroMouseLeaveHandler)

  galaxyMouseMoveHandler = handleGalaxyMouseMove
  galaxyBg.value?.addEventListener('mousemove', galaxyMouseMoveHandler)

  // Prime o decoder de vídeo (necessário no iOS Safari pra permitir
  // seek suave via currentTime sem precisar dar play de verdade)
  const aboutVideo = aboutVideoEl.value
  if (aboutVideo) {
    aboutVideo.muted = true
    aboutVideo.addEventListener('seeked', handleVideoSeeked)
    aboutVideo.play().then(() => aboutVideo.pause()).catch(() => { })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (revealObserver) revealObserver.disconnect()
  if (rafId) window.cancelAnimationFrame(rafId)
  if (animationFrameId) window.cancelAnimationFrame(animationFrameId)
  if (heroMouseMoveHandler) heroSection.value?.removeEventListener('mousemove', heroMouseMoveHandler)
  if (heroMouseLeaveHandler) heroSection.value?.removeEventListener('mouseleave', heroMouseLeaveHandler)
  if (galaxyMouseMoveHandler) galaxyBg.value?.removeEventListener('mousemove', galaxyMouseMoveHandler)
  aboutVideoEl.value?.removeEventListener('seeked', handleVideoSeeked)
})
</script>

<template>
  <div class="relative">
    <!-- FUNDO FIXO: a galáxia fica presa atrás de tudo, com "GSSTACK" escrito nela.
         Não tem nenhum JS controlando isso — é 100% CSS (position: fixed). -->
    <div ref="galaxyBg" class="galaxy-fixed-bg" :style="galaxyBgStyle" aria-hidden="true">
      <div class="galaxy-fixed-overlay"></div>
      <canvas ref="galaxyCanvas" class="galaxy-particles" aria-hidden="true"></canvas>
      <div class="galaxy-fixed-brand" :style="galaxyBrandStyle">
        <span>GSSTACK</span>
      </div>
    </div>

    <!-- Reserva uma tela cheia pra imagem aparecer sozinha antes do conteúdo
         começar a "subir" por cima dela -->
    <div class="galaxy-fixed-spacer" aria-hidden="true"></div>

    <!-- CONTEÚDO DO SITE: tem fundo opaco, então conforme o usuário rola,
         ele desliza por cima da imagem fixa e cobre ela. A partir daqui
         tudo funciona normal (sem fundo fixo, sem parallax nenhum). -->
    <div class="site-content relative z-10 min-h-screen">
      <header class="fixed left-0 right-0 top-0 z-50 border-b border-gold-500/10 bg-bg/85 backdrop-blur-xl">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <img src="./assets/img/logo-gs.webp" alt="StockSys" width="140" height="36" class="h-12 lg:h-16 w-auto">
            </div>
            <div>
              <p class="text-sm font-semibold tracking-[0.16em] text-gold-300">GSSTACK</p>
              <p class="text-xs text-white/45">Sistemas &amp; Sites</p>
            </div>
          </a>

          <nav class="hidden items-center gap-8 text-sm text-white/65 md:flex">
            <a href="#servicos" class="transition hover:text-gold-300">Serviços</a>
            <a href="#projetos" class="transition hover:text-gold-300">Projetos</a>
            <a href="#processo" class="transition hover:text-gold-300">Processo</a>
            <a href="#sobre" class="transition hover:text-gold-300">Sobre</a>
            <a href="#contato" class="transition hover:text-gold-300">Contato</a>
          </nav>

          <a href="#contato" class="gold-btn text-sm">Fale Conosco</a>
        </div>
      </header>

      <main class="pt-[88px]">
        <section ref="heroSection"
          class="hero-section scroll-reveal relative flex min-h-[85vh] items-center overflow-hidden px-6 lg:px-20">
          <div class="noise-overlay"></div>
          <div class="scanline"></div>

          <canvas ref="heroCanvas" class="hero-particles" aria-hidden="true"></canvas>

          <div
            class="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(10,10,15,0.97)_35%,rgba(10,10,15,0.55)_100%)]">
          </div>

          <div class="hero-parallax relative z-10 max-w-3xl">
            <span class="gold-pill mb-8">Desenvolvimento digital premium</span>
            <h1 class="text-[clamp(52px,6vw,96px)] font-black leading-[0.94] tracking-[-0.04em] text-white">
              <span class="block">Construímos</span>
              <span
                class="grad-text block bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                Sistemas &amp;
              </span>
              <span class="block">Sites que</span>
              <span
                class="grad-text block bg-gradient-to-r from-white via-gold-200 to-gold-300 bg-clip-text text-transparent">
                Impactam.
              </span>
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-white/60">
              Da ideia ao produto final, criamos soluções digitais sob medida com uma interface escura, elegante e
              cheia de movimento para combinar com a sua marca.
            </p>

            <div class="mt-10 flex flex-wrap gap-4">
              <a href="#projetos" class="gold-btn">Ver Projetos</a>
              <a href="#servicos" class="ghost-btn">Nossos Serviços</a>
            </div>
          </div>

          <div class="absolute bottom-20 right-6 z-10 hidden flex-col gap-4 lg:right-20 md:flex">
            <div class="glass-panel rounded-2xl p-5 text-right">
              <p class="text-4xl font-black leading-none text-gold-300">100%</p>
              <p class="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/40">Entrega no prazo</p>
            </div>
            <div class="glass-panel rounded-2xl p-5 text-right">
              <p class="text-4xl font-black leading-none text-gold-300">24h</p>
              <p class="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/40">Suporte direto</p>
            </div>
            <div class="glass-panel rounded-2xl p-5 text-right">
              <p class="text-4xl font-black leading-none text-gold-300">1:1</p>
              <p class="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/40">Atendimento exclusivo</p>
            </div>
          </div>
        </section>

        <!-- A PARTIR DAQUI o fundo é opaco e cobre a galáxia de vez.
             A hero-section acima fica sem fundo próprio de propósito,
             pra deixar a imagem fixa aparecer atrás dela enquanto sobe. -->
        <div
          class="page-body relative z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.14),_transparent_40%),linear-gradient(180deg,#0a0a0f_0%,#09090d_100%)]">
          <div class="section-divider"></div>

          <section id="servicos" ref="servicesWrap" class="relative overflow-hidden px-6 py-24 lg:px-20">
            <div
              class="absolute -right-20 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.12)_0%,_transparent_68%)]">
            </div>

            <div class="scroll-reveal mx-auto mb-16 max-w-2xl text-center">
              <span class="gold-pill mb-5">O que fazemos</span>
              <h2 class="heading-rtl text-[clamp(36px,4vw,64px)] font-black leading-none tracking-[-0.04em] text-white">
                Soluções digitais de
                <span
                  class="grad-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                  alta performance
                </span>
              </h2>
              <p class="mx-auto mt-5 max-w-xl text-white/55">
                Tecnologia sob medida para negócios que querem crescer sem abrir mão de presença visual.
              </p>
            </div>

            <div class="neon-trail-wrap relative mx-auto max-w-7xl">
              <svg ref="servicesTrail" class="neon-trail-svg" aria-hidden="true">
                <rect ref="servicesTrailRect" x="1" y="1" rx="20" class="services-trail-rect" />
              </svg>

              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <article v-for="service in services" :key="service.title"
                  class="scroll-reveal card-neon relative overflow-hidden p-7">
                  <div
                    class="service-icon-wrap mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gradient-to-br from-gold-500/20 to-gold-700/20">
                    <div class="h-7 w-7 rounded-md bg-gradient-to-br from-gold-300 to-gold-700"></div>
                  </div>
                  <h3 class="text-xl font-black text-white">{{ service.title }}</h3>
                  <p class="mt-3 text-sm leading-7 text-white/55">{{ service.text }}</p>
                  <div class="mt-7 border-t border-gold-500/12 pt-6">
                    <a href="#contato" class="text-sm font-semibold tracking-[0.04em] text-gold-300">
                      Saiba mais
                      <span class="ml-2">→</span>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <div class="section-divider"></div>

          <section id="projetos" ref="projectSection" class="relative overflow-hidden px-6 py-24 lg:px-20">
            <div
              class="absolute -left-24 bottom-0 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,_rgba(245,158,11,0.1)_0%,_transparent_70%)]">
            </div>

            <div class="scroll-reveal mx-auto mb-16 max-w-2xl text-center">
              <span class="gold-pill mb-5">Projeto em destaque</span>
              <h2 class="heading-rtl text-[clamp(36px,4vw,64px)] font-black leading-none tracking-[-0.04em] text-white">
                Conheça o
                <span
                  class="grad-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">StockSys</span>
              </h2>
              <p class="mx-auto mt-5 max-w-xl text-white/55">
                Nosso sistema de estoque inteligente, reimaginado como uma peça viva no site.
              </p>
            </div>

            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div class="scroll-reveal relative">
                <div class="stocksys-mockup-wrap">
                  <div ref="projectMockup" class="stocksys-mockup">
                    <div
                      class="overflow-hidden rounded-[24px] border border-gold-500/25 bg-surface2 shadow-[0_0_60px_rgba(217,119,6,0.2),0_8px_32px_rgba(0,0,0,0.8)]">
                      <div class="relative h-[380px]">
                        <div
                          class="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)]">
                        </div>
                        <div
                          class="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent">
                        </div>

                        <div class="absolute left-6 top-5 rounded-full border border-gold-500/30 bg-black/55 px-3 py-1">
                          <span class="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/75">
                            <span class="h-2 w-2 animate-pulse rounded-full bg-gold-400"></span>
                            Ao vivo
                          </span>
                        </div>

                        <div class="absolute right-6 top-5">
                          <img :src="stocksysLogo" alt="StockSys" class="h-8 w-auto">
                        </div>

                        <div class="absolute left-6 top-16 right-6 grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                          <div class="rounded-[18px] border border-white/10 bg-black/35 p-4">
                            <div class="flex items-start justify-between gap-4">
                              <h3 class="text-lg font-black leading-snug text-white">
                                Um sistema completo para gerenciar o estoque de qualquer empresa
                              </h3>
                              <div class="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-gold-400 shadow-[0_0_18px_rgba(245,158,11,0.9)]">
                              </div>
                            </div>

                            <div
                              class="mt-5 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-gold-500/20 bg-black/35 p-4"
                              style="perspective: 500px" aria-hidden="true">
                              <div class="spin-box"
                                :style="{ transform: `rotateX(-20deg) rotateY(${boxRotationProgress * 360}deg)` }">
                                <div class="spin-box-face spin-box-front" />
                                <div class="spin-box-face spin-box-back" />
                                <div class="spin-box-face spin-box-right" />
                                <div class="spin-box-face spin-box-left" />
                                <div class="spin-box-face spin-box-top" />
                                <div class="spin-box-face spin-box-bottom" />
                              </div>
                            </div>
                          </div>

                          <div class="flex flex-col justify-center rounded-[18px] border border-white/10 bg-black/35 p-4">
                            <p class="mb-4 text-[11px] uppercase tracking-[0.2em] text-white/40">Fluxo simples</p>
                            <div class="space-y-4 border-l border-gold-500/25 pl-4">
                              <div class="relative">
                                <span
                                  class="absolute -left-[18px] top-1 h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
                                <p class="text-sm font-semibold text-white">Produtos</p>
                              </div>
                              <div class="relative">
                                <span class="absolute -left-[18px] top-1 h-2 w-2 rounded-full bg-gold-400/70"></span>
                                <p class="text-sm font-semibold text-white/75">Clientes</p>
                              </div>
                              <div class="relative">
                                <span class="absolute -left-[18px] top-1 h-2 w-2 rounded-full bg-gold-400/50"></span>
                                <p class="text-sm font-semibold text-white/60">Pedidos</p>
                              </div>

                            </div>
                            <p class="mt-4 pl-4 text-[11px] text-white/40">e muito mais</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div ref="projectFeaturedBlock" class="scroll-reveal">
                <div class="mb-8 flex items-center gap-4">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 font-black text-white">
                    SS
                  </div>
                  <div>
                    <h3 class="text-2xl font-black text-white">StockSys</h3>
                    <p class="text-[11px] uppercase tracking-[0.2em] text-white/35">Sistema de Estoque</p>
                  </div>
                </div>

                <p class="max-w-xl text-base leading-8 text-white/65">
                  Um sistema completo para gerenciar entradas, saídas, fornecedores e relatórios, com interface
                  intuitiva
                  e animações que fazem a apresentação parecer um produto real.
                </p>

                <div class="mt-8 flex flex-col gap-4">
                  <div v-for="(feature, index) in projectFeatures" :key="feature"
                    class="feature-item flex items-center gap-3"
                    :class="{ 'is-active': index < activeProjectFeatureCount }">
                    <div class="feature-dot h-2.5 w-2.5 rounded-full bg-gradient-to-br from-gold-300 to-gold-700"></div>
                    <span class="text-sm text-white/80">{{ feature }}</span>
                  </div>
                </div>

                <div class="mt-8 flex flex-wrap gap-2">
                  <span
                    class="rounded-md border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">Laravel</span>
                  <span
                    class="rounded-md border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">Vue</span>
                  <span
                    class="rounded-md border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">Tailwind</span>
                  <span
                    class="rounded-md border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">MySQL</span>
                  <span
                    class="rounded-md border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-xs font-semibold text-gold-200">REST
                    API</span>
                </div>

                <a href="https://stocksys.gsstack.com.br/landingCheckout" target="_blank" rel="noopener noreferrer"
                  class="gold-btn mt-8">
                  Conhecer o StockSys
                  <span class="ml-2">→</span>
                </a>
              </div>
            </div>

            <div class="scroll-reveal mx-auto mt-20 mb-12 max-w-2xl text-center">
              <span class="gold-pill mb-5">Mais projetos</span>
              <h3 class="text-[clamp(28px,3vw,40px)] font-black leading-none tracking-[-0.03em] text-white">
                Outros trabalhos
                <span
                  class="grad-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                  que entregamos
                </span>
              </h3>
            </div>

            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <article v-for="project in otherProjects" :key="project.title"
                class="scroll-reveal card-neon group flex flex-col overflow-hidden rounded-[20px]">
                <div class="relative h-36 overflow-hidden bg-cover bg-center"
                  :style="{ backgroundImage: `url(${project.image})` }">
                  <div
                    class="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.35)_0%,rgba(10,10,15,0.85)_100%)]">
                  </div>
                  <div class="absolute left-4 top-4 flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-white/25"></span>
                    <span class="h-2 w-2 rounded-full bg-white/25"></span>
                    <span class="h-2 w-2 rounded-full bg-white/25"></span>
                  </div>
                  <div
                    class="absolute inset-x-4 bottom-4 flex h-9 items-center rounded-lg border border-white/10 bg-black/30 px-3 text-[11px] font-black uppercase tracking-[0.1em] text-gold-200 transition duration-300 group-hover:border-gold-400/40">
                    {{ project.title }}
                  </div>
                </div>

                <div class="flex flex-1 flex-col p-6">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">{{ project.category }}
                  </p>
                  <h4 class="mt-2 text-lg font-black text-white">{{ project.title }}</h4>
                  <p class="mt-2 flex-1 text-sm leading-6 text-white/55">{{ project.text }}</p>
                  <a :href="project.url" target="_blank" rel="noopener noreferrer"
                    class="ghost-btn mt-6 w-full text-sm">
                    Visitar Site
                  </a>
                </div>
              </article>
            </div>
          </section>

          <div class="section-divider"></div>

          <section id="processo" ref="processSection" class="relative overflow-hidden bg-surface px-6 py-24 lg:px-20">
            <video :src="processBgVideoSrc" autoplay muted loop playsinline
              class="absolute inset-0 h-full w-full object-cover"></video>
            <div class="absolute inset-0 ">
            </div>

            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent">
            </div>
            <div
              class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent">
            </div>

            <div class="scroll-reveal relative z-10 mx-auto mb-16 max-w-2xl text-center">
              <span class="gold-pill mb-5">Como trabalhamos</span>
              <h2
                class="heading-rtl text-[clamp(32px,3.5vw,56px)] font-black leading-[1.03] tracking-[-0.04em] text-white">
                Processo simples,
                <span
                  class="grad-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                  resultado extraordinário
                </span>
              </h2>
            </div>

            <div class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div class="process-track hidden lg:block">
                <div ref="processTrackFill" class="process-track-fill" :style="processFillStyle"></div>
              </div>

              <article v-for="(step, index) in steps" :key="step[0]"
                class="process-step rounded-[24px] border border-white/10 bg-black/35 p-6 text-center backdrop-blur-xl"
                :class="{
                  active: processProgress >= (index + 0.5) / steps.length,
                  'is-visible': processStepVisibility[index],
                }">
                <div class="step-content">
                  <div
                    class="step-number mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-[1.5rem] font-black text-white shadow-[0_0_30px_rgba(245,158,11,0.35)]">
                    {{ String(index + 1).padStart(2, '0') }}
                  </div>
                  <h3 class="mt-6 text-[1.1rem] font-black text-white">{{ step[0] }}</h3>
                  <p class="mt-3 text-sm leading-7 text-white/50">{{ step[1] }}</p>
                </div>
              </article>
            </div>
          </section>

          <div class="section-divider"></div>

          <section id="sobre" ref="aboutSection" class="relative overflow-hidden px-6 py-24 lg:px-20">
            <div class="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
              <div class="scroll-reveal relative">
                <div
                  class="relative mx-auto max-w-[300px] overflow-hidden rounded-[24px] border border-gold-500/20 shadow-[0_0_48px_rgba(217,119,6,0.16)]">
                  <video ref="aboutVideoEl" :src="aboutVideoSrc" muted playsinline preload="auto"
                    class="aspect-[9/16] h-auto w-full object-cover"></video>
                  <div
                    class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(10,10,15,0.6)_100%)]">
                  </div>
                </div>
                <div
                  class="absolute bottom-0 left-[-16px] top-10 w-[3px] rounded-full bg-gradient-to-b from-transparent via-gold-400 to-transparent">
                </div>
              </div>

              <div class="scroll-reveal">
                <span class="gold-pill mb-7">Sobre a GSSTACK</span>
                <h2
                  class="heading-rtl text-[clamp(32px,3.5vw,52px)] font-black leading-[1.05] tracking-[-0.04em] text-white">
                  Tecnologia que
                  <span
                    class="grad-text block bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                    transforma negócios
                  </span>
                </h2>
                <p class="mt-6 text-base leading-8 text-white/60">
                  Somos uma empresa apaixonada por resolver problemas reais com tecnologia. Nascemos para ser o parceiro
                  tech que o seu negócio precisa, com entregas claras e visual forte.
                </p>
                <p class="mt-4 text-base leading-8 text-white/60">
                  Cada projeto é tratado como único, com foco em código limpo, experiência refinada e uma identidade
                  visual que conversa com a marca.
                </p>

                <div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3">
                  <div>
                    <p class="text-[2.25rem] font-black leading-none text-gold-300">3+</p>
                    <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">Anos de experiência</p>
                  </div>
                  <div>
                    <p class="text-[2.25rem] font-black leading-none text-gold-300">IA</p>
                    <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">Automações inteligentes</p>
                  </div>
                  <div>
                    <p class="text-[2.25rem] font-black leading-none text-gold-300">∞</p>
                    <p class="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/40">Possibilidades</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="section-divider"></div>

          <section id="contato" class="relative overflow-hidden px-6 py-28 text-center lg:px-20">
            <div
              class="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(245,158,11,0.15)_0%,transparent_72%)]">
            </div>

            <div class="scroll-reveal relative mx-auto max-w-3xl">
              <span class="gold-pill mb-7">Vamos conversar</span>
              <h2
                class="heading-rtl text-[clamp(40px,5vw,80px)] font-black leading-[0.95] tracking-[-0.04em] text-white">
                Pronto para
                <span
                  class="grad-text block bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 bg-clip-text text-transparent">
                  dar o próximo
                </span>
                passo?
              </h2>
              <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/55">
                Fale com a nossa equipe e descubra como podemos transformar a sua ideia em um produto digital com
                presença.
              </p>

              <div class="mt-10 flex flex-wrap justify-center gap-4">
                <a href="mailto:contato@gsstack.com.br" class="gold-btn px-10 py-4 text-base">Iniciar Projeto</a>
                <a href="https://wa.me/55" class="ghost-btn px-10 py-4 text-base">WhatsApp</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer class="border-t border-gold-500/10 bg-surface px-6 py-12 lg:px-20">
        <div class="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div class="mb-4 flex items-center gap-3">
              <div class="flex-shrink-0">
                <img src="./assets/img/logo-gs.webp" alt="StockSys" width="140" height="36" class="h-8 lg:h-9 w-auto">
              </div>
              <span class="text-base font-black tracking-[-0.03em] text-white">GSSTACK</span>
            </div>
            <p class="max-w-sm text-sm leading-7 text-white/35">
              Criamos sistemas e sites que transformam negócios com tecnologia moderna e design de impacto.
            </p>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Serviços</p>
            <div class="space-y-2 text-sm text-white/50">
              <a href="#servicos" class="block transition hover:text-gold-300">Sistemas Web</a>
              <a href="#servicos" class="block transition hover:text-gold-300">Criação de Sites</a>
              <a href="#servicos" class="block transition hover:text-gold-300">Consultoria Tech</a>
              <a href="#servicos" class="block transition hover:text-gold-300">APIs &amp; Integrações</a>
            </div>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Empresa</p>
            <div class="space-y-2 text-sm text-white/50">
              <a href="#sobre" class="block transition hover:text-gold-300">Sobre nós</a>
              <a href="#projetos" class="block transition hover:text-gold-300">Projetos</a>
              <a href="#contato" class="block transition hover:text-gold-300">Contato</a>
            </div>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Contato</p>
            <div class="space-y-2 text-sm text-white/50">
              <a href="mailto:contato@gsstack.com.br"
                class="block transition hover:text-gold-300">contato@gsstack.com.br</a>
              <a href="https://wa.me/55" class="block transition hover:text-gold-300">WhatsApp</a>
            </div>
          </div>
        </div>

        <div
          class="mx-auto mt-10 flex max-w-7xl flex-col items-center gap-2 border-t border-gold-500/10 pt-6 text-xs text-white/25 sm:flex-row sm:justify-between sm:gap-0">
          <span>© 2026 GSSTACK™. Todos os direitos reservados.</span>
        </div>
      </footer>
    </div>

    <!-- Botões flutuantes de contato: fixos, ocultos até a hero section entrar em tela -->
    <a href="https://www.instagram.com/gs_stack/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
      class="fixed bottom-6 left-6 z-50 transition-all duration-300 hover:scale-110"
      :class="showFloatingButtons ? 'opacity-100' : 'pointer-events-none opacity-0'">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] shadow-lg md:h-11 md:w-11">
        <svg viewBox="0 0 24 24" class="h-6 w-6 text-white" fill="currentColor" aria-hidden="true">
          <path
            d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.6.23 1.03.5 1.48.95.45.45.72.88.95 1.48.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4 4 0 0 1-.95 1.48 4 4 0 0 1-1.48.95c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4 4 0 0 1-1.48-.95 4 4 0 0 1-.95-1.48c-.16-.46-.35-1.26-.4-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.23-.6.5-1.03.95-1.48.45-.45.88-.72 1.48-.95.46-.16 1.26-.35 2.43-.4C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.73.07-1 .05-1.54.21-1.9.35-.48.18-.82.4-1.18.76-.36.36-.58.7-.76 1.18-.14.36-.3.9-.35 1.9-.06 1.23-.07 1.59-.07 4.73s.01 3.5.07 4.73c.05 1 .21 1.54.35 1.9.18.48.4.82.76 1.18.36.36.7.58 1.18.76.36.14.9.3 1.9.35 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c1-.05 1.54-.21 1.9-.35.48-.18.82-.4 1.18-.76.36-.36.58-.7.76-1.18.14-.36.3-.9.35-1.9.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.73c-.05-1-.21-1.54-.35-1.9a3.17 3.17 0 0 0-.76-1.18 3.17 3.17 0 0 0-1.18-.76c-.36-.14-.9-.3-1.9-.35-1.23-.06-1.59-.07-4.73-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-1.99a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z" />
        </svg>
      </div>
    </a>

    <a href="https://wa.me/5511989872665" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      class="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110"
      :class="showFloatingButtons ? 'opacity-100' : 'pointer-events-none opacity-0'">
      <div class="relative flex h-10 w-10 items-center justify-center md:h-11 md:w-11">
        <div class="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-20"></div>
        <div class="relative flex h-full w-full items-center justify-center rounded-full bg-[#25D366] shadow-lg">
          <svg viewBox="0 0 24 24" class="h-6 w-6 text-white" fill="currentColor" aria-hidden="true">
            <path
              d="M12.04 2.02c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5l-1.42 5.19 5.32-1.4a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96s-4.47-9.99-9.97-9.99Zm0 18.22h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.16.83.84-3.08-.2-.32a8.23 8.23 0 0 1-1.27-4.36c0-4.55 3.7-8.25 8.3-8.25 2.22 0 4.3.87 5.87 2.44a8.2 8.2 0 0 1 2.43 5.83c0 4.55-3.71 8.24-8.3 8.24Zm4.53-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.9 2.42 1.02 2.58c.12.17 1.77 2.7 4.28 3.79.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
          </svg>
        </div>
      </div>
    </a>

    <svg width="0" height="0" style="position: absolute; overflow: hidden">
      <defs>
        <linearGradient id="stockChartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
/* Texto com gradiente (bg-clip-text) só pinta a área da line-box: em
   títulos com leading apertado (leading-none, 0.94 etc) o gradiente corta
   antes do fim da descendente de letras como g/p/j/q/y, que "somem" contra
   o fundo escuro. Um respiro embaixo resolve sem afetar o line-height do
   título como um todo. */
.grad-text {
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
  line-height: 1.15;
}

/* === FUNDO FIXO DA GALÁXIA === */
.galaxy-fixed-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.galaxy-fixed-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.25) 0%, rgba(10, 10, 15, 0.65) 100%);
}

.galaxy-fixed-brand {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.galaxy-fixed-brand span {
  font-size: clamp(48px, 9vw, 160px);
  font-weight: 800;
  letter-spacing: 0.02em;
  background: linear-gradient(180deg, #fff4d6 0%, #f59e0b 45%, #b45309 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px rgba(245, 158, 11, 0.55));
}

/* reserva a tela cheia pra imagem aparecer sozinha antes do
   conteúdo começar a cobrir ela */
.galaxy-fixed-spacer {
  height: 100vh;
}

/* o conteúdo do site tem z-index e fundo opaco, então conforme
   ele é rolado pra cima, cobre a imagem fixa que está atrás */
.site-content {
  isolation: isolate;
}

/*
  Reveal-on-scroll for headings: starts off-screen to the right and slides
  into place. Uses the same IntersectionObserver as .scroll-reveal (see
  <script setup>), it just needed its own transform so it doesn't conflict
  with whatever .scroll-reveal already does globally in the project.
*/
.heading-rtl {
  opacity: 0;
  transform: translateX(72px);
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.heading-rtl.is-visible {
  opacity: 1;
  transform: translateX(0);
}

/* fade-in simples de entrada pro conteúdo das sections (inclui a hero) —
   aparece uma vez quando entra na tela e fica, sem sumir de novo ao rolar */
.scroll-reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {

  .heading-rtl,
  .scroll-reveal {
    transition: none;
    transform: none;
    opacity: 1;
  }
}

/* Animações baseadas no scroll para os cards de processo */
.process-step {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.process-step.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.process-step:nth-child(2) {
  transition-delay: 0.1s;
}

.process-step:nth-child(3) {
  transition-delay: 0.2s;
}

.process-step:nth-child(4) {
  transition-delay: 0.3s;
}

.process-step .step-content {
  filter: blur(4px);
  transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.process-step.is-visible .step-content {
  filter: blur(0px);
}

.process-step .step-number {
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.process-step.is-visible .step-number {
  transform: rotate(0deg);
}

.process-step .step-number {
  transform: rotate(-30deg) scale(0.8);
}
</style>