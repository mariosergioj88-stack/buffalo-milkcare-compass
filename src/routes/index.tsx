import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, ClipboardCheck, Clock3, Droplets, Headphones, History, Package, Plus, ShieldCheck, Trash2, Beef, Milk, Waves, BookOpen, Search } from "lucide-react";
import heroVideo from "@/assets/bufalas-hero.mp4.asset.json";
import heroPoster from "@/assets/bufalas-hero-poster.jpg.asset.json";
import higiene from "@/assets/higiene-ordenha.jpg";
import posOrdenha from "@/assets/pos-ordenha.jpg";
import racao from "@/assets/racao-armazenada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manejo em Dia — Cuidados na propriedade" },
      { name: "description", content: "Orientações práticas e registro da rotina de manejo de búfalas leiteiras." },
      { property: "og:title", content: "Manejo em Dia — Cuidados na propriedade" },
      { property: "og:description", content: "Boas práticas na rotina de criação e produção de leite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type ModuleId = "pos-ordenha" | "racao" | "pre-ordenha";
type Activity = {
  id: string;
  module: string;
  date: string;
  time: string;
  completed: string[];
  problem: string;
  pending: string;
};

const modules: {
  id: ModuleId;
  number: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  image: string;
  imageAlt: string;
  icon: typeof Droplets;
  steps: string[];
  tip: string;
}[] = [
  {
    id: "pos-ordenha",
    number: "01",
    title: "Pós-ordenha e amamentação",
    summary: "Organize o momento depois da ordenha e acompanhe a amamentação dos bezerros.",
    problem: "Quando búfalas e bezerros são soltos todos juntos, pode ser difícil observar se cada bezerro mamou na própria mãe.",
    objective: "Separar os animais em grupos, acompanhar a mamada por cerca de 20 a 30 minutos e só depois fazer a liberação geral.",
    image: posOrdenha,
    imageAlt: "Cuidados com búfalas após a ordenha",
    icon: ShieldCheck,
    steps: [
      "Fazer o pós-dipping nos tetos após a ordenha.",
      "Conduzir as búfalas com calma para a área de alimentação.",
      "Permitir que os bezerros mamem em dois piquetes.",
      "Manter os animais nos piquetes por cerca de 20 a 30 minutos.",
      "Conferir se há animais com dificuldade ou sinais de desconforto.",
    ],
    tip: "O período de 20 a 30 minutos nos piquetes ajuda a organizar a amamentação. Observe os animais e siga a rotina definida com a orientação técnica da propriedade.",
  },
  {
    id: "racao",
    number: "02",
    title: "Armazenamento de ração e farelos",
    summary: "Proteja os alimentos contra umidade, sujeira, pragas e contato direto com o chão.",
    problem: "Sacos apoiados diretamente no piso ou encostados nas paredes podem absorver umidade e facilitar a contaminação por pragas.",
    objective: "Usar paletes, manter espaço para circulação de ar e guardar a ração em um depósito seco, limpo e protegido.",
    image: racao,
    imageAlt: "Ração armazenada de forma organizada",
    icon: Package,
    steps: [
      "Colocar os sacos sobre paletes ou estrados.",
      "Manter os alimentos afastados do chão.",
      "Deixar espaço entre os sacos e as paredes.",
      "Guardar em local seco, limpo e ventilado.",
      "Manter o depósito protegido contra roedores e insetos.",
      "Conferir validade, embalagens e sinais de umidade.",
    ],
    tip: "Não deixe sacos diretamente no piso ou encostados nas paredes. Separe produtos úmidos, mofados ou com embalagem danificada.",
  },
  {
    id: "pre-ordenha",
    number: "03",
    title: "Higiene antes da ordenha",
    summary: "Prepare os tetos, os equipamentos e o local para uma ordenha mais segura.",
    problem: "Sujeira nos tetos, nas mãos ou nos equipamentos pode comprometer a higiene durante a ordenha e a qualidade do leite.",
    objective: "Seguir a sequência de limpeza, pré-dipping e secagem individual dos tetos, respeitando o produto utilizado.",
    image: higiene,
    imageAlt: "Higienização antes da ordenha",
    icon: Droplets,
    steps: [
      "Lavar e higienizar as mãos antes de começar.",
      "Conferir se o local e os equipamentos estão limpos.",
      "Observar os primeiros jatos de leite e verificar alterações.",
      "Aplicar o pré-dipping conforme o produto e o tempo indicados.",
      "Secar cada teto com papel-toalha individual.",
      "Começar a ordenha somente com os tetos limpos e secos.",
    ],
    tip: "Use uma folha de papel-toalha para cada animal ou teto, conforme o procedimento adotado. Não use o mesmo papel em vários animais.",
  },
];

const buffaloRegions = [
  { name: "Norte", color: "#16c65b", total: "1.278.440", share: "71,1%", states: "Pará, Amapá, Amazonas, Rondônia, Tocantins, Acre e Roraima", highlight: "O Norte concentra a maior parte do rebanho bubalino brasileiro. Pará (736.437 cabeças) e Amapá (346.321) são os grandes destaques.", note: "A criação tem forte presença em áreas de várzea e campos alagáveis, especialmente na Ilha de Marajó e em outras áreas amazônicas.", points: "96,38 148,26 218,43 275,27 335,62 320,122 276,145 226,133 192,166 135,151 104,119" },
  { name: "Nordeste", color: "#168bff", total: "139.836", share: "7,8%", states: "Maranhão, Piauí, Ceará, Rio Grande do Norte, Paraíba, Pernambuco, Alagoas, Sergipe e Bahia", highlight: "O Maranhão lidera a região, com 96.950 búfalos em 2025. A Bahia aparece em seguida, com 23.434.", note: "A região apresenta criações em diferentes sistemas e condições climáticas. O manejo de água, sombra e conforto térmico merece atenção.", points: "335,62 382,91 414,139 398,187 354,209 319,185 320,145 320,122" },
  { name: "Centro-Oeste", color: "#f04444", total: "54.924", share: "3,1%", states: "Goiás, Mato Grosso, Mato Grosso do Sul e Distrito Federal", highlight: "Goiás tem o maior efetivo regional, com 20.709 cabeças, seguido por Mato Grosso e Mato Grosso do Sul.", note: "A região tem participação menor no total nacional, mas a criação pode integrar sistemas de produção diversificados. Pastagem, água e manejo sanitário são pontos importantes.", points: "104,119 135,151 192,166 226,133 276,145 319,145 319,185 332,246 281,277 212,263 160,228 105,192" },
  { name: "Sudeste", color: "#ffca28", total: "219.976", share: "12,2%", states: "São Paulo, Minas Gerais, Rio de Janeiro e Espírito Santo", highlight: "São Paulo (112.615) e Minas Gerais (94.253) concentram quase todo o rebanho bubalino da região.", note: "A região reúne importantes sistemas de produção leiteira e de carne. A qualidade do leite depende de higiene na ordenha, resfriamento e bem-estar animal.", points: "319,185 354,209 398,187 414,245 384,300 337,326 281,300 281,277 332,246" },
  { name: "Sul", color: "#a855f7", total: "103.612", share: "5,8%", states: "Paraná, Santa Catarina e Rio Grande do Sul", highlight: "O Paraná lidera a região com 46.735 cabeças, seguido pelo Rio Grande do Sul (44.354) e Santa Catarina (12.523).", note: "O clima mais frio em parte da região exige atenção especial à disponibilidade de abrigo, água e conforto dos animais nas épocas de baixas temperaturas.", points: "281,300 337,326 384,300 368,375 334,443 286,485 252,430 257,366" },
] as const;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

const dictionaryTerms = [
  { term: "Bubalino", meaning: "Animal que pertence à espécie dos búfalos." },
  { term: "Úbere", meaning: "Parte do corpo da fêmea onde o leite é produzido e armazenado." },
  { term: "Tetos", meaning: "Partes do úbere por onde o leite sai durante a ordenha." },
  { term: "Ordenha", meaning: "Retirada do leite da búfala, manualmente ou com equipamento." },
  { term: "Pré-dipping", meaning: "Limpeza dos tetos antes da ordenha, com produto adequado." },
  { term: "Pós-dipping", meaning: "Aplicação de produto nos tetos depois da ordenha para ajudar a protegê-los." },
  { term: "Piquete", meaning: "Área de pastagem cercada, usada para manter os animais." },
  { term: "Farelo", meaning: "Alimento triturado, como farelo de soja ou trigo, que pode fazer parte da ração." },
  { term: "Ração", meaning: "Mistura de alimentos preparada para fornecer nutrientes aos animais." },
  { term: "Contaminação", meaning: "Presença de sujeira ou microrganismos que podem prejudicar o leite ou os alimentos." },
  { term: "Ventilação", meaning: "Circulação de ar no ambiente, que ajuda a controlar o calor e a umidade." },
  { term: "Bem-estar animal", meaning: "Condição em que o animal tem água, alimento, conforto, saúde e cuidados adequados." },
] as const;

function Index() {
  const [checked, setChecked] = useState<Record<ModuleId, string[]>>({
    "pos-ordenha": [], racao: [], "pre-ordenha": [],
  });
  const [notes, setNotes] = useState<Record<ModuleId, { problem: string; pending: string }>>({
    "pos-ordenha": { problem: "", pending: "" },
    racao: { problem: "", pending: "" },
    "pre-ordenha": { problem: "", pending: "" },
  });
  const [history, setHistory] = useState<Activity[]>([]);
  const [activeModule, setActiveModule] = useState<ModuleId>("pos-ordenha");
  const [savedMessage, setSavedMessage] = useState("");
  const [breedIndex, setBreedIndex] = useState(0);
  const [breedPaused, setBreedPaused] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Norte");
  const [dictionarySearch, setDictionarySearch] = useState("");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [vaccineRecords, setVaccineRecords] = useState<{id:string; animal:string; vaccine:string; date:string; dose:string; notes:string}[]>([]);
  const [vaccineForm, setVaccineForm] = useState({animal:"", vaccine:"", date:"", dose:"", notes:""});
  const [diaryEntries, setDiaryEntries] = useState<{id:string; date:string; activity:string; observations:string; pending:string}[]>([]);
  const [diaryForm, setDiaryForm] = useState({date:new Date().toISOString().slice(0,10), activity:"", observations:"", pending:""});
  const [animalAssessment, setAnimalAssessment] = useState({animal:"", mucosas:"", body:"", temperature:"", respiration:"", behavior:"", notes:""});
  const breedCarouselRef = useRef<HTMLDivElement>(null);
  const [buffaloPart, setBuffaloPart] = useState({
    key: "ubere",
    label: "Úbere e tetos",
    description: "Antes e depois da ordenha, observe se há inchaço, feridas, dor ou alterações no leite. Mantenha a higiene dos tetos e siga a rotina de ordenha da propriedade.",
  });

  useEffect(() => {
    try {
      const storedVaccines = localStorage.getItem("manejo-em-dia-vaccines");
      const storedDiary = localStorage.getItem("manejo-em-dia-diary");
      if (storedVaccines) setVaccineRecords(JSON.parse(storedVaccines));
      if (storedDiary) setDiaryEntries(JSON.parse(storedDiary));
    } catch {
      // Os formulários continuam disponíveis se o armazenamento local falhar.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("manejo-em-dia-vaccines", JSON.stringify(vaccineRecords));
      localStorage.setItem("manejo-em-dia-diary", JSON.stringify(diaryEntries));
    } catch {
      // Os registros permanecem disponíveis durante esta sessão.
    }
  }, [vaccineRecords, diaryEntries]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("buffalo-milkcare-activities");
      if (stored) setHistory(JSON.parse(stored) as Activity[]);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("buffalo-milkcare-activities", JSON.stringify(history));
    } catch {
      // The guide remains usable if browser storage is unavailable.
    }
  }, [history]);

  // modules is a fixed, non-empty list, so the first entry is always present.
  const active = useMemo(
    () => modules.find((item) => item.id === activeModule) ?? modules[0]!,
    [activeModule],
  );

  useEffect(() => {
    if (breedPaused) return;
    const timer = window.setInterval(() => {
      setBreedIndex((current) => {
        const next = (current + 1) % 4;
        const carousel = breedCarouselRef.current;
        const card = carousel?.children[next] as HTMLElement | undefined;
        if (carousel && card) {
          carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 3500);
    return () => window.clearInterval(timer);
  }, [breedPaused]);

  function moveBreed(direction: number) {
    setBreedIndex((current) => {
      const next = (current + direction + 4) % 4;
      const carousel = breedCarouselRef.current;
      const card = carousel?.children[next] as HTMLElement | undefined;
      if (carousel && card) {
        carousel.scrollTo({ left: card.offsetLeft - carousel.offsetLeft, behavior: "smooth" });
      }
      return next;
    });
  }

  function toggleStep(moduleId: ModuleId, step: string) {
    setChecked((current) => ({
      ...current,
      [moduleId]: current[moduleId].includes(step)
        ? current[moduleId].filter((item) => item !== step)
        : [...current[moduleId], step],
    }));
  }

  function saveActivity() {
    const now = new Date();
    const activity: Activity = {
      id: `${now.getTime()}`,
      module: active.title,
      date: now.toLocaleDateString("pt-BR"),
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      completed: checked[activeModule],
      problem: notes[activeModule].problem.trim(),
      pending: notes[activeModule].pending.trim(),
    };
    setHistory((current) => [activity, ...current]);
    setSavedMessage("Registro salvo neste aparelho.");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function clearHistory() {
    if (window.confirm("Deseja apagar todo o histórico salvo neste aparelho?")) setHistory([]);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3">
          <a href="#inicio" className="flex min-w-0 items-center gap-3">
            <img src="/favicon.png" alt="" className="h-10 w-10 shrink-0 object-contain" />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-base font-bold text-foreground">Manejo em Dia</span>
              <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">Projeto de extensão V</span>
            </span>
          </a>
          <div className="flex max-w-full flex-1 items-center justify-end gap-2 overflow-x-auto text-sm md:gap-3">
            <a href="#inicio" className="shrink-0 rounded-full px-3 py-2 font-medium text-foreground transition hover:bg-surface">Início</a>
            <details className="group relative shrink-0">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-2 font-medium text-foreground transition hover:bg-surface [&::-webkit-details-marker]:hidden">Manejo <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 group-open:rotate-180" /></summary>
              <div className="absolute right-0 top-full z-40 mt-2 grid min-w-56 gap-1 rounded-2xl border border-border bg-white p-2 text-sm text-foreground shadow-xl">
                <a href="#rotina" className="rounded-xl px-3 py-2 hover:bg-surface">Rotina prática</a>
                <a href="#manejo-sanitario" className="rounded-xl px-3 py-2 hover:bg-surface">Manejo sanitário</a>
                <a href="#agua-conforto" className="rounded-xl px-3 py-2 hover:bg-surface">Água e conforto</a>
                <a href="#qualidade-leite" className="rounded-xl px-3 py-2 hover:bg-surface">Qualidade do leite</a>
                <a href="#identificacao-animais" className="rounded-xl px-3 py-2 hover:bg-surface">Identificação dos animais</a>
                <a href="#reproducao" className="rounded-xl px-3 py-2 hover:bg-surface">Reprodução bubalina</a>
                <a href="#calendario-vacinal" className="rounded-xl px-3 py-2 hover:bg-surface">Calendário vacinal</a>
                <a href="#avaliacao-animal" className="rounded-xl px-3 py-2 hover:bg-surface">Avaliação prática do animal</a>
                <a href="#diario-propriedade" className="rounded-xl px-3 py-2 hover:bg-surface">Diário da propriedade</a>
              </div>
            </details>
            <details className="group relative shrink-0">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-2 font-medium text-foreground transition hover:bg-surface [&::-webkit-details-marker]:hidden">Conhecimento <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 group-open:rotate-180" /></summary>
              <div className="absolute right-0 top-full z-40 mt-2 grid min-w-56 gap-1 rounded-2xl border border-border bg-white p-2 text-sm text-foreground shadow-xl">
                <a href="#racas" className="rounded-xl px-3 py-2 hover:bg-surface">Raças bubalinas</a>
                <a href="#dicionario" className="rounded-xl px-3 py-2 hover:bg-surface">Dicionário</a>
                <a href="#alunos-respondem" className="rounded-xl px-3 py-2 hover:bg-surface">Alunos respondem</a>
                <a href="#quiz" className="rounded-xl px-3 py-2 hover:bg-surface">Quiz dos búfalos</a>
                <a href="#mitos-verdades" className="rounded-xl px-3 py-2 hover:bg-surface">Mitos e verdades</a>
              </div>
            </details>
            <a href="#historico" className="shrink-0 rounded-full px-3 py-2 font-medium text-foreground transition hover:bg-surface">Histórico</a>
          </div>
          <a href="#rotina" className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Começar</a>
        </div>
      </nav>

      <header id="inicio" className="relative isolate flex min-h-[min(900px,100svh)] items-center justify-center overflow-hidden bg-[#101812] px-5 py-12 text-center text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster.url}
          aria-label="Rebanho de búfalos-d'água pastando ao ar livre"
        >
          <source src="https://videos.pexels.com/video-files/32536717/13875635_3840_2160_24fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime-300 sm:text-sm">Manejo e cuidado com búfalas leiteiras</p>
          <h1 className="display-title mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">MANEJO EM DIA</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
            Um guia prático para transformar recomendações da cartilha em ações na propriedade.
          </p>
          <a href="#rotina" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:scale-[1.02] hover:opacity-95 sm:text-base">
            Escolher uma atividade <ArrowRight className="h-5 w-5" />
          </a>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/65">
          Manejo responsável · Bem-estar · Qualidade do leite
        </div>
      </header>

      <section id="rotina" className="scroll-mt-20 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Aprender e registrar</p>
            <h2 className="display-title mt-4 text-3xl md:text-5xl">Três atividades importantes do dia a dia.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Os módulos foram organizados a partir de três pontos de melhoria identificados na rotina da propriedade. Em cada um, você encontra o problema observado, a melhoria proposta e uma lista para acompanhar a execução.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;
              const selected = activeModule === item.id;
              return (
                <button key={item.id} onClick={() => setActiveModule(item.id)} className={`rounded-2xl border p-5 text-left transition ${selected ? "border-primary bg-background shadow-md" : "border-border bg-background hover:border-primary/50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{item.number}</span>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">O que este módulo busca melhorar</p>
                    <p className="mt-1 text-sm leading-relaxed">{item.objective}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{selected ? "Atividade selecionada" : "Abrir atividade"} <ArrowRight className="h-4 w-4" /></span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-background">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <img src={active.image} alt={active.imageAlt} className="h-full min-h-64 w-full object-cover" />
              <div className="p-6 md:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-primary">Atividade {active.number}</p>
                    <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{active.title}</h3>
                  </div>
                  <button onClick={() => speak(`${active.title}. ${active.summary}. ${active.steps.join(". ")}. Dica: ${active.tip}`)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-surface" aria-label="Ouvir orientações">
                    <Headphones className="h-4 w-4" /> Ouvir
                  </button>
                </div>
                <p className="mt-3 leading-relaxed text-muted-foreground">{active.summary}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problema identificado</p>
                    <p className="mt-2 text-sm leading-relaxed">{active.problem}</p>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Melhoria proposta</p>
                    <p className="mt-2 text-sm leading-relaxed">{active.objective}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <h4 className="font-semibold">Lista de verificação</h4>
                  <span className="text-sm text-muted-foreground">{checked[activeModule].length} de {active.steps.length} concluídas</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(checked[activeModule].length / active.steps.length) * 100}%` }} />
                </div>
                <ul className="mt-4 space-y-3">
                  {active.steps.map((step) => (
                    <li key={step}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-surface">
                        <input type="checkbox" checked={checked[activeModule].includes(step)} onChange={() => toggleStep(activeModule, step)} className="mt-1 h-5 w-5 accent-[var(--primary)]" />
                        <span className="leading-relaxed">{step}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-2xl bg-surface p-4">
                  <p className="font-semibold">Dica importante</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{active.tip}</p>
                  <button onClick={() => speak(active.tip)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Headphones className="h-4 w-4" /> Ouvir dica</button>
                </div>
                <div className="mt-6 grid gap-4">
                  <label className="text-sm font-semibold">Problemas encontrados
                    <textarea value={notes[activeModule].problem} onChange={(e) => setNotes((current) => ({ ...current, [activeModule]: { ...current[activeModule], problem: e.target.value } }))} placeholder="Ex.: saco de ração úmido, teto machucado..." rows={2} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-base font-normal outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="text-sm font-semibold">Pendências para resolver
                    <textarea value={notes[activeModule].pending} onChange={(e) => setNotes((current) => ({ ...current, [activeModule]: { ...current[activeModule], pending: e.target.value } }))} placeholder="Ex.: comprar papel-toalha, limpar o depósito..." rows={2} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-base font-normal outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button onClick={saveActivity} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"><Plus className="h-5 w-5" /> Salvar registro</button>
                  {savedMessage && <span role="status" className="text-sm font-medium text-primary">{savedMessage}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="manejo-sanitario" className="scroll-mt-20 bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary"><ShieldCheck className="h-4 w-4" /> Saúde e prevenção</p>
            <h2 className="display-title mt-4 text-3xl md:text-5xl">Manejo sanitário do rebanho</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Cuidados diários ajudam a prevenir doenças, identificar problemas mais cedo e manter o bem-estar das búfalas e dos bezerros. Observe os animais, mantenha os ambientes limpos e registre qualquer alteração.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Observação diária", text: "Observe apetite, comportamento, locomoção, respiração, fezes e aparência geral. Fique atento a isolamento, apatia ou mudanças na rotina." },
              { title: "Higiene das instalações", text: "Mantenha currais, salas de ordenha, cochos e bebedouros limpos. Retire resíduos e evite acúmulo de lama e matéria orgânica." },
              { title: "Prevenção e controle", text: "Siga o calendário sanitário definido pelo médico-veterinário, incluindo vacinação, exames e controle de parasitas conforme a realidade da propriedade." },
              { title: "Entrada de animais", text: "Mantenha animais recém-chegados separados do rebanho pelo período orientado pelo veterinário. Verifique documentos, histórico e condição de saúde." },
            ].map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <button type="button" onClick={() => speak(item.title + ". " + item.text)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <Headphones className="h-4 w-4" /> Ouvir orientação
                </button>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-xl font-semibold">Checklist de observação</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Use esta lista como apoio na ronda diária. Se notar alguma alteração, registre e comunique ao responsável pelo rebanho.</p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed">
                {[
                  "Os animais estão comendo e bebendo normalmente?",
                  "Todas as búfalas caminham sem dificuldade aparente?",
                  "Há feridas, inchaços, secreções ou sinais de dor?",
                  "O úbere e os tetos apresentam aparência habitual?",
                  "Os bebedouros, cochos e instalações estão limpos?",
                  "Algum animal está isolado ou com comportamento diferente?",
                ].map((item) => <li key={item} className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary/50 text-primary">✓</span><span>{item}</span></li>)}
              </ul>
            </div>
            <aside className="rounded-2xl bg-[#173b2d] p-6 text-white">
              <ShieldCheck className="h-8 w-8 text-lime-300" />
              <h3 className="mt-4 text-xl font-semibold">Percebeu algum sinal de doença?</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">Avise o responsável e procure orientação de um médico-veterinário. Quando indicado, separe o animal doente com segurança, disponibilize água e evite movimentá-lo sem necessidade.</p>
              <p className="mt-4 border-t border-white/20 pt-4 text-xs leading-relaxed text-white/70">Não medique por conta própria. Vacinas, medicamentos, doses, intervalos e protocolos devem ser definidos por um profissional habilitado, considerando cada propriedade e região.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="agua-conforto" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Bem-estar do rebanho</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Água e conforto térmico</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Búfalas precisam de água limpa e disponível, sombra e condições para aliviar o calor. Acompanhe os pontos de água e observe como os animais se comportam nos períodos mais quentes.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { title: "Água limpa e acessível", text: "Mantenha bebedouros abastecidos, limpos e em locais de fácil acesso. Confira diariamente a qualidade da água e o funcionamento dos pontos de abastecimento." },
              { title: "Sombra e ventilação", text: "Disponibilize áreas sombreadas e espaços com boa circulação de ar. Nos horários mais quentes, evite manejos e deslocamentos desnecessários." },
              { title: "Área para resfriamento", text: "Quando houver área de banho ou lama, mantenha-a em condições higiênicas, com acesso seguro e manejo que evite acúmulo excessivo de dejetos e lama nos locais de circulação." },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <Waves className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                <button type="button" onClick={() => speak(item.title + ". " + item.text)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Headphones className="h-4 w-4" /> Ouvir orientação</button>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-foreground">Fique atento ao calor</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Respiração muito acelerada, salivação intensa, fraqueza ou mudança importante de comportamento exigem atenção. Leve o caso ao responsável e procure orientação veterinária.</p>
          </div>
        </div>
      </section>

      <section id="qualidade-leite" className="scroll-mt-20 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Da ordenha ao armazenamento</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Qualidade do leite</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">A qualidade começa na higiene durante a ordenha e continua nos cuidados com os utensílios, o resfriamento, o armazenamento e o transporte.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <Milk className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Cuidados durante a ordenha</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Higienize as mãos, os tetos e os equipamentos conforme a rotina da propriedade.",
                  "Utilize utensílios limpos e próprios para contato com alimentos.",
                  "Observe os primeiros jatos e comunique alterações no leite ou no úbere.",
                  "Evite misturar leite de animais com suspeita de doença ou em tratamento sem orientação técnica.",
                ].map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">✓</span><span>{item}</span></li>)}
              </ul>
            </article>
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <ClipboardCheck className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Depois da ordenha</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {[
                  "Filtre o leite quando esse procedimento fizer parte do sistema utilizado.",
                  "Resfrie e mantenha o leite na temperatura e pelo tempo exigidos pelas normas e pelo laticínio responsável.",
                  "Mantenha o recipiente ou tanque fechado, limpo e protegido de contaminantes.",
                  "Transporte o leite nas condições adequadas, evitando demora e variações de temperatura.",
                ].map((item) => <li key={item} className="flex gap-3"><span className="font-bold text-primary">✓</span><span>{item}</span></li>)}
              </ul>
            </article>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Siga os procedimentos do serviço de inspeção, as normas vigentes e as orientações do estabelecimento que recebe o leite. Os parâmetros de resfriamento e conservação dependem da regulamentação aplicável.</p>
          <button type="button" onClick={() => speak("A qualidade do leite depende da higiene na ordenha, de utensílios limpos, do resfriamento adequado, do armazenamento protegido e do transporte correto. Siga as normas vigentes e as orientações do laticínio.")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Headphones className="h-4 w-4" /> Ouvir resumo</button>
        </div>
      </section>

      <section id="identificacao-animais" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Organização do rebanho</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Identificação dos animais</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">A identificação individual ajuda a reconhecer cada búfala, acompanhar sua história e manter os registros da propriedade organizados.</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <Beef className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">Como identificar?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Utilize o método de identificação adotado pela propriedade, como brincos numerados ou outro sistema individual apropriado. A identificação deve ser legível, durável e realizada de forma correta, com higiene e manejo cuidadoso.</p>
            </article>
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <ClipboardCheck className="h-7 w-7 text-primary" />
              <h3 className="text-lg font-semibold">O que registrar na ficha?</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {["Número ou código do animal", "Raça e data de nascimento", "Histórico de vacinação e exames", "Partos e reprodução", "Produção de leite", "Tratamentos e ocorrências"].map((item) => (
                  <div key={item} className="rounded-xl bg-surface p-3 text-sm text-foreground"><span className="mr-2 font-bold text-primary">✓</span>{item}</div>
                ))}
              </div>
            </article>
          </div>
          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-foreground">Dica para a rotina</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Atualize os registros sempre que houver nascimento, mudança de lote, vacinação, tratamento, parto ou alteração importante na produção. Proteja as fichas e mantenha uma cópia de segurança.</p>
          </div>
          <button type="button" onClick={() => speak("A identificação individual permite reconhecer cada búfala e acompanhar seu histórico. Registre o número do animal, raça, nascimento, vacinação, exames, partos, reprodução, produção de leite e tratamentos.")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Headphones className="h-4 w-4" /> Ouvir resumo</button>
        </div>
      </section>


      <section id="reproducao" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Planejamento do rebanho</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Reprodução bubalina</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Acompanhe os principais momentos reprodutivos de cada búfala. Registre as informações e mantenha o histórico organizado para conversar com o médico-veterinário ou responsável técnico.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Observação do cio", "Anote a data, os sinais observados e a identificação da fêmea. Mudanças de comportamento podem ajudar a reconhecer o período de cio."],
              ["Cobertura ou inseminação", "Registre a data, o reprodutor ou sêmen utilizado e o responsável pelo procedimento."],
              ["Gestação e nascimento", "Acompanhe os exames de gestação, a previsão de parto e os dados do bezerro após o nascimento."]
            ].map(([title, description]) => <article key={title} className="rounded-2xl border border-border bg-surface p-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}
          </div>
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground"><strong>Importante:</strong> protocolos de reprodução, diagnóstico de gestação e intervenções devem ser definidos e acompanhados por profissional habilitado. Este espaço é para organização dos registros, não substitui avaliação veterinária.</div>
          <button type="button" onClick={() => speak("Reprodução bubalina. Observe e registre o cio, a cobertura ou inseminação, os exames de gestação e os dados do nascimento. Procure orientação veterinária para definir os procedimentos.")} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Headphones className="h-4 w-4" /> Ouvir resumo</button>
        </div>
      </section>

      <section id="calendario-vacinal" className="scroll-mt-20 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Prevenção e organização</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Calendário vacinal</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Cadastre as vacinas realizadas ou programadas, com a data e a identificação do animal. O calendário não traz doses ou datas universais: siga o calendário oficial da região e a orientação do médico-veterinário.</p>
          </div>
          <form className="mt-8 grid gap-4 rounded-2xl border border-border bg-background p-5 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); if (!vaccineForm.animal.trim() || !vaccineForm.vaccine.trim() || !vaccineForm.date) return; setVaccineRecords((items) => [{...vaccineForm, id: String(Date.now())}, ...items]); setVaccineForm({animal:"", vaccine:"", date:"", dose:"", notes:""}); }}>
            <label className="text-sm font-semibold">Identificação do animal<input required value={vaccineForm.animal} onChange={(e) => setVaccineForm({...vaccineForm, animal:e.target.value})} placeholder="Ex.: Brinco 025" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Vacina<input required value={vaccineForm.vaccine} onChange={(e) => setVaccineForm({...vaccineForm, vaccine:e.target.value})} placeholder="Nome da vacina" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Data prevista ou realizada<input required type="date" value={vaccineForm.date} onChange={(e) => setVaccineForm({...vaccineForm, date:e.target.value})} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Dose / etapa<input value={vaccineForm.dose} onChange={(e) => setVaccineForm({...vaccineForm, dose:e.target.value})} placeholder="Ex.: reforço, 1ª dose" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold md:col-span-2">Observações<textarea value={vaccineForm.notes} onChange={(e) => setVaccineForm({...vaccineForm, notes:e.target.value})} placeholder="Lote, responsável, reação observada..." rows={2} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 font-normal" /></label>
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground md:col-span-2" type="submit">Adicionar ao calendário</button>
          </form>
          <div className="mt-6 space-y-3">
            {vaccineRecords.length === 0 ? <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum registro cadastrado. Preencha o formulário para começar.</p> : vaccineRecords.map((record) => <article key={record.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-background p-4"><div><p className="font-semibold">{record.vaccine} <span className="font-normal text-muted-foreground">· {record.animal}</span></p><p className="mt-1 text-sm text-muted-foreground">{new Date(record.date+"T12:00:00").toLocaleDateString("pt-BR")} {record.dose && "· "+record.dose}</p>{record.notes && <p className="mt-2 text-sm">{record.notes}</p>}</div><button type="button" onClick={() => setVaccineRecords((items) => items.filter((item) => item.id !== record.id))} className="text-xs font-semibold text-primary hover:underline">Excluir</button></article>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Os dados ficam salvos somente neste navegador/aparelho. Mantenha também a caderneta sanitária e os registros oficiais da propriedade.</p>
        </div>
      </section>

      <section id="avaliacao-animal" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Olhar atento ao rebanho</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Avaliação prática do animal</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Aprenda o que observar durante a rotina. Faça as anotações sem tentar fechar um diagnóstico: alterações importantes precisam de avaliação profissional.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Mucosas", "Observe a coloração na parte interna da pálpebra, sem forçar o animal. Palidez, coloração muito intensa ou amarelada merece atenção."],
              ["Condição corporal", "Observe se o animal está muito magro, adequado ou com excesso de gordura. Compare ao longo do tempo e use avaliação técnica."],
              ["Temperatura", "Meça somente se souber usar o termômetro com segurança. Registre o valor, horário e método; a interpretação depende do contexto."],
              ["Frequência respiratória", "Observe os movimentos do flanco ou tórax em repouso e conte por um minuto. Calor, esforço e estresse podem alterar a respiração."],
              ["Comportamento", "Perceba apetite, ruminação, interação, postura, caminhada e interesse pelo ambiente. Mudanças em relação ao habitual são importantes."]
            ].map(([title, description]) => <article key={title} className="rounded-2xl border border-border bg-surface p-5"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p></article>)}
          </div>
          <form className="mt-6 grid gap-4 rounded-2xl border border-border p-5 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); const summary = Object.entries(animalAssessment).filter(([key,value]) => key !== "animal" && value.trim()).map(([key,value]) => key+": "+value).join(". "); speak("Avaliação do animal "+animalAssessment.animal+". "+summary); }}>
            <label className="text-sm font-semibold">Identificação do animal<input value={animalAssessment.animal} onChange={(e) => setAnimalAssessment({...animalAssessment, animal:e.target.value})} placeholder="Número do brinco ou nome" className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            {([["mucosas","Mucosas"],["body","Condição corporal"],["temperature","Temperatura"],["respiration","Frequência respiratória"],["behavior","Comportamento"]] as const).map(([key,label]) => <label key={key} className="text-sm font-semibold">{label}<input value={animalAssessment[key]} onChange={(e) => setAnimalAssessment({...animalAssessment, [key]:e.target.value})} placeholder="Descreva o que observou" className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>)}
            <label className="text-sm font-semibold md:col-span-2">Outras observações<textarea value={animalAssessment.notes} onChange={(e) => setAnimalAssessment({...animalAssessment, notes:e.target.value})} rows={2} className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            <button type="button" onClick={() => speak("Avaliação prática do animal. "+Object.entries(animalAssessment).map(([key,value])=>key+": "+value).join(". "))} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground md:col-span-2">Ouvir minhas anotações</button>
          </form>
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950"><strong>Quando chamar o veterinário:</strong> procure orientação diante de falta de apetite, dificuldade para respirar, fraqueza, mucosas muito pálidas ou amareladas, febre suspeita, dor, dificuldade para andar, alterações importantes no leite ou mudança brusca de comportamento. Em situação grave, não espere: acione o responsável e o médico-veterinário. Não medique por conta própria.</div>
          <p className="mt-3 text-xs text-muted-foreground">Este material é educativo. A medição e a interpretação dos parâmetros devem considerar idade, estado fisiológico, ambiente e orientação veterinária.</p>
        </div>
      </section>

      <section id="diario-propriedade" className="scroll-mt-20 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Registro do dia</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Diário da propriedade</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Anote o que aconteceu, as atividades realizadas, suas observações e o que ainda precisa ser feito.</p>
          </div>
          <form className="mt-8 grid gap-4 rounded-2xl border border-border bg-background p-5 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); if (!diaryForm.activity.trim()) return; setDiaryEntries((items) => [{...diaryForm, id:String(Date.now())}, ...items]); setDiaryForm({date:new Date().toISOString().slice(0,10), activity:"", observations:"", pending:""}); }}>
            <label className="text-sm font-semibold">Data<input required type="date" value={diaryForm.date} onChange={(e) => setDiaryForm({...diaryForm,date:e.target.value})} className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Atividade realizada<input required value={diaryForm.activity} onChange={(e) => setDiaryForm({...diaryForm,activity:e.target.value})} placeholder="Ex.: limpeza do curral, ordenha..." className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Ocorrências e observações<textarea rows={3} value={diaryForm.observations} onChange={(e) => setDiaryForm({...diaryForm,observations:e.target.value})} className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            <label className="text-sm font-semibold">Pendências para acompanhar<textarea rows={3} value={diaryForm.pending} onChange={(e) => setDiaryForm({...diaryForm,pending:e.target.value})} className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 font-normal" /></label>
            <button type="submit" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground md:col-span-2">Salvar no diário</button>
          </form>
          <div className="mt-6 space-y-3">
            {diaryEntries.length === 0 ? <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Seu diário ainda está vazio.</p> : diaryEntries.map((entry) => <article key={entry.id} className="rounded-2xl border border-border bg-background p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{entry.activity}</h3><span className="text-sm text-muted-foreground">{new Date(entry.date+"T12:00:00").toLocaleDateString("pt-BR")}</span></div>{entry.observations && <p className="mt-2 text-sm"><strong>Observações:</strong> {entry.observations}</p>}{entry.pending && <p className="mt-2 text-sm"><strong>Pendências:</strong> {entry.pending}</p>}<button type="button" onClick={() => setDiaryEntries((items) => items.filter((item) => item.id !== entry.id))} className="mt-3 text-xs font-semibold text-primary hover:underline">Excluir registro</button></article>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Os registros ficam salvos neste aparelho e navegador. Não substituem documentos oficiais nem são compartilhados automaticamente.</p>
        </div>
      </section>

      

      <section id="dicionario" className="scroll-mt-20 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-7 md:grid-cols-[1fr_0.85fr] md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-primary"><BookOpen className="h-4 w-4" /> Palavras do dia a dia</p>
              <h2 className="display-title mt-3 text-3xl md:text-4xl">Dicionário do manejo</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Veja o que significam as palavras mais difíceis usadas nas orientações sobre os búfalos. Explicações simples e opção para ouvir.</p>
            </div>
            <label className="relative block">
              <span className="sr-only">Pesquisar termo</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={dictionarySearch}
                onChange={(event) => setDictionarySearch(event.target.value)}
                placeholder="Pesquisar palavra..."
                className="w-full rounded-2xl border border-border bg-surface py-4 pl-12 pr-4 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dictionaryTerms.filter((entry) => `${entry.term} ${entry.meaning}`.toLocaleLowerCase("pt-BR").includes(dictionarySearch.trim().toLocaleLowerCase("pt-BR"))).map((entry) => (
              <article key={entry.term} className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                <h3 className="text-lg font-bold text-primary">{entry.term}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{entry.meaning}</p>
                <button type="button" onClick={() => speak(`${entry.term}. ${entry.meaning}`)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <Headphones className="h-4 w-4" /> Ouvir significado
                </button>
              </article>
            ))}
            {dictionaryTerms.every((entry) => !`${entry.term} ${entry.meaning}`.toLocaleLowerCase("pt-BR").includes(dictionarySearch.trim().toLocaleLowerCase("pt-BR"))) && (
              <p className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">Nenhuma palavra encontrada. Tente outro termo.</p>
            )}
          </div>
        </div>
      </section>

      <section id="alunos-respondem" className="scroll-mt-20 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Dúvidas sobre o manejo</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Alunos respondem</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Perguntas e respostas preparadas pelos alunos sobre os cuidados com búfalas leiteiras e a rotina da propriedade. Clique em uma pergunta para ver a resposta.</p>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {[
              { question: "Por que devemos fazer a higiene dos tetos antes da ordenha?", answer: "Porque a sujeira nos tetos pode comprometer a higiene durante a ordenha e a qualidade do leite. A rotina inclui limpeza, pré-dipping e secagem individual, conforme o produto utilizado." },
              { question: "O que é pré-dipping?", answer: "É a aplicação de um produto próprio para higienizar os tetos antes da ordenha. É importante respeitar as orientações e o tempo de ação indicados pelo fabricante." },
              { question: "Por que devemos secar cada teto com papel-toalha individual?", answer: "Para evitar levar sujeira de um teto ou animal para outro. Não se deve usar o mesmo papel em vários animais." },
              { question: "O que devemos observar nos primeiros jatos de leite?", answer: "Devemos observar se há alterações no leite. Se notar algo diferente, o animal precisa ser avaliado e a orientação técnica da propriedade deve ser seguida." },
              { question: "Por que os sacos de ração não devem ficar diretamente no chão?", answer: "Porque podem absorver umidade e ficar mais expostos à sujeira e às pragas. O ideal é armazená-los sobre paletes ou estrados." },
              { question: "Como deve ser o local de armazenamento da ração e dos farelos?", answer: "Deve ser seco, limpo e ventilado, com os sacos afastados do chão e das paredes e protegido contra roedores e insetos." },
              { question: "O que fazer se encontrar ração úmida, mofada ou com embalagem danificada?", answer: "Separe esse alimento e não o ofereça aos animais até receber orientação técnica. Também confira a validade e as condições das embalagens." },
              { question: "Por que acompanhar a amamentação dos bezerros depois da ordenha?", answer: "Para observar se cada bezerro consegue mamar na própria mãe e identificar animais com dificuldade ou desconforto." },
              { question: "Quanto tempo os animais permanecem nos piquetes durante a rotina de amamentação apresentada?", answer: "A orientação do material é manter os animais nos piquetes por cerca de 20 a 30 minutos, observando se os bezerros mamaram." },
              { question: "O que é pós-dipping e quando ele é feito?", answer: "É a aplicação de um produto nos tetos após a ordenha, como parte dos cuidados de higiene e proteção." },
            ].map((item, index) => (
              <details key={item.question} className="group rounded-2xl border border-border bg-background p-5 open:border-primary/50 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-start gap-3 font-semibold leading-relaxed marker:hidden">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
                  <span className="flex-1">{item.question}</span>
                  <span className="text-xl text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="ml-10 mt-4 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                <button type="button" onClick={() => speak(`${item.question}. ${item.answer}`)} className="ml-10 mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <Headphones className="h-4 w-4" /> Ouvir resposta
                </button>
              </details>
            ))}
          </div>
        </div>
      </section>



      <section id="quiz" className="scroll-mt-24 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Aprenda brincando</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Quiz dos búfalos</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Teste seus conhecimentos sobre criação, comportamento, leite e cuidados com os búfalos.</p>
          </div>
          {(() => {
            const questions = [
              { q: "Qual é uma característica importante dos búfalos em dias quentes?", opts: ["Precisam de sombra, água e meios de perder calor", "Devem ficar sem água durante o dia", "Precisam permanecer sempre em galpões fechados", "Não sentem os efeitos das altas temperaturas"], a: 0, why: "Água disponível, sombra, ventilação e acesso a áreas de resfriamento ajudam no conforto térmico." },
              { q: "Qual cuidado contribui para a qualidade do leite?", opts: ["Usar utensílios limpos e higienizados", "Deixar o leite em temperatura ambiente por várias horas", "Misturar leite de animais em tratamento sem orientação", "Armazenar o leite em recipientes abertos"], a: 0, why: "Higiene na ordenha e nos utensílios reduz o risco de contaminação." },
              { q: "Por que identificar cada animal individualmente?", opts: ["Para acompanhar histórico, saúde e produção", "Somente para diferenciar a cor dos animais", "Para dispensar registros da propriedade", "Para evitar a necessidade de observação diária"], a: 0, why: "A identificação permite relacionar cada animal aos seus registros e acontecimentos." },
              { q: "Ao perceber uma búfala apática e sem apetite, qual atitude é mais adequada?", opts: ["Observar, registrar e comunicar ao responsável e ao veterinário", "Administrar qualquer medicamento disponível", "Ignorar se não houver ferida aparente", "Forçar o animal a caminhar longas distâncias"], a: 0, why: "Alterações de comportamento e apetite precisam ser avaliadas; não se deve medicar por conta própria." },
              { q: "Qual prática favorece o bem-estar durante a condução dos búfalos?", opts: ["Conduzir com calma, evitando gritos e agressões", "Aumentar o barulho para acelerar o lote", "Usar objetos para assustar os animais", "Misturar animais sem observar suas reações"], a: 0, why: "O manejo calmo reduz o estresse e torna a condução mais segura para pessoas e animais." },
            ];
            const current = questions[quizIndex];
            const selected = quizAnswers[quizIndex];
            const finished = quizIndex >= questions.length;
            const score = questions.filter((q, i) => quizAnswers[i] === String(q.a)).length;
            return <div className="mt-8 max-w-3xl rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>Questão {Math.min(quizIndex + 1, questions.length)} de {questions.length}</span><span>{score} acertos</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-primary transition-all" style={{ width: (finished ? 100 : (quizIndex / questions.length) * 100) + "%" }} /></div>
              {finished ? <div className="py-8 text-center">
                <h3 className="text-2xl font-bold text-foreground">Você concluiu o quiz!</h3>
                <p className="mt-3 text-muted-foreground">Você acertou {score} de {questions.length} questões.</p>
                <button type="button" onClick={() => { setQuizAnswers({}); setQuizIndex(0); }} className="mt-6 rounded-full bg-primary px-6 py-3 font-semibold text-white">Refazer quiz</button>
              </div> : <div className="mt-7">
                <h3 className="text-xl font-semibold leading-relaxed">{current.q}</h3>
                <div className="mt-5 grid gap-3">
                  {current.opts.map((option, i) => {
                    const isChosen = selected === String(i);
                    const isCorrect = i === current.a;
                    return <button key={option} type="button" disabled={selected !== undefined} onClick={() => setQuizAnswers(prev => ({ ...prev, [quizIndex]: String(i) }))} className={`rounded-2xl border p-4 text-left text-sm transition ${selected !== undefined && isCorrect ? "border-primary bg-primary/10 text-foreground" : isChosen ? "border-red-300 bg-red-50 text-foreground" : "border-border bg-background hover:border-primary hover:bg-surface"}`}>
                      <span className="mr-3 font-bold text-primary">{String.fromCharCode(65 + i)}.</span>{option}
                    </button>;
                  })}
                </div>
                {selected !== undefined && <div className="mt-5 rounded-2xl bg-surface p-4 text-sm leading-relaxed"><strong>{selected === String(current.a) ? "Muito bem!" : "Vamos aprender:"}</strong> {current.why}<button type="button" onClick={() => setQuizIndex(i => i + 1)} className="mt-4 block rounded-full bg-primary px-5 py-2.5 font-semibold text-white">{quizIndex === questions.length - 1 ? "Ver resultado" : "Próxima questão"}</button></div>}
              </div>}
            </div>;
          })()}
        </div>
      </section>

      <section id="mitos-verdades" className="scroll-mt-24 bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Conhecimento sem confusão</p>
            <h2 className="display-title mt-3 text-3xl md:text-4xl">Mitos e verdades sobre os búfalos</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Clique em cada afirmação para descobrir se ela é mito ou verdade e entender o motivo.</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { claim: "Búfalos precisam de água e sombra para enfrentar o calor.", truth: true, explanation: "Verdade. O acesso à água, sombra, ventilação e recursos para resfriamento contribui para o conforto térmico." },
              { claim: "O leite de búfala não pode ser utilizado na produção de queijos.", truth: false, explanation: "Mito. O leite de búfala é utilizado na fabricação de diversos queijos, como a muçarela de búfala." },
              { claim: "Todo búfalo tem comportamento agressivo.", truth: false, explanation: "Mito. O comportamento varia conforme indivíduo, ambiente, experiências e manejo. Condução calma e adequada é importante." },
              { claim: "A identificação individual ajuda a acompanhar a saúde e a produção.", truth: true, explanation: "Verdade. Registros associados a cada animal facilitam o acompanhamento sanitário, reprodutivo e produtivo." },
              { claim: "Búfalos são ruminantes.", truth: true, explanation: "Verdade. Como bovinos, possuem estômago dividido em compartimentos e realizam ruminação." },
              { claim: "A higiene na ordenha influencia a qualidade do leite.", truth: true, explanation: "Verdade. Higienizar mãos, tetos e equipamentos ajuda a reduzir a contaminação do leite." },
            ].map((item) => <details key={item.claim} className="group rounded-2xl border border-border bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-start gap-3 font-semibold leading-relaxed [&::-webkit-details-marker]:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><BookOpen className="h-4 w-4" /></span>
                <span className="flex-1">{item.claim}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
              </summary>
              <div className="ml-11 mt-4 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">
                <strong className={item.truth ? "text-primary" : "text-amber-700"}>{item.truth ? "Verdade" : "Mito"}</strong>
                <p className="mt-1">{item.explanation}</p>
              </div>
            </details>)}
          </div>
        </div>
      </section>

      <section id="racas" className="scroll-mt-20 bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-2xl md:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Bubalinocultura no Brasil</p>
              <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Explore o mapa do rebanho bubalino</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">Clique em uma das cinco regiões coloridas para descobrir quantos búfalos existem, quais estados se destacam e curiosidades sobre a criação.</p>
            </div>
            <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl bg-gradient-to-br from-[#f1f5f2] to-[#e8efe9] p-3 sm:p-5">
                <svg viewBox="0 0 470 520" role="group" aria-label="Mapa ilustrativo do Brasil dividido em cinco regiões clicáveis" className="mx-auto block w-full max-w-[460px] overflow-visible">
                  <defs>
                    <filter id="region-shadow" x="-30%" y="-20%" width="170%" height="170%">
                      <feDropShadow dx="0" dy="13" stdDeviation="7" floodColor="#000000" floodOpacity=".65" />
                    </filter>
                    <filter id="region-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="7" />
                    </filter>
                  </defs>
                  <g transform="translate(0 9)" opacity=".7">
                    {buffaloRegions.map((region) => <polygon key={region.name} points={region.points} fill="#050b08" stroke="#050b08" strokeWidth="9" strokeLinejoin="round" />)}
                  </g>
                  <g filter="url(#region-shadow)">
                    {buffaloRegions.map((region) => (
                      <polygon
                        key={region.name}
                        points={region.points}
                        fill={region.color}
                        stroke={selectedRegion === region.name ? "#ffffff" : "#102019"}
                        strokeWidth={selectedRegion === region.name ? "5" : "3"}
                        strokeLinejoin="round"
                        role="button"
                        tabIndex={0}
                        aria-label={`Selecionar região ${region.name}`}
                        aria-pressed={selectedRegion === region.name}
                        onClick={() => setSelectedRegion(region.name)}
                        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedRegion(region.name); } }}
                        className="cursor-pointer transition-all duration-200 hover:brightness-125 focus:outline-none"
                        style={{ filter: selectedRegion === region.name ? "brightness(1.16)" : "none" }}
                      />
                    ))}
                  </g>
                  {buffaloRegions.map((region) => {
                    const positions: Record<string, [number, number]> = { Norte: [220, 93], Nordeste: [370, 143], "Centro-Oeste": [211, 211], Sudeste: [348, 261], Sul: [318, 385] };
                    const [x, y] = positions[region.name];
                    return <text key={region.name} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#101010" fontSize="13" fontWeight="900" pointerEvents="none">{region.name === "Centro-Oeste" ? "CENTRO-" : region.name.toUpperCase()}</text>;
                  })}
                  <text x="211" y="226" textAnchor="middle" fill="#101010" fontSize="12" fontWeight="900" pointerEvents="none">OESTE</text>
                  <text x="235" y="510" textAnchor="middle" fill="#52665a" opacity=".8" fontSize="10" letterSpacing="2">MAPA REGIONAL ILUSTRATIVO</text>
                </svg>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {buffaloRegions.map((region) => (
                    <button key={region.name} type="button" onClick={() => setSelectedRegion(region.name)} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${selectedRegion === region.name ? "border-primary bg-primary text-white" : "border-border text-foreground hover:bg-surface"}`}>
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: region.color }} />{region.name}
                    </button>
                  ))}
                </div>
              </div>
              {(() => {
                const region = buffaloRegions.find((item) => item.name === selectedRegion) ?? buffaloRegions[0];
                return (
                  <div className="rounded-3xl bg-white p-6 text-[#14231b] shadow-xl md:p-7" aria-live="polite">
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 rounded-full ring-4 ring-black/5" style={{ backgroundColor: region.color }} />
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#65736b]">Região selecionada</p>
                    </div>
                    <h4 className="mt-2 text-3xl font-extrabold">{region.name}</h4>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#f1f5f2] p-4">
                        <p className="text-xs font-bold uppercase text-[#64736a]">Rebanho em 2025</p>
                        <p className="mt-1 text-2xl font-extrabold tabular-nums">{region.total}</p>
                        <p className="mt-1 text-xs text-[#64736a]">cabeças</p>
                      </div>
                      <div className="rounded-2xl p-4" style={{ backgroundColor: region.color + "20" }}>
                        <p className="text-xs font-bold uppercase text-[#64736a]">Participação</p>
                        <p className="mt-1 text-2xl font-extrabold">{region.share}</p>
                        <p className="mt-1 text-xs text-[#64736a]">do rebanho nacional</p>
                      </div>
                    </div>
                    <p className="mt-5 text-sm font-bold text-[#25392d]">Estados da região</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#536258]">{region.states}</p>
                    <p className="mt-5 text-sm font-bold text-[#25392d]">Destaque do rebanho</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#536258]">{region.highlight}</p>
                    <p className="mt-5 text-sm font-bold text-[#25392d]">Você sabia?</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#536258]">{region.note}</p>
                    <p className="mt-5 border-t border-[#e5ebe6] pt-4 text-[11px] leading-relaxed text-[#77847b]">Dados regionais calculados pela soma dos efetivos estaduais da Pesquisa da Pecuária Municipal (PPM/IBGE), 2025. Percentuais arredondados.</p>
                  </div>
                );
              })()}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">O desenho do mapa é esquemático: as áreas representam as cinco grandes regiões, não os limites exatos dos estados.</p>
            <p className="mt-2 text-center text-xs text-muted-foreground">Fonte: <a href="https://www.ibge.gov.br/explica/producao-agropecuaria/bubalinos/br" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">IBGE — Pesquisa da Pecuária Municipal</a>.</p>
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Conheça o rebanho</p>
          <h2 className="display-title mt-4 max-w-3xl text-3xl md:text-5xl">Explore uma búfala e conheça os búfalos.</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed opacity-90">Passe pelas imagens para conhecer as principais raças criadas no Brasil e um pouco da rotina desses animais. Depois, explore a imagem interativa e descubra partes importantes do corpo da búfala.</p>

          <div className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-primary">Galeria de imagens</p>
                <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Conheça as raças bubalinas</h3>
                <p className="mt-2 max-w-2xl text-sm opacity-80">Deslize para o lado ou use as setas para conhecer cada raça.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => moveBreed(-1)} aria-label="Imagem anterior" className="rounded-full border border-border p-3 transition hover:bg-surface"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" onClick={() => moveBreed(1)} aria-label="Próxima imagem" className="rounded-full border border-border p-3 transition hover:bg-surface"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
            <div
              ref={breedCarouselRef}
              onMouseEnter={() => setBreedPaused(true)}
              onMouseLeave={() => setBreedPaused(false)}
              onFocus={() => setBreedPaused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setBreedPaused(false);
              }}
              onTouchStart={() => setBreedPaused(true)}
              onTouchEnd={() => setBreedPaused(false)}
              aria-label="Carrossel automático de raças bubalinas"
              className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
            >
              {[
                { name: "Murrah", detail: "Corpo compacto e chifres curtos enrolados em espiral. É muito conhecida pela aptidão leiteira.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Murrah_buffalo_-_01.jpg?width=1800", credit: "Foto: Oleg Yunakov · Wikimedia Commons · CC BY-SA 4.0" },
                { name: "Jafarabadi", detail: "Raça de grande porte, com cabeça forte e chifres longos e pesados, curvados para baixo.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jafarabadi_buffalo_in_village.jpg?width=1800", credit: "Foto: Santosh Gore · Wikimedia Commons · CC BY-SA 4.0" },
                { name: "Mediterrânea", detail: "Raça selecionada na Itália, de aptidão leiteira e também utilizada para produção de carne.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Italian_Mediterranean_buffaloes_01.jpg?width=1800", credit: "Foto: Bernard Gagnon · Wikimedia Commons" },
                { name: "Carabao", detail: "Búfalo-do-pântano, adaptado a regiões alagadas. Tem chifres mais abertos lateralmente.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Philippine_water_buffalo_(carabao).JPG?width=1600", credit: "Foto: Pinoydiscus · CC BY-SA 3.0" },
              ].map((breed, index) => (
                <article key={breed.name} className={`w-[82vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl bg-background text-foreground shadow-lg transition ${breedIndex === index ? "ring-4 ring-primary" : ""}`}>
                  <img src={breed.image} alt={`Búfalo da raça ${breed.name}`} loading="lazy" className="h-56 w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Raça bubalina</p>
                    <h4 className="mt-2 text-2xl font-semibold">{breed.name}</h4>
                    <p className="mt-2 min-h-20 text-sm leading-relaxed text-muted-foreground">{breed.detail}</p>
                    <p className="mt-4 text-xs text-muted-foreground">{breed.credit}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2" aria-label="Selecionar raça">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => moveBreed(index - breedIndex)}
                  aria-label={`Ir para a raça ${index + 1}`}
                  aria-current={breedIndex === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-500 ${breedIndex === index ? "w-8 bg-lime" : "w-2.5 bg-border hover:bg-primary/40"}`}
                />
              ))}
              <span className="ml-2 text-xs opacity-75">{breedPaused ? "Pausado" : "Passagem automática"}</span>
            </div>
            <p className="text-xs opacity-70">As fotografias são ilustrativas. A identificação da raça deve considerar o conjunto das características do animal.</p>
          </div>

          <div className="mt-16 rounded-[2rem] border border-border bg-surface p-5 shadow-2xl md:p-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Sala de documentários</p>
              <h3 className="display-title mt-3 text-2xl font-semibold text-foreground md:text-4xl">Uma pausa para conhecer mais sobre os búfalos.</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">Imagine que você abriu o YouTube para pesquisar. Encontramos um vídeo sobre a cadeia produtiva bubalina no Pará para você assistir aqui mesmo.</p>
            </div>
            <div className="relative mx-auto mt-7 max-w-4xl rounded-[1.6rem] border-[7px] border-[#252b28] bg-[#080b09] p-2 shadow-[0_22px_60px_rgba(0,0,0,.5)] md:border-[10px] md:p-3">
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[#202124] shadow-inner">
                <span className="flex shrink-0 items-center gap-1.5 text-sm font-extrabold tracking-tight"><span className="inline-flex h-5 w-7 items-center justify-center rounded-md bg-[#ff0033] text-[10px] text-white">▶</span><span className="hidden sm:inline">YouTube</span></span>
                <div className="relative flex min-w-0 flex-1 items-center rounded-full border border-[#dadce0] bg-[#f8f9fa] px-4 py-2 text-xs text-[#5f6368] sm:text-sm">
                  <span className="truncate">documentário sobre búfalos</span>
                  <span className="pointer-events-none absolute right-3 top-1/2 z-10 animate-[tvMouse_4s_ease-in-out_infinite] text-black drop-shadow-md" aria-hidden="true">
                    <svg viewBox="0 0 24 30" className="h-7 w-6 fill-white stroke-black" strokeWidth="1.5"><path d="M3 2 L3 23 L8.5 17.5 L13 27 L17 25 L12.5 16 L21 15 Z" /></svg>
                  </span>
                </div>
                <span className="flex h-9 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1f3f4] text-[#303134]" aria-hidden="true">⌕</span>
              </div>
              <div className="overflow-hidden rounded-xl bg-black">
                <div className="relative aspect-video w-full">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src="https://www.youtube-nocookie.com/embed/Exf4krTRICo?rel=0"
                    title="Cadeia Produtiva Bubalina no Pará — documentário"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="mx-auto mt-3 h-2 w-24 rounded-full bg-[#454c47]" />
              <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Manejo em Dia · Conteúdo educativo</p>
            </div>
            <div className="mx-auto mt-5 flex max-w-4xl flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <div><p className="font-semibold text-foreground">Cadeia Produtiva Bubalina no Pará</p><p className="mt-1 text-xs text-muted-foreground">Reportagem sobre a criação e a produção bubalina na região Norte.</p></div>
              <a href="https://www.youtube.com/watch?v=Exf4krTRICo" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-surface">Abrir no YouTube ↗</a>
            </div>
            <style>{`@keyframes tvMouse { 0%, 100% { transform: translate(-34px, 10px) rotate(-8deg); } 45% { transform: translate(0, -2px) rotate(4deg); } 70% { transform: translate(18px, 5px) rotate(-2deg); } }`}</style>
          </div>

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Explore e aprenda</p>
              <h3 className="mt-2 text-2xl font-semibold md:text-3xl">Conheça o corpo de uma búfala</h3>
              <p className="mt-3 leading-relaxed opacity-90">Toque nos pontos destacados na imagem. Cada ponto abre uma explicação simples sobre uma parte do animal e os cuidados relacionados ao manejo.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { key: "cabeca", label: "Cabeça e chifres", description: "A cabeça e o formato dos chifres ajudam a observar características físicas e diferenças entre as raças. A aproximação deve ser feita com calma e segurança, sem ficar na área de alcance dos chifres." },
                  { key: "dorso", label: "Dorso e corpo", description: "Observe o estado corporal, a postura e a presença de ferimentos ou alterações. Acompanhar essas condições ajuda a perceber mudanças na saúde e no bem-estar." },
                  { key: "ubere", label: "Úbere e tetos", description: "Antes e depois da ordenha, observe se há inchaço, feridas, dor ou alterações no leite. Mantenha a higiene dos tetos e siga a rotina de ordenha da propriedade." },
                  { key: "cascos", label: "Pernas e cascos", description: "Observe a caminhada, a limpeza e possíveis rachaduras ou lesões. Dificuldade para andar ou apoiar uma das patas merece avaliação." },
                ].map((part) => (
                  <button key={part.key} type="button" onClick={() => setBuffaloPart(part)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${buffaloPart.key === part.key ? "border-primary bg-primary text-white" : "border-border hover:bg-surface"}`}>{part.label}</button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-background p-5 text-foreground" aria-live="polite">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Você selecionou</p>
                <h4 className="mt-1 text-xl font-semibold">{buffaloPart.label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{buffaloPart.description}</p>
                <button type="button" onClick={() => speak(`${buffaloPart.label}. ${buffaloPart.description}`)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Headphones className="h-4 w-4" /> Ouvir explicação</button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-3">
              <img src="https://commons.wikimedia.org/wiki/Special:FilePath/A_Murrah_buffalo.jpg?width=1800" alt="Búfala Murrah em vista lateral, para observar as partes do corpo" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
              <span className="absolute left-5 top-5 rounded-full bg-background/90 px-3 py-2 text-xs font-bold text-foreground">Imagem educativa interativa</span>
              <div className="absolute left-[57%] top-[27%]">
                <button type="button" onClick={() => setBuffaloPart({ key: "cabeca", label: "Cabeça e chifres", description: "A cabeça e o formato dos chifres ajudam a observar características físicas e diferenças entre as raças. A aproximação deve ser feita com calma e segurança, sem ficar na área de alcance dos chifres." })} aria-label="Explorar cabeça e chifres" className="h-5 w-5 rounded-full border-2 border-white bg-lime shadow-lg ring-4 ring-primary/30" />
              </div>
              <div className="absolute left-[48%] top-[49%]">
                <button type="button" onClick={() => setBuffaloPart({ key: "dorso", label: "Dorso e corpo", description: "Observe o estado corporal, a postura e a presença de ferimentos ou alterações. Acompanhar essas condições ajuda a perceber mudanças na saúde e no bem-estar." })} aria-label="Explorar dorso e corpo" className="h-5 w-5 rounded-full border-2 border-white bg-lime shadow-lg ring-4 ring-primary/30" />
              </div>
              <div className="absolute left-[36%] top-[72%]">
                <button type="button" onClick={() => setBuffaloPart({ key: "ubere", label: "Úbere e tetos", description: "Antes e depois da ordenha, observe se há inchaço, feridas, dor ou alterações no leite. Mantenha a higiene dos tetos e siga a rotina de ordenha da propriedade." })} aria-label="Explorar úbere e tetos" className="h-5 w-5 rounded-full border-2 border-white bg-lime shadow-lg ring-4 ring-primary/30" />
              </div>
              <div className="absolute left-[67%] top-[79%]">
                <button type="button" onClick={() => setBuffaloPart({ key: "cascos", label: "Pernas e cascos", description: "Observe a caminhada, a limpeza e possíveis rachaduras ou lesões. Dificuldade para andar ou apoiar uma das patas merece avaliação." })} aria-label="Explorar pernas e cascos" className="h-5 w-5 rounded-full border-2 border-white bg-lime shadow-lg ring-4 ring-primary/30" />
              </div>
              <p className="px-2 py-3 text-center text-xs opacity-75">Selecione um dos pontos sobre a imagem ou use os botões ao lado.</p>
            </div>
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed">
            <strong>Sobre o recurso:</strong> esta primeira versão usa uma fotografia com pontos interativos, não um modelo 3D giratório. Assim, o conteúdo já funciona em celular e computador. Um modelo 3D real poderá ser integrado depois, quando tivermos um arquivo próprio em formato GLB ou GLTF.
          </div>
        </div>
      </section>

      <section id="historico" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Acompanhamento</p>
            <h2 className="display-title mt-3 text-3xl md:text-5xl">Histórico de atividades.</h2>
            <p className="mt-3 text-muted-foreground">Os registros ficam salvos neste aparelho e neste navegador.</p>
          </div>
          {history.length > 0 && <button onClick={clearHistory} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-surface"><Trash2 className="h-4 w-4" /> Apagar histórico</button>}
        </div>
        {history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
            <ClipboardCheck className="mx-auto h-9 w-9 text-primary" />
            <p className="mt-3 font-semibold">Nenhuma atividade registrada ainda.</p>
            <p className="mt-1 text-sm text-muted-foreground">Quando salvar uma atividade, ela aparecerá aqui.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {history.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{entry.module}</h3>
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" /> {entry.date} às {entry.time}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{entry.completed.length} etapa(s) marcada(s) como concluída(s).</p>
                {entry.problem && <p className="mt-3 text-sm"><strong>Problemas:</strong> {entry.problem}</p>}
                {entry.pending && <p className="mt-2 text-sm"><strong>Pendências:</strong> {entry.pending}</p>}
              </article>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
          <History className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>Este histórico é local: ele não é enviado para a internet nem compartilhado automaticamente com outras pessoas. Para usar em outro aparelho, será necessário registrar as informações novamente.</p>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span className="font-semibold text-foreground">Manejo em Dia</span>
          <span>Guia prático de manejo e rotina de trabalho</span>
        </div>
      </footer>
    </div>
  );
}
