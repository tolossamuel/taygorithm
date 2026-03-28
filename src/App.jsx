import { useEffect, useRef, useState } from 'react'
import projectSaasDashboard from './assets/project-saas-dashboard.png'
import projectCarRental from './assets/project-car-rental.png'
import projectHakimMobile from './assets/project-hakim-mobile.png'
import './App.css'

function NodeGraphBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const nodeCount = 74
    const nodes = []
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 170,
    }

    let width = window.innerWidth
    let height = window.innerHeight
    let animationFrameId = 0

    const setupCanvas = () => {
      const ratio = window.devicePixelRatio || 1

      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * ratio)
      canvas.height = Math.floor(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const spawnNodes = () => {
      nodes.length = 0

      for (let index = 0; index < nodeCount; index += 1) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.7 + 0.6,
        })
      }
    }

    const onMouseMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    const onMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index]

        node.x += node.vx
        node.y += node.vy

        if (node.x <= 0 || node.x >= width) {
          node.vx *= -1
        }

        if (node.y <= 0 || node.y >= height) {
          node.vy *= -1
        }

        const distanceToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y)

        if (distanceToMouse < mouse.radius) {
          const force = (mouse.radius - distanceToMouse) / mouse.radius
          const dx = node.x - mouse.x
          const dy = node.y - mouse.y
          const angle = Math.atan2(dy, dx)

          node.vx += Math.cos(angle) * force * 0.02
          node.vy += Math.sin(angle) * force * 0.02
        }

        node.vx *= 0.985
        node.vy *= 0.985

        context.beginPath()
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        context.fillStyle = 'rgba(0, 225, 171, 0.65)'
        context.fill()
      }

      for (let outerIndex = 0; outerIndex < nodes.length; outerIndex += 1) {
        for (
          let innerIndex = outerIndex + 1;
          innerIndex < nodes.length;
          innerIndex += 1
        ) {
          const nodeA = nodes[outerIndex]
          const nodeB = nodes[innerIndex]
          const dx = nodeA.x - nodeB.x
          const dy = nodeA.y - nodeB.y
          const distance = Math.hypot(dx, dy)

          if (distance < 120) {
            const alpha = (1 - distance / 120) * 0.25
            context.beginPath()
            context.moveTo(nodeA.x, nodeA.y)
            context.lineTo(nodeB.x, nodeB.y)
            context.strokeStyle = `rgba(0, 225, 171, ${alpha})`
            context.lineWidth = 1
            context.stroke()
          }
        }

        const node = nodes[outerIndex]
        const distanceToMouse = Math.hypot(node.x - mouse.x, node.y - mouse.y)

        if (distanceToMouse < 160) {
          const alpha = (1 - distanceToMouse / 160) * 0.35
          context.beginPath()
          context.moveTo(node.x, node.y)
          context.lineTo(mouse.x, mouse.y)
          context.strokeStyle = `rgba(0, 225, 171, ${alpha})`
          context.lineWidth = 1
          context.stroke()
        }
      }

      animationFrameId = window.requestAnimationFrame(draw)
    }

    const onResize = () => {
      setupCanvas()
      spawnNodes()
    }

    setupCanvas()
    spawnNodes()
    draw()

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', onResize)

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="node-graph" aria-hidden="true" />
}

function CursorAuraLayer() {
  const coreRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    const coreElement = coreRef.current
    const trailElement = trailRef.current

    if (!coreElement || !trailElement) {
      return undefined
    }

    const target = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    }

    const core = {
      x: target.x,
      y: target.y,
    }

    const trail = {
      x: target.x,
      y: target.y,
    }

    let frameId = 0

    const onMouseMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    const onMouseLeave = () => {
      target.x = window.innerWidth * 0.5
      target.y = window.innerHeight * 0.5
    }

    const animate = () => {
      core.x += (target.x - core.x) * 0.2
      core.y += (target.y - core.y) * 0.2

      trail.x += (target.x - trail.x) * 0.085
      trail.y += (target.y - trail.y) * 0.085

      coreElement.style.transform = `translate3d(${core.x}px, ${core.y}px, 0)`
      trailElement.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`

      frameId = window.requestAnimationFrame(animate)
    }

    frameId = window.requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="cursor-aura-layer" aria-hidden="true">
      <div ref={trailRef} className="cursor-aura trail" />
      <div ref={coreRef} className="cursor-aura core" />
    </div>
  )
}

function App() {
  const capabilities = [
    {
      id: 'custom-backend',
      title: 'Custom Backend',
      description:
        'Engineered for extreme reliability and horizontal scalability. We build the hidden logic layer powers global enterprises.',
      points: ['MICROSERVICES', 'API ARCHITECTURE'],
      icon: '⌁',
      accent: '#00e1ab',
      detail:
        'Built for complex workflows, custom backend modules handle high-volume requests with stable uptime and clean service boundaries.',
    },
    {
      id: 'data-pipelines',
      title: 'Data Pipelines',
      description:
        'Transforming raw information into actionable signals. Real-time processing and ETL solutions at scale.',
      points: ['STREAM PROCESSING', 'BIG DATA OPS'],
      icon: '⛁',
      accent: '#58b6ff',
      detail:
        'From ingestion to analytics, we design fault-tolerant flows that process data continuously and surface meaningful business insights.',
    },
    {
      id: 'full-stack-saas',
      title: 'Full-Stack SaaS',
      description:
        'End-to-end product engineering from ideation to deployment. High-performance interfaces with modern backend logic.',
      points: ['REACT/NEXT.JS', 'PRODUCT STRATEGY'],
      icon: '◆',
      accent: '#b58dff',
      detail:
        'Product-focused development that balances speed, architecture, and maintainability—so teams can launch fast and scale confidently.',
    },
    {
      id: 'custom-websites',
      title: 'Custom Websites',
      description:
        'High-conversion, custom-built websites with premium motion, fast load performance, and business-first user experience.',
      points: ['UI/UX DESIGN', 'SEO + PERFORMANCE'],
      icon: '◈',
      accent: '#ff9f5a',
      detail:
        'We craft unique brand websites—not templates—with responsive layouts, animation polish, and clear conversion pathways.',
    },
  ]

  const [selectedCapabilityId, setSelectedCapabilityId] = useState(
    capabilities[0].id,
  )

  const selectedCapability =
    capabilities.find((item) => item.id === selectedCapabilityId) ||
    capabilities[0]

  const process = [
    {
      id: '01',
      title: 'DISCOVERY',
      description:
        'Technical audit of your current stack and business bottlenecks.',
    },
    {
      id: '02',
      title: 'PROTOTYPING',
      description: 'Visualizing the logic flow and architectural blueprint.',
    },
    {
      id: '03',
      title: 'ENGINEERING',
      description: 'Sprint-based development with high-frequency deployments.',
    },
    {
      id: '04',
      title: 'SCALE',
      description: 'Launch and continuous optimization of system throughput.',
    },
  ]

  const [activeProcessStep, setActiveProcessStep] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveProcessStep((previous) => (previous + 1) % process.length)
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [process.length])

  const stack = [
    'PYTHON',
    'REACT',
    'TYPESCRIPT',
    'NEXT.JS',
    'FASTAPI',
    'AWS',
    'AZURE',
    'GCP',
    'DOCKER',
    'KUBERNETES',
    'TERRAFORM',
    'NODE.JS',
    'NESTJS',
    'REDIS',
    'RABBITMQ',
    'KAFKA',
    'POSTGRES',
    'MONGODB',
    'ELASTICSEARCH',
    'CI/CD',
    'OBSERVABILITY',
    'SYSTEM DESIGN',
  ]

  const loopingStack = [...stack, ...stack]

  const projects = [
    {
      id: 'saas-dashboard',
      tag: 'CUSTOM WEBSITE • SAAS PLATFORM',
      title: 'Management System Console',
      description:
        'Enterprise-grade dashboard for analytics, workflow control, and operational reporting across cloud infrastructure.',
      metric: '+78% WORKFLOW EFFICIENCY',
      imageSrc: projectSaasDashboard,
      imageAlt:
        'Custom Website SaaS platform management system dashboard interface',
      link: 'https://medi-assist-ai-henna.vercel.app/',
    },
    {
      id: 'car-service-platform',
      tag: 'COMPANY SPECIFIC • CUSTOM WEBSITE',
      title: 'Car Service & Rental Platform',
      description:
        'Conversion-focused company website with service highlights, fleet showcase, and clear booking-ready user journeys.',
      metric: '+64% QUALIFIED LEADS',
      imageSrc: projectCarRental,
      imageAlt:
        'Company specific custom website for car service and rental solutions',
      link: 'https://car-service-jet.vercel.app/',
    },
    {
      id: 'hakim-express-mobile',
      tag: 'MOBILE APPLICATION • FINTECH',
      title: 'Hakim Express',
      description:
        'Mobile-first remittance experience designed for fast, simple, and secure money transfer workflows.',
      metric: 'EASY MONEY TRANSFER',
      imageSrc: projectHakimMobile,
      imageAlt:
        'Hakim Express mobile application for easy remit money transfer',
      mobile: true,
      link: 'https://play.google.com/store/apps/details?id=com.hakimexpresset&pcampaignid=web_share',
    },
  ]

  return (
    <div className="page">
      <NodeGraphBackground />
      <CursorAuraLayer />

      <header className="top-nav wrap">
        <a className="brand" href="#">TAYGORITHM</a>
        <nav className="nav-links" aria-label="Main">
          <a href="#services">SERVICES</a>
          <a href="#roadmap">ROADMAP</a>
          <a href="#projects">PROJECTS</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <button className="btn btn-sm">Connect Terminal</button>
      </header>

      <main>
        <section className="hero-section wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="kicker">● SYSTEM STATUS: OPTIMAL</p>
              <h1>
                Strategic <span>Development</span> &amp; Algorithmic Solutions
              </h1>
              <p className="hero-desc">
                Engineering high-fidelity digital infrastructure. We transform
                complex logic into scalable architecture through precision-led
                software development and data strategy.
              </p>
              <div className="hero-actions">
                <button className="btn">FREE ARCHITECTURE REVIEW</button>
                <button className="btn btn-ghost">VIEW ROADMAP →</button>
              </div>
            </div>

            <aside className="status-terminal" aria-label="System terminal">
              <div className="terminal-head">
                <div className="lights" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p>TERMINAL.LOG</p>
              </div>
              <div className="terminal-body">
                <p>&gt; Initializing core.architecture...</p>
                <p>&gt; Node taxonomy → online.logic</p>
                <p>[SUCCESS] Data pipeline stabilized</p>
                <p>[INFO] Scaling infrastructure to 10k req/s...</p>
                <p>[ANALYSIS] 99.89% efficiency reached</p>
                <div className="terminal-bar">
                  <span />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="services" className="section section-low">
          <div className="wrap">
            <div className="section-head">
              <p className="kicker">CAPABILITIES</p>
              <h2>What We Can Engineer</h2>
              <p>
                Deploying battle-tested technologies to solve non-linear
                business challenges. Precision is our default state.
              </p>
            </div>

            <div className="card-grid">
              {capabilities.map((item) => (
                <article
                  className={`card card-clickable ${selectedCapabilityId === item.id ? 'active' : ''}`}
                  key={item.id}
                  style={{ '--card-accent': item.accent }}
                  onClick={() => setSelectedCapabilityId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      setSelectedCapabilityId(item.id)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedCapabilityId === item.id}
                >
                  <p className="card-icon" aria-hidden="true">
                    {item.icon}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <aside
              className="capability-detail"
              style={{ '--detail-accent': selectedCapability.accent }}
              aria-live="polite"
            >
              <p className="kicker">SELECTED SERVICE</p>
              <h3>{selectedCapability.title}</h3>
              <p>{selectedCapability.detail}</p>
            </aside>
          </div>
        </section>

        <section id="roadmap" className="section process">
          <div className="wrap">
            <p className="kicker center">PROCESS</p>
            <h2 className="center">How Our Partnership Works</h2>

            <div className="road-visual" aria-hidden="true">
              <div className="road-line" />
              <div className="road-points">
                {process.map((step, index) => (
                  <span
                    className={`road-point ${activeProcessStep === index ? 'active' : ''}`}
                    style={{ '--point-index': index }}
                    key={step.id}
                  >
                    {step.id}
                  </span>
                ))}
              </div>

              <div className="car-3d">
                <span className="car-top" />
                <span className="wheel wheel-left" />
                <span className="wheel wheel-right" />
              </div>
            </div>

            <div className="process-grid">
              {process.map((step, index) => (
                <article
                  className={`process-step ${activeProcessStep === index ? 'active' : ''}`}
                  key={step.id}
                >
                  <p className="step-id">{step.id}</p>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section cases section-low">
          <div className="wrap">
            <div className="cases-head">
              <h2>Recent Success Stories</h2>
              <a href="#">ALL WORK</a>
            </div>
            <div className="projects-scroll" role="region" aria-label="Project gallery">
              {projects.map((project) => (
                <article
                  className={`project-card ${project.mobile ? 'project-card-mobile' : ''}`}
                  key={project.id}
                >
                  <a
                    className="project-image-link"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} in a new tab`}
                  >
                    <div
                      className={`case-image-wrap ${project.mobile ? 'case-mobile-image-wrap' : ''}`}
                    >
                      <img
                        className={`case-image ${project.mobile ? 'case-mobile-image' : ''}`}
                        src={project.imageSrc}
                        alt={project.imageAlt}
                        loading="lazy"
                      />
                    </div>
                    <span className="project-review-btn">Review Project ↗</span>
                  </a>

                  <div className="case-content">
                    <p className="tag">{project.tag}</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>

                  <p className="case-metric">{project.metric}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="stack-strip">
          <div className="wrap">
            <p className="kicker center">INTEGRATED TECHNOLOGIES</p>
            <div className="skills-marquee" aria-label="Technology skills">
              <div className="skills-track">
                {loopingStack.map((tech, index) => (
                  <span className="skill-chip" key={`${tech}-${index}`}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="wrap contact-grid">
            <div className="contact-copy">
              <p className="kicker">READY TO DEPLOY?</p>
              <h2>
                Let&apos;s Talk <span>Scale!</span>
              </h2>
              <p>
                Whether you&apos;re starting from zero or optimizing a legacy
                giant, we provide the architectural muscle.
              </p>
              <ul>
                <li>email: admin@taygorithm.com</li>
                <li>area: Silicon Valley / Remote</li>
              </ul>
            </div>

            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <label>
                NAME
                <input type="text" placeholder="John Doe" />
              </label>
              <label>
                COMPANY
                <input type="text" placeholder="Acme Corp" />
              </label>
              <label>
                INFRASTRUCTURE NEEDS
                <select defaultValue="">
                  <option value="" disabled>
                    Backend Architecture
                  </option>
                  <option>Data Pipeline</option>
                  <option>Cloud Migration</option>
                  <option>Product Engineering</option>
                </select>
              </label>
              <label>
                MESSAGE
                <textarea
                  rows="4"
                  placeholder="Describe your technical challenge..."
                />
              </label>
              <button className="btn" type="submit">
                INITIALIZE CONTACT &gt;
              </button>
            </form>
          </div>
        </section>

      </main>

      <footer className="footer wrap">
        <div>
          <p className="brand">TAYGORITHM</p>
          <p>© 2026 TAYGORITHM. LOGIC-FIRST ARCHITECTURE.</p>
        </div>
        <div className="footer-links">
          <a href="#">DOCUMENTATION</a>
          <a href="#">SYSTEMS STATUS</a>
          <a href="#">GITHUB</a>
          <a href="#">PRIVACY</a>
        </div>
      </footer>
    </div>
  )
}

export default App
