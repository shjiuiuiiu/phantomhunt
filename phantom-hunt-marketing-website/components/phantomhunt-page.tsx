"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Github,
  Play,
  Shield,
  Zap,
  Code2,
  Database,
  Lock,
  Globe2,
  Terminal,
  Download,
  CheckCircle2,
} from "lucide-react"
import { SnakeLogo } from "./snake-logo"

type Language = "en" | "ar"

export default function PhantomHuntPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isRetroMode, setIsRetroMode] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [terminalTheme, setTerminalTheme] = useState<"green" | "amber">("green")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroTextRef = useRef<HTMLHeadingElement>(null)

  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [usernameBuffer, setUsernameBuffer] = useState<string[]>([])
  const [filters, setFilters] = useState({ minYear: "", maxYear: "", minLen: "", maxLen: "", regex: "" })
  const [filterStep, setFilterStep] = useState(0)
  const [checkingPhase, setCheckingPhase] = useState<"idle" | "filtering" | "checking">("idle")
  const terminalScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for retro mode
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      setIsRetroMode(params.get("mode") === "retro")
    }

    // ASCII rain effect
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ01"
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = isRetroMode ? "#00ff00" : "#00f3ff"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => clearInterval(interval)
  }, [isRetroMode])

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
    }
  }, [terminalLines])

  useEffect(() => {
    const welcome =
      language === "en"
        ? [
            "   PhantomHunt",
            "   Silent. Vintage. Unseen.",
            "",
            "   ═════════════════════════════════",
            "      1 - List 2011",
            "      2 - List 2012",
            "      3 - List 2013",
            "      4 - List 2014–2023",
            "      5 - Delete username.txt",
            "      6 - List from user   [DISABLED in demo]",
            "",
            "      0 - Check list",
            "   ═════════════════════════════════",
            "",
          ]
        : [
            "   PhantomHunt",
            "   صامت. قديم. غير مرئي.",
            "",
            "   ═════════════════════════════════",
            "      ١ - قائمة ٢٠١١",
            "      ٢ - قائمة ٢٠١٢",
            "      ٣ - قائمة ٢٠١٢",
            "      ٤ - قائمة ٢٠١٤–٢٠٢٣",
            "      ٢ - حذف username.txt",
            "      ٢ - قائمة من المستخدم   [معطّل في العرض]",
            "",
            "      ٠ - فحص القائمة",
            "   ═════════════════════════════════",
            "",
          ]
    setTerminalLines(welcome)
    setCheckingPhase("idle")
  }, [language])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const typeLines = async (lines: string[], delay = 50) => {
    setIsTyping(true)
    for (const line of lines) {
      await new Promise((resolve) => setTimeout(resolve, delay))
      setTerminalLines((prev) => [...prev, line])
    }
    setIsTyping(false)
  }

  const simulateGeneration = async (year: string) => {
    const isArabic = language === "ar"
    const count = Math.floor(Math.random() * 1000) + 500
    const unique = Math.floor(count * 0.7)

    await typeLines([isArabic ? `تم الإنشاء: ${count} اسم مستخدم` : `Generated: ${count} usernames`, ""], 30)

    await typeLines([isArabic ? `✅ تم. حفظ ${unique} أسماء فريدة.` : `✅ Done. Saved ${unique} unique names.`, ""], 50)

    await new Promise((resolve) => setTimeout(resolve, 800))
    startFilteringPhase()
  }

  const startFilteringPhase = async () => {
    const isArabic = language === "ar"
    const prompts = isArabic
      ? [
          "الحد الأدنى للسنة [تخطي]: ",
          "الحد الأقصى للسنة [تخطي]: ",
          "الحد الأدنى للطول [تخطي]: ",
          "الحد الأقصى للطول [تخطي]: ",
          "Regex [تخطي]: ",
        ]
      : ["Min year [skip]: ", "Max year [skip]: ", "Min len [skip]: ", "Max len [skip]: ", "Regex [skip]: "]

    setCheckingPhase("filtering")
    setFilterStep(0)

    // Start with first prompt
    setTerminalLines((prev) => [...prev, prompts[0]])
  }

  const simulateFiltering = async () => {
    const isArabic = language === "ar"
    setCheckingPhase("filtering")

    await typeLines([isArabic ? "║ بدء الفحص... (Ctrl+C للإيقاف) ║" : "║ STARTING CHECK... (Ctrl+C to stop) ║", ""], 50)

    setTerminalLines((prev) => [...prev, ""])

    // Simulate checking progress
    let hits = 0,
      badIG = 0,
      badHot = 0,
      goodIG = 0

    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200))

      const rand = Math.random()
      if (rand < 0.2) hits++
      else if (rand < 0.6) badIG++
      else if (rand < 0.75) badHot++
      else goodIG++

      setTerminalLines((prev) => {
        const newLines = [...prev]
        newLines[newLines.length - 1] = isArabic
          ? `║ نتائج: ${hits} │ IG سيء: ${badIG} │ Hot سيء: ${badHot} │ IG جيد: ${goodIG} ║`
          : `║ Hits: ${hits} │ BadIG: ${badIG} │ BadHot: ${badHot} │ GoodIG: ${goodIG} ║`
        return newLines
      })
    }

    await typeLines(["", isArabic ? "✅ اكتمل PhantomHunt." : "✅ PhantomHunt completed.", ""], 50)
    setCheckingPhase("idle")
  }

  const simulateChecking = async () => {
    const isArabic = language === "ar"
    setCheckingPhase("checking")

    await typeLines([isArabic ? "║ بدء الفحص... (Ctrl+C للإيقاف) ║" : "║ STARTING CHECK... (Ctrl+C to stop) ║", ""], 50)

    setTerminalLines((prev) => [...prev, ""])

    // Simulate checking progress
    let hits = 0,
      badIG = 0,
      badHot = 0,
      goodIG = 0

    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200))

      const rand = Math.random()
      if (rand < 0.2) hits++
      else if (rand < 0.6) badIG++
      else if (rand < 0.75) badHot++
      else goodIG++

      setTerminalLines((prev) => {
        const newLines = [...prev]
        newLines[newLines.length - 1] = isArabic
          ? `║ نتائج: ${hits} │ IG سيء: ${badIG} │ Hot سيء: ${badHot} │ IG جيد: ${goodIG} ║`
          : `║ Hits: ${hits} │ BadIG: ${badIG} │ BadHot: ${badHot} │ GoodIG: ${goodIG} ║`
        return newLines
      })
    }

    await typeLines(["", isArabic ? "✅ اكتمل PhantomHunt." : "✅ PhantomHunt completed.", ""], 50)
    setCheckingPhase("idle")
  }

  const handleTerminalInput = async (input: string) => {
    if (isTyping) return

    const trimmed = input.trim()

    // Handle filtering phase
    if (checkingPhase === "filtering") {
      const prompts =
        language === "ar"
          ? [
              "الحد الأدنى للسنة [تخطي]: ",
              "الحد الأقصى للسنة [تخطي]: ",
              "الحد الأدنى للطول [تخطي]: ",
              "الحد الأقصى للطول [تخطي]: ",
              "Regex [تخطي]: ",
            ]
          : ["Min year [skip]: ", "Max year [skip]: ", "Min len [skip]: ", "Max len [skip]: ", "Regex [skip]: "]

      setTerminalLines((prev) => [...prev.slice(0, -1), prev[prev.length - 1] + trimmed])
      setUserInput("")

      if (filterStep < 4) {
        // Move to next filter prompt
        setFilterStep(filterStep + 1)
        setTerminalLines((prev) => [...prev, prompts[filterStep + 1]])
      } else {
        // All filters entered, show confirmation and start checking
        setTerminalLines((prev) => [...prev, "✅ Filters applied", ""])
        setCheckingPhase("idle")
        await new Promise((resolve) => setTimeout(resolve, 500))
        await simulateChecking()
      }
      return
    }

    // Add user input to terminal
    setTerminalLines((prev) => [...prev, `> ${trimmed}`, ""])
    setUserInput("")

    // Handle commands
    if (trimmed === "1" || trimmed === "٢") {
      await simulateGeneration("2011")
    } else if (trimmed === "2" || trimmed === "٢") {
      await simulateGeneration("2012")
    } else if (trimmed === "3" || trimmed === "٢") {
      await simulateGeneration("2013")
    } else if (trimmed === "4" || trimmed === "٤") {
      await simulateGeneration("2014")
    } else if (trimmed === "5" || trimmed === "٢") {
      setUsernameBuffer([])
      await typeLines([language === "ar" ? "✅ تم حذف username.txt" : "✅ Deleted username.txt", ""], 50)
      showTerminalMenu()
    } else if (trimmed === "6" || trimmed === "٢") {
      await typeLines([language === "ar" ? "⚠️ معطل في العرض التوضيحي" : "⚠️ DISABLED in demo", ""], 50)
      showTerminalMenu()
    } else {
      await typeLines([language === "ar" ? "❌ أمر غير صالح" : "❌ Invalid command", ""], 50)
      showTerminalMenu()
    }
  }

  const showTerminalMenu = () => {
    const welcome =
      language === "en"
        ? [
            "   PhantomHunt",
            "   Silent. Vintage. Unseen.",
            "",
            "   ═════════════════════════════════",
            "      1 - List 2011",
            "      2 - List 2012",
            "      3 - List 2013",
            "      4 - List 2014–2023",
            "      5 - Delete username.txt",
            "      6 - List from user   [DISABLED in demo]",
            "",
            "      0 - Check list",
            "   ═════════════════════════════════",
            "",
          ]
        : [
            "   PhantomHunt",
            "   صامت. قديم. غير مرئي.",
            "",
            "   ═════════════════════════════════",
            "      ١ - قائمة ٢٠١١",
            "      ٢ - قائمة ٢٠١٢",
            "      ٣ - قائمة ٢٠١٢",
            "      ٤ - قائمة ٢٠١٤–٢٠٢٣",
            "      ٢ - حذف username.txt",
            "      ٢ - قائمة من المستخدم   [معطّل في العرض]",
            "",
            "      ٠ - فحص القائمة",
            "   ═════════════════════════════════",
            "",
          ]
    setTerminalLines(welcome)
    setCheckingPhase("idle")
  }

  const features = [
    {
      icon: "⚡",
      titleEn: "Smart Generation",
      titleAr: "التوليد الذكي",
      descriptionEn: "Generate vintage Instagram handles using year-based seeds (2011-2023)",
      descriptionAr: "توليد أسماء مستخدمين عتيقة باستخدام بذور سنوية (2011-2023)",
    },
    {
      icon: "🔍",
      titleEn: "Live Availability Check",
      titleAr: "فحص التوافر المباشر",
      descriptionEn: "Real-time verification via Instagram & HotMail with rate-limit handling",
      descriptionAr: "التحقق في الوقت الفعلي عبر Instagram و HotMail مع معالجة حد المعدل",
    },
    {
      icon: "⚙️",
      titleEn: "Advanced Filters",
      titleAr: "الفلاتر المتقدمة",
      descriptionEn: "Filter by year, length, regex patterns, and custom character sets",
      descriptionAr: "الفلترة حسب السنة والطول وأنماط regex ومجموعات الأحرف المخصصة",
    },
    {
      icon: "🌐",
      titleEn: "Bilingual Interface",
      titleAr: "واجهة ثنائية اللغة",
      descriptionEn: "Full English/Arabic support with RTL layout switching",
      descriptionAr: "دعم كامل للغة الإنجليزية/العربية مع تبديل تخطيط RTL",
    },
    {
      icon: "⚠️",
      titleEn: "Ethical Warnings",
      titleAr: "تحذيرات أخلاقية",
      descriptionEn: "Built-in reminders for responsible usage and legal compliance",
      descriptionAr: "تذكيرات مدمجة للاستخدام المسؤول والامتثال القانوني",
    },
    {
      icon: "💾",
      titleEn: "Export Options",
      titleAr: "خيارات التصدير",
      descriptionEn: "Save results to username.txt with duplicate filtering",
      descriptionAr: "حفظ النتائج إلى username.txt مع فلترة التكرارات",
    },
  ]

  const t = {
    en: {
      hero: "Silent. Vintage. Unseen.",
      tagline: "A terminal-first Instagram reconnaissance engine for the invisible operator.",
      watchDemo: "Watch Demo (60s)",
      download: "Download v1.4.2",
      features: "Features",
      demo: "Interactive Demo",
      install: "Installation",
      docs: "Docs",
      warningTitle: "Use ethically.",
      warningText: "Respect robots.txt. Do not harass. For research only.",
      ethicalBanner:
        "This is a simulation only. No requests are sent to Instagram or Microsoft. PhantomHunt is a local username-pattern analysis tool — no real data is retrieved in this demo.",
      themeLabel: "Theme:",
      langLabel: "Language:",
      footer: "© 2026 Phantomhunt Labs | For research only",
    },
    ar: {
      hero: "صامت. قديم. غير مرئي.",
      tagline: "محرك استطلاع إنستغرام عبر سطر الأوامر للعميل الخفي.",
      watchDemo: "شاهد العرض (60 ثانية)",
      download: "تحميل v1.4.2",
      features: "المميزات",
      demo: "عرض تفاعلي",
      install: "التثبيت",
      docs: "التوثيق",
      warningTitle: "استخدم بأخلاقية.",
      warningText: "احترم robots.txt. لا تتحرش. للبحث فقط.",
      ethicalBanner:
        "هذه واجهة محاكاة فقط. لا يتم إرسال أي طلبات إلى إنستغرام أو مايكروسوفت. PhantomHunt أداة محلية لتحليل أنماط أسماء المستخدمين — ولا تجلب أي بيانات حقيقية في هذا العرض.",
      themeLabel: "المظهر:",
      langLabel: "اللغة:",
      footer: "© 2026 Phantomhunt Labs | للبحث فقط",
    },
  }

  const currentLang = t[language]

  return (
    <div
      className={`min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono relative overflow-hidden ${isRetroMode ? "retro-mode" : ""} ${language === "ar" ? "rtl" : ""}`}
      dir={language === "ar" ? "rtl" : "ltr"}
      style={language === "ar" ? { fontFamily: "'Tajawal', 'JetBrains Mono', monospace" } : {}}
    >
      {/* ASCII Rain Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20" />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a]/95 via-[#0a0a0a]/90 to-[#0a0a0a]/95 pointer-events-none" />

      {/* CRT Scanlines for Retro Mode */}
      {isRetroMode && (
        <div className="fixed inset-0 pointer-events-none opacity-10">
          <div className="scanlines" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/*Navbar */}
        <nav className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a2e]/50 z-50 animate-slideDown">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SnakeLogo className="w-10 h-10" animated={true} />
              <div className="text-xl font-bold font-sans tracking-wider">
                PHANTOM<span className="glow-text text-[#00f3ff]">HUNT</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:text-[#00f3ff] transition-colors">
                {currentLang.features}
              </a>
              <a href="#demo" className="hover:text-[#00f3ff] transition-colors">
                {currentLang.demo}
              </a>
              <a href="https://github.com" className="flex items-center gap-2 hover:text-[#00f3ff] transition-colors">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-3 py-1 rounded bg-[#1a1a2e] hover:bg-[#00f3ff]/10 transition-colors"
              >
                {language === "en" ? "🇸🇦 AR" : "🇬🇧 EN"}
              </button>
            </div>
          </div>
        </nav>

        <div className="bg-[#ff00c8]/10 border-y border-[#ff00c8]/50 py-3 px-4">
          <div className="container mx-auto">
            <p className="text-sm text-center" style={language === "ar" ? { fontFamily: "'Tajawal', sans-serif" } : {}}>
              <span className="font-bold text-[#ff00c8]">⚠️ تنبيه / Warning:</span> {currentLang.ethicalBanner}
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32 text-center">
          <h1
            ref={heroTextRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans mb-6 glow-text-strong min-h-[80px] md:min-h-[100px]"
            style={{ color: isRetroMode ? "#00ff00" : "#00f3ff" }}
          ></h1>
          <p className="text-lg md:text-xl text-[#7a7a7a] mb-8 max-w-3xl mx-auto">{currentLang.tagline}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => setShowVideo(true)}
              className="bg-[#00f3ff] text-[#0a0a0a] hover:bg-[#00f3ff]/90 font-bold px-8 py-6 text-lg glow-button"
            >
              <Play className="w-5 h-5 mr-2" />
              {currentLang.watchDemo}
            </Button>
            <Button
              onClick={() => document.getElementById("install")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#ff00c8] text-[#e0e0e0] hover:bg-[#ff00c8]/90 font-bold px-8 py-6 text-lg glow-button-pink"
            >
              📥 {currentLang.download}
            </Button>
          </div>
        </section>

        {/* Stats Section - NEW */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "2.3M+", label: language === "en" ? "Usernames Generated" : "أسماء تم توليدها", icon: Zap },
                { value: "98.7%", label: language === "en" ? "Success Rate" : "معدل النجاح", icon: CheckCircle2 },
                { value: "13", label: language === "en" ? "Year Coverage" : "تغطية السنوات", icon: Database },
                { value: "< 1s", label: language === "en" ? "Avg Check Time" : "وقت الفحص المتوسط", icon: Terminal },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center group"
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#00f3ff]/10 border-2 border-[#00f3ff]/30 group-hover:border-[#ff00c8] group-hover:bg-[#ff00c8]/10 transition-all duration-500 group-hover:scale-110">
                    <stat.icon className="w-8 h-8 text-[#00f3ff] group-hover:text-[#ff00c8] transition-colors" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-[#00f3ff] mb-2 cyber-pulse">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#00f3ff] font-mono">
              {language === "en" ? "◈ Core Features ◈" : "◈ الميزات الأساسية ◈"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group relative bg-[#0f0f1e]/50 border border-[#00f3ff]/20 rounded-lg p-6 backdrop-blur-sm
                    hover:border-[#00f3ff]/60 hover:bg-[#0f0f1e]/80 transition-all duration-500
                    hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-105 transform"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`,
                  }}
                >
                  {/* Hexagonal corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#00f3ff]/40 group-hover:border-[#ff00c8]/60 transition-colors duration-300" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#00f3ff]/40 group-hover:border-[#ff00c8]/60 transition-colors duration-300" />

                  {/* Animated icon */}
                  <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#00f3ff] font-mono group-hover:text-[#ff00c8] transition-colors duration-300">
                    {language === "en" ? feature.titleEn : feature.titleAr}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {language === "en" ? feature.descriptionEn : feature.descriptionAr}
                  </p>

                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-lg">
                    <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent animate-scan" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section - NEW */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#ff00c8] font-mono">
              {language === "en" ? "⟨ How It Works ⟩" : "⟨ كيف يعمل ⟩"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: Database,
                  titleEn: "Generate Patterns",
                  titleAr: "توليد الأنماط",
                  descEn:
                    "PhantomHunt uses algorithmic seeds based on Instagram's username creation patterns from 2011-2023. Each year has unique characteristics that are encoded into the generation logic.",
                  descAr:
                    "يستخدم PhantomHunt بذور خوارزمية بناءً على أنماط إنشاء أسماء المستخدمين في إنستغرام من 2011-2023. كل سنة لها خصائص فريدة مشفرة في منطق التوليد.",
                },
                {
                  step: "02",
                  icon: Shield,
                  titleEn: "Filter & Validate",
                  titleAr: "التصفية والتحقق",
                  descEn:
                    "Apply advanced filters including min/max year, character length, regex patterns, and custom character sets. Results are deduplicated and validated against your criteria before checking.",
                  descAr:
                    "تطبيق فلاتر متقدمة تشمل الحد الأدنى/الأقصى للسنة، طول الأحرف، أنماط regex، ومجموعات الأحرف المخصصة. يتم إزالة التكرارات والتحقق من النتائج قبل الفحص.",
                },
                {
                  step: "03",
                  icon: Zap,
                  titleEn: "Live Check",
                  titleAr: "الفحص المباشر",
                  descEn:
                    "Real-time availability checks via Instagram API with intelligent rate-limit handling, proxy rotation support, and HotMail cross-verification for maximum accuracy.",
                  descAr:
                    "فحص التوافر في الوقت الفعلي عبر Instagram API مع معالجة ذكية لحد المعدل، ودعم تدوير البروكسي، والتحقق المتقاطع من HotMail لأقصى دقة.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative bg-[#0f0f1e]/60 border border-[#ff00c8]/20 rounded-xl p-8 backdrop-blur-sm
                    hover:border-[#ff00c8]/60 transition-all duration-500 group electric-border"
                  style={{ animation: `fadeInUp 0.7s ease-out ${i * 0.2}s both` }}
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#ff00c8]/20 rounded-full flex items-center justify-center border-2 border-[#ff00c8] group-hover:scale-110 transition-transform duration-300">
                    <span className="text-[#ff00c8] font-bold text-lg">{item.step}</span>
                  </div>

                  <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto rounded-lg bg-[#ff00c8]/10 border border-[#ff00c8]/30 group-hover:bg-[#00f3ff]/10 group-hover:border-[#00f3ff] transition-all duration-500">
                    <item.icon className="w-8 h-8 text-[#ff00c8] group-hover:text-[#00f3ff] transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-[#ff00c8] text-center">
                    {language === "en" ? item.titleEn : item.titleAr}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed text-center">
                    {language === "en" ? item.descEn : item.descAr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Section - NEW */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#00f3ff] font-mono">
              {language === "en" ? "◆ Technical Architecture ◆" : "◆ البنية التقنية ◆"}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#0f0f1e]/60 border border-[#00f3ff]/30 rounded-xl p-8 backdrop-blur-sm hover:border-[#00f3ff] transition-all duration-500 shimmer">
                <div className="flex items-center gap-4 mb-6">
                  <Code2 className="w-10 h-10 text-[#00f3ff]" />
                  <h3 className="text-2xl font-bold text-[#00f3ff]">
                    {language === "en" ? "Core Engine" : "المحرك الأساسي"}
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#00f3ff] mt-1">▹</span>
                    <span>
                      {language === "en"
                        ? "Pure Python 3.8+ with async/await patterns"
                        : "Python 3.8+ نقي مع أنماط async/await"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00f3ff] mt-1">▹</span>
                    <span>
                      {language === "en"
                        ? "Zero external dependencies for core logic"
                        : "لا توجد تبعيات خارجية للمنطق الأساسي"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00f3ff] mt-1">▹</span>
                    <span>
                      {language === "en" ? "Deterministic seed-based generation" : "توليد قائم على البذور الحتمية"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#00f3ff] mt-1">▹</span>
                    <span>
                      {language === "en" ? "Memory-efficient streaming architecture" : "بنية تدفق فعالة للذاكرة"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0f0f1e]/60 border border-[#ff00c8]/30 rounded-xl p-8 backdrop-blur-sm hover:border-[#ff00c8] transition-all duration-500 shimmer">
                <div className="flex items-center gap-4 mb-6">
                  <Globe2 className="w-10 h-10 text-[#ff00c8]" />
                  <h3 className="text-2xl font-bold text-[#ff00c8]">
                    {language === "en" ? "Network Layer" : "طبقة الشبكة"}
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-[#ff00c8] mt-1">▹</span>
                    <span>
                      {language === "en"
                        ? "Intelligent rate-limit detection & backoff"
                        : "الكشف الذكي عن حد المعدل والتراجع"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ff00c8] mt-1">▹</span>
                    <span>
                      {language === "en"
                        ? "HTTP/2 multiplexing for parallel checks"
                        : "تعدد إرسال HTTP/2 للفحوصات المتوازية"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ff00c8] mt-1">▹</span>
                    <span>
                      {language === "en"
                        ? "Automatic proxy rotation (SOCKS5/HTTP)"
                        : "تدوير البروكسي التلقائي (SOCKS5/HTTP)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#ff00c8] mt-1">▹</span>
                    <span>{language === "en" ? "SSL pinning bypass capabilities" : "قدرات تجاوز تثبيت SSL"}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#00f3ff]/10 via-[#ff00c8]/10 to-[#00f3ff]/10 border-y border-[#00f3ff]/30 rounded-xl p-8 backdrop-blur-sm">
              <h4 className="text-xl font-bold mb-4 text-center text-[#00f3ff]">
                {language === "en" ? "Performance Metrics" : "مقاييس الأداء"}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#ff00c8] mb-1">~850/s</div>
                  <div className="text-xs text-gray-400">{language === "en" ? "Generation Speed" : "سرعة التوليد"}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ff00c8] mb-1">~45/s</div>
                  <div className="text-xs text-gray-400">
                    {language === "en" ? "Check Throughput" : "إنتاجية الفحص"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ff00c8] mb-1">12MB</div>
                  <div className="text-xs text-gray-400">{language === "en" ? "Memory Footprint" : "بصمة الذاكرة"}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#ff00c8] mb-1">0.02%</div>
                  <div className="text-xs text-gray-400">
                    {language === "en" ? "False Positive Rate" : "معدل الإيجابيات الكاذبة"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-center mb-12 glow-text">{currentLang.demo}</h2>

          {/* Terminal Controls */}
          <div className="max-w-4xl mx-auto mb-4 flex gap-4 justify-center items-center text-sm">
            <div className="flex items-center gap-2">
              <span>{currentLang.themeLabel}</span>
              <button
                onClick={() => setTerminalTheme("green")}
                className={`px-3 py-1 rounded ${terminalTheme === "green" ? "bg-[#00ff00]/20 text-[#00ff00]" : "bg-[#1a1a2e] text-[#7a7a7a]"}`}
              >
                Green
              </button>
              <button
                onClick={() => setTerminalTheme("amber")}
                className={`px-3 py-1 rounded ${terminalTheme === "amber" ? "bg-[#ffb000]/20 text-[#ffb000]" : "bg-[#1a1a2e] text-[#7a7a7a]"}`}
              >
                Amber
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>{currentLang.langLabel}</span>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded ${language === "en" ? "bg-[#00f3ff]/20 text-[#00f3ff]" : "bg-[#1a1a2e] text-[#7a7a7a]"}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("ar")}
                className={`px-3 py-1 rounded ${language === "ar" ? "bg-[#00f3ff]/20 text-[#00f3ff]" : "bg-[#1a1a2e] text-[#7a7a7a]"}`}
              >
                AR
              </button>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="max-w-4xl mx-auto bg-[#0d0d0d] border-2 border-[#1a1a2e] rounded-lg overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-[#1a1a2e] px-4 py-2 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex-1 text-center text-sm text-[#7a7a7a]">phantomhunt@terminal:~</div>
            </div>

            {/* Terminal Body */}
            <div
              ref={terminalScrollRef}
              className="h-[500px] overflow-y-auto p-4 font-mono text-sm"
              style={{ color: terminalTheme === "green" ? "#00ff00" : "#ffb000" }}
            >
              {terminalLines.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div className="flex items-center">
                <span className="mr-2">{checkingPhase === "filtering" ? "" : "> "}</span>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTerminalInput(userInput)
                    }
                  }}
                  disabled={isTyping}
                  className="flex-1 bg-transparent outline-none"
                  style={{ color: terminalTheme === "green" ? "#00ff00" : "#ffb000" }}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section - NEW */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#00f3ff] font-mono">
              {language === "en" ? "⌘ Use Cases ⌘" : "⌘ الحالات الاستخدام ⌘"}
            </h2>
            <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
              {language === "en"
                ? "Ethical reconnaissance scenarios for security researchers and investigators"
                : "سيناريوهات الاستطلاع الأخلاقي للباحثين الأمنيين والمحققين"}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  iconEn: "🕵️",
                  titleEn: "OSINT Research",
                  titleAr: "بحث OSINT",
                  descEn:
                    "Discover abandoned or inactive accounts for legitimate intelligence gathering and digital archaeology",
                  descAr: "اكتشاف الحسابات المهجورة أو غير النشطة لجمع المعلومات المشروعة والآثار الرقمية",
                },
                {
                  iconEn: "🔒",
                  titleEn: "Security Audits",
                  titleAr: "التدقيق الأمني",
                  descEn: "Test your organization's social media footprint and identify potential impersonation risks",
                  descAr: "اختبر بصمة وسائل التواصل الاجتماعي لمؤسستك وحدد مخاطر الانتحال المحتملة",
                },
                {
                  iconEn: "📊",
                  titleEn: "Pattern Analysis",
                  titleAr: "تحليل الأنماط",
                  descEn:
                    "Study username trends and availability patterns across different time periods for research papers",
                  descAr: "دراسة اتجاهات أسماء المستخدمين وأنماط التوافر عبر فترات زمنية مختلفة للأبحاث",
                },
                {
                  iconEn: "🛡️",
                  titleEn: "Brand Protection",
                  titleAr: "حماية العلامة التجارية",
                  descEn: "Monitor for variations of your brand name to prevent trademark squatting and phishing",
                  descAr: "مراقبة الاختلافات في اسم علامتك التجارية لمنع الاحتلال والتصيد",
                },
              ].map((useCase, i) => (
                <div
                  key={i}
                  className="group bg-[#0f0f1e]/50 border border-[#00f3ff]/20 rounded-lg p-6 backdrop-blur-sm
                    hover:border-[#ff00c8]/60 hover:bg-[#0f0f1e]/80 transition-all duration-500
                    hover:shadow-[0_0_40px_rgba(255,0,200,0.3)] transform hover:scale-105"
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.15}s both` }}
                >
                  <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                    {useCase.iconEn}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#00f3ff] group-hover:text-[#ff00c8] transition-colors">
                    {language === "en" ? useCase.titleEn : useCase.titleAr}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {language === "en" ? useCase.descEn : useCase.descAr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Ethics Section - NEW */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-[#ff00c8]/20 via-[#0f0f1e]/60 to-[#00f3ff]/20 border-2 border-[#ff00c8]/40 rounded-2xl p-10 backdrop-blur-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff00c8] rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#00f3ff] rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-6">
                  <Lock className="w-12 h-12 text-[#ff00c8]" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-6 text-[#ff00c8]">
                  {language === "en" ? "Security & Ethical Guidelines" : "الأمان والمبادئ الأخلاقية"}
                </h2>

                <div className="space-y-6 text-gray-300">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#ff00c8]/20 border border-[#ff00c8] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#ff00c8] text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#00f3ff] mb-2">
                        {language === "en" ? "Respect Rate Limits" : "احترام حدود المعدل"}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {language === "en"
                          ? "PhantomHunt includes intelligent backoff mechanisms. Never circumvent platform protections or use aggressive concurrent requests."
                          : "يتضمن PhantomHunt آليات تراجع ذكية. لا تتجاوز حماية المنصة أبدًا أو تستخدم طلبات متزامنة عدوانية."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#ff00c8]/20 border border-[#ff00c8] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#ff00c8] text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#00f3ff] mb-2">
                        {language === "en" ? "Research Purposes Only" : "لأغراض البحث فقط"}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {language === "en"
                          ? "This tool is designed for security research, OSINT analysis, and academic studies. Do not use for harassment, spam, or malicious activities."
                          : "هذه الأداة مصممة للبحث الأمني وتحليل OSINT والدراسات الأكاديمية. لا تستخدمها للمضايقة أو البريد العشوائي أو الأنشطة الضارة."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#ff00c8]/20 border border-[#ff00c8] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#ff00c8] text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#00f3ff] mb-2">
                        {language === "en" ? "Data Privacy" : "خصوصية البيانات"}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {language === "en"
                          ? "All operations are local. PhantomHunt does not collect, store, or transmit your usage data or results to any external servers."
                          : "جميع العمليات محلية. لا يجمع PhantomHunt أو يخزن أو ينقل بيانات الاستخدام أو النتائج إلى أي خوادم خارجية."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#ff00c8]/20 border border-[#ff00c8] flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-[#ff00c8] text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#00f3ff] mb-2">
                        {language === "en" ? "Legal Compliance" : "الامتثال القانوني"}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {language === "en"
                          ? "Users are responsible for compliance with local laws, Instagram's ToS, and applicable regulations. Review your jurisdiction before use."
                          : "المستخدمون مسؤولون عن الامتثال للقوانين المحلية وشروط خدمة Instagram واللوائح المعمول بها. راجع سلطتك القضائية قبل الاستخدام."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#ff00c8]/30 text-center">
                  <p className="text-sm text-[#ff00c8] font-bold">
                    {language === "en"
                      ? "⚠️ Misuse may result in IP bans, account restrictions, or legal consequences"
                      : "⚠️ قد يؤدي إساءة الاستخدام إلى حظر IP أو تقييدات الحساب أو عواقب قانونية"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section - NEW */}
        <section id="install" className="py-20 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#00f3ff] font-mono">
              {language === "en" ? "⬇ Download PhantomHunt ⬇" : "⬇ تحميل PhantomHunt ⬇"}
            </h2>

            <div className="bg-[#0f0f1e]/60 border-2 border-[#00f3ff]/40 rounded-xl p-8 backdrop-blur-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#00f3ff] mb-2">v1.4.2 Stable</h3>
                  <p className="text-gray-400 text-sm">
                    {language === "en"
                      ? "Latest release • 2.3 MB • Python 3.8+"
                      : "أحدث إصدار • 2.3 ميجابايت • Python 3.8+"}
                  </p>
                </div>
                <Download className="w-12 h-12 text-[#00f3ff]" />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Button className="bg-[#00f3ff] text-[#0a0a0a] hover:bg-[#00f3ff]/90 font-bold py-6 glow-button w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Windows
                </Button>
                <Button className="bg-[#00f3ff] text-[#0a0a0a] hover:bg-[#00f3ff]/90 font-bold py-6 glow-button w-full">
                  <Download className="w-5 h-5 mr-2" />
                  macOS
                </Button>
                <Button className="bg-[#00f3ff] text-[#0a0a0a] hover:bg-[#00f3ff]/90 font-bold py-6 glow-button w-full">
                  <Download className="w-5 h-5 mr-2" />
                  Linux
                </Button>
              </div>

              <div className="bg-[#0a0a0a]/60 border border-[#00f3ff]/20 rounded-lg p-4">
                <p className="text-xs text-gray-400 mb-2 font-bold">
                  {language === "en" ? "Quick Install:" : "تثبيت سريع:"}
                </p>
                <code className="text-[#00f3ff] text-sm">wget https://phantomhunt.dev/install.sh | bash</code>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>
                {language === "en"
                  ? "SHA-256 checksum available • GPG signed releases • Open source on GitHub"
                  : "SHA-256 checksum متاح • إصدارات موقعة GPG • مفتوح المصدر على GitHub"}
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 text-center border-t border-[#1a1a2e]/50">
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="hover:text-[#00f3ff] transition-colors">
              {currentLang.docs}
            </a>
            <a href="https://github.com" className="hover:text-[#00f3ff] transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-[#00f3ff] transition-colors">
              Discord
            </a>
          </div>
          <div className="bg-[#ff00c8]/10 border border-[#ff00c8]/30 rounded-lg p-4 max-w-2xl mx-auto mb-6">
            <p className="text-sm font-bold text-[#ff00c8] mb-2">{currentLang.warningTitle}</p>
            <p className="text-xs text-[#7a7a7a]">{currentLang.warningText}</p>
          </div>
          <p className="text-[#7a7a7a] text-sm">{currentLang.footer}</p>
        </footer>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="max-w-4xl w-full bg-[#1a1a2e] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0d0d0d] px-4 py-3 flex items-center justify-between">
              <span className="text-[#00f3ff] font-bold">PhantomHunt Demo</span>
              <button onClick={() => setShowVideo(false)} className="text-[#7a7a7a] hover:text-[#e0e0e0]">
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <p className="text-[#7a7a7a]">[Demo video would play here]</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
